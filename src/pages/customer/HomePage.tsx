import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { getAccountByUserId, getTransactionsByAccountId, getUserById } from '../../lib/api'
import { getGreeting } from '../../lib/format'
import { useDataRefresh } from '../../hooks/useDataRefresh'
import { BalanceCard } from '../../components/banking/BalanceCard'
import { QuickActions } from '../../components/banking/QuickActions'
import { TransactionRow } from '../../components/banking/TransactionRow'
import { TransactionDetailView } from '../../components/banking/TransactionDetailView'
import { BottomSheet } from '../../components/ui/BottomSheet'
import { TransactionSkeleton } from '../../components/ui/Skeleton'
import type { Transaction } from '../../types'
import { useToast } from '../../contexts/ToastContext'

export function CustomerHomePage() {
  const { session } = useAuth()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const balanceRef = useRef<HTMLDivElement>(null)

  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null)
  const [balanceVisible, setBalanceVisible] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  const { data, loading } = useDataRefresh(() => {
    if (!session?.userId) return null
    const user = getUserById(session.userId)
    const account = getAccountByUserId(session.userId)
    if (!user || !account) return null
    const transactions = getTransactionsByAccountId(account.id).slice(0, 5)
    return { user, account, transactions }
  }, [session?.userId])

  const scrollToBalance = () => {
    setBalanceVisible(true)
    balanceRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    showToast('Balance revealed')
  }

  if (!data) return null
  const { user, account, transactions } = data
  const firstName = user.name.split(' ')[0]

  return (
    <div className="pb-6">
      {/* Compact Elegant Mobile Header */}
      <header className="flex items-center justify-between px-6 pt-5 pb-2">
        <div>
          <p className="text-muted text-xs tracking-wide uppercase font-medium">{getGreeting()}</p>
          <h1 className="text-2xl font-extrabold text-charcoal tracking-tight mt-0.5">{firstName}</h1>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowNotifications(true)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm border border-gray-100/80 text-charcoal/80 hover:text-brand-800 relative touch-active"
            aria-label="Notifications"
          >
            <Bell size={19} />
            <span className="w-2 h-2 rounded-full bg-brand-800 absolute top-2.5 right-2.5 ring-2 ring-white" />
          </button>

          <button
            onClick={() => navigate('/customer/profile')}
            className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md shadow-brand-800/20 ring-2 ring-brand-100 overflow-hidden touch-active"
            style={{
              background: 'linear-gradient(135deg, #7c1034 0%, #b81d52 100%)',
            }}
            aria-label="Profile"
          >
            {firstName.slice(0, 2).toUpperCase()}
          </button>
        </div>
      </header>

      {/* Account Balance Card */}
      <div ref={balanceRef}>
        <BalanceCard
          accountType={user.account_type}
          accountNumber={user.account_number}
          balance={account.balance}
          availableBalance={account.available_balance}
          currency={user.currency}
          forceVisible={balanceVisible}
          onToggleVisible={(vis) => setBalanceVisible(vis)}
        />
      </div>

      {/* Quick Actions */}
      <QuickActions basePath="/customer" onViewBalance={scrollToBalance} />

      {/* Recent Transactions Feed */}
      <div className="px-5 mt-7">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-bold text-charcoal tracking-tight">Recent Transactions</h3>
            <p className="text-[11px] text-muted">Latest account activity</p>
          </div>
          <button
            onClick={() => navigate('/customer/transactions')}
            className="text-brand-800 text-xs font-semibold hover:underline"
          >
            See all
          </button>
        </div>

        <div className="space-y-2">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <TransactionSkeleton key={i} />)
          ) : transactions.length === 0 ? (
            <div className="text-center py-8 text-muted text-xs bg-white rounded-2xl border border-gray-100">
              No transactions yet
            </div>
          ) : (
            transactions.map((t) => (
              <TransactionRow
                key={t.id}
                transaction={t}
                onClick={() => setSelectedTxn(t)}
              />
            ))
          )}
        </div>
      </div>

      {/* Transaction Receipt Bottom Sheet */}
      <BottomSheet
        open={!!selectedTxn}
        onClose={() => setSelectedTxn(null)}
        title="Transaction Receipt"
        fullHeight
      >
        {selectedTxn && (
          <TransactionDetailView
            transaction={selectedTxn}
            user={user}
            onClose={() => setSelectedTxn(null)}
          />
        )}
      </BottomSheet>

      {/* Notification Sheet */}
      <BottomSheet
        open={showNotifications}
        onClose={() => setShowNotifications(false)}
        title="Notifications"
      >
        <div className="space-y-3 pt-1 pb-4">
          <div className="p-3.5 bg-brand-50/70 border border-brand-100 rounded-2xl flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-800 text-white flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
              VB
            </div>
            <div className="flex-1">
              <p className="font-semibold text-xs text-charcoal">Account Credited</p>
              <p className="text-[11px] text-muted mt-0.5">Your monthly salary has been credited and verified.</p>
              <span className="text-[10px] text-brand-800 font-medium mt-1 inline-block">Today • 10:30 AM</span>
            </div>
          </div>

          <div className="p-3.5 bg-gray-50 border border-gray-100 rounded-2xl flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
              ₹
            </div>
            <div className="flex-1">
              <p className="font-semibold text-xs text-charcoal">Quarterly Cashback Added</p>
              <p className="text-[11px] text-muted mt-0.5">₹2,500 rewards cashback was credited to your savings balance.</p>
              <span className="text-[10px] text-muted font-medium mt-1 inline-block">2 Sep 2026</span>
            </div>
          </div>
        </div>
      </BottomSheet>
    </div>
  )
}

