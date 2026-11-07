import { Link } from 'react-router-dom'
import { useAnimaux } from '../../hooks/useAnimaux'
import { useDemandes } from '../../hooks/useDemandes'
import { useDossiersMedicaux } from '../../hooks/useDossiersMedicaux'
import { useDons } from '../../hooks/useDons'
import { formaterDate } from '../../utils/dates'
import PersonnelNav from '../../components/personnel/PersonnelNav'
import Chargement from '../../components/ui/Chargement'
import Bouton from '../../components/ui/Bouton'

export default function PersonnelDashboard() {
  const { tousLesAnimaux, chargement: chargementAnimaux } = useAnimaux()
  const { demandes, chargement: chargementDemandes, modifierStatut } = useDemandes()
  const { dossiers, chargement: chargementDossiers } = useDossiersMedicaux()
  const { dons, chargement: chargementDons } = useDons()

  const chargementGlobal =
    chargementAnimaux || chargementDemandes || chargementDossiers || chargementDons

  const animauxDisponibles = tousLesAnimaux.filter((a) => a.statut === 'DISPONIBLE')
  const animauxEnSoin = tousLesAnimaux.filter((a) => a.statut === 'EN_SOIN')
  const animauxAdoptes = tousLesAnimaux.filter((a) => a.statut === 'ADOPTE')
  const demandesEnAttente = demandes.filter((d) => d.statut === 'EN_ATTENTE')

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <PersonnelNav />

      {chargementGlobal ? (
        <Chargement message="Synchronisation des indicateurs du refuge..." />
      ) : (
        <div className="space-y-8">
          {/* Métriques réelles du refuge (non inventées) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-brand-burnt/15 shadow-sm">
              <span className="text-xs font-bold text-brand-taupe uppercase tracking-wider">
                Total Résidents
              </span>
              <p className="text-3xl font-black text-brand-dark mt-1">
                {tousLesAnimaux.length}
              </p>
              <div className="mt-2 text-xs text-brand-dark/70 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>{animauxDisponibles.length} disponibles immédiatement</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-brand-burnt/15 shadow-sm">
              <span className="text-xs font-bold text-brand-taupe uppercase tracking-wider">
                Demandes d'adoption
              </span>
              <p className="text-3xl font-black text-brand-burnt mt-1">
                {demandesEnAttente.length}
              </p>
              <div className="mt-2 text-xs text-brand-dark/70 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span>En attente d’évaluation soignante</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-brand-burnt/15 shadow-sm">
              <span className="text-xs font-bold text-brand-taupe uppercase tracking-wider">
                Suivi Médical Actif
              </span>
              <p className="text-3xl font-black text-blue-700 mt-1">
                {animauxEnSoin.length}
              </p>
              <div className="mt-2 text-xs text-brand-dark/70 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <span>{dossiers.length} dossiers vétérinaires enregistrés</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-brand-burnt/15 shadow-sm">
              <span className="text-xs font-bold text-brand-taupe uppercase tracking-wider">
                Adoptions Réalisées
              </span>
              <p className="text-3xl font-black text-brand-orange mt-1">
                {animauxAdoptes.length}
              </p>
              <div className="mt-2 text-xs text-brand-dark/70 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                <span>{dons.length} dons matériels ou financiers</span>
              </div>
            </div>
          </div>

          {/* Raccourcis d’action rapide */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/personnel/animaux"
              className="p-5 rounded-3xl bg-white border border-brand-burnt/15 shadow-sm hover:shadow-warm-md hover:border-brand-burnt transition-all flex items-center justify-between group"
            >
              <div>
                <h3 className="font-bold text-brand-dark group-hover:text-brand-burnt transition-colors">
                  🐕 Gestion des Animaux
                </h3>
                <p className="text-xs text-brand-dark/70 mt-0.5">
                  Ajouter, modifier ou mettre à jour le statut
                </p>
              </div>
              <span className="text-brand-burnt text-lg group-hover:translate-x-1 transition-transform">→</span>
            </Link>

            <Link
              to="/personnel/demandes"
              className="p-5 rounded-3xl bg-white border border-brand-burnt/15 shadow-sm hover:shadow-warm-md hover:border-brand-burnt transition-all flex items-center justify-between group"
            >
              <div>
                <h3 className="font-bold text-brand-dark group-hover:text-brand-burnt transition-colors">
                  📋 Traiter les Demandes
                </h3>
                <p className="text-xs text-brand-dark/70 mt-0.5">
                  Accepter ou refuser les dossiers en attente
                </p>
              </div>
              <span className="text-brand-burnt text-lg group-hover:translate-x-1 transition-transform">→</span>
            </Link>

            <Link
              to="/personnel/dossiers-medicaux"
              className="p-5 rounded-3xl bg-white border border-brand-burnt/15 shadow-sm hover:shadow-warm-md hover:border-brand-burnt transition-all flex items-center justify-between group"
            >
              <div>
                <h3 className="font-bold text-brand-dark group-hover:text-brand-burnt transition-colors">
                  🩺 Carnets &amp; Soins Vétérinaires
                </h3>
                <p className="text-xs text-brand-dark/70 mt-0.5">
                  Consigner vaccins, stérilisations et allergies
                </p>
              </div>
              <span className="text-brand-burnt text-lg group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

          {/* Section : Demandes d'adoption en attente d'évaluation */}
          <div className="bg-white p-6 rounded-3xl border border-brand-burnt/15 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-brand-dark">
                  Demandes d’adoption récentes à traiter
                </h3>
                <p className="text-xs text-brand-dark/70">
                  Consultez les motivations et validez le contact avec les adoptants
                </p>
              </div>
              <Link to="/personnel/demandes">
                <Bouton variant="secondary" size="sm">
                  Voir toutes les demandes ({demandes.length})
                </Bouton>
              </Link>
            </div>

            {demandesEnAttente.length === 0 ? (
              <p className="text-xs text-brand-taupe italic p-6 text-center bg-brand-cream/40 rounded-2xl">
                Aucune demande en attente actuellement. Tous les dossiers sont à jour !
              </p>
            ) : (
              <div className="space-y-3">
                {demandesEnAttente.slice(0, 4).map((demande) => {
                  const animalTrouve = tousLesAnimaux.find((a) => a.id === demande.animalId)
                  return (
                    <div
                      key={demande.id}
                      className="p-4 rounded-2xl border border-brand-stone hover:border-brand-burnt/30 bg-brand-cream/20 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-brand-dark">
                            Demande #{demande.id} pour {animalTrouve?.nom || `Animal #${demande.animalId}`}
                          </span>
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
                            En attente
                          </span>
                        </div>
                        <p className="text-xs text-brand-dark/80 line-clamp-1 italic">
                          « {demande.motif} »
                        </p>
                        <p className="text-[11px] text-brand-taupe">
                          Reçue le {formaterDate(demande.dateDemande)} • Adoptant réf #{demande.adoptantId}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                        <button
                          type="button"
                          onClick={() => modifierStatut(demande.id, 'ACCEPTEE')}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer"
                        >
                          ✓ Accepter
                        </button>
                        <button
                          type="button"
                          onClick={() => modifierStatut(demande.id, 'REFUSEE')}
                          className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors cursor-pointer"
                        >
                          ✕ Refuser
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
