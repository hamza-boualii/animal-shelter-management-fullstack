export default function Notification({ type = 'info', message, onFermer }) {
  if (!message) return null

  const styles = {
    succes: 'bg-emerald-50 border-emerald-300 text-emerald-900',
    erreur: 'bg-rose-50 border-rose-300 text-rose-900',
    info: 'bg-brand-cream border-brand-burnt/30 text-brand-dark',
    avertissement: 'bg-amber-50 border-amber-300 text-amber-900',
  }

  const icones = {
    succes: '✓',
    erreur: '⚠',
    info: 'ℹ',
    avertissement: '!',
  }

  return (
    <div
      role="alert"
      className={`p-4 rounded-2xl border shadow-warm-sm flex items-start justify-between gap-3 ${
        styles[type] || styles.info
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="font-bold text-lg leading-none">{icones[type] || '•'}</span>
        <div className="text-sm font-medium leading-relaxed">{message}</div>
      </div>
      {onFermer && (
        <button
          type="button"
          onClick={onFermer}
          className="text-current opacity-60 hover:opacity-100 transition-opacity p-1 text-sm cursor-pointer"
          aria-label="Fermer"
        >
          ✕
        </button>
      )}
    </div>
  )
}
