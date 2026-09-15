import { Eye, EyeOff, Radio } from 'lucide-react'
import { useState, useEffect } from 'react'
import { formatCurrency, formatMaskedBalance, maskAccountNumber } from '../../lib/format'

interface BalanceCardProps {
  accountType: string
  accountNumber: string
  balance: number
  availableBalance: number
  currency?: string
  forceVisible?: boolean
  onToggleVisible?: (visible: boolean) => void
}

export function BalanceCard({
  accountType,
  accountNumber,
  balance,
  availableBalance,
  currency = 'INR',
  forceVisible,
  onToggleVisible,
}: BalanceCardProps) {
  const [visible, setVisible] = useState(false)
  const symbol = currency === 'INR' ? '₹' : currency

  useEffect(() => {
    if (forceVisible !== undefined) {
      setVisible(forceVisible)
    }
  }, [forceVisible])

  const toggle = () => {
    const next = !visible
    setVisible(next)
    onToggleVisible?.(next)
  }

  return (
    <div
      className="mx-5 mt-4 rounded-[28px] p-6 text-white relative overflow-hidden transition-all duration-300 select-none shadow-[0_18px_36px_rgba(124,16,52,0.32)] border border-white/10"
      style={{
        background: 'linear-gradient(135deg, #380616 0%, #680d2b 40%, #8f133e 75%, #b31d51 100%)',
      }}
    >
      {/* Luxury Watermark & Light Orbs */}
      <div className="absolute -right-10 -top-10 w-44 h-44 bg-white/[0.08] rounded-full blur-xl pointer-events-none" />
      <div className="absolute right-12 bottom-0 w-32 h-32 bg-brand-400/[0.15] rounded-full blur-2xl pointer-events-none" />
      <div className="absolute left-[-20px] top-[-20px] w-28 h-28 bg-white/[0.04] rounded-full pointer-events-none" />

      {/* Decorative Wave/Card Lines SVG */}
      <svg
        className="absolute inset-0 w-full h-full opacity-10 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 400 240"
        fill="none"
      >
        <path
          d="M-50 180 C 80 120, 220 260, 450 140"
          stroke="white"
          strokeWidth="1.5"
        />
        <path
          d="M-50 210 C 100 150, 240 290, 450 170"
          stroke="white"
          strokeWidth="1.2"
        />
        <circle cx="340" cy="50" r="80" stroke="white" strokeWidth="1" />
      </svg>

      <div className="relative z-10">
        {/* Top Card Row */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            {/* Metallic Gold EMV Chip */}
            <div
              className="w-10 h-8 rounded-md relative overflow-hidden shadow-inner flex flex-col justify-between p-1 shrink-0"
              style={{
                background: 'linear-gradient(135deg, #f7d28b 0%, #d4a045 50%, #b88128 100%)',
                border: '1px solid rgba(255,255,255,0.4)',
              }}
            >
              <div className="w-full h-[1px] bg-black/25 my-auto" />
              <div className="w-full h-[1px] bg-black/25" />
              <div className="absolute left-3 top-0 bottom-0 w-[1px] bg-black/25" />
              <div className="absolute right-3 top-0 bottom-0 w-[1px] bg-black/25" />
            </div>

            {/* Contactless symbol */}
            <div className="text-white/70 rotate-90 ml-1">
              <Radio size={16} />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold tracking-widest uppercase px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white/90">
              Private Client
            </span>
            <button
              onClick={toggle}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white/15 backdrop-blur-md text-white hover:bg-white/25 active:scale-95 transition-all shadow-sm"
              aria-label={visible ? 'Hide balance' : 'Reveal balance'}
            >
              {visible ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Account Type & Masked Number */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-white/75 text-xs font-medium tracking-wide uppercase">
              {accountType || 'Savings Account'}
            </p>
            <p className="text-white/95 text-xs font-mono font-semibold tracking-wider mt-0.5">
              {maskAccountNumber(accountNumber)}
            </p>
          </div>
          <span className="text-white/50 font-serif italic text-xs">AURA ELITE</span>
        </div>

        {/* Current Balance */}
        <div className="mb-4">
          <p className="text-white/70 text-[11px] font-medium uppercase tracking-wider mb-1 flex items-center gap-1.5">
            Current Balance
            <span className="text-[10px] text-white/40 normal-case">
              {visible ? '(tap eye to hide)' : '(tap eye to reveal)'}
            </span>
          </p>
          <div className="h-10 flex items-center">
            <p
              className={`text-3xl font-extrabold tracking-tight transition-all duration-300 ${
                visible ? 'balance-reveal text-white' : 'text-white/80 font-mono tracking-wider'
              }`}
            >
              {visible ? formatCurrency(balance, currency) : formatMaskedBalance(symbol)}
            </p>
          </div>
        </div>

        {/* Card Footer: Available Balance & Brand */}
        <div className="flex items-center justify-between pt-3.5 border-t border-white/15 text-xs">
          <div>
            <p className="text-white/60 text-[10px] uppercase tracking-wider">Available Balance</p>
            <p className={`font-semibold text-sm transition-all ${visible ? 'text-emerald-300 balance-reveal' : 'text-white/80'}`}>
              {visible ? formatCurrency(availableBalance, currency) : formatMaskedBalance(symbol)}
            </p>
          </div>

          <div className="text-right flex flex-col items-end">
            <span className="text-[10px] font-bold tracking-[0.18em] text-white/60 uppercase">
              VELORA BANK
            </span>
            <div className="flex items-center gap-1 mt-0.5">
              <div className="w-3.5 h-3.5 rounded-full bg-red-400/80 -mr-1.5" />
              <div className="w-3.5 h-3.5 rounded-full bg-amber-400/80" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

