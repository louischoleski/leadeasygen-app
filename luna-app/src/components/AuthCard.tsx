import type { ReactNode } from 'react'

export default function AuthCard({ wide = false, children }: { wide?: boolean; children: ReactNode }) {
  return <div className={`mt-[10%] w-full p-5 ${wide ? 'max-w-[800px]' : 'max-w-[400px]'}`}>{children}</div>
}
