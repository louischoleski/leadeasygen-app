import { fonderie } from './fonderie'

/**
 * Typed access to the scraper api (/v1/tasks). These routes return plain JSON
 * bodies (not the fonderie response envelope), so calls go through the fonderie
 * client — which owns the Bearer token and refresh dance — and are cast to the
 * wire shapes here. The client throws FonderieApiError (carrying `.status`) on
 * any non-2xx response. Billing (balance, packs, invoices, subscription) is not
 * here — it goes through `@fonderie/client`'s billing sub-client + the
 * `@fonderie/react-billing` hooks.
 */

export type ApiTaskStatus = 'pending' | 'scraping' | 'complete' | 'error'

/** Structured form parameters the api stores alongside the derived Maps URL. */
export interface ApiTaskParams {
  location: string
  keyword: string
  radiusKm: number | null
  category: string | null
  groupId: string | null
}

export interface ApiTask {
  id: string
  url: string
  limit: number | null
  status: ApiTaskStatus
  params: ApiTaskParams | null
  errorMessage: string | null
  createdAt: string
  updatedAt: string
}

/** A lead as the scraper engine emits it (see api/src/scraper/engine.ts). */
export interface ApiLead {
  name?: string
  category?: string
  rating?: number
  reviews?: number
  phone?: string
  website?: string
  emails?: string[]
  address?: string
}

export interface ApiTaskDetail extends ApiTask {
  results: ApiLead[] | null
}

export interface CreateTaskInput {
  location: string
  keyword: string
  radiusKm?: number
  category?: string
  groupId?: string
  limit?: number
  // Re-run even if the same search ran recently (the caller confirmed past the
  // duplicate warning). Omitted/false lets the server dedup it.
  force?: boolean
}

export interface CreatedTask {
  taskId: string
  status: ApiTaskStatus
  params: ApiTaskParams | null
  remainingCredits: number
}

/** HTTP status from a FonderieApiError, or undefined for other failures. */
export function apiErrorStatus(err: unknown): number | undefined {
  if (typeof err === 'object' && err !== null && 'status' in err) {
    const status = Number((err as { status: unknown }).status)
    return Number.isFinite(status) ? status : undefined
  }
  return undefined
}

/**
 * If this error is the create endpoint's RECENT_DUPLICATE 409, the id of the
 * existing task the caller already ran recently; otherwise undefined. The
 * client packs the server's `details` onto FonderieApiError.
 */
export function duplicateTaskId(err: unknown): string | undefined {
  if (typeof err !== 'object' || err === null) return undefined
  if ((err as { reason?: unknown }).reason !== 'RECENT_DUPLICATE') return undefined
  const details = (err as { details?: unknown }).details
  if (typeof details === 'object' && details !== null && 'existingTaskId' in details) {
    const id = (details as { existingTaskId: unknown }).existingTaskId
    return typeof id === 'string' ? id : undefined
  }
  return undefined
}

// cache: false — the task list is polled while jobs run; a cached response
// would freeze the status the UI is waiting to see change.
export const listTasks = () =>
  fonderie.get('/v1/tasks', { cache: false }) as unknown as Promise<ApiTask[]>

export const getTask = (id: string) =>
  fonderie.get(`/v1/tasks/${id}`, { cache: false }) as unknown as Promise<ApiTaskDetail>

export const createTask = (input: CreateTaskInput) =>
  fonderie.post('/v1/tasks/create', input) as unknown as Promise<CreatedTask>

export const retryTask = (id: string) =>
  fonderie.post(`/v1/tasks/${id}/retry`) as unknown as Promise<CreatedTask>
