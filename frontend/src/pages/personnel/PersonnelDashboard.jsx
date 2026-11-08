import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { animate, stagger } from 'animejs'
import { useAnimaux } from '../../hooks/useAnimaux'
import { useDemandes } from '../../hooks/useDemandes'
import { useDossiersMedicaux } from '../../hooks/useDossiersMedicaux'
import { useDons } from '../../hooks/useDons'
import { formaterDate } from '../../utils/dates'
import Chargement from '../../components/ui/Chargement'

export default function PersonnelDashboard() {
  const { tousLesAnimaux, chargement: chargementAnimaux } = useAnimaux()
  const { demandes, chargement: chargementDemandes, modifierStatut } = useDemandes()
  const { dossiers, chargement: chargementDossiers } = useDossiersMedicaux()
  const { dons, chargement: chargementDons } = useDons()

  const kpiContainerRef = useRef(null)
  const quickActionsRef = useRef(null)
  const recentSectionRef = useRef(null)

  const chargementGlobal =
    chargementAnimaux || chargementDemandes || chargementDossiers || chargementDons

  const animauxDisponibles = tousLesAnimaux.filter((a) => a.statut === 'DISPONIBLE')
  const animauxEnSoin = tousLesAnimaux.filter((a) => a.statut === 'EN_SOIN')
  const animauxAdoptes = tousLesAnimaux.filter((a) => a.statut === 'ADOPTE')
  const demandesEnAttente = demandes.filter((d) => d.statut === 'EN_ATTENTE')

  useEffect(() => {
    if (chargementGlobal) return

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    try {
      const kpiItems = kpiContainerRef.current ? Array.from(kpiContainerRef.current.children) : []
      const quickItems = quickActionsRef.current ? Array.from(quickActionsRef.current.children) : []
      const recentEl = recentSectionRef.current

      if (kpiItems.length > 0) {
        animate(kpiItems, {
          opacity: [0, 1],
          translateY: [16, 0],
          duration: 400,
          ease: 'outCubic',
          delay: stagger(60),
        })
      }

      if (quickItems.length > 0) {
        animate(quickItems, {
          opacity: [0, 1],
          translateY: [16, 0],
          duration: 400,
          ease: 'outCubic',
          delay: stagger(60, { start: 120 }),
        })
      }

      if (recentEl) {
        animate(recentEl, {
          opacity: [0, 1],
          translateY: [16, 0],
          duration: 400,
          ease: 'outCubic',
          delay: 200,
        })
      }
    } catch {
      // Fallback gracieux si animejs n'est pas actif
    }
  }, [chargementGlobal])

  return (
    <div>
      {chargementGlobal ? (
        <Chargement message="Synchronisation des indicateurs du refuge..." />
      ) : (
        <div className="space-y-8">
          {/* 1. MÉTROLOGIE & KPIS DU REFUGE */}
          <section ref={kpiContainerRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* KPI 1 : Total Résidents */}
            <div className="group relative flex flex-col justify-between p-6 rounded-3xl bg-white border border-brand-burnt/15 shadow-[0_8px_24px_rgba(52,46,43,0.04)] hover:shadow-[0_16px_36px_rgba(198,83,53,0.12)] hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-brand-dark/70 font-bold">
                  Total Résidents
                </span>
                <span className="p-2.5 rounded-2xl bg-brand-surface text-brand-burnt">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <ellipse cx="8.5" cy="5" rx="1.75" ry="2.5" />
                    <ellipse cx="15.5" cy="5" rx="1.75" ry="2.5" />
                    <ellipse cx="4.75" cy="9.5" rx="1.6" ry="2.2" />
                    <ellipse cx="19.25" cy="9.5" rx="1.6" ry="2.2" />
                    <path d="M12 10.2c-3.1 0-5.7 2.1-5.7 4.9 0 2.2 1.6 3.9 3.5 3.9.9 0 1.6-.4 2.2-1 .6.6 1.3 1 2.2 1 1.9 0 3.5-1.7 3.5-3.9 0-2.8-2.6-4.9-5.7-4.9z" />
                  </svg>
                </span>
              </div>
              <div className="my-4">
                <span className="text-4xl sm:text-5xl font-extrabold text-brand-dark tracking-tight group-hover:text-brand-burnt transition-colors">
                  {tousLesAnimaux.length}
                </span>
              </div>
              <div className="flex items-center gap-2 pt-2 border-t border-brand-stone/40 text-xs font-semibold text-brand-dark/80">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                <span>{animauxDisponibles.length} disponibles immédiatement</span>
              </div>
            </div>

            {/* KPI 2 : Demandes d'adoption */}
            <div className="group relative flex flex-col justify-between p-6 rounded-3xl bg-white border border-brand-burnt/15 shadow-[0_8px_24px_rgba(52,46,43,0.04)] hover:shadow-[0_16px_36px_rgba(232,121,69,0.12)] hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-brand-dark/70 font-bold">
                  Demandes d'Adoption
                </span>
                <span className="p-2.5 rounded-2xl bg-[#FFF5EF] text-[#E87945]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
              </div>
              <div className="my-4">
                <span className="text-4xl sm:text-5xl font-extrabold text-brand-burnt tracking-tight group-hover:text-brand-orange transition-colors">
                  {demandesEnAttente.length}
                </span>
              </div>
              <div className="flex items-center gap-2 pt-2 border-t border-brand-stone/40 text-xs font-semibold text-brand-dark/80">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E87945] shadow-[0_0_8px_rgba(232,121,69,0.5)]"></span>
                <span>En attente d'évaluation soignante</span>
              </div>
            </div>

            {/* KPI 3 : Suivi Médical Actif */}
            <div className="group relative flex flex-col justify-between p-6 rounded-3xl bg-white border border-brand-burnt/15 shadow-[0_8px_24px_rgba(52,46,43,0.04)] hover:shadow-[0_16px_36px_rgba(14,165,233,0.12)] hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-brand-dark/70 font-bold">
                  Suivi Médical Actif
                </span>
                <span className="p-2.5 rounded-2xl bg-sky-50 text-sky-700">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-3-3v6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </span>
              </div>
              <div className="my-4">
                <span className="text-4xl sm:text-5xl font-extrabold text-blue-700 tracking-tight group-hover:text-blue-800 transition-colors">
                  {animauxEnSoin.length}
                </span>
              </div>
              <div className="flex items-center gap-2 pt-2 border-t border-brand-stone/40 text-xs font-semibold text-brand-dark/80">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-600 shadow-[0_0_8px_rgba(2,132,199,0.5)]"></span>
                <span>{dossiers.length} dossiers vétérinaires enregistrés</span>
              </div>
            </div>

            {/* KPI 4 : Adoptions Réalisées */}
            <div className="group relative flex flex-col justify-between p-6 rounded-3xl bg-white border border-brand-burnt/15 shadow-[0_8px_24px_rgba(52,46,43,0.04)] hover:shadow-[0_16px_36px_rgba(198,83,53,0.12)] hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-brand-dark/70 font-bold">
                  Adoptions Réalisées
                </span>
                <span className="p-2.5 rounded-2xl bg-amber-50 text-amber-700">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                </span>
              </div>
              <div className="my-4">
                <span className="text-4xl sm:text-5xl font-extrabold text-brand-orange tracking-tight group-hover:text-brand-burnt transition-colors">
                  {animauxAdoptes.length}
                </span>
              </div>
              <div className="flex items-center gap-2 pt-2 border-t border-brand-stone/40 text-xs font-semibold text-brand-dark/80">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-orange shadow-[0_0_8px_rgba(232,121,69,0.5)]"></span>
                <span>{dons.length} dons matériels ou financiers</span>
              </div>
            </div>
          </section>

          {/* 2. RACCOURCIS D’ACTION RAPIDE (3 Cartes Modernes) */}
          <section ref={quickActionsRef} className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Link
              to="/personnel/animaux"
              className="group relative overflow-hidden flex flex-col justify-between p-6 sm:p-7 rounded-3xl bg-white border border-brand-burnt/15 shadow-[0_6px_20px_rgba(52,46,43,0.04)] hover:shadow-[0_14px_32px_rgba(198,83,53,0.12)] hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-2xl bg-brand-surface flex items-center justify-center text-brand-burnt group-hover:bg-brand-burnt group-hover:text-white transition-colors duration-200">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <ellipse cx="8.5" cy="5" rx="1.75" ry="2.5" />
                    <ellipse cx="15.5" cy="5" rx="1.75" ry="2.5" />
                    <ellipse cx="4.75" cy="9.5" rx="1.6" ry="2.2" />
                    <ellipse cx="19.25" cy="9.5" rx="1.6" ry="2.2" />
                    <path d="M12 10.2c-3.1 0-5.7 2.1-5.7 4.9 0 2.2 1.6 3.9 3.5 3.9.9 0 1.6-.4 2.2-1 .6.6 1.3 1 2.2 1 1.9 0 3.5-1.7 3.5-3.9 0-2.8-2.6-4.9-5.7-4.9z" />
                  </svg>
                </div>
                <span className="w-9 h-9 rounded-full bg-brand-cream flex items-center justify-center text-brand-dark group-hover:translate-x-1 group-hover:bg-brand-burnt group-hover:text-white transition-all duration-200">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </div>
              <div className="mt-6">
                <h2 className="text-lg font-bold text-brand-dark tracking-tight group-hover:text-brand-burnt transition-colors">
                  Gestion des Animaux
                </h2>
                <p className="text-xs text-brand-dark/70 mt-1 line-clamp-2">
                  Ajouter, modifier ou mettre à jour le statut des pensionnaires
                </p>
              </div>
            </Link>

            <Link
              to="/personnel/demandes"
              className="group relative overflow-hidden flex flex-col justify-between p-6 sm:p-7 rounded-3xl bg-white border border-brand-burnt/15 shadow-[0_6px_20px_rgba(52,46,43,0.04)] hover:shadow-[0_14px_32px_rgba(232,121,69,0.12)] hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[#FFF5EF] flex items-center justify-center text-[#E87945] group-hover:bg-[#E87945] group-hover:text-white transition-colors duration-200">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <span className="w-9 h-9 rounded-full bg-brand-cream flex items-center justify-center text-brand-dark group-hover:translate-x-1 group-hover:bg-[#E87945] group-hover:text-white transition-all duration-200">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </div>
              <div className="mt-6">
                <h2 className="text-lg font-bold text-brand-dark tracking-tight group-hover:text-[#E87945] transition-colors">
                  Traiter les Demandes
                </h2>
                <p className="text-xs text-brand-dark/70 mt-1 line-clamp-2">
                  Accepter ou refuser les dossiers en attente de validation
                </p>
              </div>
            </Link>

            <Link
              to="/personnel/dossiers-medicaux"
              className="group relative overflow-hidden flex flex-col justify-between p-6 sm:p-7 rounded-3xl bg-white border border-brand-burnt/15 shadow-[0_6px_20px_rgba(52,46,43,0.04)] hover:shadow-[0_14px_32px_rgba(133,82,52,0.12)] hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-2xl bg-brand-surface flex items-center justify-center text-brand-taupe group-hover:bg-brand-taupe group-hover:text-white transition-colors duration-200">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-3-3v6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <span className="w-9 h-9 rounded-full bg-brand-cream flex items-center justify-center text-brand-dark group-hover:translate-x-1 group-hover:bg-brand-taupe group-hover:text-white transition-all duration-200">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </div>
              <div className="mt-6">
                <h2 className="text-lg font-bold text-brand-dark tracking-tight group-hover:text-brand-taupe transition-colors">
                  Carnets &amp; Soins Vétérinaires
                </h2>
                <p className="text-xs text-brand-dark/70 mt-1 line-clamp-2">
                  Consigner vaccins, stérilisations et suivi de santé
                </p>
              </div>
            </Link>
          </section>

          {/* 3. DEMANDES D’ADOPTION RÉCENTES À TRAITER */}
          <section ref={recentSectionRef} className="rounded-3xl bg-white p-6 sm:p-8 shadow-[0_8px_30px_rgba(52,46,43,0.04)] border border-brand-burnt/15 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-brand-stone/40">
              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-extrabold text-brand-dark tracking-tight">
                  Demandes d’adoption récentes à traiter
                </h2>
                <p className="text-xs sm:text-sm text-brand-dark/70">
                  Consultez les motivations et validez le contact avec les adoptants
                </p>
              </div>
              <Link
                to="/personnel/demandes"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-surface hover:bg-brand-burnt hover:text-white font-bold text-xs sm:text-sm text-brand-burnt transition-all self-start sm:self-auto"
              >
                <span>Voir toutes les demandes ({demandes.length})</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {demandesEnAttente.length === 0 ? (
              <div className="text-center p-8 bg-brand-cream/40 rounded-2xl border border-brand-stone/40 space-y-2">
                <span className="text-2xl">✨</span>
                <p className="text-xs sm:text-sm text-brand-taupe font-medium">
                  Aucune demande en attente actuellement. Tous les dossiers sont traités !
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {demandesEnAttente.slice(0, 4).map((demande) => {
                  const animalTrouve = tousLesAnimaux.find((a) => a.id === demande.animalId)
                  return (
                    <div
                      key={demande.id}
                      className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 rounded-2xl bg-brand-cream/30 hover:bg-brand-cream/60 border border-brand-stone/60 hover:border-brand-burnt/30 transition-all gap-4"
                    >
                      <div className="space-y-1.5 min-w-0">
                        <div className="flex items-center gap-2.5">
                          <span className="w-7 h-7 rounded-lg bg-brand-burnt/10 text-brand-burnt flex items-center justify-center font-bold text-xs shrink-0">
                            #{demande.id}
                          </span>
                          <h3 className="font-bold text-sm sm:text-base text-brand-dark truncate">
                            Candidature pour {animalTrouve?.nom || `Animal #${demande.animalId}`}
                          </h3>
                        </div>
                        <p className="text-xs sm:text-sm text-brand-dark/80 line-clamp-1 italic pl-9">
                          « {demande.motif} »
                        </p>
                        <p className="text-[11px] text-brand-taupe pl-9">
                          Reçue le {formaterDate(demande.dateDemande)} • Adoptant référencé #{demande.adoptantId}
                        </p>
                      </div>

                      <div className="flex items-center gap-2.5 self-end sm:self-auto shrink-0">
                        <button
                          type="button"
                          onClick={() => modifierStatut(demande.id, 'REFUSEE')}
                          aria-label={`Refuser la demande #${demande.id}`}
                          className="group/btn relative inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-[#8C3A27] bg-[#FAF2EE] hover:bg-[#8C3A27] hover:text-white border border-[#EAD2C9] hover:border-[#8C3A27] shadow-xs hover:shadow-[0_2px_8px_rgba(140,58,39,0.18)] transition-all duration-150 ease-out cursor-pointer active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8C3A27]/40 focus-visible:ring-offset-1 shrink-0"
                        >
                          <svg className="w-3.5 h-3.5 shrink-0 transition-transform duration-150 group-hover/btn:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          <span>Refuser</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => modifierStatut(demande.id, 'ACCEPTEE')}
                          aria-label={`Accepter la demande #${demande.id}`}
                          className="group/btn relative inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-brand-burnt to-brand-orange hover:from-[#B5472B] hover:to-[#D46735] shadow-[0_2px_10px_rgba(198,83,53,0.28)] hover:shadow-[0_4px_16px_rgba(198,83,53,0.38)] hover:-translate-y-0.5 transition-all duration-150 ease-out cursor-pointer active:scale-[0.96] active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-burnt/50 focus-visible:ring-offset-1 shrink-0"
                        >
                          <svg className="w-3.5 h-3.5 shrink-0 transition-transform duration-150 group-hover/btn:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Accepter</span>
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  )
}
