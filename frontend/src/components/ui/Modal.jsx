import { useEffect } from 'react'

export default function Modal({ ouvert, onFermer, titre, children, taille = 'md' }) {
  useEffect(() => {
    function gererEchap(e) {
      if (e.key === 'Escape') onFermer()
    }
    if (ouvert) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', gererEchap)
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-dark/60 backdrop-blur-sm overflow-y-auto"
      onClick={onFermer}
    >
      <div
        className={`w-full ${
          tailles[taille] || tailles.md
        } bg-white rounded-3xl shadow-2xl border border-brand-burnt/15 overflow-hidden my-8 transform transition-all`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-brand-stone bg-brand-cream/60">
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
        <div className="p-6 max-h-[80vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  )
}
