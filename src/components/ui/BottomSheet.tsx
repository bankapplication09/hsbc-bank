import { X } from 'lucide-react'
import { useEffect, type ReactNode } from 'react'

interface BottomSheetProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  fullHeight?: boolean
}

export function BottomSheet({ open, onClose, title, children, fullHeight }: BottomSheetProps) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0">
      <div
        className="fixed inset-0 bg-black/55 backdrop-blur-[3px] overlay-enter transition-opacity"
        onClick={onClose}
      />
      <div
        className={`relative w-full max-w-[430px] mx-auto bg-white rounded-t-[32px] shadow-[0_-15px_40px_rgba(0,0,0,0.2)] sheet-enter flex flex-col z-10 ${
          fullHeight ? 'h-[92dvh]' : 'max-h-[88dvh]'
        }`}
      >
        <div className="flex items-center justify-between px-6 pt-5 pb-3 shrink-0 border-b border-gray-100/60 relative">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto absolute top-2.5 left-1/2 -translate-x-1/2" />
          {title ? (
            <h2 className="text-lg font-bold text-charcoal mt-1 tracking-tight">{title}</h2>
          ) : (
            <div />
          )}
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100/90 text-charcoal/70 hover:bg-gray-200 transition-colors touch-active"
            aria-label="Close"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4 overscroll-contain">{children}</div>
      </div>
    </div>
  )
}

