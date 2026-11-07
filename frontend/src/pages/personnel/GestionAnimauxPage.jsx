import { useState } from 'react'
import { useAnimaux } from '../../hooks/useAnimaux'
import { STATUTS_ANIMAL, ESPECES } from '../../utils/constantes'
import { formaterDate } from '../../utils/dates'
import PersonnelNav from '../../components/personnel/PersonnelNav'
import AnimalForm from '../../components/animals/AnimalForm'
import Modal from '../../components/ui/Modal'
import Bouton from '../../components/ui/Bouton'
import Chargement from '../../components/ui/Chargement'
import Notification from '../../components/ui/Notification'

export default function GestionAnimauxPage() {
  const [filtres, setFiltres] = useState({ recherche: '', espece: 'TOUS', statut: 'TOUS' })
  const { animaux, chargement, erreur, creerAnimal, modifierAnimal, supprimerAnimal } = useAnimaux(filtres)

  const [modalOuvert, setModalOuvert] = useState(false)
  const [animalEnEdition, setAnimalEnEdition] = useState(null)
  const [chargementAction, setChargementAction] = useState(false)
  const [messageNotification, setMessageNotification] = useState(null)

  const ouvrirAjout = () => {
    setAnimalEnEdition(null)
    setModalOuvert(true)
  }

  const ouvrirEdition = (animal) => {
    setAnimalEnEdition(animal)
    setModalOuvert(true)
  }

  const fermerModal = () => {
    setAnimalEnEdition(null)
    setModalOuvert(false)
  }

  const gererEnregistrement = async (donnees) => {
    setChargementAction(true)
    try {
      if (animalEnEdition) {
        await modifierAnimal(animalEnEdition.id, donnees)
        setMessageNotification({ type: 'succes', texte: `L’animal "${donnees.nom}" a été mis à jour.` })
      } else {
        await creerAnimal(donnees)
        setMessageNotification({ type: 'succes', texte: `L’animal "${donnees.nom}" a été ajouté au sanctuaire.` })
      }
      fermerModal()
    } catch (err) {
      setMessageNotification({ type: 'erreur', texte: err.message || 'Une erreur est survenue.' })
    } finally {
      setChargementAction(false)
    }
  }

  const gererSuppression = async (animal) => {
    if (!window.confirm(`Confirmez-vous la suppression de l’animal "${animal.nom}" ? Cette action est irréversible.`)) {
      return
    }
    try {
      await supprimerAnimal(animal.id)
      setMessageNotification({ type: 'succes', texte: `L’animal "${animal.nom}" a été retiré du refuge.` })
    } catch (err) {
      setMessageNotification({ type: 'erreur', texte: err.message || 'Impossible de supprimer l’animal.' })
    }
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <PersonnelNav />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-brand-dark">Gestion des Animaux</h2>
          <p className="text-xs text-brand-dark/70">
            Intake, fiches comportementales, suivi des statuts et mises à jour
          </p>
        </div>
        <Bouton variant="primary" size="md" onClick={ouvrirAjout}>
          + Ajouter un animal
        </Bouton>
      </div>

      {messageNotification && (
        <div className="mb-6">
          <Notification
            type={messageNotification.type}
            message={messageNotification.texte}
            onFermer={() => setMessageNotification(null)}
          />
        </div>
      )}

      {erreur && (
        <div className="mb-6">
          <Notification type="erreur" message={erreur} />
        </div>
      )}

      {/* Barre de filtrage interne */}
      <div className="bg-white p-4 rounded-2xl border border-brand-burnt/15 shadow-sm mb-6 flex flex-wrap items-center justify-between gap-3">
        <input
          type="text"
          placeholder="Filtrer par nom ou race..."
          value={filtres.recherche}
          onChange={(e) => setFiltres({ ...filtres, recherche: e.target.value })}
          className="px-4 py-2 text-xs rounded-xl border border-brand-stone bg-brand-cream/40 focus:outline-none focus:border-brand-burnt w-full sm:w-64"
        />

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filtres.espece}
            onChange={(e) => setFiltres({ ...filtres, espece: e.target.value })}
            className="px-3 py-2 text-xs rounded-xl border border-brand-stone bg-white font-semibold text-brand-dark"
          >
            <option value="TOUS">Toutes espèces</option>
            {Object.entries(ESPECES).map(([code, info]) => (
              <option key={code} value={code}>
                {info.label}s
              </option>
            ))}
          </select>

          <select
            value={filtres.statut}
            onChange={(e) => setFiltres({ ...filtres, statut: e.target.value })}
            className="px-3 py-2 text-xs rounded-xl border border-brand-stone bg-white font-semibold text-brand-dark"
          >
            <option value="TOUS">Tous statuts</option>
            {Object.entries(STATUTS_ANIMAL).map(([code, info]) => (
              <option key={code} value={code}>
                {info.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table responsive des animaux */}
      {chargement ? (
        <Chargement message="Chargement des résidents..." />
      ) : animaux.length === 0 ? (
        <div className="bg-white p-10 rounded-3xl border border-brand-stone text-center text-xs text-brand-taupe">
          Aucun animal ne correspond aux filtres appliqués.
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-brand-burnt/15 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-brand-cream/80 border-b border-brand-stone text-brand-dark uppercase tracking-wider text-[11px] font-bold">
                <tr>
                  <th className="py-3.5 px-4">Nom &amp; Espèce</th>
                  <th className="py-3.5 px-4">Race</th>
                  <th className="py-3.5 px-4">Âge &amp; Sexe</th>
                  <th className="py-3.5 px-4">Statut</th>
                  <th className="py-3.5 px-4">Arrivée</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-stone/50">
                {animaux.map((animal) => {
                  const statutInfo = STATUTS_ANIMAL[animal.statut] || STATUTS_ANIMAL.DISPONIBLE
                  return (
                    <tr key={animal.id} className="hover:bg-brand-surface/40 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-brand-dark">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{ESPECES[animal.espece]?.icone || '🐾'}</span>
                          <span>{animal.nom}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-brand-dark/80">
                        {animal.race || 'Non spécifiée'}
                      </td>
                      <td className="py-3.5 px-4 text-brand-dark/80">
                        {animal.age} an{animal.age > 1 ? 's' : ''} • {animal.sexe}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${statutInfo.badgeClass}`}>
                          {statutInfo.label}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-brand-taupe text-xs">
                        {formaterDate(animal.dateArrivee)}
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => ouvrirEdition(animal)}
                          className="px-2.5 py-1 rounded-lg bg-brand-cream hover:bg-brand-burnt hover:text-white text-brand-dark border border-brand-burnt/20 text-xs font-bold transition-colors cursor-pointer"
                        >
                          Modifier
                        </button>
                        <button
                          type="button"
                          onClick={() => gererSuppression(animal)}
                          className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-700 hover:text-white text-rose-800 border border-rose-200 text-xs font-bold transition-colors cursor-pointer"
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Ajout / Modification */}
      <Modal
        ouvert={modalOuvert}
        onFermer={fermerModal}
        titre={animalEnEdition ? `Modifier ${animalEnEdition.nom}` : 'Ajouter un animal au refuge'}
        taille="lg"
      >
        <AnimalForm
          key={animalEnEdition?.id || 'nouveau'}
          animalInitial={animalEnEdition}
          onEnregistrer={gererEnregistrement}
          onAnnuler={fermerModal}
          chargement={chargementAction}
        />
      </Modal>
    </div>
  )
}
