import { ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import type { Transaction, User } from '../../types'
import { formatCurrency, formatDate, maskAccountNumber } from '../../lib/format'

interface TransactionDetailViewProps {
  transaction: Transaction
  user?: User
}

function DetailRow({ label, value }: { label: string; value: string }) {
  if (!value) return null
  return (
    <div className="flex justify-between items-start py-3 border-b border-gray-100 last:border-0">
      <span className="text-muted text-sm shrink-0 mr-4">{label}</span>
      <span className="text-charcoal text-sm font-medium text-right">{value}</span>
    </div>
  )
}

export function TransactionDetailView({ transaction: t, user }: TransactionDetailViewProps) {
  const isCredit = t.type === 'credit'

  return (
    <div>
      <div className="text-center py-6">
        <div
          className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4 ${
            isCredit ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'
          }`}
        >
          {isCredit ? <ArrowDownLeft size={28} /> : <ArrowUpRight size={28} />}
        </div>
        <p className={`text-3xl font-bold ${isCredit ? 'text-emerald-600' : 'text-charcoal'}`}>
          {isCredit ? '+' : '−'} {formatCurrency(t.amount)}
        </p>
        <p className="text-charcoal font-semibold mt-2">{t.title}</p>
        <p className="text-muted text-sm">{t.description}</p>
        <span
          className={`inline-block mt-3 text-xs font-semibold uppercase px-3 py-1 rounded-full ${
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

      <div className="bg-gray-50 rounded-2xl px-4 py-1">
        <DetailRow label="Transaction ID" value={t.transaction_id} />
        <DetailRow label="Reference" value={t.reference} />
        <DetailRow label="Type" value={t.type.charAt(0).toUpperCase() + t.type.slice(1)} />
        <DetailRow label="Category" value={t.category} />
        <DetailRow label="Merchant" value={t.merchant} />
        <DetailRow label="Sender" value={t.sender} />
        <DetailRow label="Recipient" value={t.recipient} />
        <DetailRow label="Date" value={formatDate(t.date)} />
        <DetailRow label="Time" value={t.time} />
        {user && <DetailRow label="Account" value={maskAccountNumber(user.account_number)} />}
        <DetailRow label="Balance Before" value={formatCurrency(t.balance_before)} />
        <DetailRow label="Balance After" value={formatCurrency(t.balance_after)} />
        <DetailRow label="Notes" value={t.notes} />
        <DetailRow label="Created" value={new Date(t.created_at).toLocaleString('en-IN')} />
      </div>
    </div>
  )
}
