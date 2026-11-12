import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { animauxApi } from '../../api/animauxApi'
import { dossiersMedicauxApi } from '../../api/dossiersMedicauxApi'
import { useAuth } from '../../hooks/useAuth'
import AnimalProfileCard from '../../components/animals/AnimalProfileCard'
import Bouton from '../../components/ui/Bouton'
import Chargement from '../../components/ui/Chargement'
import Notification from '../../components/ui/Notification'

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

        try {
          const tousDossiers = await dossiersMedicauxApi.lister()
          if (Array.isArray(tousDossiers)) {
            const trouve = tousDossiers.find((d) => Number(d.animalId) === Number(id))
            setDossierMedical(trouve || null)
          }
        } catch {
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

  return (
    <div className="max-w-6xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-1 mb-6">
        <Link
          to="/animaux"
          className="group inline-flex items-center gap-2.5 self-start px-4 py-2 rounded-full bg-white border border-brand-stone text-xs sm:text-sm font-semibold text-brand-dark shadow-sm hover:border-brand-burnt hover:text-brand-burnt hover:shadow transition-all duration-200"
        >
          <svg
            className="w-4 h-4 text-brand-taupe group-hover:text-brand-burnt transition-transform duration-200 group-hover:-translate-x-1"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>Retour aux animaux</span>
        </Link>

        <nav aria-label="Fil d'ariane" className="flex items-center space-x-2 text-xs font-medium text-brand-taupe">
          <Link to="/" className="hover:text-brand-dark transition-colors">
            Accueil
          </Link>
          <svg className="w-3.5 h-3.5 text-brand-stone" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
          <Link to="/animaux" className="hover:text-brand-dark transition-colors">
            Explorer les animaux
          </Link>
          <svg className="w-3.5 h-3.5 text-brand-stone" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
          <span aria-current="page" className="text-brand-dark font-semibold">
            {animal.nom}
          </span>
        </nav>
      </div>

      <AnimalProfileCard
        animal={animal}
        dossierMedical={dossierMedical}
        estAdoptant={estAdoptant}
        estPersonnel={estPersonnel}
      />
    </div>
  )
}
