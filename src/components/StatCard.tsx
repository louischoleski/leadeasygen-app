import { CaretDown, CaretUp, Clock } from '@phosphor-icons/react'
import type { SessionStat } from '../data/dashboard'

export default function StatCard({ value, delta, dir, label, updated }: SessionStat) {
  const Caret = dir === 'up' ? CaretUp : CaretDown
  const toneClass = dir === 'up' ? 'text-success' : 'text-ink-subtle'

  return (
    <div className="card mb-5">
      <div className="p-6">
        <h2 className="text-[1.65rem] font-semibold tracking-[-0.5px] text-ink">
          {value}{' '}
          <span className="text-[11px] font-normal tracking-normal text-ink-muted">
            <Caret size={11} aria-hidden="true" className={`inline ${toneClass}`} /> {delta}
          </span>
        </h2>
        <div className="text-xs">{label}</div>
        <div className="mt-2.5 text-[11px]">
          <Clock size={11} aria-hidden="true" className="inline" /> Updated:{' '}
          <span className="text-ink">{updated}</span>
        </div>
      </div>
    </div>
  )
}
