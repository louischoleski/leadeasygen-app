import { FonderieClient } from '@fonderie/client'

// Base origin of the leadeasygen-fonderie API. Local by default; deployments
// set VITE_API_URL. Exported so any non-SDK call resolves the same host the
// FonderieClient uses.
export const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

// Single client for the whole app; hooks reach it via <FonderieProvider>.
export const fonderie = new FonderieClient({ baseUrl: API_BASE_URL })
