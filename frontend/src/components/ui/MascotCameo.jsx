import { useEffect, useRef } from 'react'
import { animate } from 'animejs'

/**
 * Composant mascotte animé 2D avec Anime.js v4.
 *
 * Note technique d'architecture : La mascotte source est une image matricielle aplatie (PNG).
 * Les membres ou la queue individuels ne peuvent être articulés séparément sans découpage
 * en calques SVG distincts. En revanche, les cinématiques globales (translation, rebond,
 * inclinaison/wagging, apparition en surgissement, respiration posée 'sit') sont orchestrées
 * avec précision pour donner vie au compagnon doré.
 */
export default function MascotCameo({
  mode = 'float', // 'float' | 'bounce' | 'wag' | 'peek' | 'sit'
  taille = 60,
  bulle = null,
  titreBulle = 'Rafiq Scout',
  className = '',
}) {
  const conteneurRef = useRef(null)
  const animRef = useRef(null)

  useEffect(() => {
    const el = conteneurRef.current
    if (!el) return

    try {
      if (mode === 'float') {
        animRef.current = animate(el, {
          translateY: [-4, 4],
          duration: 2200,
          loop: true,
          alternate: true,
          ease: 'inOutQuad',
        })
      } else if (mode === 'bounce') {
        animRef.current = animate(el, {
          translateY: [0, -12, 0],
          scale: [1, 1.05, 1],
          duration: 950,
          loop: true,
          ease: 'outQuad',
        })
      } else if (mode === 'wag') {
        animRef.current = animate(el, {
          rotate: [-6, 6],
          duration: 650,
          loop: true,
          alternate: true,
          ease: 'inOutSine',
        })
      } else if (mode === 'peek') {
        animRef.current = animate(el, {
          translateX: [-10, 0],
          rotate: [-4, 2],
          duration: 1600,
          loop: true,
          alternate: true,
          ease: 'inOutCubic',
        })
      } else if (mode === 'sit') {
        animRef.current = animate(el, {
          scale: [1, 1.03, 1],
          translateY: [0, -2, 0],
          duration: 2400,
          loop: true,
          ease: 'inOutQuad',
        })
      }
    } catch {
      // Fallback gracieux si l'environnement bloque Anime.js
    }

    return () => {
      try {
        if (animRef.current && typeof animRef.current.pause === 'function') {
          animRef.current.pause()
        }
      } catch {
        // no-op
      }
    }
  }, [mode])

  return (
    <div className={`inline-flex items-center gap-3.5 ${className}`}>
      <div
        ref={conteneurRef}
        className="shrink-0 select-none flex items-center justify-center will-change-transform cursor-pointer transition-transform hover:scale-110 active:scale-95 duration-200"
        style={{ width: `${taille}px`, height: `${taille}px` }}
      >
        <img
          src="/images/mascot/rafiq-mascot.png"
          alt="Mascotte Rafiq Scout"
          className="w-full h-full object-contain filter drop-shadow-md pointer-events-none"
          loading="lazy"
        />
      </div>
      {bulle && (
        <div className="bg-white p-3.5 rounded-2xl shadow-warm-lg border border-brand-burnt/15 max-w-xs transition-all duration-300 hover:shadow-warm-md">
          {titreBulle && (
            <p className="text-[11px] font-bold uppercase tracking-wider text-brand-burnt mb-0.5">
              {titreBulle}
            </p>
          )}
          <p className="text-xs font-semibold text-brand-dark leading-snug">{bulle}</p>
        </div>
      )}
    </div>
  )
}
