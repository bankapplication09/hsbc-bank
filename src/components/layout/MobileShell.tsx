import { useState, useEffect, type ReactNode } from 'react'
import { Wifi, Battery, Smartphone } from 'lucide-react'

const MOBILE_WIDTHS = [
  { label: '360px', width: 360, device: 'Galaxy S21' },
  { label: '375px', width: 375, device: 'iPhone SE/13 mini' },
  { label: '390px', width: 390, device: 'iPhone 14/15' },
  { label: '414px', width: 414, device: 'iPhone Plus' },
  { label: '430px', width: 430, device: 'iPhone Pro Max' },
]

export function MobileShell({ children }: { children: ReactNode }) {
  const [selectedWidth, setSelectedWidth] = useState<number>(414)
  const [currentTime, setCurrentTime] = useState('9:41')
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const hours = now.getHours() % 12 || 12
      const minutes = now.getMinutes().toString().padStart(2, '0')
      setCurrentTime(`${hours}:${minutes}`)
    }
    updateTime()
    const timer = setInterval(updateTime, 10000)

    const checkDesktop = () => {
      setIsDesktop(window.innerWidth > 640)
    }
    checkDesktop()
    window.addEventListener('resize', checkDesktop)

    return () => {
      clearInterval(timer)
      window.removeEventListener('resize', checkDesktop)
    }
  }, [])

  return (
    <div className="min-h-[100dvh] bg-[#0d0f14] md:py-6 flex flex-col items-center justify-start relative">
      {/* Desktop Device Toolbar */}
      {isDesktop && (
        <aside aria-label="Mobile viewport controls" className="hidden md:flex items-center gap-2 mb-4 px-4 py-2 bg-[#1b1e26] border border-white/10 rounded-full shadow-lg z-30 text-xs text-white/80">
          <div className="flex items-center gap-1.5 font-semibold text-white mr-2">
            <Smartphone size={15} className="text-brand-400" />
            <span>Mobile Preview:</span>
          </div>
          <div className="flex items-center gap-1 bg-black/40 p-1 rounded-full border border-white/5">
            {MOBILE_WIDTHS.map(({ label, width }) => (
              <button
                key={width}
                onClick={() => setSelectedWidth(width)}
                className={`px-2.5 py-1 rounded-full font-medium transition-all ${
                  selectedWidth === width
                    ? 'bg-gradient-to-r from-brand-700 to-brand-600 text-white shadow-sm font-semibold'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <span className="text-[11px] text-white/40 ml-1">
            ({MOBILE_WIDTHS.find((m) => m.width === selectedWidth)?.device})
          </span>
        </aside>
      )}

      {/* Main Mobile App Frame */}
      <main
        className="w-full relative bg-[#F7F7F9] min-h-[100dvh] md:rounded-[44px] md:shadow-[0_25px_70px_rgba(0,0,0,0.65)] md:border-[10px] md:border-[#1e222d] overflow-hidden flex flex-col transition-all duration-200"
        style={{
          maxWidth: isDesktop ? `${selectedWidth}px` : '100%',
        }}
      >
        {/* Simulated Mobile Status Bar */}
        <header aria-label="System status" className="sticky top-0 z-30 flex items-center justify-between px-6 pt-3 pb-1 bg-transparent select-none pointer-events-none text-charcoal/80">
          <span className="text-xs font-semibold tracking-tight">{currentTime}</span>

          {/* Dynamic Island / Speaker Pill */}
          <div className="w-24 h-4 bg-black rounded-full mx-auto shadow-inner" />

          <div className="flex items-center gap-1.5 text-charcoal/80">
            {/* Cellular signal bars */}
            <svg width="14" height="10" viewBox="0 0 17 12" fill="currentColor">
              <rect x="0" y="8" width="2.5" height="4" rx="0.5" />
              <rect x="4.5" y="5.5" width="2.5" height="6.5" rx="0.5" />
              <rect x="9" y="3" width="2.5" height="9" rx="0.5" />
              <rect x="13.5" y="0" width="2.5" height="12" rx="0.5" />
            </svg>
            <Wifi size={13} strokeWidth={2.4} />
            <Battery size={15} strokeWidth={2.4} />
          </div>
        </header>

        {/* Child Screen Content */}
        <div className="flex-1 flex flex-col relative w-full overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  )
}

