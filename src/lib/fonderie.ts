import { FonderieClient } from '@fonderie/client'

// Single client for the whole app; hooks reach it via <FonderieProvider>.
// Local leadeasygen-fonderie server by default; deployments set VITE_API_URL.
export const fonderie = new FonderieClient({
  baseUrl: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
})
