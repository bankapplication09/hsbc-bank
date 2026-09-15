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
    <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ maxWidth: 430, margin: '0 auto', left: 0, right: 0 }}>
      <div className="absolute inset-0 bg-black/40 overlay-enter" onClick={onClose} />
      <div
        className={`relative w-full bg-white rounded-t-3xl sheet-enter safe-bottom flex flex-col ${
          fullHeight ? 'h-[92dvh]' : 'max-h-[90dvh]'
        }`}
      >
        <div className="flex items-center justify-between px-5 pt-5 pb-3 shrink-0">
          <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto absolute top-2.5 left-1/2 -translate-x-1/2" />
          {title && <h2 className="text-lg font-bold text-charcoal mt-2">{title}</h2>}
          <button
            onClick={onClose}
            className="ml-auto w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-charcoal touch-active"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 pb-6">{children}</div>
      </div>
    </div>
  )
}
