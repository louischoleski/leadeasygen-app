import { FonderieClient } from '@fonderie/client'

// Base origin of the leadeasygen-fonderie API. Local by default; deployments
// set VITE_API_URL. Exported so non-SDK calls (e.g. the raw multipart-free
// avatar upload to POST /media, which has no client sub-client yet) and
// absolute media URLs (`${API_BASE_URL}/media/:id`) resolve the same host.
export const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

// Single client for the whole app; hooks reach it via <FonderieProvider>.
export const fonderie = new FonderieClient({ baseUrl: API_BASE_URL })
