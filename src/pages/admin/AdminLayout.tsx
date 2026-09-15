import { LayoutDashboard, Users, ArrowLeftRight, Activity, User } from 'lucide-react'
import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { MobileShell } from '../../components/layout/MobileShell'
import { BottomNav } from '../../components/layout/BottomNav'

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/customers', label: 'Customers', icon: Users },
  { to: '/admin/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { to: '/admin/activity', label: 'Activity', icon: Activity },
  { to: '/admin/profile', label: 'Profile', icon: User },
]

export function AdminLayout() {
  const { session, loading } = useAuth()

  if (loading) return null
  if (!session || session.role !== 'admin') return <Navigate to="/admin/login" replace />

  return (
    <MobileShell>
      <div className="pb-24 min-h-[100dvh]">
        <Outlet />
      </div>
      <BottomNav items={navItems} />
    </MobileShell>
  )
}
