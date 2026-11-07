import { useState } from 'react'
import { useDons } from '../../hooks/useDons'
import { useAuth } from '../../hooks/useAuth'
import { TYPES_DON } from '../../utils/constantes'
import { formaterDate } from '../../utils/dates'
import PersonnelNav from '../../components/personnel/PersonnelNav'
import Modal from '../../components/ui/Modal'
import Bouton from '../../components/ui/Bouton'
import Chargement from '../../components/ui/Chargement'
import Notification from '../../components/ui/Notification'

export default function GestionDonsPage() {
  const { dons, chargement, erreur, creerDon, modifierDon, supprimerDon } = useDons()
  const { utilisateur } = useAuth()

  const [modalOuvert, setModalOuvert] = useState(false)
  const [donEnEdition, setDonEnEdition] = useState(null)
  const [chargementAction, setChargementAction] = useState(false)
  const [notification, setNotification] = useState(null)

  const [form, setForm] = useState({
    personnelId: utilisateur?.id || 1,
    typeDon: 'ARGENT',
    valeur: '50.00',
    description: '',
    date: new Date().toISOString().split('T')[0],
    nomDonateur: '',
    telephoneDonateur: '',
    photoUrl: '',
  })

  const ouvrirAjout = () => {
    setDonEnEdition(null)
    setForm({
      personnelId: utilisateur?.id || 1,
      typeDon: 'ARGENT',
      valeur: '50.00',
      description: '',
      date: new Date().toISOString().split('T')[0],
      nomDonateur: '',
      telephoneDonateur: '',
      photoUrl: '',
    })
    setModalOuvert(true)
  }

  const ouvrirEdition = (don) => {
    setDonEnEdition(don)
    setForm({
      personnelId: don.personnelId || utilisateur?.id || 1,
      typeDon: don.typeDon || 'ARGENT',
      valeur: don.valeur ? String(don.valeur) : '0.00',
      description: don.description || '',
      date: don.dateDon || don.date || new Date().toISOString().split('T')[0],
      nomDonateur: don.nomDonateur || '',
      telephoneDonateur: don.telephoneDonateur || '',
      photoUrl: don.photoUrl || '',
    })
    setModalOuvert(true)
  }

  const fermerModal = () => {
    setDonEnEdition(null)
    setModalOuvert(false)
  }

  const changer = (e) => {
    const { name, value } = e.target
    setForm((ancien) => ({ ...ancien, [name]: value }))
  }

  const gererSoumission = async (e) => {
    e.preventDefault()
    setChargementAction(true)
    try {
      const payload = {
        ...form,
        personnelId: Number(form.personnelId || utilisateur?.id || 1),
        valeur: Number(form.valeur || 0),
      }

      if (donEnEdition) {
        await modifierDon(donEnEdition.id, payload)
        setNotification({ type: 'succes', texte: 'Don mis à jour.' })
      } else {
        await creerDon(payload)
        setNotification({ type: 'succes', texte: 'Don enregistré avec succès dans le registre.' })
      }
      fermerModal()
    } catch (err) {
      setNotification({ type: 'erreur', texte: err.message || 'Une erreur est survenue.' })
    } finally {
      setChargementAction(false)
    }
  }

  const gererSuppression = async (don) => {
    if (!window.confirm('Confirmez-vous la suppression de cette entrée de don ?')) return
    try {
      await supprimerDon(don.id)
      setNotification({ type: 'succes', texte: 'Entrée supprimée.' })
    } catch (err) {
      setNotification({ type: 'erreur', texte: err.message || 'Impossible de supprimer.' })
    }
  }

  const totalFinancier = dons
    .filter((d) => d.typeDon === 'ARGENT')
    .reduce((acc, curr) => acc + Number(curr.valeur || 0), 0)

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <PersonnelNav />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-brand-dark">Gestion des Dons &amp; Ressources</h2>
          <p className="text-xs text-brand-dark/70">
            Registre des contributions financières et matérielles reçues au sanctuaire
          </p>
        </div>
        <Bouton variant="primary" size="md" onClick={ouvrirAjout}>
          + Enregistrer un don
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

      {/* Résumé des dons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-5 rounded-2xl border border-brand-burnt/15 shadow-sm">
          <span className="text-xs font-bold text-brand-taupe uppercase">Total Financier Collecté</span>
          <p className="text-2xl font-black text-emerald-800 mt-1">
            {totalFinancier.toFixed(2)} DT
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-brand-burnt/15 shadow-sm">
          <span className="text-xs font-bold text-brand-taupe uppercase">Dons en nature / matériel</span>
          <p className="text-2xl font-black text-brand-orange mt-1">
            {dons.filter((d) => d.typeDon === 'NATURE').length} dons
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-brand-burnt/15 shadow-sm">
          <span className="text-xs font-bold text-brand-taupe uppercase">Total Bienfaiteurs Référencés</span>
          <p className="text-2xl font-black text-brand-dark mt-1">
            {dons.length} enregistrements
          </p>
        </div>
      </div>

      {chargement ? (
        <Chargement message="Chargement du registre des dons..." />
      ) : dons.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-brand-stone text-center text-xs text-brand-taupe">
          Aucun don enregistré pour le moment.
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-brand-burnt/15 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-brand-cream/80 border-b border-brand-stone text-brand-dark uppercase tracking-wider text-[11px] font-bold">
                <tr>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Donateur</th>
                  <th className="py-3.5 px-4">Valeur / Montant</th>
                  <th className="py-3.5 px-4">Description</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-stone/50">
                {dons.map((don) => {
                  const typeInfo = TYPES_DON[don.typeDon] || TYPES_DON.ARGENT
                  return (
                    <tr key={don.id} className="hover:bg-brand-surface/40 transition-colors">
                      <td className="py-3.5 px-4 text-xs font-bold text-brand-dark">
                        {formaterDate(don.dateDon || don.date)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${typeInfo.badgeClass}`}>
                          {typeInfo.label}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-brand-dark">{don.nomDonateur || 'Anonyme'}</div>
                        <div className="text-[11px] text-brand-taupe">{don.telephoneDonateur || '-'}</div>
                      </td>
                      <td className="py-3.5 px-4 font-extrabold text-brand-dark">
                        {don.valeur ? `${Number(don.valeur).toFixed(2)} DT` : '-'}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-brand-dark/75 max-w-xs truncate">
                        {don.description || '-'}
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => ouvrirEdition(don)}
                          className="px-2.5 py-1 rounded-lg bg-brand-cream hover:bg-brand-burnt hover:text-white text-brand-dark border border-brand-burnt/20 text-xs font-bold transition-colors cursor-pointer"
                        >
                          Modifier
                        </button>
                        <button
                          type="button"
                          onClick={() => gererSuppression(don)}
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

      {/* Modal Enregistrement / Modification Don */}
      <Modal
        ouvert={modalOuvert}
        onFermer={fermerModal}
        titre={donEnEdition ? 'Modifier l’enregistrement du don' : 'Enregistrer une contribution au refuge'}
        taille="md"
      >
        <form onSubmit={gererSoumission} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark mb-1">
                Type de don <span className="text-brand-burnt">*</span>
              </label>
              <select
                name="typeDon"
                value={form.typeDon}
                onChange={changer}
                className="w-full h-11 px-3.5 rounded-xl border border-brand-stone bg-white text-sm"
              >
                <option value="ARGENT">Financier (Espèces, Virement)</option>
                <option value="NATURE">Nature (Croquettes, Médicaments, Litière)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark mb-1">
                Valeur estimée ou montant (DT)
              </label>
              <input
                name="valeur"
                type="number"
                step="0.01"
                min="0"
                value={form.valeur}
                onChange={changer}
                className="w-full h-11 px-3.5 rounded-xl border border-brand-stone text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark mb-1">
                Nom du donateur
              </label>
              <input
                name="nomDonateur"
                type="text"
                value={form.nomDonateur}
                onChange={changer}
                placeholder="Ex : Ahmed Ben Ali ou Anonyme"
                className="w-full h-11 px-3.5 rounded-xl border border-brand-stone text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark mb-1">
                Téléphone du donateur
              </label>
              <input
                name="telephoneDonateur"
                type="text"
                value={form.telephoneDonateur}
                onChange={changer}
                placeholder="98123456"
                className="w-full h-11 px-3.5 rounded-xl border border-brand-stone text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark mb-1">
              Date de réception <span className="text-brand-burnt">*</span>
            </label>
            <input
              name="date"
              type="date"
              required
              value={form.date}
              onChange={changer}
              className="w-full h-11 px-3.5 rounded-xl border border-brand-stone text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark mb-1">
              Description de la contribution
            </label>
            <textarea
              name="description"
              rows="3"
              value={form.description}
              onChange={changer}
              placeholder="Détail des articles remis, objectif du don..."
              className="w-full p-3.5 rounded-xl border border-brand-stone text-sm"
            ></textarea>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-brand-stone">
            <Bouton variant="secondary" onClick={fermerModal} disabled={chargementAction}>
              Annuler
            </Bouton>
            <Bouton type="submit" variant="primary" chargement={chargementAction}>
              Enregistrer
            </Bouton>
          </div>
        </form>
      </Modal>
    </div>
  )
}
