import { useState } from 'react'
import { useAnimaux } from '../../hooks/useAnimaux'
import AnimalCard from '../../components/animals/AnimalCard'
import AnimalFilters from '../../components/animals/AnimalFilters'
import Chargement from '../../components/ui/Chargement'
import Notification from '../../components/ui/Notification'
import MascotCameo from '../../components/ui/MascotCameo'

export default function ExploreAnimalsPage() {
  const [filtres, setFiltres] = useState({
    recherche: '',
    espece: 'TOUS',
    statut: 'TOUS',
  })

  const { animaux, chargement, erreur, recharger } = useAnimaux(filtres)

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* En-tête éditorial */}
      <div className="mb-10 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-burnt/10 border border-brand-burnt/20 text-brand-burnt text-xs font-bold uppercase tracking-wider mb-3">
          <span>🐾</span>
          Sanctuaire Rafiq • Compagnons à l'adoption
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-brand-dark tracking-tight">
          Trouvez votre{' '}
          <span className="font-serif italic font-normal text-brand-burnt">
            compagnon de vie
          </span>
        </h1>
        <p className="mt-3 text-base text-brand-dark/75 leading-relaxed">
          Chaque résident de notre sanctuaire est soigné avec bienveillance. Explorez leurs profils complets, découvrez leur tempérament et initiez une demande d’adoption réfléchie.
        </p>
      </div>

      {/* Barre de filtres et recherche */}
      <div className="mb-10">
        <AnimalFilters filtres={filtres} onChangeFiltres={setFiltres} />
      </div>

      {/* Gestion des erreurs de chargement */}
      {erreur && (
        <div className="mb-8">
          <Notification
            type="erreur"
            message={`Impossible de charger les animaux : ${erreur}`}
            onFermer={recharger}
          />
        </div>
      )}

      {/* Contenu principal : Grille d'animaux */}
      {chargement ? (
        <Chargement message="Recherche des compagnons du sanctuaire..." hauteurPleine />
      ) : animaux.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-brand-burnt/15 text-center max-w-xl mx-auto shadow-sm">
          <MascotCameo
            mode="sit"
            taille={72}
            className="mb-4 justify-center"
            titreBulle="Aucun animal trouvé"
            bulle="Essayez de modifier vos critères de recherche ou revenez bientôt !"
          />
          <h3 className="text-xl font-bold text-brand-dark mb-2">Aucun compagnon ne correspond</h3>
          <p className="text-sm text-brand-dark/70 mb-6">
            Aucun animal ne correspond à ces critères dans le refuge actuellement.
          </p>
          <button
            type="button"
            onClick={() => setFiltres({ recherche: '', espece: 'TOUS', statut: 'TOUS' })}
            className="px-5 py-2.5 rounded-full bg-brand-burnt text-white text-xs font-bold hover:bg-brand-orange transition-colors cursor-pointer"
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-6 px-1">
            <p className="text-sm font-bold text-brand-dark/80">
              {animaux.length} compagnon{animaux.length > 1 ? 's' : ''} disponible{animaux.length > 1 ? 's' : ''}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {animaux.map((animal) => (
              <AnimalCard key={animal.id} animal={animal} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
