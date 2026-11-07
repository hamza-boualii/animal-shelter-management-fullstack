import { useState } from 'react'
import { useDemandes } from '../../hooks/useDemandes'
import { useAnimaux } from '../../hooks/useAnimaux'
import { STATUTS_DEMANDE } from '../../utils/constantes'
import { formaterDate } from '../../utils/dates'
import PersonnelNav from '../../components/personnel/PersonnelNav'
import Chargement from '../../components/ui/Chargement'
import Notification from '../../components/ui/Notification'

export default function GestionDemandesPage() {
  const { demandes, chargement, erreur, modifierStatut } = useDemandes()
  const { tousLesAnimaux } = useAnimaux()

  const [filtreStatut, setFiltreStatut] = useState('TOUS')
  const [notification, setNotification] = useState(null)

  const demandesFiltrees = demandes.filter((d) => {
    if (filtreStatut !== 'TOUS' && d.statut !== filtreStatut) {
      return false
    }
    return true
  })

  const gererChangementStatut = async (id, nouveauStatut) => {
    try {
      await modifierStatut(id, nouveauStatut)
      setNotification({
        type: 'succes',
        texte: `La demande #${id} a été passée à l'état "${STATUTS_DEMANDE[nouveauStatut]?.label}".`,
      })
    } catch (err) {
      setNotification({
        type: 'erreur',
        texte: err.message || 'Impossible de mettre à jour la demande.',
      })
    }
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <PersonnelNav />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-brand-dark">Gestion des Demandes d’Adoption</h2>
          <p className="text-xs text-brand-dark/70">
            Évaluation des dossiers, entretiens préalables et organisation des visites au sanctuaire
          </p>
        </div>

        {/* Filtre par statut */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFiltreStatut('TOUS')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              filtreStatut === 'TOUS'
                ? 'bg-brand-dark text-white shadow-sm'
                : 'bg-white text-brand-dark hover:bg-brand-surface border border-brand-stone'
            }`}
          >
            Toutes ({demandes.length})
          </button>
          {Object.entries(STATUTS_DEMANDE).map(([code, info]) => (
            <button
              key={code}
              type="button"
              onClick={() => setFiltreStatut(code)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                filtreStatut === code
                  ? 'bg-brand-burnt text-white shadow-sm'
                  : 'bg-white text-brand-dark hover:bg-brand-surface border border-brand-stone'
              }`}
            >
              {info.label} ({demandes.filter((d) => d.statut === code).length})
            </button>
          ))}
        </div>
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

      {/* Note de protocole */}
      <div className="p-4 rounded-2xl bg-brand-cream/80 border border-brand-burnt/15 text-xs text-brand-dark mb-6 flex items-start gap-3">
        <span className="text-lg">ℹ️</span>
        <div>
          <span className="font-bold">Protocole de rencontre en sanctuaire :</span> Dès qu’une demande est acceptée, un soignant prend contact avec l’adoptant pour planifier le créneau de visite dans les jardins sensoriels.
        </div>
      </div>

      {chargement ? (
        <Chargement message="Chargement des demandes..." />
      ) : demandesFiltrees.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-brand-stone text-center text-xs text-brand-taupe">
          Aucune demande d’adoption enregistrée pour ce filtre.
        </div>
      ) : (
        <div className="space-y-4">
          {demandesFiltrees.map((demande) => {
            const animal = tousLesAnimaux.find((a) => a.id === demande.animalId)
            const statutInfo = STATUTS_DEMANDE[demande.statut] || STATUTS_DEMANDE.EN_ATTENTE

            return (
              <div
                key={demande.id}
                className="bg-white p-6 rounded-3xl border border-brand-burnt/15 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-brand-stone/60 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-xl bg-brand-surface border border-brand-burnt/20 flex items-center justify-center font-bold text-xs text-brand-burnt">
                      #{demande.id}
                    </span>
                    <div>
                      <h3 className="font-extrabold text-base text-brand-dark">
                        Candidature pour {animal?.nom || `Animal #${demande.animalId}`}
                      </h3>
                      <p className="text-xs text-brand-taupe">
                        Reçue le {formaterDate(demande.dateDemande)} • Adoptant référencé #{demande.adoptantId}
                      </p>
                    </div>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-bold border self-start sm:self-auto ${statutInfo.badgeClass}`}>
                    {statutInfo.label}
                  </span>
                </div>

                {/* Motivation et cadre de vie */}
                <div className="bg-brand-cream/30 p-4 rounded-2xl border border-brand-stone/50 text-xs sm:text-sm">
                  <span className="font-bold text-brand-dark block mb-1">Motif &amp; Cadre de vie déclaré :</span>
                  <p className="text-brand-dark/85 whitespace-pre-line italic">
                    « {demande.motif || 'Aucun motif renseigné.'} »
                  </p>
                </div>

                {/* Actions soignants */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <p className="text-[11px] text-brand-taupe">
                    Mise à jour du statut dans le système du refuge
                  </p>

                  <div className="flex flex-wrap items-center gap-2">
                    {demande.statut !== 'EN_ATTENTE' && (
                      <button
                        type="button"
                        onClick={() => gererChangementStatut(demande.id, 'EN_ATTENTE')}
                        className="px-3 py-1.5 rounded-xl border border-brand-stone bg-white hover:bg-brand-surface text-brand-dark text-xs font-bold transition-colors cursor-pointer"
                      >
                        Remettre en attente
                      </button>
                    )}

                    {demande.statut !== 'ACCEPTEE' && (
                      <button
                        type="button"
                        onClick={() => gererChangementStatut(demande.id, 'ACCEPTEE')}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer"
                      >
                        ✓ Accepter la demande
                      </button>
                    )}

                    {demande.statut !== 'REFUSEE' && (
                      <button
                        type="button"
                        onClick={() => gererChangementStatut(demande.id, 'REFUSEE')}
                        className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors cursor-pointer"
                      >
                        ✕ Refuser
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
