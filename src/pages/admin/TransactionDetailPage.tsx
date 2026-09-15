import { useState } from 'react'
import { ArrowLeft, Edit3, Trash2 } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { editTransaction, getTransactionById, getUserById, removeTransaction } from '../../lib/api'
import { getStore } from '../../lib/storage'
import { formatCurrency } from '../../lib/format'
import { useToast } from '../../contexts/ToastContext'
import { TransactionDetailView } from '../../components/banking/TransactionDetailView'
import { TransactionForm } from '../../components/banking/TransactionForm'
import { BottomSheet } from '../../components/ui/BottomSheet'
import { Button } from '../../components/ui/Button'
import type { TransactionFormData } from '../../types'

export function AdminTransactionDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const transaction = id ? getTransactionById(id) : undefined
  const accountUser = transaction
    ? (() => {
        const store = getStore()
        const account = store.accounts.find((a) => a.id === transaction.account_id)
        return account ? getUserById(account.user_id) : undefined
      })()
    : undefined

  if (!transaction) {
    return (
      <div className="px-5 pt-8 text-center">
        <p className="text-muted">Transaction not found</p>
        <button onClick={() => navigate('/admin/transactions')} className="text-brand-800 mt-4">
          Back
        </button>
      </div>
    )
  }

  const handleEdit = (data: TransactionFormData) => {
    setLoading(true)
    const updated = editTransaction(transaction.id, data)
    setLoading(false)
    if (updated) {
      showToast('Transaction updated')
      setEditOpen(false)
      navigate(0)
    } else {
      showToast('Failed to update transaction', 'error')
    }
  }

  const handleDelete = () => {
    const ok = removeTransaction(transaction.id)
    if (ok) {
      showToast('Transaction deleted')
      navigate('/admin/transactions')
    } else {
      showToast('Failed to delete', 'error')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between px-5 pt-4 pb-2">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm border border-gray-100 touch-active"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-bold text-charcoal">Transaction</h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setEditOpen(true)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-brand-50 text-brand-800 touch-active"
          >
            <Edit3 size={18} />
          </button>
          <button
            onClick={() => setDeleteOpen(true)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-red-50 text-red-600 touch-active"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="px-5 pb-8">
        <TransactionDetailView transaction={transaction} user={accountUser} />
      </div>

      <BottomSheet open={editOpen} onClose={() => setEditOpen(false)} title="Edit Transaction" fullHeight>
        <TransactionForm
          type={transaction.type}
          initial={{
            amount: transaction.amount,
            title: transaction.title,
            description: transaction.description,
            merchant: transaction.merchant,
            sender: transaction.sender,
            recipient: transaction.recipient,
            category: transaction.category,
            reference: transaction.reference,
            transaction_id: transaction.transaction_id,
            date: transaction.date,
            time: transaction.time,
            status: transaction.status,
            notes: transaction.notes,
          }}
          submitLabel="Save Changes"
          onSubmit={handleEdit}
          onCancel={() => setEditOpen(false)}
          loading={loading}
        />
      </BottomSheet>

      <BottomSheet open={deleteOpen} onClose={() => setDeleteOpen(false)} title="Delete Transaction">
        <p className="text-muted text-center py-4">Delete this transaction?</p>
        <p className="text-center font-bold text-charcoal mb-6">
          {transaction.title} — {formatCurrency(transaction.amount)}
        </p>
        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={() => setDeleteOpen(false)}>
            Cancel
          </Button>
          <Button variant="danger" className="flex-1" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </BottomSheet>
    </div>
  )
}
