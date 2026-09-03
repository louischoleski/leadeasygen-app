import { useSyncExternalStore } from 'react'
import { createSubscribable } from '../hooks/subscribable'
import { refundCredits, spendCredits } from './billing'

export type JobStatus = 'queued' | 'running' | 'completed' | 'failed'

export interface Lead {
  business: string
  address: string
  phone: string | null
  website: string | null
  email: string | null
  source: 'maps' | 'website'
}

export interface Job {
  id: string
  location: string
  radiusKm: number
  keywords: string[]
  category: string
  status: JobStatus
  progress: number // 0-100
  leadsFound: number
  creditCost: number
  createdAt: number
  results: Lead[]
  refunded?: boolean
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

export function jobCreditCost(radiusKm: number, keywordCount: number): number {
  return 10 + 2 * keywordCount + Math.ceil(radiusKm / 5)
}

const STORAGE_KEY = 'jobs'
const MAX_JOBS = 20
const TICK_MS = 700
const FAILURE_CHANCE = 0.08

const jobStatuses: JobStatus[] = ['queued', 'running', 'completed', 'failed']

function readStored(): Job[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter(
        (j): j is Job =>
          typeof j === 'object' &&
          j !== null &&
          typeof (j as Job).id === 'string' &&
          jobStatuses.includes((j as Job).status),
      )
      .slice(0, MAX_JOBS)
  } catch {
    return []
  }
}

let jobs: Job[] = readStored()
const store = createSubscribable()
let engine: ReturnType<typeof setInterval> | null = null

function persist() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs))
  } catch {
    // storage unavailable: keep the in-memory list for this session
  }
}

function setJobs(next: Job[]) {
  jobs = next.slice(0, MAX_JOBS)
  persist()
  store.emit()
}

const randomInt = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1))
const pick = <T>(items: T[]) => items[randomInt(0, items.length - 1)]
const maybe = <T>(value: T, chance: number): T | null => (Math.random() < chance ? value : null)

const namePrefixes = ['Atlas', 'Nova', 'Prime', 'Golden', 'Urban', 'Harbor', 'Cedar', 'Summit', 'Bluebird', 'Vertex']
const nameSuffixes: Record<string, string[]> = {
  'Local Business': ['Market', 'Shop', 'House', 'Services', 'Co.'],
  'Professional Services': ['Consulting', 'Legal', 'Accounting', 'Studio', 'Agency'],
  Healthcare: ['Dental', 'Clinic', 'Physio', 'Wellness', 'Optics'],
  Retail: ['Boutique', 'Supply Co.', 'Outfitters', 'Market', 'Emporium'],
  'Food & Dining': ['Bistro', 'Grill', 'Kitchen', 'Café', 'Trattoria'],
  'Home Services': ['Plumbing', 'Electric', 'Roofing', 'Carpentry', 'HVAC'],
}
const streets = ['Main St', 'Oak Ave', 'Market St', 'Hill Rd', 'Station Blvd', 'Park Lane']

function makeLead(location: string, category: string): Lead {
  const business = `${pick(namePrefixes)} ${pick(nameSuffixes[category] ?? nameSuffixes.Retail)}`
  const slug = business.toLowerCase().replace(/[^a-z]+/g, '')
  const email = maybe(`contact@${slug}.example.com`, 0.4)
  return {
    business,
    address: `${randomInt(1, 900)} ${pick(streets)}, ${location}`,
    phone: maybe(`+1 555 ${randomInt(100, 999)} ${randomInt(1000, 9999)}`, 0.85),
    website: maybe(`https://${slug}.example.com`, 0.7),
    email,
    // Emails only surface by visiting the business site, so they mark the source
    source: email ? 'website' : 'maps',
  }
}

function tick() {
  let changed = false
  const next = jobs.map((job) => {
    if (job.status === 'queued') {
      changed = true
      return { ...job, status: 'running' as JobStatus }
    }
    if (job.status !== 'running') return job
    changed = true

    if (Math.random() < FAILURE_CHANCE && job.progress < 90) {
      refundCredits(job.creditCost)
      return { ...job, status: 'failed' as JobStatus, refunded: true }
    }

    const progress = Math.min(100, job.progress + randomInt(7, 15))
    const leadsFound = job.leadsFound + randomInt(5, 15)
    if (progress >= 100) {
      const results = Array.from({ length: leadsFound }, () => makeLead(job.location, job.category))
      return { ...job, status: 'completed' as JobStatus, progress: 100, leadsFound, results }
    }
    return { ...job, progress, leadsFound }
  })

  if (changed) setJobs(next)
  if (!next.some((job) => job.status === 'queued' || job.status === 'running')) stopEngine()
}

function startEngine() {
  if (engine === null) engine = setInterval(tick, TICK_MS)
}

function stopEngine() {
  if (engine !== null) {
    clearInterval(engine)
    engine = null
  }
}

// Jobs left mid-run by a previous session resume on load
if (jobs.some((job) => job.status === 'queued' || job.status === 'running')) startEngine()

export type CreateJobInput = {
  location: string
  radiusKm: number
  keywords: string[]
  category: string
}

export type CreateJobResult = { ok: true; job: Job } | { ok: false; error: 'insufficient-credits' }

export function createJob(input: CreateJobInput): CreateJobResult {
  const creditCost = jobCreditCost(input.radiusKm, input.keywords.length)
  if (!spendCredits(creditCost)) return { ok: false, error: 'insufficient-credits' }

  const job: Job = {
    id: `job-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    location: input.location,
    radiusKm: input.radiusKm,
    keywords: input.keywords,
    category: input.category,
    status: 'queued',
    progress: 0,
    leadsFound: 0,
    creditCost,
    createdAt: Date.now(),
    results: [],
  }
  setJobs([job, ...jobs])
  startEngine()
  return { ok: true, job }
}

export function retryJob(id: string): CreateJobResult | null {
  const job = jobs.find((j) => j.id === id)
  if (!job || job.status !== 'failed') return null
  return createJob({ location: job.location, radiusKm: job.radiusKm, keywords: job.keywords, category: job.category })
}

export function cancelJob(id: string) {
  setJobs(
    jobs.map((job) => {
      if (job.id !== id || (job.status !== 'queued' && job.status !== 'running')) return job
      refundCredits(job.creditCost)
      return { ...job, status: 'failed' as JobStatus, refunded: true }
    }),
  )
}

export function useJobs() {
  const current = useSyncExternalStore(store.subscribe, () => jobs)
  return {
    jobs: current,
    activeJobs: current.filter((job) => job.status === 'queued' || job.status === 'running'),
    completedJobs: current.filter((job) => job.status === 'completed' || job.status === 'failed'),
    createJob,
    cancelJob,
    retryJob,
  }
}
