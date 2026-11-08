import { useEffect, useRef, useState } from 'react'
import { useLocation, useOutlet } from 'react-router-dom'
import { animate, remove, cleanInlineStyles } from 'animejs'

function usePrefersReducedMotion() {
  const [prefersReduced, setPrefersReduced] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const listener = (e) => setPrefersReduced(e.matches)
    mediaQuery.addEventListener('change', listener)
    return () => mediaQuery.removeEventListener('change', listener)
  }, [])

  return prefersReduced
}

export default function PersonnelPageTransition() {
  const location = useLocation()
  const currentOutlet = useOutlet()
  const prefersReduced = usePrefersReducedMotion()

  const [activePath, setActivePath] = useState(location.pathname)
  const [activeOutlet, setActiveOutlet] = useState(currentOutlet)

  const containerRef = useRef(null)
  const activeAnimationRef = useRef(null)
  const isInitialMountRef = useRef(true)

  // Exit animation when navigating between personnel sections
  useEffect(() => {
    if (prefersReduced) return
    if (location.pathname === activePath) return

    // Cancel ongoing animation if user navigates rapidly
    if (activeAnimationRef.current) {
      try {
        activeAnimationRef.current.revert()
      } catch {
        // ignore
      }
      activeAnimationRef.current = null
    }

    if (containerRef.current) {
      try {
        remove(containerRef.current)
      } catch {
        // ignore
      }

      activeAnimationRef.current = animate(containerRef.current, {
        opacity: [1, 0],
        translateY: [0, -6],
        duration: 120,
        ease: 'inQuad',
        onComplete: () => {
          activeAnimationRef.current = null
          setActivePath(location.pathname)
          setActiveOutlet(currentOutlet)
        },
      })
    } else {
      setActivePath(location.pathname)
      setActiveOutlet(currentOutlet)
    }

    return () => {
      if (activeAnimationRef.current) {
        try {
          activeAnimationRef.current.revert()
        } catch {
          // ignore
        }
        activeAnimationRef.current = null
      }
    }
  }, [location.pathname, activePath, currentOutlet, prefersReduced])

  // Entrance animation whenever activePath updates
  useEffect(() => {
    if (prefersReduced || !containerRef.current) {
      if (containerRef.current) {
        containerRef.current.style.opacity = '1'
        containerRef.current.style.transform = 'none'
      }
      return
    }

    if (activeAnimationRef.current) {
      try {
        activeAnimationRef.current.revert()
      } catch {
        // ignore
      }
      activeAnimationRef.current = null
    }

    try {
      remove(containerRef.current)
    } catch {
      // ignore
    }

    const isInitial = isInitialMountRef.current
    if (isInitial) {
      isInitialMountRef.current = false
    }

    activeAnimationRef.current = animate(containerRef.current, {
      opacity: [0, 1],
      translateY: isInitial ? [0, 0] : [8, 0],
      duration: isInitial ? 220 : 200,
      ease: 'outCubic',
      onComplete: () => {
        activeAnimationRef.current = null
        if (containerRef.current) {
          try {
            cleanInlineStyles(containerRef.current)
          } catch {
            containerRef.current.style.transform = ''
            containerRef.current.style.opacity = ''
          }
        }
      },
    })

    return () => {
      if (activeAnimationRef.current) {
        try {
          activeAnimationRef.current.revert()
        } catch {
          // ignore
        }
        activeAnimationRef.current = null
      }
    }
  }, [activePath, prefersReduced])

  if (prefersReduced) {
    return <div>{currentOutlet}</div>
  }

  const contentToRender = location.pathname === activePath ? currentOutlet : activeOutlet

  return (
    <div ref={containerRef} className="will-change-[opacity,transform]">
      {contentToRender}
    </div>
  )
}
