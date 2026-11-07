import { NavLink } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function PersonnelNav() {
  const { utilisateur } = useAuth()

  const onglets = [
    { to: '/personnel', label: 'Tableau de bord', icone: '📊', end: true },
    { to: '/personnel/animaux', label: 'Gestion Animaux', icone: '🐕' },
    { to: '/personnel/demandes', label: 'Demandes d’Adoption', icone: '📋' },
    { to: '/personnel/dossiers-medicaux', label: 'Dossiers Médicaux', icone: '🩺' },
    { to: '/personnel/dons', label: 'Gestion des Dons', icone: '🎁' },
    { to: '/personnel/equipe', label: 'Équipe & Sécurité', icone: '👥' },
  ]

  return (
    <div className="mb-8">
      {/* Bandeau d'en-tête de l'espace gestion */}
      <div className="bg-brand-dark text-white p-6 rounded-3xl shadow-warm-md mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-burnt text-[11px] font-bold uppercase tracking-wider mb-2">
            <span>🛡️</span> Espace Opérationnel Refuge
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Gestion du Sanctuaire Rafiq
          </h1>
          <p className="text-xs text-brand-cream/80 mt-1">
            Connecté en tant que <strong className="text-brand-peach">{utilisateur?.nom}</strong> ({utilisateur?.email})
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs bg-white/10 text-brand-peach px-3 py-1.5 rounded-full border border-white/10 font-bold">
            Accès Staff Égalitaire (Sans RBAC)
          </span>
        </div>
      </div>

      {/* Barre d'onglets réactifs */}
      <nav className="flex overflow-x-auto no-scrollbar gap-2 p-1.5 bg-white rounded-2xl border border-brand-burnt/15 shadow-sm">
        {onglets.map((onglet) => (
          <NavLink
            key={onglet.to}
            to={onglet.to}
            end={onglet.end}
            className={({ isActive }) =>
              `px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                isActive
                  ? 'bg-brand-burnt text-white shadow-sm'
                  : 'text-brand-dark/70 hover:text-brand-burnt hover:bg-brand-surface'
              }`
            }
          >
            <span>{onglet.icone}</span>
            <span>{onglet.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
