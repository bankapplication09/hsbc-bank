export type UserRole = 'customer' | 'admin'

export type TransactionType = 'credit' | 'debit'
export type TransactionStatus = 'completed' | 'pending' | 'failed'
export type AccountStatus = 'active' | 'inactive' | 'suspended'

export interface User {
  id: string
  name: string
  email: string
  password: string
  role: UserRole
  phone: string
  account_number: string
  account_type: string
  currency: string
  status: AccountStatus
  created_at: string
}

export interface Account {
  id: string
  user_id: string
  balance: number
  available_balance: number
  opening_balance: number
  created_at: string
}

export interface Transaction {
  id: string
  account_id: string
  type: TransactionType
  amount: number
  title: string
  description: string
  merchant: string
  sender: string
  recipient: string
  category: string
  reference: string
  transaction_id: string
  date: string
  time: string
  status: TransactionStatus
  notes: string
  balance_before: number
  balance_after: number
  created_at: string
  updated_at: string
}

export interface AuthSession {
  userId: string
  role: UserRole
  email: string
  name: string
}

export interface CustomerWithAccount extends User {
  account: Account
  transaction_count: number
}

export interface TransactionFormData {
  amount: number
  title: string
  description: string
  merchant: string
  sender: string
  recipient: string
  category: string
  reference: string
  transaction_id: string
  date: string
  time: string
  status: TransactionStatus
  notes: string
}

export interface DashboardStats {
  totalCustomers: number
  totalAccounts: number
  totalBalance: number
  totalCredits: number
  totalDebits: number
  transactionsToday: number
}
