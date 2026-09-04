import { useSyncExternalStore } from 'react'
import { createSubscribable } from '../hooks/subscribable'
import {
  apiErrorStatus,
  createTask,
  getTask,
  listTasks,
  retryTask,
  type ApiLead,
  type ApiTask,
} from '../lib/api'
import { refreshBalance } from './billing'

/**
 * API-backed jobs store. A "job" is what the form submits — one task per
 * keyword on the server, grouped back together client-side via the groupId
 * stamped into each task's params. The list is polled while any task is
 * still pending/scraping; results for completed tasks are fetched once and
 * cached for the session.
 */

export type JobStatus = 'queued' | 'running' | 'completed' | 'failed'

// Mirrors the scraper's wire payload (see api/src/scraper/engine.ts)
export interface Lead {
  name: string
  category: string
  rating: number | null // null = unrated
  reviews: number
  phone: string | null
  website: string | null
  emails: string[]
  address: string
}

export interface Job {
  id: string // groupId, or the task id for ungrouped/legacy tasks
  location: string
  radiusKm: number | null
  keywords: string[]
  category?: string
  status: JobStatus
  progress: number // share of the group's tasks that reached a terminal state
  leadsFound: number
  creditCost: number // one credit per keyword task, charged on completion only
  createdAt: number
  results: Lead[]
  error?: string
}

export const jobCategories = [
  'Local Business',
  'Professional Services',
  'Healthcare',
  'Retail',
  'Food & Dining',
  'Home Services',
]

// Keep the billing page's "~N jobs at avg. cost" copy on the same math
export const AVG_JOB_COST = 20

// The server charges exactly one credit per task (= per keyword), and only
// when the scrape completes — failures cost nothing.
export function jobCreditCost(keywordCount: number): number {
  return Math.max(1, keywordCount)
}

const POLL_MS = 3000
const RESULT_FETCHES_PER_POLL = 25

const taskStatusToJob: Record<ApiTask['status'], JobStatus> = {
  pending: 'queued',
  scraping: 'running',
  complete: 'completed',
  error: 'failed',
}

let tasks: ApiTask[] = []
let jobs: Job[] = []
const resultsCache = new Map<string, Lead[]>()
const store = createSubscribable()
let pollTimer: ReturnType<typeof setInterval> | null = null
let inFlight = false
let lastRefresh = 0
let hadActive = false

const toLead = (l: ApiLead): Lead => ({
  name: l.name ?? '',
  category: l.category ?? '',
  rating: typeof l.rating === 'number' && l.rating > 0 ? l.rating : null,
  reviews: typeof l.reviews === 'number' ? l.reviews : 0,
  phone: l.phone || null,
  website: l.website || null,
  emails: Array.isArray(l.emails) ? l.emails : [],
  address: l.address ?? '',
})

const groupKey = (t: ApiTask) => t.params?.groupId ?? t.id

function buildJobs(): Job[] {
  const groups = new Map<string, ApiTask[]>()
  for (const task of tasks) {
    const key = groupKey(task)
    const group = groups.get(key)
    if (group) group.push(task)
    else groups.set(key, [task])
  }

  const built: Job[] = []
  for (const [id, group] of groups) {
    const params = group.find((t) => t.params)?.params ?? null
    const statuses = group.map((t) => taskStatusToJob[t.status] ?? 'queued')
    const terminal = statuses.filter((s) => s === 'completed' || s === 'failed').length

    let status: JobStatus
    if (statuses.some((s) => s === 'running')) status = 'running'
    else if (statuses.some((s) => s === 'queued')) status = terminal > 0 ? 'running' : 'queued'
    else status = statuses.some((s) => s === 'failed') ? 'failed' : 'completed'

    const results = group.flatMap((t) => resultsCache.get(t.id) ?? [])
    const keywords = group.map((t) => t.params?.keyword ?? '').filter(Boolean)

    built.push({
      id,
      location: params?.location ?? group[0].url,
      radiusKm: params?.radiusKm ?? null,
      keywords: keywords.length > 0 ? keywords : ['scrape'],
      category: params?.category ?? undefined,
      status,
      progress: Math.round((terminal / group.length) * 100),
      leadsFound: results.length,
      creditCost: group.length,
      createdAt: Math.min(...group.map((t) => Date.parse(t.createdAt))),
      results,
      error: group.map((t) => t.errorMessage).find(Boolean) ?? undefined,
    })
  }
  return built.sort((a, b) => b.createdAt - a.createdAt)
}

