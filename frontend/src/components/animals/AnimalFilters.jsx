import { ESPECES, STATUTS_ANIMAL } from '../../utils/constantes'

export default function AnimalFilters({ filtres, onChangeFiltres }) {
  const majFiltre = (cle, valeur) => {
    onChangeFiltres({ ...filtres, [cle]: valeur })
  }

  return (
    <div className="bg-white p-5 rounded-3xl border border-brand-burnt/15 shadow-sm space-y-4">
      {/* Barre de recherche textuelle */}
      <div className="relative">
        <input
          type="text"
          placeholder="Rechercher par nom, race ou mot-clé..."
          value={filtres.recherche || ''}
          onChange={(e) => majFiltre('recherche', e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-brand-cream/60 border border-brand-stone rounded-2xl text-sm focus:outline-none focus:border-brand-burnt focus:ring-2 focus:ring-brand-burnt/20 placeholder:text-brand-taupe"
        />
        <svg
          className="w-5 h-5 absolute left-3.5 top-3.5 text-brand-taupe"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-brand-stone/60">
        {/* Filtre par Espèce */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-brand-dark/70 mr-1">Espèce :</span>
          <button
            type="button"
            onClick={() => majFiltre('espece', 'TOUS')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              !filtres.espece || filtres.espece === 'TOUS'
                ? 'bg-brand-burnt text-white shadow-sm'
                : 'bg-brand-surface text-brand-dark hover:bg-brand-burnt/10'
            }`}
          >
            Toutes
          </button>
          {Object.entries(ESPECES).map(([code, info]) => (
            <button
              key={code}
              type="button"
              onClick={() => majFiltre('espece', code)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                filtres.espece === code
                  ? 'bg-brand-burnt text-white shadow-sm'
                  : 'bg-brand-surface text-brand-dark hover:bg-brand-burnt/10'
              }`}
            >
              <span>{info.icone}</span>
              <span>{info.label}s</span>
            </button>
          ))}
        </div>

        {/* Filtre par Statut */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-brand-dark/70 mr-1">Statut :</span>
          <button
            type="button"
            onClick={() => majFiltre('statut', 'TOUS')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              !filtres.statut || filtres.statut === 'TOUS'
                ? 'bg-brand-dark text-white shadow-sm'
                : 'bg-brand-surface text-brand-dark hover:bg-brand-burnt/10'
            }`}
          >
            Tous
          </button>
          {Object.entries(STATUTS_ANIMAL).map(([code, info]) => (
            <button
              key={code}
              type="button"
              onClick={() => majFiltre('statut', code)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                filtres.statut === code
                  ? 'bg-brand-burnt text-white shadow-sm'
                  : 'bg-brand-surface text-brand-dark hover:bg-brand-burnt/10'
              }`}
            >
              {info.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
