import { useState, useEffect, useRef } from 'react'
import { animate, stagger } from 'animejs'
import { useDossiersMedicaux } from '../../hooks/useDossiersMedicaux'
import { useAnimaux } from '../../hooks/useAnimaux'
import { useAuth } from '../../hooks/useAuth'
import Modal from '../../components/ui/Modal'
import Bouton from '../../components/ui/Bouton'
import Chargement from '../../components/ui/Chargement'
import Notification from '../../components/ui/Notification'

export default function DossiersMedicauxPage() {
  const { dossiers, chargement, erreur, creerDossier, modifierDossier, supprimerDossier } = useDossiersMedicaux()
  const { tousLesAnimaux } = useAnimaux()
  const { utilisateur } = useAuth()

  const [modalOuvert, setModalOuvert] = useState(false)
  const [dossierEnEdition, setDossierEnEdition] = useState(null)
  const [chargementAction, setChargementAction] = useState(false)
  const [notification, setNotification] = useState(null)
  const gridRef = useRef(null)

  const [form, setForm] = useState({
    animalId: '',
    personnelId: utilisateur?.id || 1,
    sterilise: false,
    allergies: '',
    vaccinsRecus: '',
    traitementsEnCours: '',
    description: '',
    photoUrls: '',
  })

  useEffect(() => {
    if (chargement) return

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    try {
      const cards = gridRef.current ? Array.from(gridRef.current.children) : []
      if (cards.length > 0) {
        animate(cards, {
          opacity: [0, 1],
          translateY: [14, 0],
          duration: 350,
          ease: 'outCubic',
          delay: stagger(50),
        })
      }
    } catch {
      // Fallback
    }
  }, [chargement, dossiers.length])

  const ouvrirAjout = () => {
    setDossierEnEdition(null)
    setForm({
      animalId: tousLesAnimaux[0]?.id || '',
      personnelId: utilisateur?.id || 1,
      sterilise: false,
      allergies: '',
      vaccinsRecus: '',
      traitementsEnCours: '',
      description: '',
      photoUrls: '',
    })
    setModalOuvert(true)
  }

  const ouvrirEdition = (d) => {
    setDossierEnEdition(d)
    setForm({
      animalId: d.animalId || '',
      personnelId: d.personnelId || utilisateur?.id || 1,
      sterilise: Boolean(d.sterilise),
      allergies: d.allergies || '',
      vaccinsRecus: d.vaccinsRecus || '',
      traitementsEnCours: d.traitementsEnCours || '',
      description: d.description || '',
      photoUrls: d.photoUrls || '',
    })
    setModalOuvert(true)
  }

  const fermerModal = () => {
    setDossierEnEdition(null)
    setModalOuvert(false)
  }

  const changer = (e) => {
    const { name, value, type, checked } = e.target
    setForm((ancien) => ({
      ...ancien,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const gererSoumission = async (e) => {
    e.preventDefault()
    if (!form.animalId) {
      setNotification({ type: 'erreur', texte: 'Veuillez sélectionner un animal.' })
      return
    }

    setChargementAction(true)
    try {
      const payload = {
        ...form,
        animalId: Number(form.animalId),
        personnelId: Number(form.personnelId || utilisateur?.id || 1),
      }

      if (dossierEnEdition) {
        await modifierDossier(dossierEnEdition.id, payload)
        setNotification({ type: 'succes', texte: 'Dossier médical mis à jour avec succès.' })
      } else {
        await creerDossier(payload)
        setNotification({ type: 'succes', texte: 'Nouveau dossier médical enregistré.' })
      }
      fermerModal()
    } catch (err) {
      setNotification({ type: 'erreur', texte: err.message || 'Une erreur est survenue.' })
    } finally {
      setChargementAction(false)
    }
  }

  const gererSuppression = async (dossier) => {
    if (!window.confirm('Confirmez-vous la suppression de ce dossier médical ?')) {
      return
    }
    try {
      await supprimerDossier(dossier.id)
      setNotification({ type: 'succes', texte: 'Dossier médical supprimé.' })
    } catch (err) {
      setNotification({ type: 'erreur', texte: err.message || 'Impossible de supprimer le dossier.' })
    }
  }

  return (
    <div className="space-y-8">
      {/* EN-TÊTE OPÉRATIONNEL */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <span className="w-11 h-11 rounded-2xl bg-brand-surface text-brand-burnt flex items-center justify-center shrink-0 shadow-sm border border-brand-burnt/10">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-3-3v6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </span>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-dark tracking-tight">
              Dossiers Médicaux &amp; Carnets Vétérinaires
            </h1>
            <p className="text-xs sm:text-sm text-brand-dark/70 mt-1">
              Suivi des vaccinations, stérilisations, allergies et protocoles de soin des résidents
            </p>
          </div>
        </div>
        <Bouton variant="primary" size="md" onClick={ouvrirAjout} className="self-start sm:self-auto shadow-warm-md flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
          <span>Créer un dossier médical</span>
        </Bouton>
      </div>

      {notification && (
        <Notification
          type={notification.type}
          message={notification.texte}
          onFermer={() => setNotification(null)}
        />
      )}

      {erreur && <Notification type="erreur" message={erreur} />}

      {/* GRILLE DES DOSSIERS MÉDICAUX */}
      {chargement ? (
        <Chargement message="Chargement des carnets de santé..." />
      ) : dossiers.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-brand-burnt/15 text-center text-xs sm:text-sm text-brand-taupe space-y-2">
          <p className="font-semibold">Aucun carnet médical enregistré pour le moment.</p>
        </div>
      ) : (
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {dossiers.map((d) => {
            const animal = tousLesAnimaux.find((a) => a.id === d.animalId)
            return (
              <div
                key={d.id}
                className="bg-white p-6 sm:p-7 rounded-3xl border border-brand-burnt/15 shadow-[0_8px_24px_rgba(52,46,43,0.04)] hover:shadow-warm-md transition-all flex flex-col justify-between gap-5 relative overflow-hidden"
              >
                <div className="space-y-4">
                  {/* Titre et statut de stérilisation */}
                  <div className="flex items-start justify-between gap-3 border-b border-brand-stone/50 pb-4">
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center shrink-0 border border-sky-100">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-3-3v6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </span>
                      <div>
                        <h2 className="font-extrabold text-base sm:text-lg text-brand-dark tracking-tight">
                          {animal ? animal.nom : `Animal #${d.animalId}`}
                        </h2>
                        <p className="text-xs text-brand-burnt font-semibold">
                          {animal?.espece || 'Espèce'} • {animal?.race || 'Race croisée'}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-sm ${
                        d.sterilise
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}
                    >
                      {d.sterilise ? '✓ Stérilisé(e)' : 'Non stérilisé(e)'}
                    </span>
                  </div>

                  {/* Détails cliniques */}
                  <div className="space-y-2.5 text-xs sm:text-sm text-brand-dark/85">
                    <div className="flex items-start gap-2">
                      <strong className="text-brand-dark min-w-[130px] shrink-0 font-bold">Vaccinations :</strong>
                      <span className="text-brand-dark/80">{d.vaccinsRecus || 'Non renseigné'}</span>
                    </div>

                    <div className="flex items-start gap-2">
                      <strong className="text-brand-dark min-w-[130px] shrink-0 font-bold">Allergies :</strong>
                      <span className={d.allergies ? 'text-amber-800 font-semibold' : 'text-brand-dark/70'}>
                        {d.allergies || 'Aucune constatée'}
                      </span>
                    </div>

                    {d.traitementsEnCours && (
                      <div className="flex items-start gap-2 bg-blue-50/70 p-2.5 rounded-xl border border-blue-100">
                        <strong className="text-blue-900 min-w-[130px] shrink-0 font-bold">Traitements actifs :</strong>
                        <span className="text-blue-900 font-semibold">{d.traitementsEnCours}</span>
                      </div>
                    )}

                    {d.description && (
                      <div className="pt-2 border-t border-brand-stone/40">
                        <span className="font-bold text-brand-dark text-xs block mb-1">Observations vétérinaires :</span>
                        <p className="italic text-brand-dark/80 bg-[#FFF8F5] p-3 rounded-xl border border-brand-stone/50 leading-relaxed text-xs">
                          « {d.description} »
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2.5 pt-3 border-t border-brand-stone/40">
                  <button
                    type="button"
                    onClick={() => ouvrirEdition(d)}
                    className="px-3.5 py-1.5 rounded-xl bg-brand-surface hover:bg-brand-burnt hover:text-white text-brand-dark border border-brand-burnt/20 text-xs font-bold transition-all cursor-pointer active:scale-95 shadow-sm"
                  >
                    Modifier
                  </button>
                  <button
                    type="button"
                    onClick={() => gererSuppression(d)}
                    className="px-3.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-700 hover:text-white text-rose-800 border border-rose-200 text-xs font-bold transition-all cursor-pointer active:scale-95 shadow-sm"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* MODAL FORMULAIRE DOSSIER MÉDICAL */}
      <Modal
        ouvert={modalOuvert}
        onFermer={fermerModal}
        titre={dossierEnEdition ? 'Modifier le carnet vétérinaire' : 'Nouveau carnet vétérinaire'}
        taille="md"
      >
        <form onSubmit={gererSoumission} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark mb-1">
              Animal concerné <span className="text-brand-burnt">*</span>
            </label>
            <select
              name="animalId"
              required
              disabled={Boolean(dossierEnEdition)}
              value={form.animalId}
              onChange={changer}
              className="w-full h-11 px-3.5 rounded-xl border border-brand-stone bg-white text-xs sm:text-sm focus:outline-none focus:border-brand-burnt"
            >
              <option value="">Sélectionner un animal...</option>
              {tousLesAnimaux.map((a) => (
                <option key={a.id} value={a.id}>
                  #{a.id} — {a.nom} ({a.espece})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3 p-3.5 bg-[#FFF8F5] rounded-xl border border-brand-burnt/15">
            <input
              id="sterilise"
              name="sterilise"
              type="checkbox"
              checked={form.sterilise}
              onChange={changer}
              className="w-4 h-4 rounded text-brand-burnt focus:ring-brand-burnt cursor-pointer"
            />
            <label htmlFor="sterilise" className="text-xs sm:text-sm font-bold text-brand-dark cursor-pointer select-none">
              L’animal est stérilisé / castré
            </label>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark mb-1">
              Vaccinations reçues
            </label>
            <input
              name="vaccinsRecus"
              type="text"
              value={form.vaccinsRecus}
              onChange={changer}
              placeholder="Ex : Rage, RCP, Leucose..."
              className="w-full h-11 px-3.5 rounded-xl border border-brand-stone text-xs sm:text-sm focus:outline-none focus:border-brand-burnt"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark mb-1">
              Allergies constatées
            </label>
            <input
              name="allergies"
              type="text"
              value={form.allergies}
              onChange={changer}
              placeholder="Ex : Pénicilline, céréales ou Aucune"
              className="w-full h-11 px-3.5 rounded-xl border border-brand-stone text-xs sm:text-sm focus:outline-none focus:border-brand-burnt"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark mb-1">
              Traitements en cours
            </label>
            <input
              name="traitementsEnCours"
              type="text"
              value={form.traitementsEnCours}
              onChange={changer}
              placeholder="Ex : Antibiotiques 5j, collyre ou Aucun"
              className="w-full h-11 px-3.5 rounded-xl border border-brand-stone text-xs sm:text-sm focus:outline-none focus:border-brand-burnt"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark mb-1">
              Observations vétérinaires générales
            </label>
            <textarea
              name="description"
              rows="3"
              value={form.description}
              onChange={changer}
              placeholder="Examen général, état du pelage, bilan comportemental..."
              className="w-full p-3.5 rounded-xl border border-brand-stone text-xs sm:text-sm focus:outline-none focus:border-brand-burnt"
            ></textarea>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-brand-stone">
            <Bouton variant="secondary" onClick={fermerModal} disabled={chargementAction}>
              Annuler
            </Bouton>
            <Bouton type="submit" variant="primary" chargement={chargementAction}>
              Enregistrer le carnet
            </Bouton>
          </div>
        </form>
      </Modal>
    </div>
  )
}
