import { useState } from 'react'
import {
  ArrowDownLeft,
  ArrowLeftRight,
  ArrowUpRight,
  List,
  Wallet,
  CheckCircle2,
  QrCode,
  Building2,
  Smartphone,
  CreditCard,
  Zap,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { BottomSheet } from '../ui/BottomSheet'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { useToast } from '../../contexts/ToastContext'

interface QuickActionsProps {
  basePath?: string
  onViewBalance?: () => void
}

export function QuickActions({ basePath = '', onViewBalance }: QuickActionsProps) {
  const navigate = useNavigate()
  const { showToast } = useToast()

  const [activeSheet, setActiveSheet] = useState<'transfer' | 'pay' | 'deposit' | null>(null)
  const [transferRecipient, setTransferRecipient] = useState('Sarah Miller')
  const [transferAmount, setTransferAmount] = useState('1500')
  const [transferSuccess, setTransferSuccess] = useState(false)

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault()
    setTransferSuccess(true)
    setTimeout(() => {
      showToast(`Transferred ₹${transferAmount} to ${transferRecipient}`)
      setActiveSheet(null)
      setTransferSuccess(false)
    }, 900)
  }

  return (
    <div className="px-5 mt-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-charcoal tracking-tight">Quick Actions</h3>
        <span className="text-[11px] text-muted font-medium">1-tap services</span>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {/* View Balance */}
        <button
          onClick={onViewBalance}
          className="flex flex-col items-center gap-2 touch-active group"
        >
          <div className="w-13 h-13 rounded-2xl flex items-center justify-center bg-white text-brand-800 border border-gray-100/90 shadow-[0_2px_8px_rgba(0,0,0,0.04)] group-hover:border-brand-200 transition-all">
            <Wallet size={21} strokeWidth={2.2} />
          </div>
          <span className="text-[11px] font-semibold text-charcoal text-center leading-tight">
            Balance
          </span>
        </button>

        {/* Transfer */}
        <button
          onClick={() => setActiveSheet('transfer')}
          className="flex flex-col items-center gap-2 touch-active group"
        >
          <div className="w-13 h-13 rounded-2xl flex items-center justify-center bg-white text-brand-800 border border-gray-100/90 shadow-[0_2px_8px_rgba(0,0,0,0.04)] group-hover:border-brand-200 transition-all">
            <ArrowLeftRight size={21} strokeWidth={2.2} />
          </div>
          <span className="text-[11px] font-semibold text-charcoal text-center leading-tight">
            Transfer
          </span>
        </button>

        {/* Pay */}
        <button
          onClick={() => setActiveSheet('pay')}
          className="flex flex-col items-center gap-2 touch-active group"
        >
          <div className="w-13 h-13 rounded-2xl flex items-center justify-center bg-white text-brand-800 border border-gray-100/90 shadow-[0_2px_8px_rgba(0,0,0,0.04)] group-hover:border-brand-200 transition-all">
            <ArrowUpRight size={21} strokeWidth={2.2} />
          </div>
          <span className="text-[11px] font-semibold text-charcoal text-center leading-tight">
            Pay
          </span>
        </button>

        {/* Deposit */}
        <button
          onClick={() => setActiveSheet('deposit')}
          className="flex flex-col items-center gap-2 touch-active group"
        >
          <div className="w-13 h-13 rounded-2xl flex items-center justify-center bg-white text-brand-800 border border-gray-100/90 shadow-[0_2px_8px_rgba(0,0,0,0.04)] group-hover:border-brand-200 transition-all">
            <ArrowDownLeft size={21} strokeWidth={2.2} />
          </div>
          <span className="text-[11px] font-semibold text-charcoal text-center leading-tight">
            Deposit
          </span>
        </button>

        {/* Transactions */}
        <button
          onClick={() => navigate(`${basePath}/transactions`)}
          className="flex flex-col items-center gap-2 touch-active group"
        >
          <div className="w-13 h-13 rounded-2xl flex items-center justify-center bg-white text-brand-800 border border-gray-100/90 shadow-[0_2px_8px_rgba(0,0,0,0.04)] group-hover:border-brand-200 transition-all">
            <List size={21} strokeWidth={2.2} />
          </div>
          <span className="text-[11px] font-semibold text-charcoal text-center leading-tight">
            Feed
          </span>
        </button>
      </div>

      {/* Transfer Bottom Sheet */}
      <BottomSheet
        open={activeSheet === 'transfer'}
        onClose={() => setActiveSheet(null)}
        title="Quick Fund Transfer"
      >
        {transferSuccess ? (
          <div className="text-center py-8 space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 size={32} />
            </div>
            <p className="text-lg font-bold text-charcoal">Transfer Initiated</p>
            <p className="text-sm text-muted">₹{transferAmount} sent to {transferRecipient}</p>
          </div>
        ) : (
          <form onSubmit={handleTransfer} className="space-y-4 pt-1">
            <div>
              <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-2">
                Recent Payees
              </label>
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {['Sarah Miller', 'David Clark', 'Tech Solutions', 'Swiggy UPI'].map((name) => (
                  <button
                    type="button"
                    key={name}
                    onClick={() => setTransferRecipient(name)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border shrink-0 transition-all ${
                      transferRecipient === name
                        ? 'bg-brand-800 text-white border-brand-800'
                        : 'bg-gray-50 border-gray-200 text-charcoal'
                    }`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>

            <Input
              label="Recipient Name or UPI ID"
              value={transferRecipient}
              onChange={(e) => setTransferRecipient(e.target.value)}
              required
            />
            <Input
              label="Amount (₹)"
              type="number"
              min="1"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
              required
            />

            <Button type="submit" size="lg" className="w-full mt-4">
              Send Payment
            </Button>
          </form>
        )}
      </BottomSheet>

      {/* Pay Bills Bottom Sheet */}
      <BottomSheet
        open={activeSheet === 'pay'}
        onClose={() => setActiveSheet(null)}
        title="Pay Bills & Services"
      >
        <div className="space-y-3 pt-1 pb-4">
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Scan & Pay QR', icon: QrCode, desc: 'Any UPI QR' },
              { label: 'Mobile Recharge', icon: Smartphone, desc: 'Prepaid/Postpaid' },
              { label: 'Electricity Bill', icon: Zap, desc: 'BESCOM, Tata Power' },
              { label: 'Credit Card Bill', icon: CreditCard, desc: 'Instant settlement' },
            ].map(({ label, icon: Icon, desc }) => (
              <button
                key={label}
                onClick={() => {
                  showToast(`${label} portal opened`)
                  setActiveSheet(null)
                }}
                className="p-3 bg-gray-50 hover:bg-brand-50/50 border border-gray-200/70 rounded-2xl text-left flex flex-col gap-1.5 touch-active transition-all"
              >
                <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-brand-800 shadow-sm border border-gray-100">
                  <Icon size={18} />
                </div>
                <span className="font-semibold text-xs text-charcoal">{label}</span>
                <span className="text-[10px] text-muted">{desc}</span>
              </button>
            ))}
          </div>
        </div>
      </BottomSheet>

      {/* Deposit Bottom Sheet */}
      <BottomSheet
        open={activeSheet === 'deposit'}
        onClose={() => setActiveSheet(null)}
        title="Deposit & Add Funds"
      >
        <div className="space-y-4 pt-1 pb-4">
          <div className="p-4 bg-brand-50/70 border border-brand-100 rounded-2xl">
            <div className="flex items-center gap-3 mb-2">
              <Building2 className="text-brand-800" size={20} />
              <p className="font-bold text-charcoal text-sm">Direct Bank Wire / NEFT / RTGS</p>
            </div>
            <p className="text-xs text-muted mb-2">Use your account details to receive funds instantly:</p>
            <div className="bg-white p-3 rounded-xl border border-brand-100/80 text-xs space-y-1">
              <p><strong className="text-charcoal">Account No:</strong> 4821009384821</p>
              <p><strong className="text-charcoal">IFSC Code:</strong> VLRA0004821</p>
              <p><strong className="text-charcoal">Branch:</strong> Mumbai Financial District</p>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              showToast('Account details copied to clipboard')
              setActiveSheet(null)
            }}
          >
            Copy Account Details
          </Button>
        </div>
      </BottomSheet>
    </div>
  )
}

