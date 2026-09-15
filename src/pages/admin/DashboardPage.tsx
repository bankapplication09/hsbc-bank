import { Bell, Search, Users, Wallet, TrendingUp, TrendingDown, Receipt } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { getDashboardStats } from '../../lib/api'
import { formatCurrency, getGreeting } from '../../lib/format'
import { useDataRefresh } from '../../hooks/useDataRefresh'

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof Users
  label: string
  value: string
  color: string
}) {
  return (
    <div className="min-w-[140px] bg-white rounded-2xl p-4 shadow-sm border border-gray-50 shrink-0">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
        <Icon size={20} />
      </div>
      <p className="text-muted text-xs">{label}</p>
      <p className="text-lg font-bold text-charcoal mt-0.5">{value}</p>
    </div>
  )
}

export function AdminDashboardPage() {
  const { session } = useAuth()
  const { data: stats } = useDataRefresh(() => getDashboardStats(), [])

  if (!stats) return null

  return (
    <div>
      <header className="flex items-center justify-between px-5 pt-4 pb-3">
        <div>
          <p className="text-muted text-sm">{getGreeting()}</p>
          <h1 className="text-xl font-bold text-charcoal">{session?.name ?? 'Admin'}</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm border border-gray-100">
            <Search size={18} className="text-charcoal" />
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm border border-gray-100">
            <Bell size={18} className="text-charcoal" />
          </button>
          <div className="w-10 h-10 rounded-full card-gradient flex items-center justify-center text-white text-sm font-bold">
            AD
          </div>
        </div>
      </header>

      <div className="px-5 overflow-x-auto scrollbar-hide">
        <div className="flex gap-3 pb-2" style={{ width: 'max-content' }}>
          <StatCard icon={Users} label="Customers" value={String(stats.totalCustomers)} color="bg-brand-50 text-brand-800" />
          <StatCard icon={Wallet} label="Accounts" value={String(stats.totalAccounts)} color="bg-blue-50 text-blue-600" />
          <StatCard icon={Wallet} label="Total Balance" value={formatCurrency(stats.totalBalance)} color="bg-emerald-50 text-emerald-600" />
          <StatCard icon={TrendingUp} label="Credits" value={formatCurrency(stats.totalCredits)} color="bg-emerald-50 text-emerald-600" />
          <StatCard icon={TrendingDown} label="Debits" value={formatCurrency(stats.totalDebits)} color="bg-red-50 text-red-500" />
          <StatCard icon={Receipt} label="Today" value={String(stats.transactionsToday)} color="bg-amber-50 text-amber-600" />
        </div>
      </div>

      <div className="mx-5 mt-6 bg-white rounded-3xl p-5 shadow-sm border border-gray-50">
        <h3 className="font-semibold text-charcoal mb-3">Quick Overview</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-muted text-sm">Total portfolio value</span>
            <span className="font-bold text-charcoal">{formatCurrency(stats.totalBalance)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted text-sm">Net credits (all time)</span>
            <span className="font-semibold text-emerald-600">{formatCurrency(stats.totalCredits)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted text-sm">Net debits (all time)</span>
            <span className="font-semibold text-red-500">{formatCurrency(stats.totalDebits)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted text-sm">Transactions today</span>
            <span className="font-semibold text-charcoal">{stats.transactionsToday}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
