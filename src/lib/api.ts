import type {
  Account,
  AuthSession,
  CustomerWithAccount,
  DashboardStats,
  Transaction,
  TransactionFormData,
  TransactionType,
  User,
} from '../types'
import { generateId, todayISO } from './format'
import {
  addTransaction,
  deleteTransaction,
  getSession,
  getStore,
  recalculateBalance,
  saveSession,
  updateAccount,
  updateTransaction,
} from './storage'

export async function login(email: string, password: string, role: 'customer' | 'admin'): Promise<AuthSession | null> {
  const store = getStore()
  const user = store.users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password && u.role === role,
  )
  if (!user) return null
  const session: AuthSession = { userId: user.id, role: user.role, email: user.email, name: user.name }
  saveSession(session)
  return session
}

export function logout(): void {
  saveSession(null)
}

export function getCurrentSession(): AuthSession | null {
  const s = getSession()
  if (!s) return null
  return { userId: s.userId, role: s.role as AuthSession['role'], email: s.email, name: s.name }
}

export function getUserById(id: string): User | undefined {
  return getStore().users.find((u) => u.id === id)
}

export function getAccountByUserId(userId: string): Account | undefined {
  return getStore().accounts.find((a) => a.user_id === userId)
}

export function getAccountById(id: string): Account | undefined {
  return getStore().accounts.find((a) => a.id === id)
}

export function getTransactionsByAccountId(accountId: string): Transaction[] {
  return getStore()
    .transactions.filter((t) => t.account_id === accountId)
    .sort((a, b) => {
      const da = new Date(`${a.date} ${a.time}`).getTime()
      const db = new Date(`${b.date} ${b.time}`).getTime()
      return db - da
    })
}

export function getAllTransactions(): Transaction[] {
  return getStore()
    .transactions.sort((a, b) => {
      const da = new Date(`${a.date} ${a.time}`).getTime()
      const db = new Date(`${b.date} ${b.time}`).getTime()
      return db - da
    })
}

export function getTransactionById(id: string): Transaction | undefined {
  return getStore().transactions.find((t) => t.id === id)
}

export function getCustomers(): CustomerWithAccount[] {
  const store = getStore()
  return store.users
    .filter((u) => u.role === 'customer')
    .map((user) => {
      const account = store.accounts.find((a) => a.user_id === user.id)!
      const transaction_count = store.transactions.filter((t) => t.account_id === account.id).length
      return { ...user, account, transaction_count }
    })
}

export function getCustomerById(userId: string): CustomerWithAccount | undefined {
  return getCustomers().find((c) => c.id === userId)
}

export function getDashboardStats(): DashboardStats {
  const store = getStore()
  const customers = store.users.filter((u) => u.role === 'customer')
  const accounts = store.accounts
  const txns = store.transactions
  const today = todayISO()

  return {
    totalCustomers: customers.length,
    totalAccounts: accounts.length,
    totalBalance: accounts.reduce((s, a) => s + a.balance, 0),
    totalCredits: txns.filter((t) => t.type === 'credit' && t.status === 'completed').reduce((s, t) => s + t.amount, 0),
    totalDebits: txns.filter((t) => t.type === 'debit' && t.status === 'completed').reduce((s, t) => s + t.amount, 0),
    transactionsToday: txns.filter((t) => t.date === today).length,
  }
}

export function applyTransaction(
  accountId: string,
  type: TransactionType,
  data: TransactionFormData,
): { transaction: Transaction; account: Account } | null {
  const account = getAccountById(accountId)
  if (!account) return null

  const balanceBefore = account.balance
  const balanceAfter =
    type === 'credit' ? balanceBefore + data.amount : balanceBefore - data.amount

  if (balanceAfter < 0) return null

  const now = new Date().toISOString()
  const transaction: Transaction = {
    id: generateId('txn'),
    account_id: accountId,
    type,
    amount: data.amount,
    title: data.title,
    description: data.description,
    merchant: data.merchant,
    sender: data.sender,
    recipient: data.recipient,
    category: data.category,
    reference: data.reference,
    transaction_id: data.transaction_id,
    date: data.date,
    time: data.time,
    status: data.status,
    notes: data.notes,
    balance_before: balanceBefore,
    balance_after: balanceAfter,
    created_at: now,
    updated_at: now,
  }

  addTransaction(transaction)

  const updatedAccount: Account = {
    ...account,
    balance: balanceAfter,
    available_balance: balanceAfter,
  }
  updateAccount(updatedAccount)

  return { transaction, account: updatedAccount }
}

export function editTransaction(
  txnId: string,
  data: TransactionFormData,
  newType?: TransactionType,
  newAmount?: number,
): Transaction | null {
  const existing = getTransactionById(txnId)
  if (!existing) return null

  deleteTransaction(txnId)
  recalculateBalance(existing.account_id)

  const account = getAccountById(existing.account_id)!
  const type = newType ?? existing.type
  const amount = newAmount ?? data.amount

  const result = applyTransaction(existing.account_id, type, { ...data, amount })
  if (!result) {
    addTransaction(existing)
    recalculateBalance(existing.account_id)
    return null
  }

  const updated = { ...result.transaction, id: existing.id, created_at: existing.created_at }
  deleteTransaction(result.transaction.id)
  addTransaction(updated)
  recalculateBalance(existing.account_id)

  return getTransactionById(existing.id) ?? updated
}

export function removeTransaction(txnId: string): boolean {
  const txn = getTransactionById(txnId)
  if (!txn) return false
  deleteTransaction(txnId)
  recalculateBalance(txn.account_id)
  return true
}

export function searchCustomers(query: string): CustomerWithAccount[] {
  const q = query.toLowerCase()
  return getCustomers().filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.account_number.includes(q),
  )
}

export function filterTransactions(
  filter: 'all' | 'credit' | 'debit' | 'completed' | 'pending' | 'failed',
  search = '',
): (Transaction & { customerName?: string })[] {
  const store = getStore()
  let txns = getAllTransactions().map((t) => {
    const account = store.accounts.find((a) => a.id === t.account_id)
    const user = account ? store.users.find((u) => u.id === account.user_id) : undefined
    return { ...t, customerName: user?.name }
  })

  if (filter === 'credit') txns = txns.filter((t) => t.type === 'credit')
  else if (filter === 'debit') txns = txns.filter((t) => t.type === 'debit')
  else if (filter !== 'all') txns = txns.filter((t) => t.status === filter)

  if (search) {
    const q = search.toLowerCase()
    txns = txns.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.customerName?.toLowerCase().includes(q) ||
        t.transaction_id.toLowerCase().includes(q),
    )
  }

  return txns
}
