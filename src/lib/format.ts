export function formatCurrency(amount: number | undefined | null, currency = 'INR'): string {
  const val = typeof amount === 'number' && !isNaN(amount) ? amount : 0
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val)
}

export function formatMaskedBalance(currency = '₹'): string {
  return `${currency} ••••••••`
}

export function maskAccountNumber(num?: string): string {
  if (!num) return '**** 0000'
  const clean = num.replace(/\s+/g, '')
  const last4 = clean.slice(-4)
  return `•••• ${last4}`
}

export function formatDate(dateStr?: string): string {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function formatDateTime(dateStr?: string, timeStr?: string): string {
  const formattedDate = formatDate(dateStr)
  if (!timeStr) return formattedDate
  return `${formattedDate} · ${timeStr}`
}

export function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export function generateId(prefix: string): string {
  const rand = Math.floor(100000 + Math.random() * 900000)
  return `${prefix}-${rand}`
}

export function todayISO(): string {
  return new Date().toISOString().split('T')[0]
}

export function nowTime(): string {
  return new Date().toLocaleTimeString('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

export function isToday(dateStr?: string): boolean {
  return dateStr === todayISO()
}

export function parseTxnTimestamp(dateStr?: string, timeStr?: string, fallbackIso?: string): number {
  if (dateStr) {
    const combined = timeStr ? `${dateStr} ${timeStr}` : dateStr
    const parsed = Date.parse(combined)
    if (!isNaN(parsed)) return parsed
    const dOnly = Date.parse(dateStr)
    if (!isNaN(dOnly)) return dOnly
  }
  if (fallbackIso) {
    const fallback = Date.parse(fallbackIso)
    if (!isNaN(fallback)) return fallback
  }
  return 0
}

