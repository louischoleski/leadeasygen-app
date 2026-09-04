import { MapPin } from '@phosphor-icons/react'
import { useId, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { usePlaceSuggestions, type PlaceSuggestion } from '../hooks/usePlaceSuggestions'
import { cn } from '../lib/cn'
import { Input, type InputProps } from './Input'

export interface LocationSearchProps
  extends Omit<InputProps, 'value' | 'onChange' | 'onSelect' | 'type' | 'iconLeft'> {
  value: string
  onChange: (value: string) => void
  onSelect?: (suggestion: PlaceSuggestion) => void
}

/**
 * Location input backed by Google Places autocomplete. Behaves as a plain
 * text input until suggestions arrive (or when no Maps API key is set).
 */
export function LocationSearch({ value, onChange, onSelect, onBlur, ...inputProps }: LocationSearchProps) {
  const [open, setOpen] = useState(false)
  const [highlighted, setHighlighted] = useState(-1)
  const listId = useId()
  const suggestions = usePlaceSuggestions(open ? value : '')

  const expanded = open && suggestions.length > 0

  const close = () => {
    setOpen(false)
    setHighlighted(-1)
  }

  const select = (suggestion: PlaceSuggestion) => {
    onChange(suggestion.fullText)
    onSelect?.(suggestion)
    close()
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!expanded) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlighted((i) => (i + 1) % suggestions.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlighted((i) => (i <= 0 ? suggestions.length - 1 : i - 1))
    } else if (e.key === 'Enter' && highlighted >= 0) {
      // Only intercept the form submit while an option is highlighted
      e.preventDefault()
      select(suggestions[highlighted])
    } else if (e.key === 'Escape') {
      close()
    }
  }

  return (
    <div className="relative">
      <Input
        {...inputProps}
        value={value}
        iconLeft={MapPin}
        autoComplete="off"
        role="combobox"
        aria-expanded={expanded}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={highlighted >= 0 ? `${listId}-${highlighted}` : undefined}
        onChange={(e) => {
          onChange(e.target.value)
          setOpen(true)
          setHighlighted(-1)
        }}
        onKeyDown={handleKeyDown}
        onBlur={(e) => {
          close()
          onBlur?.(e)
        }}
      />
      {expanded && (
        <ul
          id={listId}
          role="listbox"
          aria-label="Location suggestions"
          className="absolute left-0 z-50 mt-1 w-max min-w-full max-w-[min(36rem,calc(100vw-3rem))] overflow-hidden rounded-lg border border-hairline bg-surface-1 py-1 shadow-card"
          // Keep focus in the input so onBlur doesn't close the list before a click lands
          onMouseDown={(e) => e.preventDefault()}
        >
          {suggestions.map((suggestion, i) => (
            <li
              key={suggestion.id}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={i === highlighted}
            >
              <button
                type="button"
                tabIndex={-1}
                className={cn(
                  'flex w-full cursor-pointer items-baseline gap-1.5 px-3 py-2.5 text-left',
                  i === highlighted && 'bg-surface-2',
                )}
                onClick={() => select(suggestion)}
                onMouseEnter={() => setHighlighted(i)}
              >
                <span className="shrink-0 text-sm font-medium whitespace-nowrap text-ink">{suggestion.mainText}</span>
                {suggestion.secondaryText && (
                  <span className="truncate text-xs text-ink-subtle">{suggestion.secondaryText}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
