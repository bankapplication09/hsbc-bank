import { getAllTransactions } from '../../lib/api'
import { getStore } from '../../lib/storage'
import { formatCurrency, formatDateTime } from '../../lib/format'
import { useDataRefresh } from '../../hooks/useDataRefresh'
import { PageHeader } from '../../components/layout/PageHeader'

export function ActivityPage() {
  const { data: activities } = useDataRefresh(() => {
    const store = getStore()
    return getAllTransactions()
      .slice(0, 20)
      .map((t) => {
        const account = store.accounts.find((a) => a.id === t.account_id)
        const user = account ? store.users.find((u) => u.id === account.user_id) : undefined
        return { ...t, customerName: user?.name ?? 'Unknown' }
      })
  }, [])

  return (
    <div>
      <PageHeader title="Activity" subtitle="Recent admin activity" />

      <div className="px-5 space-y-2">
        {activities?.map((a) => (
          <div key={a.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
            <div className="flex items-start gap-3">
              <div
                className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                  a.type === 'credit' ? 'bg-emerald-500' : 'bg-red-400'
                }`}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-charcoal">
                  <span className="font-semibold">{a.customerName}</span>
                  {' — '}
                  {a.type === 'credit' ? 'received' : 'spent'}{' '}
                  <span className={a.type === 'credit' ? 'text-emerald-600 font-semibold' : 'font-semibold'}>
                    {formatCurrency(a.amount)}
                  </span>
                </p>
                <p className="text-muted text-xs mt-0.5">{a.title}</p>
                <p className="text-muted text-xs">{formatDateTime(a.date, a.time)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
