import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Filter } from 'lucide-react'
import { getCustomers, searchCustomers } from '../../lib/api'
import { formatCurrency, maskAccountNumber } from '../../lib/format'
import { useDataRefresh } from '../../hooks/useDataRefresh'
import { PageHeader } from '../../components/layout/PageHeader'
import { Button } from '../../components/ui/Button'

export function CustomersPage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'active'>('all')

  const { data: customers } = useDataRefresh(() => {
    let list = query ? searchCustomers(query) : getCustomers()
    if (filter === 'active') list = list.filter((c) => c.status === 'active')
    return list
  }, [query, filter])

  return (
    <div>
      <PageHeader title="Customers" subtitle={`${customers?.length ?? 0} customers`} />

      <div className="px-5 flex gap-2 mb-4">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="search"
            placeholder="Search customers..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-800/30"
          />
        </div>
        <button
          onClick={() => setFilter(filter === 'all' ? 'active' : 'all')}
          className={`w-12 h-12 flex items-center justify-center rounded-2xl border touch-active ${
            filter === 'active' ? 'bg-brand-800 text-white border-brand-800' : 'bg-white border-gray-200 text-charcoal'
          }`}
        >
          <Filter size={18} />
        </button>
      </div>

      <div className="px-5 space-y-3">
        {customers?.map((c) => (
          <div key={c.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-bold text-charcoal">{c.name}</p>
                <p className="text-muted text-sm">{c.account_type}</p>
                <p className="text-muted text-xs mt-0.5">{maskAccountNumber(c.account_number)}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-charcoal">{formatCurrency(c.account.balance)}</p>
                <span
                  className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                    c.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {c.status}
                </span>
              </div>
            </div>
            <Button
              variant="secondary"
              size="sm"
              className="w-full mt-3"
              onClick={() => navigate(`/admin/customers/${c.id}`)}
            >
              View Account
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
