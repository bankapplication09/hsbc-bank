import { ArrowLeft } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { getTransactionById, getUserById } from '../../lib/api'
import { TransactionDetailView } from '../../components/banking/TransactionDetailView'

export function TransactionDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { session } = useAuth()
  const transaction = id ? getTransactionById(id) : undefined
  const user = session ? getUserById(session.userId) : undefined

  if (!transaction) {
    return (
      <div className="px-5 pt-8 text-center">
        <p className="text-muted">Transaction not found</p>
        <button onClick={() => navigate(-1)} className="text-brand-800 mt-4 font-medium">
          Go back
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-3 px-5 pt-4 pb-2">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm border border-gray-100 touch-active"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-bold text-charcoal">Transaction Details</h1>
      </div>
      <div className="px-5 pb-8">
        <TransactionDetailView transaction={transaction} user={user} />
      </div>
    </div>
  )
}
