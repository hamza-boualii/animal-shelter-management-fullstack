import { NavLink } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function PersonnelNav() {
  const { utilisateur } = useAuth()

  const onglets = [
    {
      to: '/personnel',
      label: 'Tableau de bord',
      end: true,
      icone: (
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
    },
    {
      to: '/personnel/animaux',
      label: 'Gestion Animaux',
      icone: (
        <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
          <ellipse cx="8.5" cy="5" rx="1.75" ry="2.5" />
          <ellipse cx="15.5" cy="5" rx="1.75" ry="2.5" />
          <ellipse cx="4.75" cy="9.5" rx="1.6" ry="2.2" />
          <ellipse cx="19.25" cy="9.5" rx="1.6" ry="2.2" />
          <path d="M12 10.2c-3.1 0-5.7 2.1-5.7 4.9 0 2.2 1.6 3.9 3.5 3.9.9 0 1.6-.4 2.2-1 .6.6 1.3 1 2.2 1 1.9 0 3.5-1.7 3.5-3.9 0-2.8-2.6-4.9-5.7-4.9z" />
        </svg>
      ),
    },
    {
      to: '/personnel/demandes',
      label: "Demandes d'Adoption",
      icone: (
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
    },
    {
      to: '/personnel/dossiers-medicaux',
      label: 'Dossiers Médicaux',
      icone: (
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-3-3v6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      to: '/personnel/dons',
      label: 'Gestion des Dons',
      icone: (
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
    },
    {
      to: '/personnel/equipe',
      label: 'Équipe & Sécurité',
      icone: (
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
  ]

  return (
    <div className="mb-8 space-y-6">
      {/* 1. Bandeau Opérationnel / Hero Card */}
      <section className="relative overflow-hidden rounded-3xl bg-[#342E2B] text-white shadow-[0_20px_40px_-15px_rgba(52,46,43,0.35)] p-6 sm:p-8 lg:p-9 animate-fade-in">
        {/* Halos lumineux d'ambiance chaleureuse */}
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-gradient-to-br from-[#C65335]/35 to-[#E87945]/20 blur-3xl pointer-events-none"></div>
        <div className="absolute -left-16 -bottom-16 w-72 h-72 rounded-full bg-gradient-to-tr from-[#E87945]/25 to-transparent blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#C65335]/25 backdrop-blur-md text-[#F3B18D] text-xs font-bold tracking-wider uppercase border border-[#F3B18D]/30">
              <span className="w-2 h-2 rounded-full bg-[#E87945] animate-pulse"></span>
              <span>Espace Opérationnel Refuge</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
              Gestion du Sanctuaire Rafiq
            </h1>

            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-[#FFF5EF]/80">
              <span>Connecté en tant que</span>
              <span className="font-semibold text-white bg-white/15 px-2.5 py-0.5 rounded-lg backdrop-blur-sm">
                {utilisateur?.nom || 'Collaborateur'}
              </span>
              <span className="opacity-70 font-mono text-xs">
                ({utilisateur?.email || 'staff@shelter.tn'})
              </span>
            </div>
          </div>

          <div className="flex items-center self-start lg:self-center shrink-0">
            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-inner text-[#FFF5EF] text-xs sm:text-sm font-semibold">
              <svg className="w-4 h-4 text-[#F3B18D] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>Accès Staff Égalitaire (Sans RBAC)</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Sous-navigation opérationnelle réactive */}
      <nav aria-label="Sous-navigation opérationnelle" className="w-full overflow-x-auto pb-1 no-scrollbar animate-slide-up">
        <div className="flex items-center gap-2 min-w-max bg-white p-2 rounded-2xl border border-brand-burnt/15 shadow-[0_4px_20px_rgba(52,46,43,0.04)]">
          {onglets.map((onglet) => (
            <NavLink
              key={onglet.to}
              to={onglet.to}
              end={onglet.end}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-brand-burnt text-white shadow-[0_4px_14px_rgba(198,83,53,0.3)] font-bold'
                    : 'text-brand-dark/70 hover:text-brand-burnt hover:bg-brand-cream/60'
                }`
              }
            >
              {onglet.icone}
              <span>{onglet.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
