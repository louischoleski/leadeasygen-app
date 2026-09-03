import type { Icon } from '@phosphor-icons/react'
import type { ReactNode } from 'react'

type Props = {
  icon: Icon
  title: string
  children?: ReactNode
  aside?: ReactNode
}

export default function ViewHeader({ icon: HeaderIcon, title, children, aside }: Props) {
  return (
    <div className="my-5 flex min-h-[50px] items-start justify-between">
      <div className="flex items-start">
        <HeaderIcon size={60} aria-hidden="true" className="-mt-2 w-[68px] shrink-0 pr-2 text-accent" />
        <div>
          <h3 className="mb-0.5 text-xl font-normal text-white">{title}</h3>
          <small className="text-[80%]">{children}</small>
        </div>
      </div>
      {aside && <div className="text-right leading-[14px]">{aside}</div>}
    </div>
  )
}