async function refresh(): Promise<void> {
  if (inFlight) return
  inFlight = true
  lastRefresh = Date.now()
  try {
    tasks = await listTasks()
  } catch {
    // Unauthenticated or api unreachable — keep the last known state and
    // let the next poll (or user action) try again.
    inFlight = false
    return
  }

  // Results land once per completed task, then live in the session cache.
  const missing = tasks
    .filter((t) => t.status === 'complete' && !resultsCache.has(t.id))
    .slice(0, RESULT_FETCHES_PER_POLL)
  await Promise.all(
    missing.map(async (t) => {
      try {
        const detail = await getTask(t.id)
        resultsCache.set(t.id, (detail.results ?? []).map(toLead))
      } catch {
        // fetched again on the next poll
      }
    }),
  )

  jobs = buildJobs()
  inFlight = false
  store.emit()

  const active = tasks.some((t) => t.status === 'pending' || t.status === 'scraping')
  if (active) startPolling()
  else stopPolling()
  // Completion is the moment the server charges credits, so re-read the
  // balance when the last active task settles.
  if (hadActive && !active) void refreshBalance()
  hadActive = active
}

function startPolling() {
  if (pollTimer === null) pollTimer = setInterval(() => void refresh(), POLL_MS)
}

function stopPolling() {
  if (pollTimer !== null) {
    clearInterval(pollTimer)
    pollTimer = null
  }
}

function subscribe(onChange: () => void) {
  // Re-sync on (re)mount — covers first load and a different user logging
  // in — but not on every subscriber of the same render pass.
  if (Date.now() - lastRefresh > 2000) {
    void refresh()
    void refreshBalance()
  }
  return store.subscribe(onChange)
}

export interface CreateJobInput {
  location: string
  radiusKm: number
  keywords: string[]
  category?: string
}

export type CreateJobResult =
  | { ok: true; creditCost: number }
  | { ok: false; error: 'insufficient-credits' | 'request-failed' }

const failureFrom = (err: unknown): CreateJobResult => ({
  ok: false,
  error: apiErrorStatus(err) === 403 ? 'insufficient-credits' : 'request-failed',
})

// The engine has no geo filter (it crawls a text search), so the radius knob
// maps to the per-task lead cap: a wider radius asks for more results.
const RADIUS_LEAD_LIMIT: Record<number, number> = { 5: 10, 10: 25, 25: 50, 50: 100 }

export async function createJob(input: CreateJobInput): Promise<CreateJobResult> {
  const groupId = crypto.randomUUID()
  let created = 0
  for (const keyword of input.keywords) {
    try {
      await createTask({
        location: input.location,
        keyword,
        radiusKm: input.radiusKm,
        category: input.category,
        groupId,
        limit: RADIUS_LEAD_LIMIT[input.radiusKm] ?? 25,
      })
      created++
    } catch (err) {
      if (created === 0) return failureFrom(err)
      break // partial group: what was enqueued keeps running and shows in the list
    }
  }
  void refresh()
  return { ok: true, creditCost: created }
}

export async function retryJob(id: string): Promise<CreateJobResult | null> {
  const job = jobs.find((j) => j.id === id)
  if (!job || job.status !== 'failed') return null

  // Retry only the failed tasks; the server marks each one superseded so the
  // stale failures drop out of every listing. Completed siblings keep their
  // results and are never re-charged.
  const failedTasks = tasks.filter((t) => groupKey(t) === id && t.status === 'error')
  let retried = 0
  for (const task of failedTasks) {
    try {
      await retryTask(task.id)
      retried++
    } catch (err) {
      if (retried === 0) return failureFrom(err)
      break
    }
  }
  void refresh()
  return { ok: true, creditCost: retried }
}

export function useJobs() {
  const current = useSyncExternalStore(subscribe, () => jobs)
  return {
    jobs: current,
    activeJobs: current.filter((job) => job.status === 'queued' || job.status === 'running'),
    completedJobs: current.filter((job) => job.status === 'completed' || job.status === 'failed'),
    createJob,
    retryJob,
  }
}
