import { Home, User, Wallet, ArrowLeftRight } from 'lucide-react'
import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { MobileShell } from '../../components/layout/MobileShell'
import { BottomNav } from '../../components/layout/BottomNav'

const navItems = [
  { to: '/customer', label: 'Home', icon: Home },
  { to: '/customer/accounts', label: 'Accounts', icon: Wallet },
  { to: '/customer/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { to: '/customer/profile', label: 'Profile', icon: User },
]

export function CustomerLayout() {
  const { session, loading } = useAuth()

  if (loading) return null
  if (!session || session.role !== 'customer') return <Navigate to="/login" replace />

  return (
    <MobileShell>
      <div className="pb-24 min-h-[100dvh]">
        <Outlet />
      </div>
      <BottomNav items={navItems} />
    </MobileShell>
  )
}
