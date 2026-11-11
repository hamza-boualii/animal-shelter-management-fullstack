import { Link } from 'react-router-dom'
import { STATUTS_ANIMAL, DEFAULT_ANIMAL_IMAGES, SEXES } from '../../utils/constantes'

export default function AnimalCard({ animal, index = 0 }) {
  const statutInfo = STATUTS_ANIMAL[animal.statut] || STATUTS_ANIMAL.DISPONIBLE
  const photo =
    animal.photoUrl ||
    DEFAULT_ANIMAL_IMAGES[animal.espece] ||
    '/images/animals/golden-retriever.png'

  const sexeInfo = SEXES[animal.sexe] || { label: animal.sexe, symbole: '' }

  const statusBadgeColor = {
    DISPONIBLE: 'bg-[#DEF7EC] text-[#03543F]',
    EN_ATTENTE_ADOPTION: 'bg-[#F7EDE2] text-[#9E4211]',
    EN_SOIN: 'bg-[#E1EFFE] text-[#1E429F]',
    ADOPTE: 'bg-[#F3F4F6] text-[#4B5563]',
  }[animal.statut] || 'bg-[#DEF7EC] text-[#03543F]'

  const statusLabel = {
    DISPONIBLE: 'DISPONIBLE',
    EN_ATTENTE_ADOPTION: 'EN ATTENTE',
    EN_SOIN: 'EN SOINS',
    ADOPTE: 'ADOPTÉ',
  }[animal.statut] || statutInfo.label.toUpperCase()

  return (
    <article
      data-animal-card=""
      data-species-type={animal.espece?.toLowerCase()}
      data-status-type={animal.statut}
      className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 animate-card-reveal"
      style={{ animationDelay: `${Math.min(index * 60, 480)}ms` }}
    >
      <div className="relative w-full aspect-square bg-[#FDF0E9] overflow-hidden">
        <img
          src={photo}
          alt={animal.nom}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-3.5 left-3.5">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider shadow-sm shrink-0 ${statusBadgeColor}`}>
            {statusLabel}
          </span>
        </div>
        <div className="absolute bottom-3.5 right-3.5">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-[#342E2B] text-white shadow-sm">
            {sexeInfo.symbole && <span>{sexeInfo.symbole}</span>}
            <span>{sexeInfo.label}</span>
          </span>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow justify-between gap-4">
        <div>
          <div className="flex items-baseline justify-between mb-1">
            <h2 className="text-xl font-bold text-[#342E2B] tracking-tight group-hover:text-[#C65335] transition-colors">
              {animal.nom}
            </h2>
            <span className="text-sm text-[#736B66]">
              {animal.age} an{animal.age > 1 ? 's' : ''}
            </span>
          </div>

          <p className="text-sm font-semibold uppercase tracking-wide text-[#C65335] mb-2.5">
            {animal.espece} • {animal.race || 'Race croisée'}
          </p>

          <p className="text-sm text-[#736B66] leading-relaxed line-clamp-2">
            {animal.description || 'Compagnon affectueux en attente d’une famille aimante.'}
          </p>
        </div>

        <Link
          to={`/animaux/${animal.id}`}
          className="w-full flex items-center justify-center gap-2 bg-[#FDF0E9] hover:bg-[#C65335] text-[#C65335] hover:text-white border border-[#E87945]/30 hover:border-[#C65335] font-semibold py-2.5 px-4 rounded-xl text-sm shadow-sm transition-all duration-200"
        >
          <span>Consulter le dossier</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </Link>
      </div>
    </article>
  )
}
