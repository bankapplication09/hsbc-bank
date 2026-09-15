import {
  ArrowDownLeft,
  ArrowLeftRight,
  ArrowUpRight,
  List,
  Wallet,
  type LucideIcon,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface Action {
  icon: LucideIcon
  label: string
  path?: string
  onClick?: () => void
  enabled?: boolean
}

interface QuickActionsProps {
  basePath?: string
  onViewBalance?: () => void
}

export function QuickActions({ basePath = '', onViewBalance }: QuickActionsProps) {
  const navigate = useNavigate()

  const actions: Action[] = [
    { icon: Wallet, label: 'View Balance', onClick: onViewBalance, enabled: !!onViewBalance },
    { icon: ArrowLeftRight, label: 'Transfer', enabled: false },
    { icon: ArrowUpRight, label: 'Pay', enabled: false },
    { icon: ArrowDownLeft, label: 'Deposit', enabled: false },
    { icon: List, label: 'Transactions', path: `${basePath}/transactions`, enabled: true },
  ]

  return (
    <div className="px-5 mt-6">
      <h3 className="text-sm font-semibold text-charcoal mb-3">Quick Actions</h3>
      <div className="flex justify-between gap-2">
        {actions.map(({ icon: Icon, label, path, onClick, enabled }) => (
          <button
            key={label}
            disabled={!enabled}
            onClick={() => {
              if (onClick) onClick()
              else if (path) navigate(path)
            }}
            className={`flex flex-col items-center gap-2 flex-1 touch-active ${
              enabled ? '' : 'opacity-40 cursor-not-allowed'
            }`}
          >
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${
                enabled ? 'bg-white text-brand-800 border border-gray-100' : 'bg-gray-100 text-gray-400'
              }`}
            >
              <Icon size={22} strokeWidth={2} />
            </div>
            <span className="text-[11px] font-medium text-charcoal text-center leading-tight">{label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
