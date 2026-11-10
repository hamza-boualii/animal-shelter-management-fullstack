import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { STATUTS_ANIMAL, DEFAULT_ANIMAL_IMAGES } from '../../utils/constantes'
import Bouton from '../ui/Bouton'
import MascotCameo from '../ui/MascotCameo'

export default function FeaturedCarousel({ animaux = [] }) {
  const containerRef = useRef(null)
  const trackRef = useRef(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [activeIndex, setActiveIndex] = useState(0)

  // Utiliser les animaux réels du backend
  // Si la base de données est vide, nous présentons la liste de base avec les photographies fournies
  const displayAnimals = animaux.length > 0
    ? animaux.slice(0, 5)
    : [
        {
          id: 1,
          nom: 'Rex',
          espece: 'CHIEN',
          race: 'Berger Allemand & Golden',
          age: 3,
          statut: 'DISPONIBLE',
          description: 'Compagnon calme, fidèle et habitué aux enfants.',
          photoUrl: '/images/animals/golden-retriever.png',
        },
        {
          id: 2,
          nom: 'Luna',
          espece: 'CHAT',
          race: 'Européen doux',
          age: 2,
          statut: 'DISPONIBLE',
          description: 'Chatte sociable, propre et très affectueuse.',
          photoUrl: '/images/animals/sleeping-kitten.png',
        },
        {
          id: 3,
          nom: 'Zephyr',
          espece: 'CHIEN',
          race: 'Collie & Husky Mix',
          age: 1,
          statut: 'DISPONIBLE',
          description: 'Agile, intelligent et idéal pour de longues promenades.',
          photoUrl: '/images/animals/animal-2.png',
        },
        {
          id: 4,
          nom: 'Minou',
          espece: 'CHAT',
          race: 'Siamois croisé',
          age: 2,
          statut: 'EN_ATTENTE_ADOPTION',
          description: 'Très curieuse, adore observer les oiseaux depuis la fenêtre.',
          photoUrl: '/images/animals/sleeping-kitten.png',
        },
      ]

  const total = displayAnimals.length

  // Synchronisation du défilement vertical avec la translation horizontale et la 3D
  const gererScroll = useCallback(() => {
    const conteneur = containerRef.current
    if (!conteneur) return

    const rect = conteneur.getBoundingClientRect()
    const hauteurTotale = conteneur.offsetHeight - window.innerHeight
    if (hauteurTotale <= 0) return

    // Progrès relatif entre 0 et 1 pendant que la section est épinglée
    const brut = -rect.top / hauteurTotale
    const progress = Math.min(Math.max(brut, 0), 1)

    setScrollProgress(progress)
    const calculeIndex = Math.min(Math.round(progress * (total - 1)), total - 1)
    setActiveIndex(calculeIndex)
  }, [total])

  useEffect(() => {
    window.addEventListener('scroll', gererScroll, { passive: true })
    window.addEventListener('resize', gererScroll)
    gererScroll()
    return () => {
      window.removeEventListener('scroll', gererScroll)
      window.removeEventListener('resize', gererScroll)
    }
  }, [gererScroll])

  // Déplacement via flèches : fait défiler la page jusqu'au cran correspondant
  const naviguerVers = (nouvelIndex) => {
    const conteneur = containerRef.current
    if (!conteneur) return

    const indexCible = Math.max(0, Math.min(nouvelIndex, total - 1))
    const ratio = total > 1 ? indexCible / (total - 1) : 0
    const hauteurTotale = conteneur.offsetHeight - window.innerHeight
    const positionAbsolue = conteneur.offsetTop + ratio * hauteurTotale

    window.scrollTo({
      top: positionAbsolue,
      behavior: 'smooth',
    })
  }

  // Largeur de carte et espacement
  const cardWidth = 320
  const gap = 24
  const decalageHorizontal = scrollProgress * (total - 1) * (cardWidth + gap)

  return (
    <section
      ref={containerRef}
      className="relative bg-white"
      style={{ minHeight: `${100 + total * 35}vh` }}
      id="featured-animals"
      data-purpose="featured-animals-showcase"
    >
      {/* Conteneur épinglé (Sticky) pendant la progression du scroll */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-center overflow-hidden py-8">
        {/* Filigrane d'arrière-plan */}
        <div className="absolute top-12 right-0 pointer-events-none select-none opacity-20 -z-0">
          <span className="text-watermark font-extrabold text-brand-peach/40 uppercase">
            SANCTUARY
          </span>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 mb-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="max-w-xl">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-brand-surface border border-brand-burnt/20 text-brand-burnt text-xs font-bold tracking-wider uppercase mb-2">
                Compagnons en vedette
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-dark tracking-tight">
                Ils attendent un{' '}
                <span className="font-serif italic font-normal text-brand-burnt">
                  foyer chaleureux
                </span>
              </h2>
              <p className="mt-2 text-brand-dark/75 text-sm sm:text-base">
                Faites défiler la page verticalement pour explorer nos résidents. Chacun possède son profil et son dossier médical vérifié.
              </p>
            </div>

            {/* Contrôles de navigation flèches */}
            <div className="flex items-center gap-3">
              <div className="text-xs font-bold text-brand-dark/70 bg-brand-cream px-3 py-1.5 rounded-full border border-brand-burnt/15">
                {activeIndex + 1} / {total}
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => naviguerVers(activeIndex - 1)}
                  disabled={activeIndex === 0}
                  aria-label="Animal précédent"
                  className="w-11 h-11 rounded-full border border-brand-burnt/30 flex items-center justify-center text-brand-dark hover:bg-brand-burnt hover:text-white hover:border-brand-burnt transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={() => naviguerVers(activeIndex + 1)}
                  disabled={activeIndex === total - 1}
                  aria-label="Animal suivant"
                  className="w-11 h-11 rounded-full bg-brand-burnt text-white flex items-center justify-center hover:bg-brand-orange shadow-warm-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Piste 3D animée au scroll */}
        <div className="carousel-perspective relative w-full overflow-hidden py-6">
          <div
            ref={trackRef}
            className="carousel-track flex items-stretch gap-6 px-8 sm:px-16"
            style={{
              transform: `translateX(-${decalageHorizontal}px)`,
              transition: 'transform 0.15s ease-out',
            }}
          >
            {displayAnimals.map((animal, idx) => {
              const diff = idx - activeIndex
              let classe3D = 'far'
              if (diff === 0) classe3D = 'active'
              else if (diff === -1) classe3D = 'prev'
              else if (diff === 1) classe3D = 'next'

              const photoSource =
                animal.photoUrl ||
                DEFAULT_ANIMAL_IMAGES[animal.espece] ||
                '/images/animals/golden-retriever.png'

              const statutInfo = STATUTS_ANIMAL[animal.statut] || STATUTS_ANIMAL.DISPONIBLE

              return (
                <div
                  key={animal.id || idx}
                  onClick={() => {
                    if (diff !== 0) naviguerVers(idx)
                  }}
                  className={`carousel-item flex-none w-[290px] sm:w-[320px] bg-brand-card rounded-3xl overflow-hidden border border-brand-burnt/15 shadow-md flex flex-col justify-between ${classe3D} ${diff !== 0 ? 'cursor-pointer hover:border-brand-burnt/40' : ''}`}
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-brand-surface">
                    <img
                      src={photoSource}
                      alt={animal.nom}
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                    />
                    <span
                      className={`absolute top-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border ${statutInfo.badgeClass}`}
                    >
                      {statutInfo.label}
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-baseline justify-between mb-1">
                        <h3 className="text-xl font-bold text-brand-dark">{animal.nom}</h3>
                        <span className="text-xs font-semibold text-brand-dark/60">
                          {animal.age} an{animal.age > 1 ? 's' : ''}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-brand-orange mb-3">
                        {animal.espece} • {animal.race || 'Race croisée'}
                      </p>
                      <p className="text-xs text-brand-dark/75 line-clamp-2 leading-relaxed mb-4">
                        {animal.description || 'Animal affectueux suivi par le sanctuaire Rafiq.'}
                      </p>
                    </div>

                    <Link
                      to={`/animaux/${animal.id}`}
                      className="w-full py-2.5 px-4 rounded-xl bg-white border border-brand-burnt/20 text-brand-dark hover:bg-brand-burnt hover:text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
                    >
                      <span>Voir le profil complet</span>
                      <span>→</span>
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Bouton d'exploration et mascotte */}
        <div className="mt-4 text-center flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/animaux">
            <Bouton variant="primary" size="md">
              <span>Explorer tous les animaux du sanctuaire</span>
            </Bouton>
          </Link>
          <MascotCameo
            mode="wag"
            taille={44}
            bulle="Défilez vers le bas pour découvrir le processus d’adoption !"
          />
        </div>
      </div>
    </section>
  )
}
