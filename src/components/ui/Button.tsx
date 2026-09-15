import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  children: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const variants = {
    primary: 'bg-brand-800 text-white hover:bg-brand-900 active:bg-brand-900 shadow-md shadow-brand-800/20',
    secondary: 'bg-white text-charcoal border border-gray-200 hover:bg-gray-50',
    ghost: 'bg-transparent text-brand-800 hover:bg-brand-50',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    outline: 'border-2 border-brand-800 text-brand-800 bg-transparent hover:bg-brand-50',
  }
  const sizes = {
    sm: 'px-4 py-2 text-sm rounded-xl min-h-[40px]',
    md: 'px-5 py-3 text-base rounded-2xl min-h-[48px]',
    lg: 'px-6 py-4 text-base rounded-2xl min-h-[52px]',
  }

  return (
    <button
      className={`font-semibold transition-all touch-active flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : (
        children
      )}
    </button>
  )
}
