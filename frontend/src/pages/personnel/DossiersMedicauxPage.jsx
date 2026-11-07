import { useState } from 'react'
import { useDossiersMedicaux } from '../../hooks/useDossiersMedicaux'
import { useAnimaux } from '../../hooks/useAnimaux'
import { useAuth } from '../../hooks/useAuth'
import PersonnelNav from '../../components/personnel/PersonnelNav'
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
    if (!window.confirm(`Confirmez-vous la suppression de ce dossier médical ?`)) {
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
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <PersonnelNav />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-brand-dark">Dossiers Médicaux &amp; Carnets Vétérinaires</h2>
          <p className="text-xs text-brand-dark/70">
            Suivi des vaccinations, stérilisations, allergies et traitements en cours des résidents
          </p>
        </div>
        <Bouton variant="primary" size="md" onClick={ouvrirAjout}>
          + Créer un dossier médical
        </Bouton>
      </div>

      {notification && (
        <div className="mb-6">
          <Notification
            type={notification.type}
            message={notification.texte}
            onFermer={() => setNotification(null)}
          />
        </div>
      )}

      {erreur && (
        <div className="mb-6">
          <Notification type="erreur" message={erreur} />
        </div>
      )}

      {chargement ? (
        <Chargement message="Chargement des carnets de santé..." />
      ) : dossiers.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-brand-stone text-center text-xs text-brand-taupe">
          Aucun dossier médical enregistré pour le moment.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {dossiers.map((d) => {
            const animal = tousLesAnimaux.find((a) => a.id === d.animalId)
            return (
              <div
                key={d.id}
                className="bg-white p-6 rounded-3xl border border-brand-burnt/15 shadow-sm space-y-4 hover:shadow-warm-md transition-shadow"
              >
                <div className="flex items-center justify-between border-b border-brand-stone/60 pb-3">
                  <div>
                    <h3 className="font-extrabold text-base text-brand-dark">
                      {animal ? animal.nom : `Animal #${d.animalId}`}
                    </h3>
                    <p className="text-xs text-brand-orange font-semibold">
                      {animal?.espece || 'Espèce'} • {animal?.race || 'Race croisée'}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      d.sterilise
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                        : 'bg-amber-100 text-amber-800 border-amber-200'
                    }`}
                  >
                    {d.sterilise ? '✓ Stérilisé(e)' : 'Non stérilisé(e)'}
                  </span>
                </div>

                <div className="space-y-2 text-xs text-brand-dark/80">
                  <p>
                    <strong className="text-brand-dark">Vaccinations : </strong>
                    {d.vaccinsRecus || 'Non renseigné'}
                  </p>
                  <p>
                    <strong className="text-brand-dark">Allergies connues : </strong>
                    {d.allergies || 'Aucune connue'}
                  </p>
                  {d.traitementsEnCours && (
                    <p>
                      <strong className="text-brand-dark">Traitements en cours : </strong>
                      <span className="text-blue-800 font-medium">{d.traitementsEnCours}</span>
                    </p>
                  )}
                  {d.description && (
                    <div className="pt-2 border-t border-brand-stone/40">
                      <span className="font-bold text-brand-dark block mb-1">Observations vétérinaires :</span>
                      <p className="italic text-brand-dark/75 bg-brand-cream/30 p-2.5 rounded-xl">
                        « {d.description} »
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-brand-stone/50">
                  <button
                    type="button"
                    onClick={() => ouvrirEdition(d)}
                    className="px-3 py-1.5 rounded-xl bg-brand-cream hover:bg-brand-burnt hover:text-white text-brand-dark border border-brand-burnt/20 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Modifier
                  </button>
                  <button
                    type="button"
                    onClick={() => gererSuppression(d)}
                    className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-700 hover:text-white text-rose-800 border border-rose-200 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal Dossier Médical */}
      <Modal
        ouvert={modalOuvert}
        onFermer={fermerModal}
        titre={dossierEnEdition ? 'Modifier le dossier médical' : 'Nouveau carnet vétérinaire'}
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
              className="w-full h-11 px-3.5 rounded-xl border border-brand-stone bg-white text-sm"
            >
              <option value="">Sélectionner un animal...</option>
              {tousLesAnimaux.map((a) => (
                <option key={a.id} value={a.id}>
                  #{a.id} — {a.nom} ({a.espece})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3 p-3 bg-brand-surface rounded-xl border border-brand-burnt/15">
            <input
              id="sterilise"
              name="sterilise"
              type="checkbox"
              checked={form.sterilise}
              onChange={changer}
              className="w-4 h-4 rounded text-brand-burnt focus:ring-brand-burnt cursor-pointer"
            />
            <label htmlFor="sterilise" className="text-xs font-bold text-brand-dark cursor-pointer">
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
              className="w-full h-11 px-3.5 rounded-xl border border-brand-stone text-sm"
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
              className="w-full h-11 px-3.5 rounded-xl border border-brand-stone text-sm"
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
              className="w-full h-11 px-3.5 rounded-xl border border-brand-stone text-sm"
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
              className="w-full p-3.5 rounded-xl border border-brand-stone text-sm"
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
