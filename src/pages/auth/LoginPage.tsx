import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../contexts/ToastContext'
import { Logo } from '../../components/ui/Logo'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { MobileShell } from '../../components/layout/MobileShell'
import type { UserRole } from '../../types'

interface LoginPageProps {
  role: UserRole
}

export function LoginPage({ role }: LoginPageProps) {
  const [email, setEmail] = useState(role === 'admin' ? 'admin@example.com' : 'user@example.com')
  const [password, setPassword] = useState(role === 'admin' ? 'Admin@12345' : 'User@12345')
  const [remember, setRemember] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const ok = await login(email, password, role)
    setLoading(false)
    if (ok) {
      showToast(`Welcome back!`)
      navigate(role === 'admin' ? '/admin' : '/customer')
    } else {
      setError('Invalid email or password')
    }
  }

  const isAdmin = role === 'admin'

  return (
    <MobileShell>
      <div className="min-h-[100dvh] flex flex-col px-6 pt-12 pb-8 bg-gradient-to-b from-brand-50 to-surface">
        <div className="flex justify-center mb-10">
          <Logo size="lg" />
        </div>

        <div className="flex-1">
          <h1 className="text-2xl font-bold text-charcoal mb-1">
            {isAdmin ? 'Admin Sign In' : 'Welcome back'}
          </h1>
          <p className="text-muted mb-8">
            {isAdmin
              ? 'Manage customers, balances and transactions'
              : 'Sign in to access your Velora Bank account'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email / Username"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex items-center justify-between py-1">
              <label className="flex items-center gap-2 text-sm text-muted cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded accent-brand-800"
                />
                Remember me
              </label>
              <button type="button" className="text-sm text-brand-800 font-medium">
                Forgot password?
              </button>
            </div>

            <Button type="submit" size="lg" className="w-full mt-2" loading={loading}>
              {isAdmin ? 'Admin Login' : 'Customer Login'}
            </Button>
          </form>
        </div>

        <div className="text-center mt-8 space-y-3">
          {isAdmin ? (
            <Link to="/login" className="text-sm text-brand-800 font-medium">
              ← Customer Login
            </Link>
          ) : (
            <>
              <p className="text-muted text-sm">
                Don't have an account?{' '}
                <button type="button" className="text-brand-800 font-medium">
                  Contact us
                </button>
              </p>
              <Link to="/admin/login" className="block text-sm text-muted hover:text-brand-800">
                Admin Login →
              </Link>
            </>
          )}
        </div>
      </div>
    </MobileShell>
  )
}
