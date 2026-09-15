import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Plus, Minus, Search } from 'lucide-react'
import { filterTransactions, getCustomers } from '../../lib/api'
import { useDataRefresh } from '../../hooks/useDataRefresh'
import { PageHeader } from '../../components/layout/PageHeader'
import { TransactionRow } from '../../components/banking/TransactionRow'
import { BottomSheet } from '../../components/ui/BottomSheet'
import { Button } from '../../components/ui/Button'
import { Select } from '../../components/ui/Input'

type Filter = 'all' | 'credit' | 'debit' | 'completed' | 'pending' | 'failed'

const filters: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'credit', label: 'Credit' },
  { value: 'debit', label: 'Debit' },
  { value: 'completed', label: 'Completed' },
  { value: 'pending', label: 'Pending' },
  { value: 'failed', label: 'Failed' },
]

export function AdminTransactionsPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const customerFilter = searchParams.get('customer')
  const [filter, setFilter] = useState<Filter>('all')
  const [search, setSearch] = useState('')
  const [createSheet, setCreateSheet] = useState(false)
  const [createType, setCreateType] = useState<'credit' | 'debit'>('credit')
  const [selectedCustomer, setSelectedCustomer] = useState(customerFilter ?? '')

  const { data: txns } = useDataRefresh(() => {
    let list = filterTransactions(filter, search)
    if (customerFilter) {
      const customers = getCustomers()
      const c = customers.find((x) => x.id === customerFilter)
      if (c) list = list.filter((t) => t.account_id === c.account.id)
    }
    return list
  }, [filter, search, customerFilter])

  const customers = getCustomers()

  return (
    <div>
      <PageHeader title="Transactions" subtitle={`${txns?.length ?? 0} records`} />

      <div className="px-5 flex gap-2 mb-3">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="search"
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-800/30"
          />
        </div>
        <button
          onClick={() => { setCreateType('credit'); setCreateSheet(true) }}
          className="w-12 h-12 flex items-center justify-center rounded-2xl bg-brand-800 text-white touch-active"
        >
          <Plus size={20} />
        </button>
        <button
          onClick={() => { setCreateType('debit'); setCreateSheet(true) }}
          className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-gray-200 text-charcoal touch-active"
        >
          <Minus size={20} />
        </button>
      </div>

      <div className="px-5 flex gap-2 overflow-x-auto scrollbar-hide pb-3">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-full text-xs font-semibold shrink-0 touch-active ${
              filter === f.value ? 'bg-brand-800 text-white' : 'bg-white text-muted border border-gray-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="px-5 space-y-2">
        {txns?.map((t) => (
          <div key={t.id} className="relative">
            <TransactionRow
              transaction={t}
              showCustomer={t.customerName}
              onClick={() => navigate(`/admin/transactions/${t.id}`)}
            />
          </div>
        ))}
      </div>

      <BottomSheet open={createSheet} onClose={() => setCreateSheet(false)} title={`Create ${createType}`}>
        <Select
          label="Select Customer"
          options={[
            { value: '', label: 'Choose customer...' },
            ...customers.map((c) => ({ value: c.id, label: c.name })),
          ]}
          value={selectedCustomer}
          onChange={(e) => setSelectedCustomer(e.target.value)}
        />
        <Button
          className="w-full mt-4"
          disabled={!selectedCustomer}
          onClick={() => {
            setCreateSheet(false)
            navigate(`/admin/customers/${selectedCustomer}`)
          }}
        >
          Continue to {createType}
        </Button>
      </BottomSheet>
    </div>
  )
}
