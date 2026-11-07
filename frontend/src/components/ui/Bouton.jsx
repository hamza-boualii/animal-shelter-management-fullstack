export default function Bouton({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  chargement = false,
  className = '',
  onClick,
  ...props
}) {
  const baseClasses =
    'inline-flex items-center justify-center font-bold transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-3 focus:ring-brand-burnt/30 active:scale-[0.98]'

  const variants = {
    primary:
      'bg-brand-burnt text-white hover:bg-brand-orange shadow-warm-sm hover:shadow-warm-md active:bg-[#9D3A20]',
    secondary:
      'bg-white text-brand-dark border border-brand-burnt/20 hover:bg-brand-surface hover:border-brand-burnt active:bg-[#F0E2D8]',
    ghost:
      'bg-transparent text-brand-burnt hover:bg-brand-surface/70 active:bg-brand-surface',
    dark:
      'bg-brand-dark text-white hover:bg-black shadow-warm-sm active:bg-neutral-900',
    danger:
      'bg-rose-700 text-white hover:bg-rose-800 shadow-sm active:bg-rose-900',
  }

  const sizes = {
    sm: 'text-xs px-3.5 py-1.5 rounded-full',
    md: 'text-sm px-5 py-2.5 rounded-full',
    lg: 'text-base px-7 py-3.5 rounded-full',
  }

  return (
    <button
      type={type}
      disabled={disabled || chargement}
      onClick={onClick}
      className={`${baseClasses} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {chargement ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Chargement...
        </span>
      ) : (
        children
      )}
    </button>
  )
}
