import { useState, useEffect, useRef } from 'react'
import { animate } from 'animejs'
import { useAnimaux } from '../../hooks/useAnimaux'
import { STATUTS_ANIMAL, ESPECES } from '../../utils/constantes'
import { formaterDate } from '../../utils/dates'
import { formaterPoids } from '../../utils/nombres'
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
  const tableRef = useRef(null)

  useEffect(() => {
    if (chargement) return

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    try {
      if (tableRef.current) {
        animate(tableRef.current, {
          opacity: [0, 1],
          translateY: [12, 0],
          duration: 350,
          ease: 'outCubic',
        })
      }
    } catch {
      // Fallback
    }
  }, [chargement, filtres])

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
    <div className="space-y-8">
      {/* EN-TÊTE OPÉRATIONNEL */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-dark tracking-tight">
            Gestion des Animaux
          </h1>
          <p className="text-xs sm:text-sm text-brand-dark/70 mt-1">
            Intake, fiches comportementales, suivi des statuts et mises à jour en refuge
          </p>
        </div>
        <Bouton variant="primary" size="md" onClick={ouvrirAjout} className="self-start sm:self-auto shadow-warm-md flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
          <span>Ajouter un animal</span>
        </Bouton>
      </div>

      {messageNotification && (
        <Notification
          type={messageNotification.type}
          message={messageNotification.texte}
          onFermer={() => setMessageNotification(null)}
        />
      )}

      {erreur && <Notification type="erreur" message={erreur} />}

      {/* BARRE DE RECHERCHE ET FILTRES */}
      <div className="bg-white p-4 rounded-2xl border border-brand-burnt/15 shadow-[0_4px_20px_rgba(52,46,43,0.03)] flex flex-wrap items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <svg className="w-4 h-4 text-brand-taupe absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Filtrer par nom ou race..."
            value={filtres.recherche}
            onChange={(e) => setFiltres({ ...filtres, recherche: e.target.value })}
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-brand-stone bg-[#FFF8F5] focus:outline-none focus:border-brand-burnt focus:ring-1 focus:ring-brand-burnt transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <select
            value={filtres.espece}
            onChange={(e) => setFiltres({ ...filtres, espece: e.target.value })}
            aria-label="Filtrer par espèce"
            className="px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-brand-stone bg-white font-semibold text-brand-dark focus:outline-none focus:border-brand-burnt"
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
            aria-label="Filtrer par statut"
            className="px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-brand-stone bg-white font-semibold text-brand-dark focus:outline-none focus:border-brand-burnt"
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

      {/* TABLE DES ANIMAUX */}
      {chargement ? (
        <Chargement message="Chargement des pensionnaires du sanctuaire..." />
      ) : animaux.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-brand-burnt/15 text-center text-xs sm:text-sm text-brand-taupe space-y-2">
          <p className="font-semibold">Aucun animal ne correspond aux filtres appliqués.</p>
        </div>
      ) : (
        <div ref={tableRef} className="bg-white rounded-3xl border border-brand-burnt/15 shadow-[0_8px_30px_rgba(52,46,43,0.04)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#FFF8F5] border-b border-brand-stone/60 text-brand-dark uppercase tracking-wider text-[11px] font-bold">
                <tr>
                  <th className="py-4 px-5">Nom &amp; Espèce</th>
                  <th className="py-4 px-5">Race</th>
                  <th className="py-4 px-5">Âge &amp; Sexe</th>
                  <th className="py-4 px-5">Poids</th>
                  <th className="py-4 px-5">Statut</th>
                  <th className="py-4 px-5">Date d'arrivée</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-stone/40">
                {animaux.map((animal) => {
                  const statutInfo = STATUTS_ANIMAL[animal.statut] || STATUTS_ANIMAL.DISPONIBLE
                  return (
                    <tr key={animal.id} className="hover:bg-brand-surface/30 transition-colors">
                      <td className="py-4 px-5 font-bold text-brand-dark">
                        <div className="flex items-center gap-3">
                          <span className="w-9 h-9 rounded-xl bg-brand-burnt/10 text-brand-burnt flex items-center justify-center text-sm shrink-0">
                            {animal.espece === 'CHIEN' ? '🐕' : animal.espece === 'CHAT' ? '🐈' : '🐾'}
                          </span>
                          <div>
                            <span className="font-extrabold text-sm sm:text-base text-brand-dark block">{animal.nom}</span>
                            <span className="text-[11px] text-brand-taupe font-medium">{animal.espece}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-5 text-brand-dark/80 font-medium">
                        {animal.race || 'Non spécifiée'}
                      </td>
                      <td className="py-4 px-5 text-brand-dark/80">
                        {animal.age} an{animal.age > 1 ? 's' : ''} • {animal.sexe}
                      </td>
                      <td className="py-4 px-5 text-brand-dark/80 font-semibold">
                        {formaterPoids(animal.poids)}
                      </td>
                      <td className="py-4 px-5">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${statutInfo.badgeClass}`}>
                          {statutInfo.label}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-brand-taupe text-xs">
                        {formaterDate(animal.dateArrivee)}
                      </td>
                      <td className="py-4 px-5 text-right space-x-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => ouvrirEdition(animal)}
                          className="px-3 py-1.5 rounded-xl bg-brand-surface hover:bg-brand-burnt hover:text-white text-brand-dark border border-brand-burnt/20 text-xs font-bold transition-all cursor-pointer active:scale-95 shadow-sm"
                        >
                          Modifier
                        </button>
                        <button
                          type="button"
                          onClick={() => gererSuppression(animal)}
                          className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-700 hover:text-white text-rose-800 border border-rose-200 text-xs font-bold transition-all cursor-pointer active:scale-95 shadow-sm"
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
        titre={animalEnEdition ? `Modifier la fiche de ${animalEnEdition.nom}` : 'Ajouter un animal au refuge'}
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
