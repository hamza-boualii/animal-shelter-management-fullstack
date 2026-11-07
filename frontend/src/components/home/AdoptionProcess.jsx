import { useEffect, useRef } from 'react'
import { animate, stagger } from 'animejs'
import MascotCameo from '../ui/MascotCameo'

export default function AdoptionProcess() {
  const sectionRef = useRef(null)
  const headerRef = useRef(null)
  const cardsRef = useRef(null)

  const etapes = [
    {
      numero: '01',
      titre: 'Découvrir & Parcourir',
      description:
        'Accès libre à l’ensemble du catalogue des animaux du refuge avec observations des soignants, tempérament et besoins réels, sans compte requis pour explorer.',
      badge: 'Profils Transparents',
    },
    {
      numero: '02',
      titre: 'S’informer & Dossier Médical',
      description:
        'Historique vétérinaire documenté : stérilisation, vaccinations, allergies et carnet de santé complet accessible en toute transparence.',
      badge: 'Santé & Suivi Vétérinaire',
    },
    {
      numero: '03',
      titre: 'Demande d’Adoption Réfléchie',
      description:
        'Création d’un compte Adoptant et envoi d’une demande motivée détaillant votre environnement pour veiller au bien-être mutuel.',
      badge: 'Alignement du Foyer',
    },
    {
      numero: '04',
      titre: 'Rencontre au Sanctuaire',
      description:
        'Contact direct par l’équipe de soignants du refuge pour planifier une visite dans nos jardins sensoriels et confirmer le lien avant l’adoption définitive.',
      badge: 'Rencontre en Sanctuaire',
    },
  ]

  useEffect(() => {
    const section = sectionRef.current
    const header = headerRef.current
    const cardsContainer = cardsRef.current
    if (!section) return

    const cardElements = cardsContainer ? Array.from(cardsContainer.children) : []

    // Initialiser les éléments en attente d'apparition
    if (header) {
      header.style.opacity = '0'
      header.style.transform = 'translateY(24px)'
    }
    cardElements.forEach((card) => {
      card.style.opacity = '0'
      card.style.transform = 'translateY(30px)'
    })

    const triggerAnimation = () => {
      try {
        if (header) {
          animate(header, {
            opacity: [0, 1],
            translateY: [24, 0],
            duration: 700,
            ease: 'outCubic',
          })
        }

        if (cardElements.length > 0) {
          animate(cardElements, {
            opacity: [0, 1],
            translateY: [30, 0],
            duration: 700,
            ease: 'outCubic',
            delay: stagger(130, { start: 200 }),
          })
        }
      } catch {
        // Fallback gracieux en cas d'indisponibilité du moteur d'animation
        if (header) {
          header.style.opacity = '1'
          header.style.transform = 'none'
        }
        cardElements.forEach((card) => {
          card.style.opacity = '1'
          card.style.transform = 'none'
        })
      }
    }

    // Utiliser IntersectionObserver pour déclencher l'animation dès l'entrée dans le viewport
    if (typeof IntersectionObserver !== 'undefined') {
      const observer = new IntersectionObserver(
        (entries) => {
          const [entry] = entries
          if (entry.isIntersecting) {
            triggerAnimation()
            observer.disconnect()
          }
        },
        { threshold: 0.15 }
      )

      observer.observe(section)
      return () => observer.disconnect()
    } else {
      triggerAnimation()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="py-20 lg:py-24 bg-brand-surface relative overflow-hidden"
      id="adoption-process"
    >
      {/* Filigrane d'arrière-plan */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden -z-0 opacity-25">
        <span className="text-watermark font-extrabold text-[#DDC3AF]/40 uppercase tracking-tighter">
          PROCESS
        </span>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* En-tête de section avec mascotte */}
        <div ref={headerRef} className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-burnt/10 border border-brand-burnt/20 text-brand-burnt text-xs font-bold tracking-wider uppercase mb-3">
            <span>🐾</span>
            Transparence &amp; Bienveillance
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-brand-dark tracking-tight">
            Une adoption fondée sur la{' '}
            <span className="font-serif italic font-normal text-brand-burnt">
              confiance &amp; le soin
            </span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-brand-dark/75 leading-relaxed">
            Nous croyons qu’un refuge éthique repose sur une transparence absolue. Notre parcours en 4 étapes garantit une rencontre sereine et une adoption durable.
          </p>

          <div className="mt-4 flex justify-center">
            <MascotCameo
              mode="peek"
              taille={48}
              bulle="Les soignants vous accompagnent à chaque étape de votre visite !"
            />
          </div>
        </div>

        {/* 4 Étapes numérotées au design soigné */}
        <div ref={cardsRef} className="space-y-4">
          {etapes.map((etape) => (
            <div
              key={etape.numero}
              className="group bg-white hover:bg-white/95 p-6 sm:p-7 rounded-3xl border border-brand-burnt/15 shadow-sm transition-all duration-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 hover:shadow-warm-md hover:border-brand-burnt/30"
            >
              <div className="flex items-start sm:items-center gap-6">
                <span className="text-3xl sm:text-4xl font-extrabold text-brand-peach group-hover:text-brand-burnt transition-colors">
                  {etape.numero}
                </span>
                <div>
                  <h3 className="text-xl font-bold text-brand-dark group-hover:text-brand-burnt transition-colors">
                    {etape.titre}
                  </h3>
                  <p className="mt-1 text-sm sm:text-base text-brand-dark/70 max-w-2xl leading-relaxed">
                    {etape.description}
                  </p>
                </div>
              </div>
              <div className="shrink-0 self-end md:self-center">
                <span className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-brand-burnt bg-brand-cream px-4 py-2 rounded-full border border-brand-burnt/20">
                  {etape.badge}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
