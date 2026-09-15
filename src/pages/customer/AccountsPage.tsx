import { useAuth } from '../../contexts/AuthContext'
import { getAccountByUserId, getUserById } from '../../lib/api'
import { formatCurrency, formatDate, maskAccountNumber } from '../../lib/format'
import { useDataRefresh } from '../../hooks/useDataRefresh'
import { PageHeader } from '../../components/layout/PageHeader'
import { BalanceCard } from '../../components/banking/BalanceCard'

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-3.5 border-b border-gray-100 last:border-0">
      <span className="text-muted text-sm">{label}</span>
      <span className="text-charcoal text-sm font-medium text-right">{value}</span>
    </div>
  )
}

export function AccountsPage() {
  const { session } = useAuth()

  const { data } = useDataRefresh(() => {
    const user = getUserById(session!.userId)!
    const account = getAccountByUserId(session!.userId)!
    return { user, account }
  }, [session?.userId])

  if (!data) return null
  const { user, account } = data

  return (
    <div>
      <PageHeader title="Accounts" subtitle="Your account details" />

      <BalanceCard
        accountType={user.account_type}
        accountNumber={user.account_number}
        balance={account.balance}
        availableBalance={account.available_balance}
        currency={user.currency}
      />

      <div className="mx-5 mt-6 bg-white rounded-3xl p-5 shadow-sm border border-gray-50">
        <h3 className="font-semibold text-charcoal mb-2">Account Details</h3>
        <InfoRow label="Account Holder" value={user.name} />
        <InfoRow label="Account Number" value={maskAccountNumber(user.account_number)} />
        <InfoRow label="Full Account No." value={user.account_number} />
        <InfoRow label="Account Type" value={user.account_type} />
        <InfoRow label="Currency" value={user.currency} />
        <InfoRow label="Current Balance" value={formatCurrency(account.balance, user.currency)} />
        <InfoRow label="Available Balance" value={formatCurrency(account.available_balance, user.currency)} />
        <InfoRow label="Status" value={user.status.charAt(0).toUpperCase() + user.status.slice(1)} />
        <InfoRow label="Opening Date" value={formatDate(user.created_at)} />
      </div>
    </div>
  )
}
