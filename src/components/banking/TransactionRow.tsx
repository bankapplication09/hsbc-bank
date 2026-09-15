import {
  ArrowDownLeft,
  ArrowUpRight,
  ShoppingBag,
  Utensils,
  Zap,
  Car,
  RotateCcw,
  Tv,
  Heart,
  Gift,
  Briefcase,
  CircleDollarSign,
} from 'lucide-react'
import type { Transaction } from '../../types'
import { formatCurrency, formatDateTime } from '../../lib/format'

const categoryIcons: Record<string, typeof ShoppingBag> = {
  Shopping: ShoppingBag,
  Food: Utensils,
  Utilities: Zap,
  Transport: Car,
  Refund: RotateCcw,
  Entertainment: Tv,
  Health: Heart,
  Rewards: Gift,
  Income: Briefcase,
}

function getIcon(txn: Transaction) {
  const CatIcon = categoryIcons[txn.category] ?? CircleDollarSign
  const isCredit = txn.type === 'credit'
  return (
    <div
      className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${
        isCredit ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'
      }`}
    >
      {isCredit ? <ArrowDownLeft size={20} /> : <CatIcon size={20} />}
    </div>
  )
}

interface TransactionRowProps {
  transaction: Transaction
  onClick?: () => void
  showCustomer?: string
}

export function TransactionRow({ transaction: t, onClick, showCustomer }: TransactionRowProps) {
  const isCredit = t.type === 'credit'

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-4 bg-white rounded-2xl shadow-sm border border-gray-50 touch-active text-left transition-shadow hover:shadow-md"
    >
      {getIcon(t)}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="font-semibold text-charcoal truncate">{t.title}</p>
          <p className={`font-bold text-sm shrink-0 ${isCredit ? 'text-emerald-600' : 'text-charcoal'}`}>
            {isCredit ? '' : '− '}
            {formatCurrency(t.amount)}
          </p>
        </div>
        <p className="text-muted text-sm truncate">{t.description}</p>
        {showCustomer && <p className="text-brand-700 text-xs font-medium mt-0.5">{showCustomer}</p>}
        <div className="flex items-center justify-between mt-1">
          <p className="text-muted text-xs">{formatDateTime(t.date, t.time)}</p>
          <span
            className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
              t.status === 'completed'
                ? 'bg-emerald-50 text-emerald-700'
                : t.status === 'pending'
                  ? 'bg-amber-50 text-amber-700'
                  : 'bg-red-50 text-red-600'
            }`}
          >
            {t.status}
          </span>
        </div>
      </div>
    </button>
  )
}
