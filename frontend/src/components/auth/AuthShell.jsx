import RiveMascot from './RiveMascot'

function PawMark({ className = '' }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <ellipse cx="8.5" cy="5" rx="1.75" ry="2.5" />
      <ellipse cx="15.5" cy="5" rx="1.75" ry="2.5" />
      <ellipse cx="4.75" cy="9.5" rx="1.6" ry="2.2" />
      <ellipse cx="19.25" cy="9.5" rx="1.6" ry="2.2" />
      <path d="M12 10.2c-3.1 0-5.7 2.1-5.7 4.9 0 2.2 1.6 3.9 3.5 3.9.9 0 1.6-.4 2.2-1 .6.6 1.3 1 2.2 1 1.9 0 3.5-1.7 3.5-3.9 0-2.8-2.6-4.9-5.7-4.9z" />
    </svg>
  )
}

export default function AuthShell({
  variant,
  title,
  description,
  children,
  footnote,
  footer,
  trust,
}) {
  return (
    <section className="relative isolate min-h-[85vh] overflow-hidden bg-[#FFF8F5] px-4 py-10 sm:px-6 sm:py-14">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-[#FDEFE7] blur-3xl" />
        <div className="absolute -right-24 top-20 h-80 w-80 rounded-full bg-brand-peach/20 blur-3xl" />
        <div className="absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-brand-orange/10 blur-3xl" />
      </div>

      <div className="pointer-events-none absolute left-6 top-6 z-10 hidden items-center gap-2.5 rounded-full border border-brand-burnt/10 bg-white/85 px-4 py-2 shadow-[0px_4px_14px_rgba(52,46,43,0.06)] backdrop-blur lg:flex">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-burnt text-white">
          <PawMark className="h-3.5 w-3.5" />
        </span>
        <span className="text-[15px] font-extrabold tracking-tight text-brand-burnt">Rafiq</span>
        <span className="h-4 w-px bg-brand-stone" />
        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-taupe">
          Shelter Sanctuary
        </span>
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[460px] flex-col items-center">
        <div className="relative z-20 -mb-8 flex justify-center">
          <RiveMascot variant={variant} />
        </div>

        <div className="relative z-10 w-full rounded-[24px] bg-white p-6 shadow-[0px_12px_32px_-4px_rgba(52,46,43,0.08),0px_4px_12px_-2px_rgba(52,46,43,0.04)] sm:p-8">
          <div className="mb-6 flex flex-col items-center text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#FDF1EC] px-3 py-1">
              <span className="h-2 w-2 rounded-full bg-brand-burnt" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-brand-taupe">
                Portail Refuge • Sanctuary Portal
              </span>
            </div>

            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#C65335] text-white shadow-[0px_4px_12px_rgba(198,83,53,0.25)]">
              <PawMark className="h-6 w-6" />
            </div>

            <div className="mb-1 flex items-center justify-center gap-2.5">
              <span className="text-2xl font-bold tracking-tight text-[#201A18]">Rafiq</span>
              <span className="font-light text-brand-stone">|</span>
              <span className="font-arabic text-2xl font-bold text-brand-burnt" dir="rtl" lang="ar">
                رفيق
              </span>
            </div>

            <p className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-brand-taupe">
              Sanctuaire &amp; Adoption Animale
            </p>

            <h1 className="text-[22px] font-semibold tracking-tight text-[#201A18] sm:text-2xl">
              {title}
            </h1>
            <p className="mt-1.5 max-w-[340px] text-[13px] leading-relaxed text-brand-taupe">
              {description}
            </p>
          </div>

          {children}
          {footnote}
          {footer}
        </div>

        {trust}
      </div>
    </section>
  )
}
