import { Link } from 'react-router-dom'
import { STATUTS_ANIMAL, DEFAULT_ANIMAL_IMAGES, SEXES } from '../../utils/constantes'

export default function AnimalCard({ animal }) {
  const statutInfo = STATUTS_ANIMAL[animal.statut] || STATUTS_ANIMAL.DISPONIBLE
  const photo =
    animal.photoUrl ||
    DEFAULT_ANIMAL_IMAGES[animal.espece] ||
    '/images/animals/golden-retriever.png'

  const sexeInfo = SEXES[animal.sexe] || { label: animal.sexe, symbole: '' }

  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-brand-burnt/15 shadow-sm hover:shadow-warm-md hover:border-brand-burnt/30 transition-all duration-300 flex flex-col justify-between group">
      <div>
        <div className="relative aspect-[4/3] overflow-hidden bg-brand-surface">
          <img
            src={photo}
            alt={animal.nom}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <span
            className={`absolute top-3 left-3 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border shadow-sm ${statutInfo.badgeClass}`}
          >
            {statutInfo.label}
          </span>
          <span className="absolute bottom-3 right-3 bg-brand-dark/80 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full font-bold">
            {sexeInfo.symbole} {sexeInfo.label}
          </span>
        </div>

        <div className="p-5">
          <div className="flex items-baseline justify-between mb-1">
            <h3 className="text-xl font-bold text-brand-dark group-hover:text-brand-burnt transition-colors">
              {animal.nom}
            </h3>
            <span className="text-xs font-semibold text-brand-dark/60">
              {animal.age} an{animal.age > 1 ? 's' : ''}
            </span>
          </div>

          <p className="text-xs font-semibold text-brand-orange mb-3">
            {animal.espece} • {animal.race || 'Race croisée'}
          </p>

          <p className="text-xs text-brand-dark/75 line-clamp-3 leading-relaxed">
            {animal.description || 'Compagnon affectueux en attente d’une famille aimante.'}
          </p>
        </div>
      </div>

      <div className="p-5 pt-0">
        <Link
          to={`/animaux/${animal.id}`}
          className="w-full py-2.5 px-4 rounded-xl bg-brand-cream hover:bg-brand-burnt hover:text-white text-brand-dark border border-brand-burnt/20 text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
        >
          <span>Consulter le dossier</span>
          <span>→</span>
        </Link>
      </div>
    </div>
  )
}
