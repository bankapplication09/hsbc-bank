export function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 36, md: 48, lg: 64 }
  const s = sizes[size]

  return (
    <div className="flex items-center gap-2.5">
      <svg width={s} height={s} viewBox="0 0 48 48" fill="none" aria-hidden>
        <rect width="48" height="48" rx="14" fill="url(#logoGrad)" />
        <path
          d="M14 32V16h6.5c3.2 0 5.5 1.8 5.5 4.8 0 2.2-1.2 3.8-3.1 4.5l4.1 6.7h-4.2l-3.6-6H18v6h-4zm4-9.5h2.3c1.4 0 2.2-.7 2.2-1.8 0-1.1-.8-1.7-2.2-1.7H18v3.5zM28 32l6-16h4.5l6 16h-4.3l-1-3h-6.2l-1 3H28zm5.5-6.5h4l-2-5.5-2 5.5z"
          fill="white"
        />
        <defs>
          <linearGradient id="logoGrad" x1="0" y1="0" x2="48" y2="48">
            <stop stopColor="#7c1034" />
            <stop offset="1" stopColor="#b81d52" />
          </linearGradient>
        </defs>
      </svg>
      <div>
        <p className="font-bold text-charcoal leading-tight" style={{ fontSize: size === 'lg' ? '1.35rem' : size === 'md' ? '1.1rem' : '0.95rem' }}>
          Velora
        </p>
        <p className="text-muted text-xs tracking-widest uppercase">Bank</p>
      </div>
    </div>
  )
}
