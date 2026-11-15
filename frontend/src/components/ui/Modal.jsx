import { useEffect } from 'react'
import { createPortal } from 'react-dom'

export default function Modal({ ouvert, onFermer, titre, children, taille = 'md' }) {
  useEffect(() => {
    if (!ouvert) return

    function gererEchap(e) {
      if (e.key === 'Escape') onFermer()
    }

    // Lock page scroll and restore the previous value on close/unmount.
    const debordementPrecedent = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', gererEchap)

    return () => {
      document.body.style.overflow = debordementPrecedent
      window.removeEventListener('keydown', gererEchap)
    }
  }, [ouvert, onFermer])

  if (!ouvert) return null

  const tailles = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }

  // Portal into document.body so `fixed` is measured against the window,
  // not against an animated ancestor (the personnel page transition).
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-dark/60 backdrop-blur-sm"
      onClick={onFermer}
    >
      <div
        className={`w-full ${
          tailles[taille] || tailles.md
        } max-h-[90vh] flex flex-col bg-white rounded-3xl shadow-2xl border border-brand-burnt/15 overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="shrink-0 flex items-center justify-between px-6 py-4 border-b border-brand-stone bg-brand-cream/60">
          <h3 className="text-lg font-bold text-brand-dark">{titre}</h3>
          <button
            type="button"
            onClick={onFermer}
            className="w-8 h-8 rounded-full bg-white hover:bg-brand-surface text-brand-dark flex items-center justify-center transition-colors border border-brand-stone cursor-pointer"
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>
        {/* Only this body scrolls, so the title and the form footer stay visible. */}
        <div className="flex-1 min-h-0 overflow-y-auto p-6">{children}</div>
      </div>
    </div>,
    document.body
  )
}
