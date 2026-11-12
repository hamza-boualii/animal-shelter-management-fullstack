import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { animate } from 'animejs'
import {
  DEFAULT_ANIMAL_IMAGES,
  ESPECES,
  SEXES,
  STATUTS_ANIMAL,
} from '../../utils/constantes'
import { formaterDate } from '../../utils/dates'
import { formaterPoids } from '../../utils/nombres'

const BOUTON_PRIMAIRE =
  'inline-flex items-center justify-center bg-brand-burnt hover:bg-[#B0452A] text-white px-5 py-2.5 rounded-lg text-sm font-medium shadow-sm transition duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-burnt/40 focus-visible:ring-offset-2'

const BOUTON_SECONDAIRE =
  'inline-flex items-center justify-center bg-white border border-brand-stone text-brand-dark hover:bg-[#FAF5F0] px-5 py-2.5 rounded-lg text-sm font-medium transition duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-burnt/40 focus-visible:ring-offset-2'

const PROFILS_STATUT = {
  DISPONIBLE: {
    badgeClass: 'bg-[#E3F5EC] text-[#1E7E51] border-[#C2E8D5]',
    dotClass: 'bg-[#1E7E51]',
  },
  EN_ATTENTE_ADOPTION: {
    badgeClass: 'bg-[#FFF5EF] text-[#9E4211] border-[#FFDBCD]',
    dotClass: 'bg-[#9E4211]',
  },
  EN_SOIN: {
    badgeClass: 'bg-[#FAF5F0] text-[#5A4F4A] border-[#EADCD4]',
    dotClass: 'bg-[#876F64]',
  },
  ADOPTE: {
    badgeClass: 'bg-[#FAF5F0] text-[#5A4F4A] border-[#EADCD4]',
    dotClass: 'bg-[#876F64]',
  },
}

