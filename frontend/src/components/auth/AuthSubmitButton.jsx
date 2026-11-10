import AuthIcon from './AuthIcon'

export default function AuthSubmitButton({ children, chargement = false }) {
  return (
    <button
      type="submit"
      disabled={chargement}
      className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand-burnt text-[15px] font-semibold text-white shadow-[0px_4px_12px_rgba(198,83,53,0.28)] transition-all hover:bg-[#B44629] focus:outline-none focus:ring-4 focus:ring-brand-burnt/25 active:scale-[0.99] active:bg-[#9D3A20] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {chargement ? (
        <>
          <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Chargement...</span>
        </>
      ) : (
        <>
          <span>{children}</span>
          <AuthIcon name="arrow-right" className="h-[18px] w-[18px]" />
        </>
      )}
    </button>
  )
}
