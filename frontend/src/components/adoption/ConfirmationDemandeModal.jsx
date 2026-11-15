import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { animate } from 'animejs'
import { ESPECES } from '../../utils/constantes'
import AnimalPhoto from '../animals/AnimalPhoto'

const SELECTEUR_FOCUS =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

export default function ConfirmationDemandeModal({ animal, telephone, onFermer }) {
  const panneauRef = useRef(null)
  const elementPrecedentRef = useRef(null)

  useEffect(() => {
    elementPrecedentRef.current = document.activeElement
    const debordementPrecedent = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const panneau = panneauRef.current
    panneau?.focus()
    if (panneau && !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      try {
        animate(panneau, {
          opacity: [0, 1],
          translateY: [24, 0],
          scale: [0.98, 1],
          duration: 420,
          ease: 'outCubic',
        })
      } catch {
        panneau.style.opacity = '1'
      }
    }

    function gererClavier(e) {
      if (e.key === 'Escape') {
        e.preventDefault()
        onFermer()
        return
      }

      if (e.key !== 'Tab' || !panneau) return

      const focusables = Array.from(panneau.querySelectorAll(SELECTEUR_FOCUS)).filter(
        (element) => element.getClientRects().length > 0
      )

      if (focusables.length === 0) {
        e.preventDefault()
        panneau.focus()
        return
      }

      const premier = focusables[0]
      const dernier = focusables[focusables.length - 1]
      const actif = document.activeElement

      if (!panneau.contains(actif)) {
        e.preventDefault()
        premier.focus()
        return
      }

      if (e.shiftKey && (actif === premier || actif === panneau)) {
        e.preventDefault()
        dernier.focus()
      } else if (!e.shiftKey && actif === dernier) {
        e.preventDefault()
        premier.focus()
      }
    }

    document.addEventListener('keydown', gererClavier)

    return () => {
      document.removeEventListener('keydown', gererClavier)
      document.body.style.overflow = debordementPrecedent
      if (elementPrecedentRef.current instanceof HTMLElement) {
        elementPrecedentRef.current.focus()
      }
    }
  }, [onFermer])

  const especeInfo = ESPECES[animal?.espece] || { label: animal?.espece || 'Animal' }
  const photo = animal?.photoUrl || ''
  const age = Number(animal?.age)
  const ageLabel = Number.isFinite(age) ? `${age} an${age > 1 ? 's' : ''}` : 'Âge non renseigné'
  const telephoneAffiche = telephone?.trim()

  return createPortal(
    <div
      className="fixed inset-0 z-[60] overflow-y-auto bg-brand-dark/60 backdrop-blur-md animate-fade-in"
      onClick={onFermer}
    >
      <div className="flex min-h-full items-center justify-center p-4 py-5 sm:p-5">
        <div
          ref={panneauRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirmation-demande-titre"
          aria-describedby="confirmation-demande-description confirmation-demande-clarification"
          tabIndex={-1}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-3xl rounded-3xl border border-brand-stone bg-white p-5 shadow-2xl outline-none"
        >
          <button
            type="button"
            onClick={onFermer}
            aria-label="Fermer la confirmation"
            className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-brand-card text-brand-taupe transition-colors hover:bg-brand-surface hover:text-brand-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-burnt/40 focus-visible:ring-offset-2"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="text-center md:grid md:grid-cols-2 md:items-center md:gap-6">
            <div className="md:text-left">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-brand-forest shadow-inner md:mx-0">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path d="M4.5 12.75l6 6 9-13.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              <h2
                id="confirmation-demande-titre"
                className="text-xl font-bold tracking-tight text-brand-dark"
              >
                Votre demande a bien été envoyée !
              </h2>
              <p
                id="confirmation-demande-description"
                className="mt-1.5 text-sm leading-relaxed text-brand-dark/70"
              >
                Merci de faire un pas vers une belle rencontre.
              </p>

              <div className="mt-3 flex items-center gap-3 rounded-2xl border border-brand-stone bg-brand-card p-2.5 text-left">
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-brand-stone bg-brand-surface">
                  <AnimalPhoto
                    src={photo}
                    alt={animal?.nom || 'Animal'}
                    className="h-12 w-12 rounded-xl object-cover object-center"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-bold leading-snug text-brand-dark">
                    {animal?.nom || 'Cet animal'}
                  </h3>
                  <p className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs font-medium text-brand-taupe">
                    <span>{especeInfo.label}</span>
                    <span aria-hidden="true">•</span>
                    <span>{animal?.race || 'Race croisée'}</span>
                    <span aria-hidden="true">•</span>
                    <span>{ageLabel}</span>
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="mt-3 space-y-2 rounded-2xl border border-brand-stone bg-brand-cream/70 p-3 text-left">
                <p className="text-xs font-bold uppercase tracking-wider text-brand-burnt">Et maintenant ?</p>
                <p className="text-xs leading-relaxed text-brand-dark/80">
                  Notre équipe va examiner votre demande avec attention. Nous vous contacterons par téléphone au
                  numéro indiqué afin d’échanger avec vous sur votre projet d’adoption et les prochaines étapes.
                </p>
                <div className="flex items-center gap-2.5 rounded-xl border border-brand-stone bg-white p-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-burnt text-white shadow-warm-sm">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path
                        d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-taupe">
                      Téléphone de rappel
                    </p>
                    <p className="mt-0.5 break-words text-base font-bold tracking-wide text-brand-dark">
                      {telephoneAffiche || 'Numéro non renseigné'}
                    </p>
                  </div>
                </div>
              </div>

              <p
                id="confirmation-demande-clarification"
                className="mt-2 px-1 text-left text-xs leading-relaxed text-brand-taupe"
              >
                L’envoi de votre demande ne signifie pas que l’adoption est confirmée. Chaque demande est étudiée
                individuellement par notre équipe.
              </p>

              <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3 md:grid-cols-1">
                <Link
                  to="/"
                  className="inline-flex h-10 w-full items-center justify-center whitespace-nowrap rounded-full bg-brand-burnt px-4 text-sm font-semibold text-white shadow-warm-md transition-all hover:bg-[#B0452A] hover:shadow-warm-lg active:scale-[0.98] focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-burnt/25"
                >
                  Retour à l’accueil
                </Link>
                <Link
                  to="/animaux"
                  className="inline-flex h-10 w-full items-center justify-center whitespace-nowrap rounded-full border border-brand-stone bg-brand-cream px-4 text-sm font-semibold text-brand-dark transition-all hover:border-brand-burnt/40 hover:bg-brand-surface active:scale-[0.98] focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-burnt/20"
                >
                  Découvrir les autres animaux
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
