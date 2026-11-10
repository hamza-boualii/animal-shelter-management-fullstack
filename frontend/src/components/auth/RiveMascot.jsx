import { useEffect } from 'react'
import {
  Alignment,
  Fit,
  Layout,
  useStateMachineInput,
  useRive,
} from '@rive-app/react-canvas'
import riveFile from '../../rive/cat-and-dog-toggle.riv?url'

const riveLayout = new Layout({
  fit: Fit.Contain,
  alignment: Alignment.Center,
})

const STATE_MACHINE = 'State Machine 1'

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

export default function RiveMascot({ variant = 'cat' }) {
  const { rive, RiveComponent } = useRive({
    src: riveFile,
    artboard: 'Artboard',
    stateMachine: STATE_MACHINE,
    autoplay: true,
    layout: riveLayout,
    shouldResizeCanvasToContainer: true,
  })

  useStateMachineInput(rive, STATE_MACHINE, 'cat/dog', variant === 'dog')

  useEffect(() => {
    if (!rive) return

    let frame = null
    let pointer = null

    const deplacerMascotte = () => {
      frame = null

      const machine = rive.animator?.stateMachines?.find((item) => item.name === STATE_MACHINE)
      const instance = machine?.instance
      const bounds = rive.artboard?.bounds
      const canvas = rive.canvas

      if (!pointer || !instance || !bounds || !canvas) return

      const rect = canvas.getBoundingClientRect()
      if (!rect.width || !rect.height) return

      const largeur = bounds.maxX - bounds.minX
      const hauteur = bounds.maxY - bounds.minY
      const echelle = Math.min(rect.width / largeur, rect.height / hauteur)
      const decalageX = (rect.width - largeur * echelle) / 2
      const decalageY = (rect.height - hauteur * echelle) / 2

      const x = clamp((pointer.x - rect.left - decalageX) / echelle, bounds.minX, bounds.maxX)
      const y = clamp((pointer.y - rect.top - decalageY) / echelle, bounds.minY, bounds.maxY)

      instance.pointerMove(x, y, 0)
    }

    const suivrePointeur = (event) => {
      pointer = { x: event.clientX, y: event.clientY }
      if (frame === null) frame = requestAnimationFrame(deplacerMascotte)
    }

    window.addEventListener('pointermove', suivrePointeur, { passive: true })

    return () => {
      window.removeEventListener('pointermove', suivrePointeur)
      if (frame !== null) cancelAnimationFrame(frame)
    }
  }, [rive])

  return (
    <div className="pointer-events-none h-40 w-40">
      <RiveComponent
        className="pointer-events-none h-full w-full"
        role="img"
        aria-label={variant === 'dog' ? 'Mascotte chien Rafiq' : 'Mascotte chat Rafiq'}
      />
    </div>
  )
}
