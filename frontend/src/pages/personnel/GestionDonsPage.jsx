import { useState, useEffect, useRef } from 'react'
import { animate, stagger } from 'animejs'
import { useDons } from '../../hooks/useDons'
import { useAuth } from '../../hooks/useAuth'
import { TYPES_DON } from '../../utils/constantes'
import { formaterDate } from '../../utils/dates'
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
  const kpiRef = useRef(null)
  const tableRef = useRef(null)

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

  useEffect(() => {
    if (chargement) return

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    try {
      const kpiItems = kpiRef.current ? Array.from(kpiRef.current.children) : []
      if (kpiItems.length > 0) {
        animate(kpiItems, {
          opacity: [0, 1],
          translateY: [14, 0],
          duration: 350,
          ease: 'outCubic',
          delay: stagger(50),
        })
      }
      if (tableRef.current) {
        animate(tableRef.current, {
          opacity: [0, 1],
          translateY: [12, 0],
          duration: 350,
          ease: 'outCubic',
          delay: 100,
        })
      }
    } catch {
      // Fallback
    }
  }, [chargement, dons.length])

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
    <div className="space-y-8">
      {/* EN-TÊTE OPÉRATIONNEL */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-dark tracking-tight">
            Gestion des Dons &amp; Ressources
          </h1>
          <p className="text-xs sm:text-sm text-brand-dark/70 mt-1">
            Registre des contributions financières et matérielles reçues au sanctuaire
          </p>
        </div>
        <Bouton variant="primary" size="md" onClick={ouvrirAjout} className="self-start sm:self-auto shadow-warm-md flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
          <span>Enregistrer un don</span>
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

      {/* SYNTHÈSE DES DONS (3 KPI Cards) */}
      <section ref={kpiRef} className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-3xl border border-brand-burnt/15 shadow-[0_8px_24px_rgba(52,46,43,0.04)] hover:shadow-warm-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-brand-dark/70 uppercase tracking-wider">
              Total Financier Collecté
            </span>
            <span className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
          </div>
          <p className="text-3xl sm:text-4xl font-extrabold text-emerald-800 tracking-tight mt-4">
            {totalFinancier.toFixed(2)} <span className="text-lg font-semibold text-emerald-700">DT</span>
          </p>
          <p className="text-xs text-brand-dark/70 mt-2">Dédié aux soins et infrastructures</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-brand-burnt/15 shadow-[0_8px_24px_rgba(52,46,43,0.04)] hover:shadow-warm-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-brand-dark/70 uppercase tracking-wider">
              Dons en nature / matériel
            </span>
            <span className="p-2.5 rounded-2xl bg-[#FFF5EF] text-[#E87945]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </span>
          </div>
          <p className="text-3xl sm:text-4xl font-extrabold text-[#E87945] tracking-tight mt-4">
            {dons.filter((d) => d.typeDon === 'NATURE').length} <span className="text-lg font-semibold text-brand-dark/70">dons</span>
          </p>
          <p className="text-xs text-brand-dark/70 mt-2">Nourriture, litières &amp; couvertures</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-brand-burnt/15 shadow-[0_8px_24px_rgba(52,46,43,0.04)] hover:shadow-warm-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-brand-dark/70 uppercase tracking-wider">
              Total Enregistrements
            </span>
            <span className="p-2.5 rounded-2xl bg-brand-surface text-brand-burnt">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </span>
          </div>
          <p className="text-3xl sm:text-4xl font-extrabold text-brand-dark tracking-tight mt-4">
            {dons.length} <span className="text-lg font-semibold text-brand-dark/70">fiches</span>
          </p>
          <p className="text-xs text-brand-dark/70 mt-2">Communauté de bienfaiteurs</p>
        </div>
      </section>

      {/* TABLE DU REGISTRE DES DONS */}
      {chargement ? (
        <Chargement message="Chargement du registre des dons..." />
      ) : dons.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-brand-burnt/15 text-center text-xs sm:text-sm text-brand-taupe space-y-2">
          <p className="font-semibold">Aucun don enregistré pour le moment.</p>
        </div>
      ) : (
        <div ref={tableRef} className="bg-white rounded-3xl border border-brand-burnt/15 shadow-[0_8px_30px_rgba(52,46,43,0.04)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#FFF8F5] border-b border-brand-stone/60 text-brand-dark uppercase tracking-wider text-[11px] font-bold">
                <tr>
                  <th className="py-4 px-5">Date</th>
                  <th className="py-4 px-5">Type de don</th>
                  <th className="py-4 px-5">Donateur</th>
                  <th className="py-4 px-5">Montant / Valeur</th>
                  <th className="py-4 px-5">Description</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-stone/40">
                {dons.map((don) => {
                  const typeInfo = TYPES_DON[don.typeDon] || TYPES_DON.ARGENT
                  return (
                    <tr key={don.id} className="hover:bg-brand-surface/30 transition-colors">
                      <td className="py-4 px-5 text-xs font-bold text-brand-dark">
                        {formaterDate(don.dateDon || don.date)}
                      </td>
                      <td className="py-4 px-5">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${typeInfo.badgeClass}`}>
                          {typeInfo.label}
                        </span>
                      </td>
                      <td className="py-4 px-5">
                        <div className="font-bold text-brand-dark">{don.nomDonateur || 'Anonyme'}</div>
                        <div className="text-[11px] text-brand-taupe">{don.telephoneDonateur || '-'}</div>
                      </td>
                      <td className="py-4 px-5 font-extrabold text-brand-dark">
                        {don.valeur ? `${Number(don.valeur).toFixed(2)} DT` : '-'}
                      </td>
                      <td className="py-4 px-5 text-xs text-brand-dark/80 max-w-xs truncate">
                        {don.description || '-'}
                      </td>
                      <td className="py-4 px-5 text-right space-x-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => ouvrirEdition(don)}
                          className="px-3 py-1.5 rounded-xl bg-brand-surface hover:bg-brand-burnt hover:text-white text-brand-dark border border-brand-burnt/20 text-xs font-bold transition-all cursor-pointer active:scale-95 shadow-sm"
                        >
                          Modifier
                        </button>
                        <button
                          type="button"
                          onClick={() => gererSuppression(don)}
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

      {/* MODAL ENREGISTREMENT DON */}
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
                className="w-full h-11 px-3.5 rounded-xl border border-brand-stone bg-white text-xs sm:text-sm focus:outline-none focus:border-brand-burnt"
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
                className="w-full h-11 px-3.5 rounded-xl border border-brand-stone text-xs sm:text-sm focus:outline-none focus:border-brand-burnt"
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
                className="w-full h-11 px-3.5 rounded-xl border border-brand-stone text-xs sm:text-sm focus:outline-none focus:border-brand-burnt"
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
                className="w-full h-11 px-3.5 rounded-xl border border-brand-stone text-xs sm:text-sm focus:outline-none focus:border-brand-burnt"
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
              className="w-full h-11 px-3.5 rounded-xl border border-brand-stone text-xs sm:text-sm focus:outline-none focus:border-brand-burnt"
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
              className="w-full p-3.5 rounded-xl border border-brand-stone text-xs sm:text-sm focus:outline-none focus:border-brand-burnt"
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
