import { CaretDown, CaretUp, Clock } from '@phosphor-icons/react'
import type { SessionStat } from '../data/dashboard'

export default function StatCard({ value, delta, dir, tone, label, updated }: SessionStat) {
  const Caret = dir === 'up' ? CaretUp : CaretDown
  const toneClass = tone === 'warning' ? 'text-warning' : 'text-white'

  return (
    <div className="mb-5 rounded bg-panel">
      <div className="p-4 pt-2.5">
        <h2 className="text-[1.65rem] font-normal text-white">
          {value}{' '}
          <span className="text-[11px] font-light text-muted">
            <Caret size={11} aria-hidden="true" className={`inline ${toneClass}`} /> {delta}
          </span>
        </h2>
        <div className="text-[80%]">{label}</div>
        <div className="mt-2.5 text-[11px] font-light">
          <Clock size={11} aria-hidden="true" className="inline" /> Updated:{' '}
          <span className="text-white">{updated}</span>
        </div>
      </div>
    </div>
  )
}
