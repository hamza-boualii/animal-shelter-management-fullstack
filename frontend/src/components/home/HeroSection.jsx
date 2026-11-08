import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { animate, stagger } from 'animejs'
import Bouton from '../ui/Bouton'

export default function HeroSection({ totalAnimaux = 0 }) {
  const sectionRef = useRef(null)
  const watermarkRef = useRef(null)
  const badgeRef = useRef(null)
  const titreRef = useRef(null)
  const sousTitreRef = useRef(null)
  const ctaRef = useRef(null)
  const metriquesRef = useRef(null)
  const imageRef = useRef(null)

  useEffect(() => {
    // Entrée orchestrée — cascade cinématique à l'apparition
    const elements = [
      badgeRef.current,
      titreRef.current,
      sousTitreRef.current,
      ctaRef.current,
      metriquesRef.current,
    ].filter(Boolean)

    // Initialiser les éléments hors-écran
    elements.forEach((el) => {
      el.style.opacity = '0'
      el.style.transform = 'translateY(28px)'
    })
    if (imageRef.current) {
      imageRef.current.style.opacity = '0'
      imageRef.current.style.transform = 'scale(0.92) translateY(20px)'
    }

    // Déclencher l'animation après un court délai (garantir le rendu initial)
    const timer = setTimeout(() => {
      try {
        animate(elements, {
          opacity: [0, 1],
          translateY: [28, 0],
          duration: 700,
          ease: 'outCubic',
          delay: stagger(120, { start: 100 }),
        })

        if (imageRef.current) {
          animate(imageRef.current, {
            opacity: [0, 1],
            scale: [0.92, 1],
            translateY: [20, 0],
            duration: 900,
            ease: 'outCubic',
            delay: 350,
          })
        }
      } catch {
        // Fallback gracieux : rendre les éléments visibles sans animation
        elements.forEach((el) => {
          el.style.opacity = '1'
          el.style.transform = 'none'
        })
        if (imageRef.current) {
          imageRef.current.style.opacity = '1'
          imageRef.current.style.transform = 'none'
        }
      }
    }, 60)

    // Effet parallaxe subtil sur le filigrane "COMPANIONS" lors du scroll
    const onScroll = () => {
      if (!watermarkRef.current) return
      const scrollY = window.scrollY
      if (scrollY < 1200) {
        watermarkRef.current.style.transform = `translateY(${scrollY * 0.15}px)`
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      clearTimeout(timer)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <section ref={sectionRef} className="relative overflow-hidden pt-8 pb-16 lg:py-20" id="hero">
      {/* Filigrane d'arrière-plan textuel Stitch avec parallaxe */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden -z-10 opacity-30">
        <span
          ref={watermarkRef}
          className="text-watermark font-extrabold text-[#E2CDBC]/35 uppercase tracking-tighter will-change-transform"
        >
          COMPANIONS
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Colonne gauche : Titres éditoriaux & Call to Actions */}
          <div className="lg:col-span-7 space-y-6">
            <div
              ref={badgeRef}
              className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-brand-burnt/10 border border-brand-burnt/20 text-brand-burnt text-xs font-bold uppercase tracking-wider"
            >
              <span className="w-2 h-2 rounded-full bg-brand-burnt animate-pulse"></span>
              Ouvert aux adoptions bienveillantes
            </div>

            <h1
              ref={titreRef}
              className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-brand-dark leading-[1.08]"
            >
              Là où commencent les <br />
              <span className="font-serif italic font-normal text-brand-burnt">foyers</span> pour la vie.
            </h1>

            <p
              ref={sousTitreRef}
              className="text-base sm:text-lg text-brand-dark/80 max-w-xl font-normal leading-relaxed"
            >
              Chaque animal mérite un compagnon. Rafiq relie les animaux secourus avec des familles aimantes et engagées à travers un sanctuaire transparent, chaleureux et respectueux du rythme de chaque animal.
            </p>

            <div ref={ctaRef} className="pt-2 flex flex-wrap items-center gap-4">
              <Link to="/animaux">
                <Bouton variant="primary" size="lg" className="group">
                  <span>Explorer les animaux</span>
                  <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
                </Bouton>
              </Link>

              <a href="#adoption-process">
                <Bouton variant="secondary" size="lg">
                  <svg className="w-5 h-5 mr-2 text-brand-burnt inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                  Comment ça marche
                </Bouton>
              </a>
            </div>

            {/* Métriques réelles issues du sanctuaire */}
            <div ref={metriquesRef} className="pt-6 grid grid-cols-2 sm:grid-cols-3 gap-3 border-t border-brand-burnt/15">
              <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-brand-burnt/10 shadow-sm">
                <p className="text-2xl font-black text-brand-burnt">
                  {totalAnimaux > 0 ? totalAnimaux : '10+'}
                </p>
                <p className="text-xs text-brand-dark/70 font-medium">Animaux accueillis</p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-brand-burnt/10 shadow-sm">
                <p className="text-2xl font-black text-brand-dark">10h–18h</p>
                <p className="text-xs text-brand-dark/70 font-medium">Visites 7j/7</p>
              </div>

              <div className="col-span-2 sm:col-span-1 bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-brand-burnt/10 shadow-sm">
                <p className="text-2xl font-black text-brand-orange">100%</p>
                <p className="text-xs text-brand-dark/70 font-medium">Suivi médical complet</p>
              </div>
            </div>
          </div>

          {/* Colonne droite : Photographie principale du sanctuaire */}
          <div className="lg:col-span-5 relative">
            <div className="absolute -top-6 -right-6 w-80 h-80 bg-brand-peach/30 rounded-full blur-3xl -z-10"></div>
            
            <div
              ref={imageRef}
              className="relative mx-auto rounded-[2.5rem] overflow-hidden border-8 border-white shadow-2xl bg-brand-surface aspect-[4/5] max-w-md lg:max-w-none group"
            >
              <img
                src="/images/homepage-hero.jpg"
                alt="Compagnon en attente d'adoption au sanctuaire Rafiq"
                className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
