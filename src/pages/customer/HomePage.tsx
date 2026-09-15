import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { getAccountByUserId, getTransactionsByAccountId, getUserById } from '../../lib/api'
import { getGreeting } from '../../lib/format'
import { useDataRefresh } from '../../hooks/useDataRefresh'
import { PageHeader } from '../../components/layout/PageHeader'
import { BalanceCard } from '../../components/banking/BalanceCard'
import { QuickActions } from '../../components/banking/QuickActions'
import { TransactionRow } from '../../components/banking/TransactionRow'
import { TransactionSkeleton } from '../../components/ui/Skeleton'

export function CustomerHomePage() {
  const { session } = useAuth()
  const navigate = useNavigate()
  const balanceRef = useRef<HTMLDivElement>(null)

  const { data, loading } = useDataRefresh(() => {
    const user = getUserById(session!.userId)!
    const account = getAccountByUserId(session!.userId)!
    const transactions = getTransactionsByAccountId(account.id).slice(0, 5)
    return { user, account, transactions }
  }, [session?.userId])

  const scrollToBalance = () => {
    balanceRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  if (!data) return null
  const { user, account, transactions } = data
  const firstName = user.name.split(' ')[0]

  return (
    <div>
      <PageHeader greeting={getGreeting()} title={firstName} />

      <div ref={balanceRef}>
        <BalanceCard
          accountType={user.account_type}
          accountNumber={user.account_number}
          balance={account.balance}
          availableBalance={account.available_balance}
          currency={user.currency}
        />
      </div>

      <QuickActions basePath="/customer" onViewBalance={scrollToBalance} />

      <div className="px-5 mt-8">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-charcoal">Recent Transactions</h3>
          <button
            onClick={() => navigate('/customer/transactions')}
            className="text-brand-800 text-sm font-medium"
          >
            See all
          </button>
        </div>
        <div className="space-y-2">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <TransactionSkeleton key={i} />)
            : transactions.map((t) => (
                <TransactionRow
                  key={t.id}
                  transaction={t}
                  onClick={() => navigate(`/customer/transactions/${t.id}`)}
                />
              ))}
        </div>
      </div>
    </div>
  )
}
