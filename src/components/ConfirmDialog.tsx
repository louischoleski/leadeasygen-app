import { useEffect, useRef } from 'react'
import { Button } from './Button'
import { Card } from './Card'

interface ConfirmDialogProps {
  open: boolean
  title: string
  description: string
  confirmLabel: string
  cancelLabel?: string
  danger?: boolean
  onConfirm: () => void
  onClose: () => void
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel = 'Go back',
  danger,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  // Focus returns to whatever opened the dialog once it closes
  const restoreRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!open) return
    restoreRef.current = document.activeElement as HTMLElement | null
    return () => restoreRef.current?.focus()
  }, [open])

  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 z-40 bg-overlay/50" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        onKeyDown={(e) => {
          if (e.key === 'Escape') onClose()
        }}
        className="fixed inset-x-4 top-1/2 z-50 mx-auto max-w-sm -translate-y-1/2"
      >
        <Card className="p-6">
          <h2 id="confirm-dialog-title" className="text-card-title text-ink">
            {title}
          </h2>
          <p className="mt-2 text-sm text-ink-subtle">{description}</p>
          <div className="mt-6 flex justify-end gap-2">
            <Button variant="secondary" onClick={onClose} autoFocus>
              {cancelLabel}
            </Button>
            <Button variant={danger ? 'danger' : 'primary'} onClick={onConfirm}>
              {confirmLabel}
            </Button>
          </div>
        </Card>
      </div>
    </>
  )
}
