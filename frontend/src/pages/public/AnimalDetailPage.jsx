import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { animauxApi } from '../../api/animauxApi'
import { dossiersMedicauxApi } from '../../api/dossiersMedicauxApi'
import { useAuth } from '../../hooks/useAuth'
import {
  STATUTS_ANIMAL,
  ESPECES,
  SEXES,
  DEFAULT_ANIMAL_IMAGES,
} from '../../utils/constantes'
import { formaterDate } from '../../utils/dates'
import Bouton from '../../components/ui/Bouton'
import Chargement from '../../components/ui/Chargement'
import Notification from '../../components/ui/Notification'
import MascotCameo from '../../components/ui/MascotCameo'

export default function AnimalDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { estPersonnel, estAdoptant } = useAuth()

  const [animal, setAnimal] = useState(null)
  const [dossierMedical, setDossierMedical] = useState(null)
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState(null)

  useEffect(() => {
    async function chargerDonnees() {
      try {
        setChargement(true)
        setErreur(null)

        const animalRes = await animauxApi.obtenir(id)
        setAnimal(animalRes)

        // Récupérer le dossier médical associé s'il existe
        try {
          const tousDossiers = await dossiersMedicauxApi.lister()
          if (Array.isArray(tousDossiers)) {
            const trouve = tousDossiers.find((d) => Number(d.animalId) === Number(id))
            setDossierMedical(trouve || null)
          }
        } catch {
          // Si le dossier médical n'existe pas ou échoue, on continue
          setDossierMedical(null)
        }
      } catch (err) {
        setErreur(err.message)
      } finally {
        setChargement(false)
      }
    }

    if (id) {
      chargerDonnees()
    }
  }, [id])

  if (chargement) {
    return <Chargement message="Chargement de la fiche du compagnon..." hauteurPleine />
  }

  if (erreur || !animal) {
    return (
      <div className="max-w-3xl mx-auto py-16 px-4">
        <Notification
          type="erreur"
          message={erreur || 'Compagnon introuvable dans le refuge.'}
        />
        <div className="mt-6 text-center">
          <Bouton variant="secondary" onClick={() => navigate('/animaux')}>
            ← Retour aux animaux
          </Bouton>
        </div>
      </div>
    )
  }

  const statutInfo = STATUTS_ANIMAL[animal.statut] || STATUTS_ANIMAL.DISPONIBLE
  const especeInfo = ESPECES[animal.espece] || { label: animal.espece, icone: '🐾' }
  const sexeInfo = SEXES[animal.sexe] || { label: animal.sexe, symbole: '' }
  const photo =
    animal.photoUrl ||
    DEFAULT_ANIMAL_IMAGES[animal.espece] ||
    '/images/animals/golden-retriever.png'

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Fil d'Ariane */}
      <nav className="mb-6 flex items-center gap-2 text-xs font-semibold text-brand-dark/60">
        <Link to="/" className="hover:text-brand-burnt">Accueil</Link>
        <span>/</span>
        <Link to="/animaux" className="hover:text-brand-burnt">Animaux</Link>
        <span>/</span>
        <span className="text-brand-burnt">{animal.nom}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Colonne visuelle gauche */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative rounded-[2rem] overflow-hidden border-4 border-white shadow-warm-lg bg-brand-surface aspect-[4/3] sm:aspect-square">
            <img
              src={photo}
              alt={animal.nom}
              className="w-full h-full object-cover"
            />
            <span
              className={`absolute top-4 left-4 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border shadow-sm ${statutInfo.badgeClass}`}
            >
              {statutInfo.label}
            </span>
          </div>

          {/* Cameo Mascotte */}
          <div className="p-4 bg-white rounded-2xl border border-brand-burnt/15 shadow-sm flex items-center justify-between">
            <MascotCameo
              mode="wag"
              taille={48}
              titreBulle="Le conseil de Rafiq"
              bulle="Prenez le temps de bien lire la fiche médicale avant d’adopter."
            />
          </div>
        </div>

        {/* Colonne détails droite */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-7 sm:p-8 rounded-3xl border border-brand-burnt/15 shadow-sm space-y-6">
            {/* Titre et badges clés */}
            <div className="border-b border-brand-stone/60 pb-5">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                <h1 className="text-3xl sm:text-4xl font-black text-brand-dark flex items-center gap-2">
                  <span>{animal.nom}</span>
                  <span className="text-2xl text-brand-orange">{especeInfo.icone}</span>
                </h1>
                <span className="text-sm font-bold bg-brand-cream text-brand-dark px-3 py-1 rounded-full border border-brand-burnt/15">
                  {sexeInfo.symbole} {sexeInfo.label}
                </span>
              </div>
              <p className="text-sm font-semibold text-brand-orange">
                {especeInfo.label} • {animal.race || 'Race croisée'}
              </p>
            </div>

            {/* Grille d'attributs de base (conformes au backend) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-brand-cream/60 rounded-2xl border border-brand-stone/60">
                <p className="text-[11px] font-bold text-brand-taupe uppercase tracking-wider">Âge</p>
                <p className="text-base font-extrabold text-brand-dark">
                  {animal.age} an{animal.age > 1 ? 's' : ''}
                </p>
              </div>

              <div className="p-3 bg-brand-cream/60 rounded-2xl border border-brand-stone/60">
                <p className="text-[11px] font-bold text-brand-taupe uppercase tracking-wider">Arrivée au refuge</p>
                <p className="text-xs sm:text-sm font-extrabold text-brand-dark">
                  {formaterDate(animal.dateArrivee)}
                </p>
              </div>

              <div className="col-span-2 sm:col-span-1 p-3 bg-brand-cream/60 rounded-2xl border border-brand-stone/60">
                <p className="text-[11px] font-bold text-brand-taupe uppercase tracking-wider">Statut</p>
                <p className="text-xs sm:text-sm font-extrabold text-brand-burnt">
                  {statutInfo.label}
                </p>
              </div>
            </div>

            {/* Description comportementale et profil */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-brand-burnt mb-2">
                À propos de {animal.nom}
              </h3>
              <p className="text-sm text-brand-dark/85 leading-relaxed whitespace-pre-line bg-brand-surface/40 p-4 rounded-2xl border border-brand-stone/50">
                {animal.description || 'Compagnon sociable et calme, suivi par les soigneurs de Rafiq.'}
              </p>
            </div>

            {/* Dossier médical vérifié conforme au backend */}
            <div className="border-t border-brand-stone/60 pt-5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-brand-burnt mb-3 flex items-center gap-2">
                <span>🩺</span> Dossier Médical &amp; Soins
              </h3>

              {dossierMedical ? (
                <div className="space-y-3 bg-brand-cream/40 p-5 rounded-2xl border border-brand-burnt/15 text-xs sm:text-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <span className="font-bold text-brand-dark">Stérilisation : </span>
                      <span className={`font-semibold ${dossierMedical.sterilise ? 'text-emerald-700' : 'text-amber-700'}`}>
                        {dossierMedical.sterilise ? '✓ Stérilisé(e)' : 'Non stérilisé(e)'}
                      </span>
                    </div>

                    <div>
                      <span className="font-bold text-brand-dark">Allergies : </span>
                      <span className="text-brand-dark/80">
                        {dossierMedical.allergies || 'Aucune connue'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="font-bold text-brand-dark">Vaccins reçus : </span>
                    <span className="text-brand-dark/80">
                      {dossierMedical.vaccinsRecus || 'À jour du calendrier de base'}
                    </span>
                  </div>

                  {dossierMedical.traitementsEnCours && (
                    <div>
                      <span className="font-bold text-brand-dark">Traitements en cours : </span>
                      <span className="text-brand-dark/80">
                        {dossierMedical.traitementsEnCours}
                      </span>
                    </div>
                  )}

                  {dossierMedical.description && (
                    <div className="pt-2 border-t border-brand-stone/50">
                      <span className="font-bold text-brand-dark block mb-1">Observations vétérinaires :</span>
                      <p className="text-brand-dark/75 italic">
                        « {dossierMedical.description} »
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-xs text-brand-taupe italic bg-brand-cream/40 p-4 rounded-2xl">
                  Dossier médical en cours de centralisation par l’équipe vétérinaire.
                </p>
              )}
            </div>

            {/* Bloc d'action d'adoption */}
            <div className="border-t border-brand-stone/60 pt-5">
              {animal.statut === 'DISPONIBLE' ? (
                estAdoptant ? (
                  <Link to={`/adopter/${animal.id}`} className="block">
                    <Bouton variant="primary" size="lg" className="w-full">
                      🐾 Faire une demande d’adoption pour {animal.nom}
                    </Bouton>
                  </Link>
                ) : estPersonnel ? (
                  <div className="p-4 rounded-2xl bg-brand-cream border border-brand-burnt/20 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-brand-dark">Compte Personnel actif</p>
                      <p className="text-xs text-brand-dark/70">Vous pouvez mettre à jour cet animal depuis la gestion.</p>
                    </div>
                    <Link to="/personnel/animaux">
                      <Bouton variant="secondary" size="sm">
                        Modifier dans l’espace gestion
                      </Bouton>
                    </Link>
                  </div>
                ) : (
                  <div className="p-5 rounded-2xl bg-brand-cream border border-brand-burnt/20 space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="text-xl">❤️</span>
                      <div>
                        <h4 className="text-sm font-bold text-brand-dark">
                          Vous souhaitez offrir un foyer à {animal.nom} ?
                        </h4>
                        <p className="text-xs text-brand-dark/75 mt-0.5 leading-relaxed">
                          La consultation est libre pour tous, mais la soumission d’une demande d’adoption nécessite un compte Adoptant vérifié.
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3 pt-1">
                      <Link to="/login" state={{ redirection: `/adopter/${animal.id}` }}>
                        <Bouton variant="primary" size="sm">
                          Se connecter
                        </Bouton>
                      </Link>
                      <Link to="/register">
                        <Bouton variant="secondary" size="sm">
                          Créer un compte Adoptant
                        </Bouton>
                      </Link>
                    </div>
                  </div>
                )
              ) : (
                <div className="p-4 rounded-2xl bg-stone-100 border border-stone-200 text-center">
                  <p className="text-xs font-bold text-stone-700">
                    Cet animal est actuellement {statutInfo.label.toLowerCase()} ({statutInfo.description}).
                  </p>
                  <p className="text-[11px] text-stone-500 mt-1">
                    Les demandes d’adoption ne sont ouvertes que pour les animaux avec le statut « Disponible ».
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
