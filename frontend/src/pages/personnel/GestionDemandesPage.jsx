import { useState, useEffect, useRef } from 'react'
import { animate, stagger } from 'animejs'
import { useDemandes } from '../../hooks/useDemandes'
import { useAnimaux } from '../../hooks/useAnimaux'
import { STATUTS_DEMANDE } from '../../utils/constantes'
import { formaterDate } from '../../utils/dates'
import Chargement from '../../components/ui/Chargement'
import Notification from '../../components/ui/Notification'

export default function GestionDemandesPage() {
  const { demandes, chargement, erreur, modifierStatut } = useDemandes()
  const { tousLesAnimaux } = useAnimaux()

  const [filtreStatut, setFiltreStatut] = useState('TOUS')
  const [notification, setNotification] = useState(null)
  const cardsContainerRef = useRef(null)

  const demandesFiltrees = demandes.filter((d) => {
    if (filtreStatut !== 'TOUS' && d.statut !== filtreStatut) {
      return false
    }
    return true
  })

  const enAttenteCount = demandes.filter((d) => d.statut === 'EN_ATTENTE').length
  const accepteesCount = demandes.filter((d) => d.statut === 'ACCEPTEE').length
  const refuseesCount = demandes.filter((d) => d.statut === 'REFUSEE').length

  useEffect(() => {
    if (chargement) return

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    try {
      const cards = cardsContainerRef.current ? Array.from(cardsContainerRef.current.children) : []
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
  }, [chargement, filtreStatut])

  const gererChangementStatut = async (id, nouveauStatut) => {
    try {
      await modifierStatut(id, nouveauStatut)
      setNotification({
        type: 'succes',
        texte: `La demande #${id} a été mise à jour : "${STATUTS_DEMANDE[nouveauStatut]?.label}".`,
      })
    } catch (err) {
      setNotification({
        type: 'erreur',
        texte: err.message || 'Impossible de mettre à jour la demande.',
      })
    }
  }

  return (
    <div className="space-y-8">
      {/* EN-TÊTE OPÉRATIONNEL & SYNTHÈSE DES DEMANDES */}
      <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-2">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-dark tracking-tight">
              Demandes d'Adoption
            </h1>
            <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-bold bg-brand-burnt/15 text-brand-burnt border border-brand-burnt/25 shadow-sm">
              {demandes.length} dossiers au total ({enAttenteCount} en attente)
            </span>
          </div>
          <p className="text-xs sm:text-sm text-brand-dark/70 flex items-center gap-2">
            <svg className="w-4 h-4 text-brand-burnt shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Mise à jour en temps réel des dossiers et entretiens de pré-visite</span>
          </p>
        </div>

        {/* Badges de synthèse rapide */}
        <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
          <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-brand-burnt/15 text-brand-dark text-xs font-bold shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E87945] animate-pulse"></span>
            <span>En attente : <strong className="text-brand-burnt">{enAttenteCount}</strong></span>
          </div>
          <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-brand-burnt/15 text-brand-dark text-xs font-bold shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
            <span>Acceptées : <strong className="text-emerald-700">{accepteesCount}</strong></span>
          </div>
          <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-brand-burnt/15 text-brand-dark text-xs font-bold shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span>
            <span>Refusées : <strong className="text-rose-700">{refuseesCount}</strong></span>
          </div>
        </div>
      </section>

      {/* BARRE DE FILTRES */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          type="button"
          onClick={() => setFiltreStatut('TOUS')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
            filtreStatut === 'TOUS'
              ? 'bg-brand-burnt text-white shadow-[0_4px_12px_rgba(198,83,53,0.3)]'
              : 'bg-white text-brand-dark hover:bg-brand-cream/60 border border-brand-burnt/15'
          }`}
        >
          Toutes ({demandes.length})
        </button>
        {Object.entries(STATUTS_DEMANDE).map(([code, info]) => {
          const count = demandes.filter((d) => d.statut === code).length
          const estActif = filtreStatut === code
          return (
            <button
              key={code}
              type="button"
              onClick={() => setFiltreStatut(code)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                estActif
                  ? 'bg-brand-burnt text-white shadow-[0_4px_12px_rgba(198,83,53,0.3)]'
                  : 'bg-white text-brand-dark hover:bg-brand-cream/60 border border-brand-burnt/15'
              }`}
            >
              {info.label} ({count})
            </button>
          )
        })}
      </div>

      {notification && (
        <Notification
          type={notification.type}
          message={notification.texte}
          onFermer={() => setNotification(null)}
        />
      )}

      {erreur && <Notification type="erreur" message={erreur} />}

      {/* NOTE DE PROTOCOLE DU REFUGE */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#FFF5EF] border border-[#E87945]/30 text-xs sm:text-sm text-brand-dark flex items-start gap-3.5 shadow-sm">
        <div className="w-8 h-8 rounded-xl bg-brand-burnt/10 text-brand-burnt flex items-center justify-center shrink-0 font-bold">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="leading-relaxed">
          <strong className="text-brand-burnt">Protocole d'accueil en sanctuaire : </strong>
          Dès validation d'un dossier, un soignant prend contact avec la famille candidate pour planifier le premier temps d'échange dans les jardins sensoriels du refuge, respectant le rythme de l'animal.
        </div>
      </div>

      {/* PILE DE CARTES DES DEMANDES (Stitch Design Reference) */}
      {chargement ? (
        <Chargement message="Chargement des demandes..." />
      ) : demandesFiltrees.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-brand-burnt/15 text-center text-xs sm:text-sm text-brand-taupe space-y-2">
          <p className="font-semibold">Aucun dossier ne correspond à ce filtre.</p>
        </div>
      ) : (
        <main ref={cardsContainerRef} className="flex flex-col gap-6">
          {demandesFiltrees.map((demande) => {
            const animal = tousLesAnimaux.find((a) => a.id === demande.animalId)
            const estAttente = demande.statut === 'EN_ATTENTE'
            const estAcceptee = demande.statut === 'ACCEPTEE'
            const estRefusee = demande.statut === 'REFUSEE'

            // Bordure latérale & couleur de statut
            const bordureCouleur = estAttente
              ? 'bg-[#E87945]'
              : estAcceptee
              ? 'bg-[#2E6F40]'
              : 'bg-[#C65335]'

            return (
              <article
                key={demande.id}
                className="relative overflow-hidden bg-white rounded-3xl p-6 sm:p-8 shadow-[0_10px_30px_rgba(52,46,43,0.06)] border border-brand-burnt/15 flex flex-col gap-6 transition-all hover:shadow-[0_16px_36px_rgba(52,46,43,0.1)]"
              >
                {/* Barre indicatrice latérale de statut */}
                <div className={`absolute left-0 top-0 bottom-0 w-2 ${bordureCouleur}`}></div>

                {/* En-tête de la carte */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pl-2">
                  <div className="flex items-start gap-4">
                    <span className="shrink-0 w-12 h-12 rounded-2xl bg-brand-surface border border-brand-burnt/20 text-brand-burnt flex items-center justify-center text-base font-extrabold shadow-sm">
                      #{demande.id}
                    </span>
                    <div className="flex flex-col">
                      <h2 className="text-lg sm:text-xl font-extrabold text-brand-dark tracking-tight">
                        Candidature pour {animal?.nom || `Animal #${demande.animalId}`}
                      </h2>
                      <p className="text-xs sm:text-sm text-brand-dark/70 mt-0.5">
                        Reçue le {formaterDate(demande.dateDemande)} • Adoptant référencé #{demande.adoptantId}
                        {animal?.race && ` • ${animal.espece} (${animal.race})`}
                      </p>
                    </div>
                  </div>

                  {/* Badge de statut */}
                  <div className="self-start sm:self-auto shrink-0">
                    {estAttente && (
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FFF5EF] text-[#E87945] border border-[#E87945]/30 text-xs font-bold shadow-sm">
                        <svg className="w-3.5 h-3.5 text-[#E87945] animate-pulse" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="9"></circle>
                          <path d="M12 7v5l3 2"></path>
                        </svg>
                        <span>En attente</span>
                      </span>
                    )}
                    {estAcceptee && (
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold shadow-sm">
                        <svg className="w-3.5 h-3.5 text-emerald-700" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"></path>
                        </svg>
                        <span>Acceptée</span>
                      </span>
                    )}
                    {estRefusee && (
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200 text-xs font-bold shadow-sm">
                        <svg className="w-3.5 h-3.5 text-rose-700" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"></path>
                        </svg>
                        <span>Refusée</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Corps de citation : Motif & Cadre de vie */}
                <div className="ml-2 bg-[#FFF8F5] rounded-2xl p-5 sm:p-6 border border-brand-stone/60 flex flex-col gap-2">
                  <span className="text-[11px] font-bold text-brand-dark/70 uppercase tracking-wider">
                    Motif &amp; Cadre de vie déclaré :
                  </span>
                  <p className="text-sm sm:text-base text-brand-dark italic leading-relaxed whitespace-pre-line">
                    « {demande.motif || 'Aucun motif renseigné par le candidat.'} »
                  </p>
                </div>

                {/* Pied d'actions soignants */}
                <div className="ml-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-brand-stone/40">
                  <div className="flex items-center gap-2 text-brand-dark/70 text-xs font-medium">
                    <svg className="w-4 h-4 text-brand-burnt" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                    <span>Mise à jour du statut dans le système du refuge</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 self-end sm:self-auto">
                    {demande.statut !== 'EN_ATTENTE' && (
                      <button
                        type="button"
                        onClick={() => gererChangementStatut(demande.id, 'EN_ATTENTE')}
                        className="px-4 py-2 rounded-xl border border-brand-stone bg-white hover:bg-brand-surface text-brand-dark text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95 flex items-center gap-1.5"
                      >
                        <svg className="w-3.5 h-3.5 text-brand-taupe" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9" />
                        </svg>
                        <span>Remettre en attente</span>
                      </button>
                    )}

                    {demande.statut !== 'REFUSEE' && (
                      <button
                        type="button"
                        onClick={() => gererChangementStatut(demande.id, 'REFUSEE')}
                        className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-700 border border-rose-200 text-xs font-bold shadow-sm transition-all cursor-pointer flex items-center gap-2 active:scale-95"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span>Refuser</span>
                      </button>
                    )}

                    {demande.statut !== 'ACCEPTEE' && (
                      <button
                        type="button"
                        onClick={() => gererChangementStatut(demande.id, 'ACCEPTEE')}
                        className="px-5 py-2.5 rounded-xl bg-brand-burnt hover:bg-brand-orange text-white text-xs font-bold shadow-[0_4px_16px_rgba(198,83,53,0.3)] transition-all cursor-pointer flex items-center gap-2 active:scale-95"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span>Accepter la demande</span>
                      </button>
                    )}
                  </div>
                </div>
              </article>
            )
          })}
        </main>
      )}
    </div>
  )
}
