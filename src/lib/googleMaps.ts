// Loads the Google Maps JS API on demand. The key comes from
// VITE_GOOGLE_MAPS_API_KEY (.env.local); without one, location inputs
// fall back to plain text fields.
const apiKey: string | undefined = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

export const hasMapsApiKey = Boolean(apiKey)

declare global {
  interface Window {
    __onGoogleMapsLoaded?: () => void
  }
}

let placesLibrary: Promise<google.maps.PlacesLibrary> | null = null

export function loadPlacesLibrary(): Promise<google.maps.PlacesLibrary> {
  if (!placesLibrary) {
    placesLibrary = new Promise<void>((resolve, reject) => {
      if (!apiKey) {
        reject(new Error('VITE_GOOGLE_MAPS_API_KEY is not configured'))
        return
      }
      window.__onGoogleMapsLoaded = () => {
        delete window.__onGoogleMapsLoaded
        resolve()
      }
      const params = new URLSearchParams({
        key: apiKey,
        v: 'weekly',
        loading: 'async',
        callback: '__onGoogleMapsLoaded',
      })
      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?${params}`
      script.async = true
      script.onerror = () => reject(new Error('Failed to load the Google Maps script'))
      document.head.append(script)
    }).then(() => google.maps.importLibrary('places') as Promise<google.maps.PlacesLibrary>)

    // Allow a retry on the next call instead of caching the failure
    placesLibrary.catch(() => {
      placesLibrary = null
    })
  }
  return placesLibrary
}
