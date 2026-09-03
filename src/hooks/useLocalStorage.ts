import { useCallback, useState } from 'react'

function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (v: T | ((prev: T) => T)) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      if (item === null) return initialValue
      return JSON.parse(item) as T
    } catch {
      return initialValue
    }
  })

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value
        setStoredValue(valueToStore)
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      } catch (error) {
        console.error(`useLocalStorage error for key "${key}":`, error)
      }
    },
    [key, storedValue],
  )

  const remove = useCallback(() => {
    try {
      window.localStorage.removeItem(key)
      setStoredValue(initialValue)
    } catch (error) {
      console.error(`useLocalStorage remove error for key "${key}":`, error)
    }
  }, [key, initialValue])

  return [storedValue, setValue, remove]
}

export default useLocalStorage
