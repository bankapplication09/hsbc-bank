import { useState } from 'react'
import {
  ArrowDownLeft,
  ArrowUpRight,
  Copy,
  Check,
  Share2,
  ShieldCheck,
  Building,
} from 'lucide-react'
import type { Transaction, User } from '../../types'
import { formatCurrency, formatDate, maskAccountNumber } from '../../lib/format'
import { useToast } from '../../contexts/ToastContext'

interface TransactionDetailViewProps {
  transaction: Transaction
  user?: User
  accountNumber?: string
  onClose?: () => void
}

function DetailRow({ label, value, isCopyable }: { label: string; value?: string | null; isCopyable?: boolean }) {
  const [copied, setCopied] = useState(false)
  const { showToast } = useToast()

  if (!value) return null

  const handleCopy = () => {
    navigator.clipboard?.writeText(value)
    setCopied(true)
    showToast(`Copied ${label}`)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="flex justify-between items-start py-3 border-b border-gray-100/80 last:border-0 text-xs">
      <span className="text-muted font-medium shrink-0 mr-4">{label}</span>
      <div className="flex items-center gap-1.5 text-right font-semibold text-charcoal">
        <span className="break-all">{value}</span>
        {isCopyable && (
          <button
            onClick={handleCopy}
            className="p-1 hover:bg-gray-200 rounded text-muted hover:text-charcoal transition-colors"
            title="Copy to clipboard"
          >
            {copied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
          </button>
        )}
      </div>
    </div>
  )
}

export function TransactionDetailView({
  transaction: t,
  user,
  accountNumber,
  onClose,
}: TransactionDetailViewProps) {
  const isCredit = t.type === 'credit'
  const { showToast } = useToast()
  const displayAccount = accountNumber || user?.account_number || '4821009384821'

  return (
    <div className="pb-4">
      {/* Receipt Top Card */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 relative overflow-hidden text-center">
        {/* Decorative Bank Watermark */}
        <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-3 shadow-inner relative z-10"
          style={{
            background: isCredit
              ? 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)'
              : 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
            color: isCredit ? '#15803d' : '#b91c1c',
          }}
        >
          {isCredit ? <ArrowDownLeft size={30} strokeWidth={2.5} /> : <ArrowUpRight size={30} strokeWidth={2.5} />}
        </div>

        <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-1">
          {isCredit ? 'Credit Received' : 'Payment Debited'}
        </p>

        <p
          className={`text-3xl font-extrabold tracking-tight ${
            isCredit ? 'text-emerald-600' : 'text-charcoal'
          }`}
        >
          {isCredit ? '+' : '−'} {formatCurrency(t.amount)}
        </p>

        <h3 className="text-base font-bold text-charcoal mt-1.5">{t.title}</h3>
        {t.description && <p className="text-xs text-muted mt-0.5">{t.description}</p>}

        <div className="flex items-center justify-center gap-2 mt-3">
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
              t.status === 'completed'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                : t.status === 'pending'
                  ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                  : 'bg-red-50 text-red-600 border border-red-200/60'
            }`}
          >
            <ShieldCheck size={13} />
            {t.status}
          </span>
        </div>
      </div>

      {/* Perforated Divider */}
      <div className="relative my-4 flex items-center justify-center">
        <div className="w-full border-t border-dashed border-gray-300" />
        <span className="absolute bg-[#F7F7F9] px-3 text-[10px] uppercase font-bold tracking-widest text-muted">
          Official Bank Receipt
        </span>
      </div>

      {/* Detailed Fields List */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
        <DetailRow label="Transaction ID" value={t.transaction_id} isCopyable />
        <DetailRow label="Reference Number" value={t.reference} isCopyable />
        <DetailRow label="Transaction Type" value={t.type === 'credit' ? 'Credit (+)' : 'Debit (−)'} />
        <DetailRow label="Category" value={t.category} />
        {t.merchant && <DetailRow label="Merchant" value={t.merchant} />}
        {t.sender && <DetailRow label="Sender" value={t.sender} />}
        {t.recipient && <DetailRow label="Recipient" value={t.recipient} />}
        <DetailRow label="Date" value={formatDate(t.date)} />
        <DetailRow label="Time" value={t.time} />
        <DetailRow label="Account Number" value={maskAccountNumber(displayAccount)} />
        <DetailRow label="Balance Before" value={formatCurrency(t.balance_before)} />
        <DetailRow label="Balance After" value={formatCurrency(t.balance_after)} />
        {t.notes && <DetailRow label="Notes" value={t.notes} />}
        <DetailRow
          label="Created Date"
          value={t.created_at ? new Date(t.created_at).toLocaleString('en-IN') : undefined}
        />
      </div>

      {/* Bottom Receipt Actions */}
      <div className="mt-4 flex gap-3">
        <button
          onClick={() => {
            navigator.clipboard?.writeText(t.reference)
            showToast('Reference code copied')
          }}
          className="flex-1 py-3 px-4 bg-white border border-gray-200 rounded-2xl text-xs font-semibold text-charcoal flex items-center justify-center gap-2 touch-active shadow-sm"
        >
          <Copy size={15} />
          Copy Reference
        </button>

        <button
          onClick={() => {
            showToast('Receipt saved to device')
          }}
          className="flex-1 py-3 px-4 bg-brand-800 text-white rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 touch-active shadow-sm"
        >
          <Share2 size={15} />
          Share Receipt
        </button>
      </div>

      {onClose && (
        <button
          onClick={onClose}
          className="w-full mt-3 py-3 text-xs font-semibold text-muted hover:text-charcoal transition-colors"
        >
          Close Receipt
        </button>
      )}

      <div className="mt-4 text-center">
        <p className="text-[10px] text-muted/70 flex items-center justify-center gap-1">
          <Building size={11} /> Velora Reserve Bank Ltd • Encrypted Digital Statement
        </p>
      </div>
    </div>
  )
}

