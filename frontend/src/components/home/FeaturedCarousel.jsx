import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { STATUTS_ANIMAL } from '../../utils/constantes'
import AnimalPhoto from '../animals/AnimalPhoto'
import Bouton from '../ui/Bouton'
import MascotCameo from '../ui/MascotCameo'

// Hauteur de la barre de navigation épinglée (h-20) : la scène du carrousel
// se cale juste en dessous pour ne jamais passer sous le menu.
const HAUTEUR_NAVBAR = 80

export default function FeaturedCarousel({ animaux = [] }) {
  const containerRef = useRef(null)
  const headerRef = useRef(null)
  const stageRef = useRef(null)
  const trackRef = useRef(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [activeIndex, setActiveIndex] = useState(0)

  const displayAnimals = animaux.slice(0, 5)

  const total = displayAnimals.length

  // Position de défilement à laquelle la scène commence à être épinglée, et
  // distance parcourue pendant qu'elle le reste. On repère la scène via le bas
  // de l'en-tête (dans le flux normal) : l'en-tête peut ainsi défiler
  // normalement sans consommer la progression du carrousel.
  const mesurerZoneEpinglee = useCallback(() => {
    const section = containerRef.current
    const entete = headerRef.current
    const scene = stageRef.current
    if (!section || !entete || !scene) return null

    const positionSection = section.getBoundingClientRect().top + window.scrollY
    // La scène est le frère suivant de l'en-tête : on utilise le bas de
    // l'en-tête (dans le flux normal) comme position statique de la scène.
    // `scene.offsetTop` serait faussé dès que l'élément sticky est décalé.
    const positionScene = entete.getBoundingClientRect().bottom + window.scrollY

    const hauteurDefilement = section.offsetHeight - (positionScene - positionSection) - scene.offsetHeight
    if (hauteurDefilement <= 0) return null

    return {
      debut: positionScene - HAUTEUR_NAVBAR,
      hauteurDefilement,
    }
  }, [])

  // Synchronisation du défilement vertical avec la translation horizontale et la 3D
  const gererScroll = useCallback(() => {
    const zone = mesurerZoneEpinglee()
    if (!zone) return

    // Progrès relatif entre 0 et 1 pendant que la scène est épinglée
    const brut = (window.scrollY - zone.debut) / zone.hauteurDefilement
    const progress = Math.min(Math.max(brut, 0), 1)

    setScrollProgress(progress)
    const calculeIndex = Math.min(Math.round(progress * (total - 1)), total - 1)
    setActiveIndex(calculeIndex)
  }, [mesurerZoneEpinglee, total])

  useEffect(() => {
    window.addEventListener('scroll', gererScroll, { passive: true })
    window.addEventListener('resize', gererScroll)
    // Calcul initial différé d'une frame : évite un setState synchrone dans l'effet
    const frame = window.requestAnimationFrame(gererScroll)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', gererScroll)
      window.removeEventListener('resize', gererScroll)
    }
  }, [gererScroll])

  if (total === 0) {
    return (
      <section id="featured-animals" className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-brand-dark">
            Aucun animal n’est encore présenté
          </h2>
          <p className="mt-2 text-sm text-brand-dark/70">
            Les animaux ajoutés par l’équipe du refuge apparaîtront ici.
          </p>
        </div>
      </section>
    )
  }

  // Déplacement via flèches : fait défiler la page jusqu'au cran correspondant
  const naviguerVers = (nouvelIndex) => {
    const zone = mesurerZoneEpinglee()
    if (!zone) return

    const indexCible = Math.max(0, Math.min(nouvelIndex, total - 1))
    const ratio = total > 1 ? indexCible / (total - 1) : 0

    window.scrollTo({
      top: zone.debut + ratio * zone.hauteurDefilement,
      behavior: 'smooth',
    })
  }

  return (
    <section
      ref={containerRef}
      className="relative bg-white"
      style={{ minHeight: `${100 + total * 35}vh` }}
      id="featured-animals"
      data-purpose="featured-animals-showcase"
    >
      {/* En-tête de section — dans le flux normal pour laisser toute la place
          aux cartes dans la scène épinglée ci-dessous */}
      <div ref={headerRef} className="relative">
        {/* Filigrane d'arrière-plan */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-64 overflow-hidden select-none opacity-20">
          <span className="text-watermark absolute top-6 right-0 font-extrabold text-brand-peach/40 uppercase">
            SANCTUARY
          </span>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 pt-14 sm:px-6 lg:px-8">
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
        </div>
      </div>

      {/* Conteneur épinglé (Sticky) pendant la progression du scroll.
          Sa hauteur est exactement celle disponible sous la navbar : les
          cartes et le bouton d'exploration y sont toujours entièrement visibles. */}
      <div
        ref={stageRef}
        className="sticky top-20 h-[calc(100svh-5rem)] w-full flex flex-col justify-center"
      >
        {/* Contrôles de navigation — conservés dans la scène épinglée */}
        <div className="mx-auto mb-2 flex w-full max-w-7xl items-center justify-end gap-3 px-4 sm:px-6 lg:px-8">
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

        {/* Piste 3D animée au scroll */}
        <div className="carousel-perspective relative w-full overflow-hidden py-6">
          <div
            ref={trackRef}
            className="carousel-track flex items-stretch gap-6 px-8 sm:px-16"
            style={{
              '--carousel-progress': scrollProgress,
              '--carousel-steps': Math.max(total - 1, 0),
            }}
          >
            {displayAnimals.map((animal, idx) => {
              const diff = idx - activeIndex
              let classe3D = 'far'
              if (diff === 0) classe3D = 'active'
              else if (diff === -1) classe3D = 'prev'
              else if (diff === 1) classe3D = 'next'

              const photoSource = animal.photoUrl || ''

              const statutInfo = STATUTS_ANIMAL[animal.statut] || STATUTS_ANIMAL.DISPONIBLE

              return (
                <div
                  key={animal.id || idx}
                  onClick={() => {
                    if (diff !== 0) naviguerVers(idx)
                  }}
                  className={`carousel-item flex-none bg-brand-card rounded-3xl overflow-hidden border border-brand-burnt/15 shadow-md flex flex-col justify-between ${classe3D} ${diff !== 0 ? 'cursor-pointer hover:border-brand-burnt/40' : ''}`}
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-brand-surface">
                    <AnimalPhoto
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
        <div className="mt-2 text-center flex flex-col sm:flex-row items-center justify-center gap-4">
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
