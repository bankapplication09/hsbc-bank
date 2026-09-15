import { useState } from 'react'
import { ArrowLeft, Minus, Plus } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { applyTransaction, getCustomerById, getTransactionsByAccountId } from '../../lib/api'
import { formatCurrency, maskAccountNumber } from '../../lib/format'
import { useDataRefresh } from '../../hooks/useDataRefresh'
import { useToast } from '../../contexts/ToastContext'
import { BalanceCard } from '../../components/banking/BalanceCard'
import { TransactionForm } from '../../components/banking/TransactionForm'
import { TransactionRow } from '../../components/banking/TransactionRow'
import { BottomSheet } from '../../components/ui/BottomSheet'
import { Button } from '../../components/ui/Button'
import type { TransactionFormData } from '../../types'

export function CustomerAccountPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [sheet, setSheet] = useState<'credit' | 'debit' | null>(null)
  const [loading, setLoading] = useState(false)

  const { data, refresh } = useDataRefresh(() => {
    const customer = id ? getCustomerById(id) : undefined
    if (!customer) return null
    const transactions = getTransactionsByAccountId(customer.account.id).slice(0, 5)
    return { customer, transactions }
  }, [id])

  if (!data) {
    return (
      <div className="px-5 pt-8 text-center">
        <p className="text-muted">Customer not found</p>
        <button onClick={() => navigate('/admin/customers')} className="text-brand-800 mt-4">
          Back to customers
        </button>
      </div>
    )
  }

  const { customer, transactions } = data

  const handleSubmit = (formData: TransactionFormData) => {
    if (!sheet) return
    setLoading(true)
    const result = applyTransaction(customer.account.id, sheet, formData)
    setLoading(false)
    if (result) {
      showToast(`${sheet === 'credit' ? 'Credit' : 'Debit'} of ${formatCurrency(formData.amount)} added`)
      setSheet(null)
      refresh()
    } else {
      showToast('Insufficient balance or invalid amount', 'error')
    }
  }

  return (
    <div>
      <div className="flex items-center gap-3 px-5 pt-4 pb-2">
        <button
          onClick={() => navigate('/admin/customers')}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm border border-gray-100 touch-active"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-lg font-bold text-charcoal">{customer.name}</h1>
          <p className="text-muted text-sm">{maskAccountNumber(customer.account_number)}</p>
        </div>
      </div>

      <BalanceCard
        accountType={customer.account_type}
        accountNumber={customer.account_number}
        balance={customer.account.balance}
        availableBalance={customer.account.available_balance}
        currency={customer.currency}
      />

      <div className="mx-5 mt-4 grid grid-cols-3 gap-2 text-center bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
        <div>
          <p className="text-muted text-xs">Status</p>
          <p className="font-semibold text-emerald-600 capitalize text-sm">{customer.status}</p>
        </div>
        <div>
          <p className="text-muted text-xs">Transactions</p>
          <p className="font-semibold text-charcoal text-sm">{customer.transaction_count}</p>
        </div>
        <div>
          <p className="text-muted text-xs">Type</p>
          <p className="font-semibold text-charcoal text-sm">{customer.account_type.split(' ')[0]}</p>
        </div>
      </div>

      <div className="flex gap-3 px-5 mt-4">
        <Button className="flex-1" onClick={() => setSheet('credit')}>
          <Plus size={18} /> Credit
        </Button>
        <Button variant="secondary" className="flex-1" onClick={() => setSheet('debit')}>
          <Minus size={18} /> Debit
        </Button>
      </div>

      <Button
        variant="ghost"
        className="w-[calc(100%-2.5rem)] mx-5 mt-2"
        onClick={() => navigate(`/admin/transactions?customer=${customer.id}`)}
      >
        View All Transactions
      </Button>

      <div className="px-5 mt-6">
        <h3 className="text-sm font-semibold text-charcoal mb-3">Recent Transactions</h3>
        <div className="space-y-2">
          {transactions.map((t) => (
            <TransactionRow
              key={t.id}
              transaction={t}
              onClick={() => navigate(`/admin/transactions/${t.id}`)}
            />
          ))}
        </div>
      </div>

      <BottomSheet
        open={!!sheet}
        onClose={() => setSheet(null)}
        title={sheet === 'credit' ? 'Add Credit' : 'Add Debit'}
        fullHeight
      >
        {sheet && (
          <TransactionForm
            type={sheet}
            submitLabel={sheet === 'credit' ? 'Add Credit' : 'Add Debit'}
            onSubmit={handleSubmit}
            onCancel={() => setSheet(null)}
            loading={loading}
          />
        )}
      </BottomSheet>
    </div>
  )
}
