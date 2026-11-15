import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { animauxApi } from '../../api/animauxApi'
import { useDemandes } from '../../hooks/useDemandes'
import { useAuth } from '../../hooks/useAuth'
import { ESPECES, STATUTS_ANIMAL } from '../../utils/constantes'
import Bouton from '../../components/ui/Bouton'
import Chargement from '../../components/ui/Chargement'
import Notification from '../../components/ui/Notification'
import AuthIcon from '../../components/auth/AuthIcon'
import AnimalPhoto from '../../components/animals/AnimalPhoto'
import ConfirmationDemandeModal from '../../components/adoption/ConfirmationDemandeModal'

export default function DemandeAdoptionPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { utilisateur, estConnecte, estAdoptant } = useAuth()
  const { creerDemande } = useDemandes()

  const [animal, setAnimal] = useState(null)
  const [motif, setMotif] = useState('')
  const [chargementAnimal, setChargementAnimal] = useState(true)
  const [envoiEnCours, setEnvoiEnCours] = useState(false)
  const [erreur, setErreur] = useState(null)
  const [succes, setSucces] = useState(false)
  const [modalOuverte, setModalOuverte] = useState(false)
  const envoiEnCoursRef = useRef(false)
  const boutonConfirmationRef = useRef(null)

  useEffect(() => {
    async function chargerAnimal() {
      try {
        setChargementAnimal(true)
        const res = await animauxApi.obtenir(id)
        setAnimal(res)
      } catch (err) {
        setErreur(err.message)
      } finally {
        setChargementAnimal(false)
      }
    }
    if (id) {
      chargerAnimal()
    }
  }, [id])

  const fermerConfirmation = useCallback(() => {
    setModalOuverte(false)
  }, [])

  useEffect(() => {
    if (succes && !modalOuverte) {
      boutonConfirmationRef.current?.focus()
    }
  }, [succes, modalOuverte])

  if (chargementAnimal) {
    return <Chargement message="Préparation du dossier d’adoption..." hauteurPleine />
  }

  if (!estConnecte || !estAdoptant) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4">
        <div className="bg-white p-8 rounded-3xl border border-brand-burnt/20 shadow-warm-md text-center space-y-4">
          <h2 className="text-2xl font-bold text-brand-dark">Connexion requise</h2>
          <p className="text-sm text-brand-dark/75 leading-relaxed">
            Pour soumettre une demande d’adoption auprès du sanctuaire Rafiq, vous devez être connecté(e) avec un compte Adoptant.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-3">
            <Link to="/login" state={{ redirection: `/adopter/${id}` }}>
              <Bouton variant="primary" size="md">
                Se connecter
              </Bouton>
            </Link>
            <Link to="/register">
              <Bouton variant="secondary" size="md">
                Créer un compte
              </Bouton>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!animal) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4">
        <Notification
          type="erreur"
          message={erreur || 'Compagnon introuvable dans le refuge.'}
        />
        <div className="mt-6 text-center">
          <Link to="/animaux">
            <Bouton variant="secondary" size="md">
              ← Retour aux animaux
            </Bouton>
          </Link>
        </div>
      </div>
    )
  }

  const estEligible = animal.statut === 'DISPONIBLE' || animal.statut === 'EN_ATTENTE_ADOPTION'

  if (!estEligible) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4">
        <div className="bg-white p-8 rounded-3xl border border-brand-burnt/20 shadow-warm-md text-center space-y-4">
          <h2 className="text-2xl font-bold text-brand-dark">Adoption non disponible</h2>
          <p className="text-sm text-brand-dark/75 leading-relaxed">
            {animal.nom} n’est pas éligible à l’adoption actuellement. Les demandes d’adoption ne sont ouvertes que pour les animaux avec le statut « Disponible » ou « En attente ».
          </p>
          <div className="pt-4 flex justify-center">
            <Link to="/animaux">
              <Bouton variant="primary" size="md">
                Retour aux animaux
              </Bouton>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const telephone = utilisateur?.telephone?.trim() || ''
  const especeInfo = ESPECES[animal.espece] || { label: animal.espece, icone: '🐾' }
  const statutInfo = STATUTS_ANIMAL[animal.statut] || STATUTS_ANIMAL.DISPONIBLE
  const photo = animal.photoUrl || ''
  const ageLabel = `${animal.age} an${animal.age > 1 ? 's' : ''}`

  const gererSoumission = async (e) => {
    e.preventDefault()
    if (envoiEnCoursRef.current || succes) return

    if (!estEligible) {
      setErreur("Cet animal n'est pas éligible à l'adoption.")
      return
    }
    if (!motif.trim()) {
      setErreur('Veuillez préciser votre motivation et votre cadre de vie.')
      return
    }

    envoiEnCoursRef.current = true
    setEnvoiEnCours(true)
    setErreur(null)

    try {
      await creerDemande({
        animalId: Number(id),
        adoptantId: Number(utilisateur.id),
        motif: motif.trim(),
      })
      setSucces(true)
      setModalOuverte(true)
    } catch (err) {
      setErreur(err.message || 'Impossible de soumettre la demande.')
    } finally {
      envoiEnCoursRef.current = false
      setEnvoiEnCours(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link
          to={`/animaux/${id}`}
          className="group inline-flex items-center gap-2 text-sm font-medium text-brand-dark/70 transition-colors hover:text-brand-burnt"
        >
          <svg
            className="h-4 w-4 transition-transform group-hover:-translate-x-1"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>Revenir à la fiche de {animal.nom}</span>
        </Link>
      </div>

      <section className="mb-8 max-w-3xl md:mb-10">
        <h1 className="text-3xl font-bold leading-tight tracking-tight text-brand-dark md:text-4xl">
          Demande d’adoption pour{' '}
          <span className="font-serif italic font-semibold text-brand-burnt">{animal.nom}</span>
        </h1>
        <p className="mt-2.5 text-sm leading-relaxed text-brand-dark/70 md:text-base">
          Étape 3 du processus d’adoption : partagez avec bienveillance votre cadre d’accueil pour préparer la rencontre avec notre équipe soignante.
        </p>
      </section>

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        <aside className="lg:col-span-5">
          <div className="rounded-3xl border border-brand-stone bg-white p-5 shadow-warm-md lg:sticky lg:top-28">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-brand-surface">
              <AnimalPhoto
                src={photo}
                alt={animal.nom}
                className="h-full w-full object-cover object-center"
              />
              <div className="absolute top-3.5 left-3.5">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider shadow-sm ${statutInfo.badgeClass}`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  {statutInfo.label}
                </span>
              </div>
            </div>

            <div className="mt-5">
              <h2 className="text-2xl font-bold text-brand-dark">{animal.nom}</h2>
              <p className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs font-medium text-brand-burnt">
                <span>{especeInfo.label}</span>
                <span aria-hidden="true">•</span>
                <span>{animal.race || 'Race croisée'}</span>
                <span aria-hidden="true">•</span>
                <span>{ageLabel}</span>
              </p>

              {animal.description && (
                <div className="mt-4 border-t border-brand-stone pt-4">
                  <p className="text-sm leading-relaxed text-brand-dark/75">{animal.description}</p>
                </div>
              )}
            </div>
          </div>
        </aside>

        <div className="lg:col-span-7">
          <form
            onSubmit={gererSoumission}
            className="space-y-8 rounded-3xl border border-brand-stone bg-white p-6 shadow-warm-md sm:p-8"
          >
            {erreur && <Notification type="erreur" message={erreur} onFermer={() => setErreur(null)} />}

            {succes && !modalOuverte && (
              <div
                role="status"
                className="flex flex-col items-start justify-between gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 sm:flex-row sm:items-center"
              >
                <p className="text-sm font-semibold text-emerald-900">
                  Votre demande a bien été envoyée.
                </p>
                <button
                  ref={boutonConfirmationRef}
                  type="button"
                  onClick={() => setModalOuverte(true)}
                  className="inline-flex cursor-pointer items-center justify-center rounded-full border border-brand-burnt/20 bg-white px-3.5 py-1.5 text-xs font-bold text-brand-dark transition-all duration-200 hover:border-brand-burnt hover:bg-brand-surface focus:outline-none focus:ring-3 focus:ring-brand-burnt/30 active:scale-[0.98]"
                >
                  Afficher la confirmation
                </button>
              </div>
            )}

            <section aria-labelledby="section-coordonnees">
              <div className="mb-5 border-b border-brand-stone pb-3">
                <h2
                  id="section-coordonnees"
                  className="text-xs font-bold uppercase tracking-wider text-brand-burnt"
                >
                  Section 01
                </h2>
                <h3 className="mt-0.5 text-xl font-bold text-brand-dark">Vos coordonnées</h3>
                <p className="mt-0.5 text-sm text-brand-dark/70">
                  Vérifiez vos informations de contact enregistrées sur votre profil.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                <div className="flex flex-col justify-between rounded-2xl border border-brand-stone bg-brand-cream/60 p-3.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-brand-taupe">
                    Nom et prénom
                  </span>
                  <div className="mt-1 flex items-center gap-2">
                    <AuthIcon name="user" className="h-4 w-4 text-brand-taupe" />
                    <span className="text-sm font-semibold text-brand-dark">{utilisateur.nom}</span>
                  </div>
                </div>

                <div className="flex flex-col justify-between rounded-2xl border border-brand-stone/80 bg-brand-card p-3.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-brand-taupe">
                    Email
                  </span>
                  <div className="mt-1 flex items-center gap-2">
                    <AuthIcon name="mail" className="h-4 w-4 text-brand-taupe/80" />
                    <span className="truncate text-xs font-medium text-brand-dark/65">
                      {utilisateur.email}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-3.5 flex flex-col gap-2.5 rounded-2xl border border-brand-burnt/20 bg-brand-cream/80 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-burnt text-white shadow-warm-sm">
                    <AuthIcon name="phone" className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-grow">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-brand-taupe">
                        Téléphone du contact
                      </span>
                      <span className="rounded-md border border-brand-burnt/30 bg-white px-2 py-0.5 text-[10px] font-bold text-brand-burnt">
                        Contact prioritaire
                      </span>
                    </div>
                    <p className="mt-0.5 break-words text-base font-bold tracking-wide text-brand-dark">
                      {telephone || 'Numéro non renseigné'}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-brand-dark/75 sm:pl-[52px]">
                  Notre équipe pourra vous contacter à ce numéro concernant votre demande d'adoption.
                </p>
              </div>
            </section>

            <section aria-labelledby="section-projet">
              <div className="mb-4 border-b border-brand-stone pb-3">
                <h2
                  id="section-projet"
                  className="text-xs font-bold uppercase tracking-wider text-brand-burnt"
                >
                  Section 02 — Votre projet d’adoption
                </h2>
                <label
                  htmlFor="motif"
                  className="mt-0.5 block text-xl font-bold text-brand-dark"
                >
                  Pourquoi souhaitez-vous adopter {animal.nom} ?{' '}
                  <span aria-hidden="true" className="text-brand-burnt">
                    *
                  </span>
                </label>
                <p className="mt-1 text-sm leading-relaxed text-brand-dark/70">
                  Présentez brièvement vos motivations, votre quotidien et l’environnement qui accueillera {animal.nom}.
                </p>
              </div>

              <div className="relative">
                <textarea
                  id="motif"
                  name="motif"
                  rows="7"
                  required
                  readOnly={succes}
                  value={motif}
                  onChange={(e) => setMotif(e.target.value)}
                  placeholder="Écrivez votre message ici... Partagez vos motivations, votre logement, la présence d'autres animaux, etc."
                  className="w-full resize-y rounded-2xl border border-brand-stone bg-brand-card p-4 text-base leading-relaxed text-brand-dark transition duration-150 placeholder:text-brand-taupe focus:border-brand-burnt focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-burnt/20"
                />
                <div className="mt-2 flex items-center justify-between px-1 text-xs text-brand-taupe">
                  <span>Minimum 50 caractères recommandé</span>
                  <span className="font-medium">
                    {motif.length} caractère{motif.length > 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-start gap-3.5 rounded-2xl border border-brand-stone bg-brand-cream/90 p-4 sm:p-5">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-brand-burnt/20 bg-white text-brand-burnt shadow-sm">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="text-sm leading-relaxed text-brand-dark/80">
                  <p className="mb-1 font-semibold text-brand-dark">Processus d’examen bienveillant</p>
                  <p>
                    Chaque demande est examinée individuellement par notre équipe de soignants. Nous vous contacterons par téléphone pour échanger avec vous sur votre projet d’adoption et planifier une première rencontre au sanctuaire.
                  </p>
                </div>
              </div>
            </section>

            <div className="flex flex-col-reverse items-center justify-end gap-3.5 pt-4 sm:flex-row">
              <Bouton
                variant="secondary"
                size="lg"
                onClick={() => navigate(-1)}
                disabled={envoiEnCours}
                className="w-full px-6 sm:w-auto"
              >
                Annuler
              </Bouton>
              <Bouton
                type="submit"
                variant="primary"
                size="lg"
                chargement={envoiEnCours}
                disabled={succes}
                className="w-full gap-2 px-8 sm:w-auto"
              >
                <span>{succes ? 'Demande envoyée' : 'Soumettre ma demande d’adoption'}</span>
                {!succes && (
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </Bouton>
            </div>
          </form>
        </div>
      </div>

      {succes && modalOuverte && (
        <ConfirmationDemandeModal
          animal={animal}
          telephone={telephone}
          onFermer={fermerConfirmation}
        />
      )}
    </div>
  )
}
