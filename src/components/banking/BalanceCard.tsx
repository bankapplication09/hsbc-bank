import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { formatCurrency, formatMaskedBalance, maskAccountNumber } from '../../lib/format'

interface BalanceCardProps {
  accountType: string
  accountNumber: string
  balance: number
  availableBalance: number
  currency?: string
}

export function BalanceCard({
  accountType,
  accountNumber,
  balance,
  availableBalance,
  currency = 'INR',
}: BalanceCardProps) {
  const [visible, setVisible] = useState(false)
  const symbol = currency === 'INR' ? '₹' : currency

  return (
    <div className="mx-5 mt-4 card-gradient rounded-3xl p-6 text-white shadow-xl shadow-brand-800/25 relative overflow-hidden">
      <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full" />
      <div className="absolute -right-4 bottom-4 w-20 h-20 bg-white/5 rounded-full" />

      <div className="relative">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-white/70 text-sm">{accountType}</p>
            <p className="text-white/90 text-sm font-medium mt-0.5">{maskAccountNumber(accountNumber)}</p>
          </div>
          <button
            onClick={() => setVisible(!visible)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/15 backdrop-blur touch-active"
            aria-label={visible ? 'Hide balance' : 'Show balance'}
          >
            {visible ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <div className="mb-4">
          <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Current Balance</p>
          <p className={`text-3xl font-bold tracking-tight ${visible ? 'balance-reveal' : ''}`}>
            {visible ? formatCurrency(balance, currency) : formatMaskedBalance(symbol)}
          </p>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/15">
          <div>
            <p className="text-white/60 text-xs">Available Balance</p>
            <p className={`text-lg font-semibold ${visible ? 'balance-reveal' : ''}`}>
              {visible ? formatCurrency(availableBalance, currency) : formatMaskedBalance(symbol)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-white/50 text-xs">Velora Bank</p>
            <p className="text-white/80 text-sm font-medium">Premium</p>
          </div>
        </div>
      </div>
    </div>
  )
}
