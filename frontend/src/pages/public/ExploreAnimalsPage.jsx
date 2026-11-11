import { useState } from 'react'
import { useAnimaux } from '../../hooks/useAnimaux'
import AnimalCard from '../../components/animals/AnimalCard'
import AnimalFilters from '../../components/animals/AnimalFilters'
import Chargement from '../../components/ui/Chargement'
import Notification from '../../components/ui/Notification'

export default function ExploreAnimalsPage() {
  const [filtres, setFiltres] = useState({
    recherche: '',
    espece: 'TOUS',
    statut: 'TOUS',
  })

  const { animaux, chargement, erreur, recharger } = useAnimaux(filtres)

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 animate-fade-in">
      <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-10">
        <div className="w-12 h-12 rounded-full bg-[#EDE1D8]/60 flex items-center justify-center text-[#C65335] shadow-sm mb-3">
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <ellipse cx="8.5" cy="5" rx="1.8" ry="2.6" />
            <ellipse cx="15.5" cy="5" rx="1.8" ry="2.6" />
            <ellipse cx="5" cy="10" rx="1.8" ry="2.4" />
            <ellipse cx="19" cy="10" rx="1.8" ry="2.4" />
            <path d="M12 9.5c-3.1 0-5.8 2.2-5.8 5.6 0 2.2 1.4 4.4 3.3 5.4 1.5.8 3.5.8 5 0 1.9-1 3.3-3.2 3.3-5.4 0-3.4-2.7-5.6-5.8-5.6z" />
          </svg>
        </div>
        <span className="text-xs uppercase tracking-widest font-semibold text-[#9E4211] mb-2">
          Sanctuaire &amp; Adoption
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#342E2B] mb-3 tracking-tight">
          Trouvez votre compagnon de vie
        </h1>
        <p className="text-[15px] leading-relaxed text-[#736B66] max-w-xl">
          Chaque résident de notre sanctuaire est soigné avec bienveillance en attendant de rejoindre un foyer chaleureux et définitif.
        </p>
      </div>

      <AnimalFilters filtres={filtres} onChangeFiltres={setFiltres} />

      {erreur && (
        <div className="mb-8 max-w-2xl mx-auto">
          <Notification
            type="erreur"
            message={`Impossible de charger les animaux : ${erreur}`}
            onFermer={recharger}
          />
        </div>
      )}

      {chargement ? (
        <Chargement message="Recherche des compagnons du sanctuaire..." hauteurPleine />
      ) : animaux.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-[#EDE1D8]/60 flex items-center justify-center text-[#736B66] mb-4">
            <span className="material-symbols-outlined text-[32px]">pets</span>
          </div>
          <h3 className="text-xl font-bold text-[#342E2B] mb-2">Aucun résident trouvé</h3>
          <p className="text-sm text-[#736B66] mb-6">
            Essayez d’ajuster vos critères de recherche ou de réinitialiser les filtres sélectionnés.
          </p>
          <button
            type="button"
            onClick={() => setFiltres({ recherche: '', espece: 'TOUS', statut: 'TOUS' })}
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-[#C65335] hover:bg-[#A8442B] text-white font-semibold text-sm shadow-sm transition-all cursor-pointer"
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {animaux.map((animal, index) => (
            <AnimalCard key={animal.id} animal={animal} index={index} />
          ))}
        </div>
      )}
    </div>
  )
}
