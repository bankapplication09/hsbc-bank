import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ToastProvider } from './contexts/ToastContext'
import { LoginPage } from './pages/auth/LoginPage'
import { CustomerLayout } from './pages/customer/CustomerLayout'
import { CustomerHomePage } from './pages/customer/HomePage'
import { AccountsPage } from './pages/customer/AccountsPage'
import { TransactionsPage } from './pages/customer/TransactionsPage'
import { TransactionDetailPage } from './pages/customer/TransactionDetailPage'
import { ProfilePage } from './pages/customer/ProfilePage'
import { AdminLayout } from './pages/admin/AdminLayout'
import { AdminDashboardPage } from './pages/admin/DashboardPage'
import { CustomersPage } from './pages/admin/CustomersPage'
import { CustomerAccountPage } from './pages/admin/CustomerAccountPage'
import { AdminTransactionsPage } from './pages/admin/TransactionsPage'
import { AdminTransactionDetailPage } from './pages/admin/TransactionDetailPage'
import { ActivityPage } from './pages/admin/ActivityPage'
import { AdminProfilePage } from './pages/admin/ProfilePage'

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage role="customer" />} />
            <Route path="/admin/login" element={<LoginPage role="admin" />} />

            <Route path="/customer" element={<CustomerLayout />}>
              <Route index element={<CustomerHomePage />} />
              <Route path="accounts" element={<AccountsPage />} />
              <Route path="transactions" element={<TransactionsPage />} />
              <Route path="transactions/:id" element={<TransactionDetailPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>

            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="customers" element={<CustomersPage />} />
              <Route path="customers/:id" element={<CustomerAccountPage />} />
              <Route path="transactions" element={<AdminTransactionsPage />} />
              <Route path="transactions/:id" element={<AdminTransactionDetailPage />} />
              <Route path="activity" element={<ActivityPage />} />
              <Route path="profile" element={<AdminProfilePage />} />
            </Route>

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  )
}

export default App
