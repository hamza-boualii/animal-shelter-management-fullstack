import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { animauxApi } from '../../api/animauxApi'
import { useDemandes } from '../../hooks/useDemandes'
import { useAuth } from '../../hooks/useAuth'
import { DEFAULT_ANIMAL_IMAGES, ESPECES } from '../../utils/constantes'
import Bouton from '../../components/ui/Bouton'
import Chargement from '../../components/ui/Chargement'
import Notification from '../../components/ui/Notification'
import MascotCameo from '../../components/ui/MascotCameo'

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

  if (chargementAnimal) {
    return <Chargement message="Préparation du dossier d’adoption..." hauteurPleine />
  }

  if (!estConnecte || !estAdoptant) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4">
        <div className="bg-white p-8 rounded-3xl border border-brand-burnt/20 shadow-warm-md text-center space-y-4">
          <MascotCameo mode="sit" taille={64} className="justify-center mb-2" />
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

  const estEligible = animal && (animal.statut === 'DISPONIBLE' || animal.statut === 'EN_ATTENTE_ADOPTION')

  if (!estEligible) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4">
        <div className="bg-white p-8 rounded-3xl border border-brand-burnt/20 shadow-warm-md text-center space-y-4">
          <MascotCameo mode="sit" taille={64} className="justify-center mb-2" />
          <h2 className="text-2xl font-bold text-brand-dark">Adoption non disponible</h2>
          <p className="text-sm text-brand-dark/75 leading-relaxed">
            {animal?.nom || 'Cet animal'} n’est pas éligible à l’adoption actuellement. Les demandes d’adoption ne sont ouvertes que pour les animaux avec le statut « Disponible » ou « En attente ».
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

  const gererSoumission = async (e) => {
    e.preventDefault()
    if (!estEligible) {
      setErreur("Cet animal n'est pas éligible à l'adoption.")
      return
    }
    if (!motif.trim()) {
      setErreur('Veuillez préciser votre motivation et votre cadre de vie.')
      return
    }

    setEnvoiEnCours(true)
    setErreur(null)

    try {
      await creerDemande({
        animalId: Number(id),
        adoptantId: Number(utilisateur.id),
        motif: motif.trim(),
      })
      setSucces(true)
    } catch (err) {
      setErreur(err.message || 'Impossible de soumettre la demande.')
    } finally {
      setEnvoiEnCours(false)
    }
  }

  if (succes) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4">
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-brand-burnt/20 shadow-warm-lg text-center space-y-5">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-3xl mx-auto">
            ✓
          </div>

          <h2 className="text-3xl font-extrabold text-brand-dark">
            Demande d’adoption enregistrée !
          </h2>

          <p className="text-sm text-brand-dark/80 leading-relaxed max-w-lg mx-auto">
            Votre demande pour <strong className="text-brand-burnt">{animal?.nom}</strong> a bien été transmise à l’équipe du refuge. Elle est enregistrée avec le statut <strong>En attente</strong>.
          </p>

          <div className="bg-brand-cream/80 p-5 rounded-2xl border border-brand-burnt/15 text-left text-xs sm:text-sm text-brand-dark space-y-2">
            <p className="font-bold text-brand-burnt">🐾 Prochaines étapes de votre parcours :</p>
            <ul className="list-disc list-inside space-y-1 text-brand-dark/80">
              <li>Un soignant du refuge étudiera attentivement votre profil et votre cadre d’accueil.</li>
              <li>Nous vous contacterons par téléphone ou email pour planifier une première rencontre.</li>
              <li>Vous visiterez nos jardins sensoriels pour faire connaissance avec {animal?.nom}.</li>
            </ul>
          </div>

          <div className="pt-4 flex flex-wrap justify-center gap-3">
            <Link to="/animaux">
              <Bouton variant="secondary" size="md">
                Parcourir d’autres animaux
              </Bouton>
            </Link>
            <Link to="/">
              <Bouton variant="primary" size="md">
                Retour à l’accueil
              </Bouton>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const especeInfo = ESPECES[animal?.espece] || { label: animal?.espece, icone: '🐾' }
  const photo =
    animal?.photoUrl ||
    DEFAULT_ANIMAL_IMAGES[animal?.espece] ||
    '/images/animals/golden-retriever.png'

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      {/* En-tête */}
      <div className="mb-8">
        <Link to={`/animaux/${id}`} className="text-xs font-semibold text-brand-dark/60 hover:text-brand-burnt mb-3 inline-block">
          ← Revenir à la fiche de {animal?.nom}
        </Link>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-dark tracking-tight">
          Demande d’adoption pour{' '}
          <span className="font-serif italic font-normal text-brand-burnt">
            {animal?.nom}
          </span>
        </h1>
        <p className="mt-2 text-sm text-brand-dark/75">
          Étape 3 du processus d’adoption : partagez avec bienveillance votre cadre d’accueil pour préparer la rencontre.
        </p>
      </div>

      {/* Récapitulatif de l'animal sélectionné */}
      <div className="bg-white p-5 rounded-3xl border border-brand-burnt/15 shadow-sm mb-8 flex items-center gap-5">
        <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 border border-brand-stone bg-brand-surface">
          <img src={photo} alt={animal?.nom} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-brand-dark">{animal?.nom}</h3>
            <span>{especeInfo.icone}</span>
          </div>
          <p className="text-xs text-brand-orange font-semibold">
            {especeInfo.label} • {animal?.race || 'Race croisée'} • {animal?.age} an{animal?.age > 1 ? 's' : ''}
          </p>
          <p className="text-xs text-brand-taupe mt-1 line-clamp-1">{animal?.description}</p>
        </div>
      </div>

      {/* Formulaire de demande d'adoption */}
      <form onSubmit={gererSoumission} className="bg-white p-7 sm:p-8 rounded-3xl border border-brand-burnt/15 shadow-sm space-y-6">
        {erreur && <Notification type="erreur" message={erreur} onFermer={() => setErreur(null)} />}

        <div className="space-y-1">
          <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark">
            Votre profil d’adoptant
          </label>
          <div className="p-4 rounded-2xl bg-brand-cream/60 border border-brand-stone text-xs text-brand-dark/80 grid grid-cols-1 sm:grid-cols-2 gap-2">
            <p><strong>Nom &amp; Prénom :</strong> {utilisateur.nom}</p>
            <p><strong>Email :</strong> {utilisateur.email}</p>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="motif" className="block text-xs font-bold uppercase tracking-wider text-brand-dark">
            Pourquoi souhaitez-vous adopter {animal?.nom} ? <span className="text-brand-burnt">*</span>
          </label>
          <p className="text-xs text-brand-taupe">
            Décrivez votre cadre de vie (appartement, maison avec jardin, présence d’autres animaux, rythme de présence au foyer).
          </p>
          <textarea
            id="motif"
            rows="5"
            required
            value={motif}
            onChange={(e) => setMotif(e.target.value)}
            placeholder={`Exemple : J'habite dans une maison avec jardin clôturé, je travaille à domicile et je cherche un compagnon calme comme ${animal?.nom}...`}
            className="w-full p-4 rounded-2xl border border-brand-stone focus:outline-none focus:border-brand-burnt focus:ring-2 focus:ring-brand-burnt/20 text-sm placeholder:text-brand-taupe"
          ></textarea>
        </div>

        <div className="p-4 rounded-2xl bg-brand-surface border border-brand-burnt/15 flex items-center gap-3">
          <MascotCameo mode="float" taille={40} />
          <p className="text-xs text-brand-dark/80 leading-snug">
            Toutes les demandes sont examinées individuellement par nos équipes de soignants.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
          <Bouton variant="secondary" onClick={() => navigate(-1)} disabled={envoiEnCours}>
            Annuler
          </Bouton>
          <Bouton type="submit" variant="primary" chargement={envoiEnCours}>
            Soumettre ma demande d’adoption
          </Bouton>
        </div>
      </form>
    </div>
  )
}
