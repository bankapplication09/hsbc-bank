import { Eye, EyeOff } from 'lucide-react'
import { useState, type InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function Input({ label, error, type, className = '', ...props }: InputProps) {
  const [show, setShow] = useState(false)
  const isPassword = type === 'password'

  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-charcoal mb-1.5">{label}</label>}
      <div className="relative">
        <input
          type={isPassword && show ? 'text' : type}
          className={`w-full px-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-charcoal placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-800/30 focus:border-brand-800 transition-all text-base min-h-[52px] ${className}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted p-1"
            tabIndex={-1}
          >
            {show ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
}

export function TextArea({ label, className = '', ...props }: TextAreaProps) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-charcoal mb-1.5">{label}</label>}
      <textarea
        className={`w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl text-charcoal placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-800/30 focus:border-brand-800 transition-all text-base resize-none ${className}`}
        rows={3}
        {...props}
      />
    </div>
  )
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: { value: string; label: string }[]
}

export function Select({ label, options, className = '', ...props }: SelectProps) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-charcoal mb-1.5">{label}</label>}
      <select
        className={`w-full px-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-charcoal focus:outline-none focus:ring-2 focus:ring-brand-800/30 focus:border-brand-800 transition-all text-base min-h-[52px] appearance-none ${className}`}
        {...props}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  )
}
