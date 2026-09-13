'use client'

import { useEffect, useRef, type RefObject } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  buildNeuralMorphGeometry,
  morphPositions,
  smoothstep,
  writeEdgePositions,
} from '@/lib/neural-morph/geometry'
import {
  createGlowTexture,
  createLineMaterial,
  createPointsMaterial,
} from '@/lib/neural-morph/materials'

gsap.registerPlugin(ScrollTrigger)

type NeuralMorphSceneProps = {
  sectionRef: RefObject<HTMLElement | null>
}

/** Premium minimalist density — breathable network, not a light storm. */
function particleBudget() {
  if (typeof window === 'undefined') return 700
  const w = window.innerWidth
  if (w < 720) return 560
  if (w < 1100) return 680
  return 760
}

export function NeuralMorphScene({ sectionRef }: NeuralMorphSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const section = sectionRef.current
    if (!canvas || !section) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const count = particleBudget()

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
    renderer.setClearColor(0x000000, 0)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6))

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100)
    camera.position.set(0.15, 0.04, 5.6)

    const { start, end, colors, edgeIndex } = buildNeuralMorphGeometry(count)
    const current = new Float32Array(start)

    const pointsGeo = new THREE.BufferGeometry()
    pointsGeo.setAttribute('position', new THREE.BufferAttribute(current, 3))
    pointsGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const glowMap = createGlowTexture()
    const baseSize = 0.09
    const pointsMat = createPointsMaterial(baseSize)
    pointsMat.opacity = 0.78
    if (glowMap) {
      pointsMat.map = glowMap
      pointsMat.alphaMap = glowMap
    }

    const root = new THREE.Group()
    scene.add(root)

    const points = new THREE.Points(pointsGeo, pointsMat)
    root.add(points)

    const linePositions = new Float32Array(edgeIndex.length * 3)
    writeEdgePositions(linePositions, current, edgeIndex)
    const lineGeo = new THREE.BufferGeometry()
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3))

    // Single subtle edge layer (cyan) — no dual-line density
    const lineMat = createLineMaterial()
    lineMat.color.set('#7ecfff')
    const lines = new THREE.LineSegments(lineGeo, lineMat)
    root.add(lines)

    const proxy = { t: reduceMotion ? 1 : 0 }
    let tween: gsap.core.Tween | null = null

    if (!reduceMotion) {
      tween = gsap.to(proxy, {
        t: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.15,
        },
      })
    }

    let width = 0
    let height = 0
    let running = true
    let raf = 0
    let lastTime = performance.now()
    // Continuous idle spin accumulator — never hard-swapped with scroll rotation
    let idleSpin = 0

    const resize = () => {
      const parent = canvas.parentElement
      const rect = parent?.getBoundingClientRect() ?? canvas.getBoundingClientRect()
      width = Math.max(1, rect.width)
      height = Math.max(1, rect.height)
      renderer.setSize(width, height, false)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    }

    const onVisibility = () => {
      running = document.visibilityState === 'visible'
      if (running) {
        lastTime = performance.now()
        raf = requestAnimationFrame(tick)
      }
    }

    const tick = (timeMs: number) => {
      if (!running) return

      const dt = Math.min(0.05, (timeMs - lastTime) / 1000)
      lastTime = timeMs

      const t = proxy.t
      morphPositions(current, start, end, t, timeMs)
      ;(pointsGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true

      writeEdgePositions(linePositions, current, edgeIndex)
      ;(lineGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true

      // Edges fade in gently as the network forms — never a hard cut
      const edgeAlpha = smoothstep(0.35, 0.88, t) * 0.22
      lineMat.opacity = edgeAlpha

      // Size / opacity ease continuously with t (no branch rewrite)
      const settle = smoothstep(0.2, 1, t)
      const pulse = 1 + Math.sin(timeMs * 0.0018) * 0.04 * settle
      pointsMat.opacity = 0.62 + settle * 0.2
      pointsMat.size = baseSize * (0.92 + settle * 0.28) * pulse

      // Seamless rotation: scroll-linked base + idle spin that ramps in with settle
      // Avoids the old t>0.75 hard swap that snapped rotation.
      idleSpin += dt * (0.12 + settle * 0.22)
      const scrollTwist = t * 0.55
      root.rotation.y = scrollTwist + idleSpin * settle
      root.rotation.x = Math.sin(idleSpin * 0.35) * 0.04 * settle

      renderer.render(scene, camera)
      raf = requestAnimationFrame(tick)
    }

    resize()
    window.addEventListener('resize', resize)
    document.addEventListener('visibilitychange', onVisibility)
    raf = requestAnimationFrame(tick)
    ScrollTrigger.refresh()

    return () => {
      running = false
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVisibility)

      if (tween) {
        tween.scrollTrigger?.kill()
        tween.kill()
      }

      pointsGeo.dispose()
      lineGeo.dispose()
      pointsMat.dispose()
      lineMat.dispose()
      glowMap?.dispose()
      renderer.dispose()
    }
  }, [sectionRef])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 size-full"
      aria-hidden="true"
    />
  )
}
