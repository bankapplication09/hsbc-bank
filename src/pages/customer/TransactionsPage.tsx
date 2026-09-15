import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RefreshCw } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { getAccountByUserId, getTransactionsByAccountId } from '../../lib/api'
import { useDataRefresh } from '../../hooks/useDataRefresh'
import { PageHeader } from '../../components/layout/PageHeader'
import { TransactionRow } from '../../components/banking/TransactionRow'
import { TransactionSkeleton } from '../../components/ui/Skeleton'

export function TransactionsPage() {
  const { session } = useAuth()
  const navigate = useNavigate()
  const [refreshing, setRefreshing] = useState(false)

  const { data, refresh, loading } = useDataRefresh(() => {
    const account = getAccountByUserId(session!.userId)!
    return getTransactionsByAccountId(account.id)
  }, [session?.userId])

  const handleRefresh = () => {
    setRefreshing(true)
    refresh()
    setTimeout(() => setRefreshing(false), 600)
  }

  return (
    <div>
      <PageHeader
        title="Transactions"
        subtitle={`${data?.length ?? 0} transactions`}
        right={
          <button
            onClick={handleRefresh}
            className={`w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm border border-gray-100 touch-active ${refreshing ? 'animate-spin' : ''}`}
          >
            <RefreshCw size={18} className="text-charcoal" />
          </button>
        }
      />

      <div className="px-5 space-y-2 mt-2">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => <TransactionSkeleton key={i} />)
          : data?.length === 0
            ? (
                <div className="text-center py-16 text-muted">
                  <p>No transactions yet</p>
                </div>
              )
            : data?.map((t) => (
                <TransactionRow
                  key={t.id}
                  transaction={t}
                  onClick={() => navigate(`/customer/transactions/${t.id}`)}
                />
              ))}
      </div>
    </div>
  )
}
