export function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 36, md: 44, lg: 56 }
  const s = sizes[size]

  return (
    <div className="flex items-center gap-3 select-none">
      <div
        className="relative flex items-center justify-center rounded-2xl shadow-md shrink-0 overflow-hidden"
        style={{
          width: s,
          height: s,
          background: 'linear-gradient(135deg, #4a081e 0%, #7c1034 50%, #a81c49 100%)',
          boxShadow: '0 4px 14px rgba(124, 16, 52, 0.35)',
        }}
      >
        {/* Subtle geometric facets inside the emblem */}
        <svg width={s * 0.62} height={s * 0.62} viewBox="0 0 32 32" fill="none" aria-hidden>
          <path
            d="M16 2L29 9.5V22.5L16 30L3 22.5V9.5L16 2Z"
            stroke="rgba(245, 197, 137, 0.4)"
            strokeWidth="1"
            fill="none"
          />
          <path
            d="M16 5.5L25.5 11V21L16 26.5L6.5 21V11L16 5.5Z"
            fill="url(#goldSheen)"
            fillOpacity="0.15"
          />
          <path
            d="M16 7L24 16L16 25L8 16L16 7Z"
            fill="url(#goldSheen)"
          />
          <path
            d="M16 11L20 16L16 21L12 16L16 11Z"
            fill="#5c0b26"
          />
          <circle cx="16" cy="16" r="2" fill="#f5c589" />
          <defs>
            <linearGradient id="goldSheen" x1="8" y1="7" x2="24" y2="25" gradientUnits="userSpaceOnUse">
              <stop stopColor="#fde0b2" />
              <stop offset="0.5" stopColor="#e5a855" />
              <stop offset="1" stopColor="#c57d2a" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div>
        <div className="flex items-center gap-1.5">
          <span
            className="font-bold tracking-tight text-charcoal leading-none"
            style={{
              fontSize: size === 'lg' ? '1.45rem' : size === 'md' ? '1.2rem' : '1.02rem',
              letterSpacing: '-0.02em',
            }}
          >
            VELORA
          </span>
          <span
            className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-brand-50 text-brand-800 border border-brand-100"
          >
            Private
          </span>
        </div>
        <p className="text-muted text-[10px] tracking-[0.2em] uppercase font-medium mt-0.5">
          Reserve Bank
        </p>
      </div>
    </div>
  )
}

