import { LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../contexts/ToastContext'
import { PageHeader } from '../../components/layout/PageHeader'
import { Button } from '../../components/ui/Button'

export function AdminProfilePage() {
  const { session, logout } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    showToast('Logged out successfully')
    navigate('/admin/login')
  }

  return (
    <div>
      <PageHeader title="Admin Profile" />

      <div className="mx-5 mt-4 bg-white rounded-3xl p-6 shadow-sm border border-gray-50 text-center">
        <div className="w-20 h-20 rounded-full card-gradient mx-auto flex items-center justify-center text-white text-2xl font-bold">
          AD
        </div>
        <h2 className="text-xl font-bold text-charcoal mt-4">{session?.name}</h2>
        <p className="text-muted text-sm">{session?.email}</p>
        <span className="inline-block mt-3 text-xs font-semibold uppercase px-3 py-1 rounded-full bg-brand-50 text-brand-800">
          Administrator
        </span>
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
