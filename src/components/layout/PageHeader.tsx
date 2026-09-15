import { Bell } from 'lucide-react'
import type { ReactNode } from 'react'

interface PageHeaderProps {
  greeting?: string
  title: string
  subtitle?: string
  avatar?: string
  right?: ReactNode
}

export function PageHeader({ greeting, title, subtitle, avatar, right }: PageHeaderProps) {
  const initials = title
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <header className="flex items-center justify-between px-5 pt-4 pb-2">
      <div>
        {greeting && <p className="text-muted text-sm">{greeting}</p>}
        <h1 className="text-xl font-bold text-charcoal">{title}</h1>
        {subtitle && <p className="text-muted text-sm mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2">
        {right ?? (
          <>
            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm border border-gray-100 touch-active">
              <Bell size={20} className="text-charcoal" />
            </button>
            <div className="w-10 h-10 rounded-full card-gradient flex items-center justify-center text-white text-sm font-bold shadow-md">
              {avatar ?? initials}
            </div>
          </>
        )}
      </div>
    </header>
  )
}
