import { ChevronRight, LogOut, Mail, Phone, Shield } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../contexts/ToastContext'
import { getUserById } from '../../lib/api'
import { maskAccountNumber } from '../../lib/format'
import { PageHeader } from '../../components/layout/PageHeader'
import { Button } from '../../components/ui/Button'

export function ProfilePage() {
  const { session, logout } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const user = session ? getUserById(session.userId) : undefined

  const handleLogout = () => {
    logout()
    showToast('Logged out successfully')
    navigate('/login')
  }

  if (!user) return null

  return (
    <div>
      <PageHeader title="Profile" />

      <div className="mx-5 mt-4 bg-white rounded-3xl p-6 shadow-sm border border-gray-50 text-center">
        <div className="w-20 h-20 rounded-full card-gradient mx-auto flex items-center justify-center text-white text-2xl font-bold shadow-lg">
          {user.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
        </div>
        <h2 className="text-xl font-bold text-charcoal mt-4">{user.name}</h2>
        <p className="text-muted text-sm">{user.account_type}</p>
        <p className="text-brand-800 text-sm font-medium mt-1">{maskAccountNumber(user.account_number)}</p>
      </div>

      <div className="mx-5 mt-4 bg-white rounded-3xl shadow-sm border border-gray-50 overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
          <Mail size={18} className="text-muted" />
          <div className="flex-1">
            <p className="text-xs text-muted">Email</p>
            <p className="text-sm font-medium text-charcoal">{user.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
          <Phone size={18} className="text-muted" />
          <div className="flex-1">
            <p className="text-xs text-muted">Phone</p>
            <p className="text-sm font-medium text-charcoal">{user.phone}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 px-5 py-4">
          <Shield size={18} className="text-muted" />
          <div className="flex-1">
            <p className="text-xs text-muted">Account Status</p>
            <p className="text-sm font-medium text-emerald-600 capitalize">{user.status}</p>
          </div>
          <ChevronRight size={18} className="text-muted" />
        </div>
      </div>

      <div className="mx-5 mt-8">
        <Button variant="outline" className="w-full" onClick={handleLogout}>
          <LogOut size={18} />
          Logout
        </Button>
      </div>
    </div>
  )
}
