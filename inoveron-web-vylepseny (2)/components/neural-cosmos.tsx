'use client'

import { useEffect, useRef } from 'react'
import { MotionValue, useMotionValueEvent, useReducedMotion } from 'framer-motion'

type NeuralCosmosProps = {
  progress: MotionValue<number>
}

type Point = {
  startX: number
  startY: number
  brainX: number
  brainY: number
  size: number
  phase: number
}

type Star = {
  x: number
  y: number
  size: number
  alpha: number
  phase: number
}

function seededRandom(seed: number) {
  let state = seed >>> 0
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0
    return state / 4294967296
  }
}

function smoothstep(from: number, to: number, value: number) {
  const x = Math.max(0, Math.min(1, (value - from) / (to - from)))
  return x * x * (3 - 2 * x)
}

function createScene(pointCount: number) {
  const random = seededRandom(20260830)
  const points: Point[] = []

  while (points.length < pointCount) {
    const x = random() * 2 - 1
    const y = random() * 1.65 - 0.82
    const inside = (x / 0.98) ** 2 + (y / 0.8) ** 2 < 1
    const lowerTaper = y < 0.45 || Math.abs(x) < 0.72 - (y - 0.45) * 1.25
    const fissure = Math.abs(x) > 0.045 + Math.max(0, y + 0.1) * 0.035

    if (inside && lowerTaper && fissure) {
      points.push({
        startX: random(),
        startY: random(),
        brainX: x,
        brainY: y,
        size: 0.8 + random() * 1.8,
        phase: random() * Math.PI * 2,
      })
    }
  }

  const stars: Star[] = Array.from({ length: 105 }, () => ({
    x: random(),
    y: random(),
    size: 0.4 + random() * 1.4,
    alpha: 0.15 + random() * 0.55,
    phase: random() * Math.PI * 2,
  }))

  return { points, stars }
}

const fullScene = createScene(88)
const compactScene = createScene(58)

