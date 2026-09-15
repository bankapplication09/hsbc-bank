import type { Account, Transaction, User } from '../types'
import { SEED_ACCOUNT, SEED_TRANSACTIONS, SEED_USERS } from './seed'
import { parseTxnTimestamp } from './format'

const STORAGE_KEY = 'velora_bank_data'
const SESSION_KEY = 'velora_bank_session'

interface StoreData {
  users: User[]
  accounts: Account[]
  transactions: Transaction[]
}

function syncOpeningBalances(data: StoreData): StoreData {
  for (const account of data.accounts) {
    const txns = data.transactions.filter(
      (t) => t.account_id === account.id && t.status === 'completed',
    )
    const net = txns.reduce(
      (s, t) => s + (t.type === 'credit' ? t.amount : -t.amount),
      0,
    )
    account.opening_balance = account.balance - net
  }
  return data
}

function loadStore(): StoreData {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    let initial: StoreData = {
      users: SEED_USERS,
      accounts: [{ ...SEED_ACCOUNT }],
      transactions: [...SEED_TRANSACTIONS],
    }
    initial = syncOpeningBalances(initial)
    for (const account of initial.accounts) {
      recalculateBalanceInternal(initial, account.id)
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial))
    return initial
  }
  return JSON.parse(raw) as StoreData
}

function recalculateBalanceInternal(store: StoreData, accountId: string): void {
  const account = store.accounts.find((a) => a.id === accountId)
  if (!account) return

  const txns = store.transactions
    .filter((t) => t.account_id === accountId && t.status === 'completed')
    .sort((a, b) => {
      const da = parseTxnTimestamp(a.date, a.time, a.created_at)
      const db = parseTxnTimestamp(b.date, b.time, b.created_at)
      return da - db
    })

  let balance = account.opening_balance
  for (const t of txns) {
    const before = balance
    balance = t.type === 'credit' ? balance + t.amount : balance - t.amount
    t.balance_before = before
    t.balance_after = balance
  }

  account.balance = balance
  account.available_balance = balance
}

function saveStore(data: StoreData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  window.dispatchEvent(new CustomEvent('velora:data-changed'))
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) {
      window.dispatchEvent(new CustomEvent('velora:data-changed'))
    }
  })
}


export function getStore(): StoreData {
  return loadStore()
}

export function resetStore(): void {
  localStorage.removeItem(STORAGE_KEY)
  loadStore()
}

export function saveSession(session: { userId: string; role: string; email: string; name: string } | null): void {
  if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  else localStorage.removeItem(SESSION_KEY)
}

export function getSession(): { userId: string; role: string; email: string; name: string } | null {
  const raw = localStorage.getItem(SESSION_KEY)
  return raw ? JSON.parse(raw) : null
}

export function updateAccount(account: Account): void {
  const store = loadStore()
  const idx = store.accounts.findIndex((a) => a.id === account.id)
  if (idx >= 0) store.accounts[idx] = account
  saveStore(store)
}

export function updateUser(user: User): void {
  const store = loadStore()
  const idx = store.users.findIndex((u) => u.id === user.id)
  if (idx >= 0) store.users[idx] = user
  saveStore(store)
}

export function addTransaction(txn: Transaction): void {
  const store = loadStore()
  store.transactions.unshift(txn)
  saveStore(store)
}

export function updateTransaction(txn: Transaction): void {
  const store = loadStore()
  const idx = store.transactions.findIndex((t) => t.id === txn.id)
  if (idx >= 0) {
    store.transactions[idx] = { ...txn, updated_at: new Date().toISOString() }
    saveStore(store)
  }
}

export function deleteTransaction(id: string): void {
  const store = loadStore()
  store.transactions = store.transactions.filter((t) => t.id !== id)
  saveStore(store)
}

export function recalculateBalance(accountId: string): Account | null {
  const store = loadStore()
  recalculateBalanceInternal(store, accountId)
  saveStore(store)
  return store.accounts.find((a) => a.id === accountId) ?? null
}
