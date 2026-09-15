import { useState } from 'react'
import type { TransactionFormData, TransactionStatus, TransactionType } from '../../types'
import { generateId, nowTime, todayISO } from '../../lib/format'
import { Button } from '../ui/Button'
import { Input, Select, TextArea } from '../ui/Input'

const statusOptions = [
  { value: 'completed', label: 'Completed' },
  { value: 'pending', label: 'Pending' },
  { value: 'failed', label: 'Failed' },
]

interface TransactionFormProps {
  type: TransactionType
  initial?: Partial<TransactionFormData>
  submitLabel: string
  onSubmit: (data: TransactionFormData) => void
  onCancel: () => void
  loading?: boolean
}

export function TransactionForm({
  type,
  initial,
  submitLabel,
  onSubmit,
  onCancel,
  loading,
}: TransactionFormProps) {
  const [form, setForm] = useState<TransactionFormData>({
    amount: initial?.amount ?? 0,
    title: initial?.title ?? '',
    description: initial?.description ?? '',
    merchant: initial?.merchant ?? '',
    sender: initial?.sender ?? '',
    recipient: initial?.recipient ?? '',
    category: initial?.category ?? '',
    reference: initial?.reference ?? generateId('REF'),
    transaction_id: initial?.transaction_id ?? generateId('TXN'),
    date: initial?.date ?? todayISO(),
    time: initial?.time ?? nowTime(),
    status: initial?.status ?? 'completed',
    notes: initial?.notes ?? '',
  })

  const set = (key: keyof TransactionFormData, value: string | number) =>
    setForm((f) => ({ ...f, [key]: value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.amount || form.amount <= 0 || !form.title) return
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pb-4">
      <Input
        label="Amount (₹)"
        type="number"
        min="0"
        step="0.01"
        value={form.amount || ''}
        onChange={(e) => set('amount', parseFloat(e.target.value) || 0)}
        required
      />
      <Input label="Title" value={form.title} onChange={(e) => set('title', e.target.value)} required />
      <Input label="Description" value={form.description} onChange={(e) => set('description', e.target.value)} />
      <Input label="Category" value={form.category} onChange={(e) => set('category', e.target.value)} />
      {type === 'credit' ? (
        <Input label="Sender" value={form.sender} onChange={(e) => set('sender', e.target.value)} />
      ) : (
        <>
          <Input label="Merchant" value={form.merchant} onChange={(e) => set('merchant', e.target.value)} />
          <Input label="Recipient" value={form.recipient} onChange={(e) => set('recipient', e.target.value)} />
        </>
      )}
      <Input label="Reference" value={form.reference} onChange={(e) => set('reference', e.target.value)} />
      <Input
        label="Transaction ID"
        value={form.transaction_id}
        onChange={(e) => set('transaction_id', e.target.value)}
      />
      <div className="grid grid-cols-2 gap-3">
        <Input label="Date" type="date" value={form.date} onChange={(e) => set('date', e.target.value)} />
        <Input label="Time" value={form.time} onChange={(e) => set('time', e.target.value)} placeholder="10:30 AM" />
      </div>
      <Select
        label="Status"
        options={statusOptions}
        value={form.status}
        onChange={(e) => set('status', e.target.value as TransactionStatus)}
      />
      <TextArea label="Notes" value={form.notes} onChange={(e) => set('notes', e.target.value)} />
      <div className="flex gap-3 pt-2">
        <Button type="button" variant="secondary" className="flex-1" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="flex-1" loading={loading}>
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