export function NeuralCosmos({ progress }: NeuralCosmosProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const progressRef = useRef(0)
  const pointerRef = useRef({ x: 0, y: 0, active: false })
  const reduceMotion = useReducedMotion()

  useMotionValueEvent(progress, 'change', (latest) => {
    progressRef.current = latest
  })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext('2d')
    if (!context) return

    let frame = 0
    let width = 0
    let height = 0
    let dpr = 1
    let running = true

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height
      dpr = Math.min(window.devicePixelRatio || 1, 1.6)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const onPointerMove = (event: PointerEvent) => {
      pointerRef.current = {
        x: event.clientX / Math.max(1, window.innerWidth) - 0.5,
        y: event.clientY / Math.max(1, window.innerHeight) - 0.5,
        active: event.pointerType !== 'touch',
      }
    }

    const onVisibility = () => {
      running = document.visibilityState === 'visible'
      if (running) frame = requestAnimationFrame(draw)
    }

    const draw = (time: number) => {
      if (!running) return

      context.clearRect(0, 0, width, height)
      const scene = width < 720 ? compactScene : fullScene
      const rawProgress = reduceMotion ? 0.52 : progressRef.current
      const assemble = reduceMotion ? 1 : smoothstep(0.055, 0.72, rawProgress)
      const dissolve = reduceMotion ? 0 : smoothstep(0.9, 0.995, rawProgress)
      const networkAlpha = Math.max(0, assemble * (1 - dissolve))
      const pointer = pointerRef.current
      const parallaxX = pointer.active && !reduceMotion ? pointer.x * 24 : 0
      const parallaxY = pointer.active && !reduceMotion ? pointer.y * 18 : 0

      const nebulaX = width * (width > 900 ? 0.72 : 0.55) + parallaxX * 0.5
      const nebulaY = height * 0.46 + parallaxY * 0.5
      const nebulaRadius = Math.min(width * 0.55, height * 0.76)
      const nebula = context.createRadialGradient(
        nebulaX,
        nebulaY,
        0,
        nebulaX,
        nebulaY,
        nebulaRadius,
      )
      nebula.addColorStop(0, `rgba(100, 43, 170, ${0.16 + networkAlpha * 0.08})`)
      nebula.addColorStop(0.42, 'rgba(31, 126, 172, 0.075)')
      nebula.addColorStop(1, 'rgba(5, 7, 15, 0)')
      context.fillStyle = nebula
      context.fillRect(0, 0, width, height)

      for (const star of scene.stars) {
        const twinkle = 0.72 + Math.sin(time * 0.0012 + star.phase) * 0.28
        const x = star.x * width - parallaxX * star.size * 0.18
        const y = star.y * height - parallaxY * star.size * 0.18
        context.beginPath()
        context.arc(x, y, star.size, 0, Math.PI * 2)
        context.fillStyle = `rgba(139, 224, 255, ${star.alpha * twinkle * (1 - dissolve * 0.65)})`
        context.fill()
      }

      const brainScale = Math.min(width > 900 ? width * 0.29 : width * 0.43, height * 0.39)
      const centerX = width * (width > 900 ? 0.72 : 0.56) + parallaxX
      const centerY = height * 0.47 + parallaxY
      const current = scene.points.map((point) => {
        const targetX = centerX + point.brainX * brainScale
        const targetY = centerY + point.brainY * brainScale
        let x = point.startX * width + (targetX - point.startX * width) * assemble
        let y = point.startY * height + (targetY - point.startY * height) * assemble

        if (dissolve > 0) {
          const dx = targetX - centerX
          const dy = targetY - centerY
          x += dx * dissolve * 0.72 + Math.sin(point.phase) * dissolve * 55
          y += dy * dissolve * 0.72 + Math.cos(point.phase) * dissolve * 55
        }

        return { x, y, point }
      })

      if (networkAlpha > 0.03) {
        context.lineWidth = 0.65
        for (let i = 0; i < current.length; i += 1) {
          for (let j = i + 1; j < current.length; j += 1) {
            const a = current[i]
            const b = current[j]
            const dx = a.x - b.x
            const dy = a.y - b.y
            const distance = Math.hypot(dx, dy)
            const maxDistance = width < 720 ? 82 : 102
            if (distance < maxDistance) {
              const strength = (1 - distance / maxDistance) * networkAlpha * 0.36
              context.beginPath()
              context.moveTo(a.x, a.y)
              context.lineTo(b.x, b.y)
              context.strokeStyle = `rgba(101, 211, 255, ${strength})`
              context.stroke()
            }
          }
        }
      }

      const pulseProgress = smoothstep(0.58, 0.86, rawProgress)
      const waveX = -1.25 + pulseProgress * 2.5

      for (const item of current) {
        const pulseDistance = Math.abs(item.point.brainX - waveX)
        const pulse = rawProgress > 0.55 && rawProgress < 0.89
          ? Math.max(0, 1 - pulseDistance / 0.24)
          : 0
        const breathe = 0.85 + Math.sin(time * 0.0018 + item.point.phase) * 0.15
        const alpha = (0.28 + assemble * 0.56 + pulse * 0.16) * (1 - dissolve) * breathe
        const radius = item.point.size + pulse * 3.2

        if (pulse > 0.08) {
          const glow = context.createRadialGradient(item.x, item.y, 0, item.x, item.y, radius * 5)
          glow.addColorStop(0, `rgba(255, 150, 228, ${pulse * 0.5})`)
          glow.addColorStop(1, 'rgba(99, 216, 255, 0)')
          context.beginPath()
          context.arc(item.x, item.y, radius * 5, 0, Math.PI * 2)
          context.fillStyle = glow
          context.fill()
        }

        context.beginPath()
        context.arc(item.x, item.y, radius, 0, Math.PI * 2)
        context.fillStyle = pulse > 0.2
          ? `rgba(255, 202, 241, ${alpha})`
          : `rgba(126, 224, 255, ${alpha})`
        context.fill()
      }

      if (!reduceMotion) frame = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    document.addEventListener('visibilitychange', onVisibility)
    frame = requestAnimationFrame(draw)

    return () => {
      running = false
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [reduceMotion])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 size-full"
      aria-hidden="true"
    />
  )
}
