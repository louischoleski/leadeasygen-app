import { useEffect, useRef, useState } from 'react'
import { hasMapsApiKey, loadPlacesLibrary } from '../lib/googleMaps'

export interface PlaceSuggestion {
  id: string
  mainText: string
  secondaryText: string
  fullText: string
}

const MIN_QUERY_LENGTH = 3
const DEBOUNCE_MS = 300

/**
 * Debounced Google Places autocomplete for a free-text query. Without an API
 * key configured the hook is inert and always returns an empty list.
 */
export function usePlaceSuggestions(query: string): PlaceSuggestion[] {
  const [results, setResults] = useState<PlaceSuggestion[]>([])
  // One token per typing session keeps Google billing grouping the requests
  const sessionToken = useRef<google.maps.places.AutocompleteSessionToken | null>(null)
  const requestId = useRef(0)

  const input = query.trim()
  const active = hasMapsApiKey && input.length >= MIN_QUERY_LENGTH

  useEffect(() => {
    const id = ++requestId.current

    if (!active) {
      sessionToken.current = null
      return
    }

    const timer = setTimeout(async () => {
      try {
        const { AutocompleteSuggestion, AutocompleteSessionToken } = await loadPlacesLibrary()
        sessionToken.current ??= new AutocompleteSessionToken()
        const { suggestions } = await AutocompleteSuggestion.fetchAutocompleteSuggestions({
          input,
          sessionToken: sessionToken.current,
        })
        if (id !== requestId.current) return
        setResults(
          suggestions.flatMap(({ placePrediction: p }) =>
            p
              ? {
                  id: p.placeId,
                  fullText: p.text.text,
                  mainText: p.mainText?.text ?? p.text.text,
                  secondaryText: p.secondaryText?.text ?? '',
                }
              : [],
          ),
        )
      } catch {
        if (id === requestId.current) setResults([])
      }
    }, DEBOUNCE_MS)

    return () => clearTimeout(timer)
  }, [active, input])

  // While inactive (query too short, no key, dropdown closed) show nothing;
  // while a fetch is pending the previous results stay up to avoid flicker.
  return active ? results : []
}
