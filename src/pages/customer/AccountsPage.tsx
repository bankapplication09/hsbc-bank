import { useState } from 'react'
import { ShieldCheck, Copy, Check, Lock } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { getAccountByUserId, getUserById } from '../../lib/api'
import { formatCurrency, formatDate, maskAccountNumber } from '../../lib/format'
import { useDataRefresh } from '../../hooks/useDataRefresh'
import { PageHeader } from '../../components/layout/PageHeader'
import { BalanceCard } from '../../components/banking/BalanceCard'
import { useToast } from '../../contexts/ToastContext'

function InfoRow({
  label,
  value,
  isCopyable,
  isStatus,
}: {
  label: string
  value: string
  isCopyable?: boolean
  isStatus?: boolean
}) {
  const [copied, setCopied] = useState(false)
  const { showToast } = useToast()

  const handleCopy = () => {
    navigator.clipboard?.writeText(value)
    setCopied(true)
    showToast(`Copied ${label}`)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="flex justify-between items-center py-3.5 border-b border-gray-100 last:border-0 text-xs">
      <span className="text-muted font-medium">{label}</span>
      <div className="flex items-center gap-2">
        {isStatus ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60 uppercase tracking-wider">
            <ShieldCheck size={12} /> {value}
          </span>
        ) : (
          <span className="text-charcoal font-semibold text-right">{value}</span>
        )}
        {isCopyable && (
          <button
            onClick={handleCopy}
            className="p-1 text-muted hover:text-charcoal hover:bg-gray-100 rounded transition-colors"
            title="Copy"
          >
            {copied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
          </button>
        )}
      </div>
    </div>
  )
}

export function AccountsPage() {
  const { session } = useAuth()

  const { data } = useDataRefresh(() => {
    if (!session?.userId) return null
    const user = getUserById(session.userId)
    const account = getAccountByUserId(session.userId)
    if (!user || !account) return null
    return { user, account }
  }, [session?.userId])

  if (!data) return null
  const { user, account } = data

  return (
    <div className="pb-8">
      <PageHeader title="Accounts" subtitle="Official registered account records" />

      <BalanceCard
        accountType={user.account_type}
        accountNumber={user.account_number}
        balance={account.balance}
        availableBalance={account.available_balance}
        currency={user.currency}
      />

      <div className="mx-5 mt-6 bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-charcoal text-sm">Account Specification</h3>
          <span className="inline-flex items-center gap-1 text-[10px] text-muted bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">
            <Lock size={10} /> Verified View
          </span>
        </div>

        <InfoRow label="Account Holder" value={user.name} />
        <InfoRow label="Masked Account Number" value={maskAccountNumber(user.account_number)} />
        <InfoRow label="Full Account Number" value={user.account_number} isCopyable />
        <InfoRow label="Account Type" value={user.account_type} />
        <InfoRow label="Currency" value={`${user.currency} (INR)`} />
        <InfoRow label="Current Balance" value={formatCurrency(account.balance, user.currency)} />
        <InfoRow label="Available Balance" value={formatCurrency(account.available_balance, user.currency)} />
        <InfoRow label="Account Status" value={user.status.toUpperCase()} isStatus />
        <InfoRow label="Opening Date" value={formatDate(user.created_at)} />
        <InfoRow label="Bank Branch" value="Mumbai Financial Center" />
        <InfoRow label="IFSC Code" value="VLRA0004821" isCopyable />
      </div>

      <div className="mx-5 mt-4 p-4 rounded-2xl bg-brand-50/60 border border-brand-100/60 text-xs text-brand-900/80 flex items-start gap-2.5">
        <ShieldCheck className="text-brand-800 shrink-0 mt-0.5" size={16} />
        <p className="leading-relaxed">
          <strong>Customer Notice:</strong> You are viewing a secure read-only statement. Account balances and transaction records are maintained by Velora Bank system administrators.
        </p>
      </div>
    </div>
  )
}

