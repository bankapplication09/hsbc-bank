import type { ReactNode } from 'react'

export function MobileShell({ children }: { children: ReactNode }) {
  return (
    <div className="mobile-shell safe-top">
      {children}
    </div>
  )
}