export default function AnimalProfileCard({
  animal,
  dossierMedical,
  estAdoptant,
  estPersonnel,
}) {
  const carteRef = useRef(null)
  const statutInfo = STATUTS_ANIMAL[animal.statut] || STATUTS_ANIMAL.DISPONIBLE
  const profil = PROFILS_STATUT[animal.statut] || PROFILS_STATUT.DISPONIBLE
  const especeInfo = ESPECES[animal.espece] || { label: animal.espece }
  const sexeInfo = SEXES[animal.sexe] || { label: animal.sexe, symbole: '' }
  const photo =
    animal.photoUrl ||
    DEFAULT_ANIMAL_IMAGES[animal.espece] ||
    '/images/animals/golden-retriever.png'
  const estEnAttente = animal.statut === 'EN_ATTENTE_ADOPTION'

  useEffect(() => {
    const carte = carteRef.current
    if (!carte) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return

    try {
      animate(carte, {
        opacity: [0, 1],
        translateY: [16, 0],
        duration: 500,
        ease: 'outCubic',
      })
    } catch {
      carte.style.opacity = '1'
    }
  }, [animal.id, animal.statut])

  const actionsAdoption = () => {
    if (estAdoptant) {
      return (
        <Link to={`/adopter/${animal.id}`} className={BOUTON_PRIMAIRE}>
          Faire une demande d’adoption
        </Link>
      )
    }

    if (estPersonnel) {
      return (
        <Link to="/personnel/animaux" className={BOUTON_SECONDAIRE}>
          Modifier dans l’espace gestion
        </Link>
      )
    }

    return (
      <>
        <Link
          to="/login"
          state={{ redirection: `/adopter/${animal.id}` }}
          className={BOUTON_PRIMAIRE}
        >
          Se connecter
        </Link>
        <Link to="/register" className={BOUTON_SECONDAIRE}>
          Créer un compte Adoptant
        </Link>
      </>
    )
  }

  const blocAdoption = () => {
    if (animal.statut === 'EN_SOIN') {
      return (
        <div className="bg-[#FFF8F5] border border-[#F1DFD5] rounded-xl p-5 mt-4">
          <div>
            <h3 className="font-semibold text-sm text-[#342E2B]">
              {animal.nom} est actuellement en cours de soins
            </h3>
            <p className="text-base text-[#5A4F4A] mt-2 leading-relaxed">
              L’équipe vétérinaire de Rafiq suit {animal.nom} avec attention. Les demandes
              d’adoption ne sont pas ouvertes pendant cette période de soins.
            </p>
          </div>
        </div>
      )
    }

    if (animal.statut === 'ADOPTE') {
      return (
        <div className="bg-[#FAF5F0] border border-[#EADCD4] rounded-xl p-5 mt-4">
          <div className="flex items-start gap-3">
            <div className="flex-grow">
              <h3 className="font-semibold text-sm text-[#342E2B]">
                {animal.nom} a trouvé son foyer pour la vie !
              </h3>
              <p className="text-sm sm:text-base text-[#5A4F4A] mt-1.5 leading-relaxed">
                L’adoption de {animal.nom} a été finalisée avec succès par sa nouvelle famille.
                Vous pouvez poursuivre votre découverte des compagnons du sanctuaire.
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-4">
                <Link to="/animaux" className={BOUTON_PRIMAIRE}>
                  Découvrir les autres animaux
                </Link>
              </div>
            </div>
          </div>
        </div>
      )
    }

    if (estEnAttente) {
      return (
        <div className="bg-[#FFF8F5] border border-[#F1DFD5] rounded-xl p-5 mt-4">
          <div className="flex-grow">
            <h3 className="font-semibold text-sm text-[#342E2B]">
              Une adoption est actuellement en cours pour {animal.nom}
            </h3>
            <p className="text-base text-[#4A3E39] mt-2 leading-relaxed">
              Une demande d’adoption est en cours d’évaluation. Vous pouvez toutefois
              soumettre votre propre demande d’adoption pour {animal.nom}.
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-4">{actionsAdoption()}</div>
          </div>
        </div>
      )
    }

    return (
      <div className="bg-[#FFF8F5] border border-[#F1DFD5] rounded-xl p-5 mt-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand-burnt/10 flex items-center justify-center text-brand-burnt shrink-0 mt-0.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="flex-grow">
            <h3 className="font-semibold text-sm text-[#342E2B]">
              Vous souhaitez offrir un foyer à {animal.nom} ?
            </h3>
            <p className="text-base text-[#4A3E39] mt-1 leading-relaxed">
              La consultation est libre pour tous, mais la soumission d’une demande d’adoption
              officielle nécessite un compte Adoptant vérifié par l’équipe du sanctuaire.
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-4">{actionsAdoption()}</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <section
      ref={carteRef}
      aria-labelledby="animal-name"
      className="bg-white border border-brand-stone rounded-2xl shadow-[0_12px_32px_-4px_rgba(52,46,43,0.08)] overflow-hidden p-6 sm:p-8 lg:p-10"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        <div className="lg:col-span-5 flex flex-col">
          <div className="relative w-full aspect-[4/3] sm:aspect-square lg:aspect-[4/5] rounded-2xl overflow-hidden bg-brand-surface border border-brand-stone shadow-sm group">
            <img
              src={photo}
              alt={`Portrait de ${animal.nom}`}
              className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              loading="eager"
            />
            <div className="absolute top-4 left-4">
              <span
                className={`inline-flex items-center gap-1.5 border text-[11px] font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-sm ${profil.badgeClass}`}
              >
                {animal.statut === 'ADOPTE' ? (
                  <svg className="w-3.5 h-3.5 stroke-current" fill="none" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M4.5 12.75l6 6 9-13.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <span className={`w-1.5 h-1.5 rounded-full ${profil.dotClass}`} />
                )}
                {statutInfo.label.toUpperCase()}
              </span>
            </div>
            <div className="absolute bottom-4 right-4">
              <span className="inline-flex items-center gap-1.5 bg-white/95 backdrop-blur text-brand-dark text-xs font-semibold px-3 py-1.5 rounded-full border border-brand-stone/80 shadow-sm">
                {sexeInfo.symbole && <span className="text-brand-burnt">{sexeInfo.symbole}</span>}
                <span>{sexeInfo.label}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 flex flex-col justify-between">
          <div>
            <div className="border-b border-brand-cream pb-4">
              <h1
                id="animal-name"
                className="text-3xl sm:text-4xl font-extrabold tracking-tight text-brand-dark"
              >
                {animal.nom}
              </h1>
              <p className="text-sm font-semibold text-brand-taupe mt-1 tracking-wide">
                {especeInfo.label}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-[1.6fr_1fr_1fr_1fr] gap-4 my-6 bg-brand-surface border border-brand-stone/80 rounded-xl p-4 items-start">
              <div className="flex flex-col pr-1">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-brand-taupe">
                  Race
                </span>
                <span className="text-sm sm:text-base font-bold text-brand-dark mt-0.5 leading-snug">
                  {animal.race || 'Non renseignée'}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-brand-taupe">
                  Âge
                </span>
                <span className="text-base font-bold text-brand-dark mt-0.5">
                  {animal.age} an{animal.age > 1 ? 's' : ''}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-brand-taupe">
                  Arrivée
                </span>
                <span className="text-base font-bold text-brand-dark mt-0.5">
                  {formaterDate(animal.dateArrivee)}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-brand-taupe">
                  Poids
                </span>
                <span className="text-base font-bold text-brand-dark mt-0.5">
                  {formaterPoids(animal.poids)}
                </span>
              </div>
            </div>

            <div className="mb-6 space-y-2">
              <h2 className="text-xs uppercase tracking-wider font-bold text-brand-taupe">
                À propos de {animal.nom}
              </h2>
              <div className="bg-brand-surface/50 border border-brand-stone/60 rounded-xl p-4">
                <p className="text-sm text-[#5A4F4A] leading-relaxed whitespace-pre-line">
                  {animal.description ||
                    'Aucune description n’a encore été publiée pour ce compagnon.'}
                </p>
              </div>
            </div>

            <div className="mb-6 space-y-2.5">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-brand-burnt" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M12 4.5v15m7.5-7.5h-15" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <h2 className="text-xs uppercase tracking-wider font-bold text-brand-taupe">
                  Dossier médical &amp; soins
                </h2>
              </div>

              {dossierMedical ? (
                <div className="border border-brand-stone rounded-xl bg-white divide-y divide-brand-cream text-xs sm:text-sm overflow-hidden">
                  <div className="flex items-center p-4 gap-4">
                    <span className="w-40 sm:w-44 shrink-0 text-xs font-semibold text-brand-taupe">
                      Stérilisation
                    </span>
                    <div className="flex items-center gap-1.5 font-medium text-brand-dark">
                      {dossierMedical.sterilise ? (
                        <>
                          <svg className="w-4 h-4 text-brand-forest stroke-current" fill="none" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path d="M4.5 12.75l6 6 9-13.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <span>Stérilisé(e)</span>
                        </>
                      ) : (
                        <span>Non stérilisé(e)</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center p-4 gap-4">
                    <span className="w-40 sm:w-44 shrink-0 text-xs font-semibold text-brand-taupe">
                      Allergies
                    </span>
                    <span className="font-medium text-brand-dark">
                      {dossierMedical.allergies || 'Aucune connue'}
                    </span>
                  </div>
                  <div className="flex items-start p-4 gap-4">
                    <span className="w-40 sm:w-44 shrink-0 text-xs font-semibold text-brand-taupe pt-0.5">
                      Vaccinations
                    </span>
                    <span className="flex-1 font-medium text-brand-dark leading-relaxed">
                      {dossierMedical.vaccinsRecus || 'À jour du calendrier de base'}
                    </span>
                  </div>
                  <div className="flex items-center p-4 gap-4">
                    <span className="w-40 sm:w-44 shrink-0 text-xs font-semibold text-brand-taupe">
                      Traitements en cours
                    </span>
                    <span className="font-medium text-brand-dark">
                      {dossierMedical.traitementsEnCours || 'Aucun'}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-brand-taupe italic bg-brand-surface/50 p-4 rounded-xl border border-brand-stone/60">
                  Dossier médical en cours de centralisation par l’équipe vétérinaire.
                </p>
              )}
            </div>

            {blocAdoption()}
          </div>
        </div>
      </div>
    </section>
  )
}
