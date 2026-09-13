'use client'

import { useEffect, useRef } from 'react'
import {
  MotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
} from 'framer-motion'

type Variant = 'bottleneck' | 'computer' | 'human'
type Point = { x: number; y: number }

const TAU = Math.PI * 2

function clamp(value: number, min = 0, max = 1) {
  return Math.max(min, Math.min(max, value))
}

function smoothstep(from: number, to: number, value: number) {
  const x = clamp((value - from) / (to - from))
  return x * x * (3 - 2 * x)
}

function lerp(from: number, to: number, progress: number) {
  return from + (to - from) * progress
}

function roundedRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  const r = Math.min(radius, width / 2, height / 2)
  context.beginPath()
  context.moveTo(x + r, y)
  context.lineTo(x + width - r, y)
  context.quadraticCurveTo(x + width, y, x + width, y + r)
  context.lineTo(x + width, y + height - r)
  context.quadraticCurveTo(x + width, y + height, x + width - r, y + height)
  context.lineTo(x + r, y + height)
  context.quadraticCurveTo(x, y + height, x, y + height - r)
  context.lineTo(x, y + r)
  context.quadraticCurveTo(x, y, x + r, y)
  context.closePath()
}

function glow(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  color: string,
  alpha: number,
) {
  const gradient = context.createRadialGradient(x, y, 0, x, y, radius)
  gradient.addColorStop(0, color.replace('ALPHA', String(alpha)))
  gradient.addColorStop(0.36, color.replace('ALPHA', String(alpha * 0.45)))
  gradient.addColorStop(1, color.replace('ALPHA', '0'))
  context.fillStyle = gradient
  context.fillRect(x - radius, y - radius, radius * 2, radius * 2)
}

function node(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  alpha: number,
  warm = false,
) {
  const color = warm ? '238, 112, 191' : '102, 220, 255'
  glow(context, x, y, radius * 6, `rgba(${color}, ALPHA)`, alpha * 0.28)
  context.beginPath()
  context.arc(x, y, radius, 0, TAU)
  context.fillStyle = `rgba(${color}, ${alpha})`
  context.fill()
  context.beginPath()
  context.arc(x, y, radius * 2.3, 0, TAU)
  context.strokeStyle = `rgba(${color}, ${alpha * 0.36})`
  context.lineWidth = 0.8
  context.stroke()
}

function cubicPoint(a: Point, b: Point, c: Point, d: Point, t: number): Point {
  const u = 1 - t
  return {
    x: u ** 3 * a.x + 3 * u ** 2 * t * b.x + 3 * u * t ** 2 * c.x + t ** 3 * d.x,
    y: u ** 3 * a.y + 3 * u ** 2 * t * b.y + 3 * u * t ** 2 * c.y + t ** 3 * d.y,
  }
}

function quadPoint(a: Point, b: Point, c: Point, t: number): Point {
  const u = 1 - t
  return {
    x: u ** 2 * a.x + 2 * u * t * b.x + t ** 2 * c.x,
    y: u ** 2 * a.y + 2 * u * t * b.y + t ** 2 * c.y,
  }
}

// Draws a cubic bezier progressively (like a pen tracing the curve) up to `reveal` (0-1),
// then leaves a bright glowing tip where the "pen" currently is. Returns the tip point so
// callers can attach extra effects (particles, labels) to the live drawing edge.
function drawPenCubic(
  context: CanvasRenderingContext2D,
  a: Point,
  b: Point,
  c: Point,
  d: Point,
  reveal: number,
  strokeColor: string,
  lineWidth: number,
  tipColor: string,
  tipAlpha: number,
  segments = 26,
): Point {
  const p = clamp(reveal)
  if (p <= 0.001) return a

  const activeSegments = Math.max(1, Math.round(segments * p))
  context.beginPath()
  context.moveTo(a.x, a.y)
  let tip = a
  for (let i = 1; i <= activeSegments; i += 1) {
    const t = (i / activeSegments) * p
    tip = cubicPoint(a, b, c, d, t)
    context.lineTo(tip.x, tip.y)
  }
  context.strokeStyle = strokeColor
  context.lineWidth = lineWidth
  context.lineCap = 'round'
  context.stroke()
  context.lineCap = 'butt'

  if (p < 0.985) {
    glow(context, tip.x, tip.y, lineWidth * 9, `rgba(${tipColor}, ALPHA)`, tipAlpha * 0.85)
    context.beginPath()
    context.arc(tip.x, tip.y, lineWidth * 1.35, 0, TAU)
    context.fillStyle = `rgba(${tipColor}, ${tipAlpha})`
    context.fill()
  }

  return tip
}

// Same idea for a quadratic bezier (used by the bottleneck routing arcs).
function drawPenQuad(
  context: CanvasRenderingContext2D,
  a: Point,
  b: Point,
  c: Point,
  reveal: number,
  strokeColor: string,
  lineWidth: number,
  tipColor: string,
  tipAlpha: number,
  segments = 22,
): Point {
  const p = clamp(reveal)
  if (p <= 0.001) return a

  const activeSegments = Math.max(1, Math.round(segments * p))
  context.beginPath()
  context.moveTo(a.x, a.y)
  let tip = a
  for (let i = 1; i <= activeSegments; i += 1) {
    const t = (i / activeSegments) * p
    tip = quadPoint(a, b, c, t)
    context.lineTo(tip.x, tip.y)
  }
  context.strokeStyle = strokeColor
  context.lineWidth = lineWidth
  context.lineCap = 'round'
  context.stroke()
  context.lineCap = 'butt'

  if (p < 0.985) {
    glow(context, tip.x, tip.y, lineWidth * 8, `rgba(${tipColor}, ALPHA)`, tipAlpha * 0.8)
    context.beginPath()
    context.arc(tip.x, tip.y, lineWidth * 1.2, 0, TAU)
    context.fillStyle = `rgba(${tipColor}, ${tipAlpha})`
    context.fill()
  }

  return tip
}

function drawBottleneck(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number,
  scroll: number,
) {
  const compact = width < 720
  const cx = width * 0.5
  const cy = height * 0.5
  const sx = Math.min(width * (compact ? 0.36 : 0.32), height * 0.44)
  const sy = Math.min(height * 0.34, sx * 0.82)
  const alpha = smoothstep(0.04, 0.2, progress)
  const routeReveal = smoothstep(0.14, 0.62, progress)

  glow(context, cx, cy, sx * 1.45, 'rgba(74, 181, 255, ALPHA)', 0.11 * alpha)
  glow(context, cx - sx * 0.08, cy, sx * 0.5, 'rgba(238, 100, 178, ALPHA)', 0.16 * routeReveal)

  context.save()
  context.globalAlpha = alpha

  const taskOffsets = [-0.82, -0.43, -0.06, 0.34, 0.75]
  taskOffsets.forEach((offset, index) => {
    const x = cx - sx * (1.22 + (index % 2) * 0.13)
    const y = cy + sy * offset
    const cardW = sx * (compact ? 0.26 : 0.3)
    const cardH = Math.max(22, sy * 0.16)
    roundedRect(context, x - cardW / 2, y - cardH / 2, cardW, cardH, 6)
    context.fillStyle = `rgba(14, 25, 39, ${0.42 * alpha})`
    context.fill()
    context.strokeStyle = `rgba(108, 215, 255, ${0.28 + index * 0.025})`
    context.lineWidth = 1
    context.stroke()
    context.fillStyle = `rgba(123, 222, 255, ${0.42 * alpha})`
    context.fillRect(x - cardW * 0.33, y - 2, cardW * (0.34 + (index % 3) * 0.12), 3)
    node(context, x - cardW * 0.37, y, 1.6, 0.55 * alpha, index > 2)
  })

  taskOffsets.forEach((offset, index) => {
    const start: Point = {
      x: cx - sx * (1.07 + (index % 2) * 0.13),
      y: cy + sy * offset,
    }
    const end: Point = { x: cx - sx * 0.08, y: cy + sy * offset * 0.1 }
    const controlA: Point = { x: cx - sx * 0.74, y: start.y + sy * (index % 2 ? 0.2 : -0.13) }
    const controlB: Point = { x: cx - sx * 0.32, y: cy + sy * offset * 0.2 }
    const warm = index > 2

    // Each line starts drawing a little after the previous one, so the whole
    // bundle reads as a sequence of strokes being traced rather than a fade-in.
    const drawT = clamp(routeReveal * 1.32 - index * 0.11)
    drawPenCubic(
      context,
      start,
      controlA,
      controlB,
      end,
      drawT,
      warm ? 'rgba(236, 104, 181, 0.5)' : 'rgba(91, 211, 255, 0.55)',
      1.25,
      warm ? '255, 150, 216' : '138, 226, 255',
      0.85,
    )
  })

  const archTopReveal = clamp(routeReveal * 1.2 - 0.02)
  drawPenQuad(
    context,
    { x: cx - sx * 0.98, y: cy - sy * 0.98 },
    { x: cx - sx * 0.42, y: cy - sy * 0.52 },
    { x: cx - sx * 0.08, y: cy - sy * 0.12 },
    archTopReveal,
    'rgba(126, 224, 255, 0.55)',
    1.4,
    '145, 228, 255',
    0.8,
  )
  drawPenQuad(
    context,
    { x: cx + sx * 0.08, y: cy - sy * 0.12 },
    { x: cx + sx * 0.4, y: cy - sy * 0.33 },
    { x: cx + sx * 1.02, y: cy - sy * 0.58 },
    clamp(archTopReveal * 1.15 - 0.18),
    'rgba(126, 224, 255, 0.55)',
    1.4,
    '145, 228, 255',
    0.8,
  )
  const archBottomReveal = clamp(routeReveal * 1.2 - 0.06)
  drawPenQuad(
    context,
    { x: cx - sx * 0.98, y: cy + sy * 0.98 },
    { x: cx - sx * 0.42, y: cy + sy * 0.52 },
    { x: cx - sx * 0.08, y: cy + sy * 0.12 },
    archBottomReveal,
    'rgba(126, 224, 255, 0.55)',
    1.4,
    '145, 228, 255',
    0.8,
  )
  drawPenQuad(
    context,
    { x: cx + sx * 0.08, y: cy + sy * 0.12 },
    { x: cx + sx * 0.4, y: cy + sy * 0.33 },
    { x: cx + sx * 1.02, y: cy + sy * 0.58 },
    clamp(archBottomReveal * 1.15 - 0.18),
    'rgba(126, 224, 255, 0.55)',
    1.4,
    '145, 228, 255',
    0.8,
  )

  const pulse = 0.7 + Math.sin(scroll * Math.PI * 3) * 0.12
  const completionFlash = smoothstep(0.9, 0.98, progress) * (1 - smoothstep(0.98, 1, progress) * 0.4)
  glow(context, cx, cy, sx * (0.28 + completionFlash * 0.35), 'rgba(242, 97, 174, ALPHA)', 0.24 * routeReveal * pulse + completionFlash * 0.22)
  roundedRect(context, cx - sx * 0.07, cy - sy * 0.18, sx * 0.14, sy * 0.36, 8)
  context.fillStyle = `rgba(31, 15, 36, ${0.72 * routeReveal})`
  context.fill()
  context.strokeStyle = `rgba(255, 131, 203, ${0.76 * routeReveal})`
  context.lineWidth = 1.5
  context.stroke()
  ;[-0.25, -0.16, -0.07].forEach((offset, index) => {
    node(context, cx + sx * offset, cy + (index - 1) * 7, 2.2, 0.76 * routeReveal, true)
  })

  ;[-0.5, 0, 0.5].forEach((offset, index) => {
    const startX = cx + sx * 0.09
    const endX = cx + sx * 1.02
    const endY = cy + sy * offset
    const start: Point = { x: startX, y: cy + sy * offset * 0.16 }
    const control: Point = { x: cx + sx * 0.48, y: endY }
    const end: Point = { x: endX, y: endY }
    const drawT = clamp(routeReveal * 1.4 - 0.32 - index * 0.09)
    drawPenQuad(
      context,
      start,
      control,
      end,
      drawT,
      'rgba(100, 220, 255, 0.6)',
      1.25,
      '132, 226, 255',
      0.82,
    )
  })

  context.restore()
}

function drawMiniChart(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  alpha: number,
) {
  context.beginPath()
  context.moveTo(x, y + height * 0.78)
  context.lineTo(x + width * 0.2, y + height * 0.58)
  context.lineTo(x + width * 0.42, y + height * 0.66)
  context.lineTo(x + width * 0.63, y + height * 0.28)
  context.lineTo(x + width, y + height * 0.08)
  context.strokeStyle = `rgba(111, 225, 255, ${alpha})`
  context.lineWidth = 1.5
  context.stroke()
  ;[
    [0, 0.78],
    [0.2, 0.58],
    [0.42, 0.66],
    [0.63, 0.28],
    [1, 0.08],
  ].forEach(([dx, dy], index) => node(context, x + width * dx, y + height * dy, 1.6, alpha, index === 3))
}

function drawComputer(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number,
  scroll: number,
) {
  const compact = width < 720
  const alpha = smoothstep(0.04, 0.2, progress)
  const build = smoothstep(0.14, 0.62, progress)
  const cx = width * 0.5
  const cy = height * 0.5
  const sceneW = Math.min(width * (compact ? 0.9 : 0.68), height * 1.05)
  const sceneH = sceneW * 0.58
  const x = cx - sceneW / 2
  const y = cy - sceneH / 2

  glow(context, cx, cy, sceneW * 0.76, 'rgba(67, 187, 255, ALPHA)', 0.13 * alpha)
  glow(context, cx + sceneW * 0.18, cy - sceneH * 0.08, sceneW * 0.42, 'rgba(211, 83, 197, ALPHA)', 0.11 * build)

  context.save()
  context.translate(cx, cy)
  const scale = lerp(0.93, 1, build)
  context.scale(scale, scale)
  context.translate(-cx, -cy)
  context.globalAlpha = alpha

  roundedRect(context, x, y, sceneW, sceneH, 18)
  context.fillStyle = `rgba(8, 19, 32, ${0.44 * alpha})`
  context.fill()
  context.strokeStyle = `rgba(114, 221, 255, ${0.52 * alpha})`
  context.lineWidth = 1.25
  context.stroke()

  context.beginPath()
  context.moveTo(x, y + sceneH * 0.115)
  context.lineTo(x + sceneW, y + sceneH * 0.115)
  context.strokeStyle = `rgba(130, 220, 255, ${0.22 * alpha})`
  context.stroke()
  ;[0, 1, 2].forEach((index) => node(context, x + sceneW * (0.045 + index * 0.03), y + sceneH * 0.057, 1.8, 0.5 * alpha, index === 2))

  roundedRect(context, x + sceneW * 0.035, y + sceneH * 0.17, sceneW * 0.135, sceneH * 0.72, 9)
  context.fillStyle = `rgba(11, 29, 45, ${0.46 * alpha})`
  context.fill()
  context.strokeStyle = `rgba(101, 215, 255, ${0.19 * alpha})`
  context.stroke()
  ;[0.26, 0.39, 0.52, 0.65, 0.78].forEach((row, index) => {
    context.fillStyle = index === 1
      ? `rgba(234, 107, 192, ${0.48 * alpha})`
      : `rgba(106, 218, 255, ${0.32 * alpha})`
    context.fillRect(x + sceneW * 0.064, y + sceneH * row, sceneW * (index === 1 ? 0.072 : 0.054), 3)
  })

  const coreX = x + sceneW * 0.51
  const coreY = y + sceneH * 0.52
  const coreR = sceneH * 0.095
  const spin = scroll * Math.PI * 1.8
  const coreCompletionFlash = smoothstep(0.88, 0.98, progress) * (1 - smoothstep(0.98, 1, progress) * 0.35)
  glow(context, coreX, coreY, coreR * (5.2 + coreCompletionFlash * 2.4), 'rgba(82, 201, 255, ALPHA)', 0.2 * build + coreCompletionFlash * 0.24)
  ;[1.55, 2.25].forEach((ring, index) => {
    context.save()
    context.translate(coreX, coreY)
    context.rotate(spin * (index ? -0.55 : 0.8))
    context.beginPath()
    context.arc(0, 0, coreR * ring, index ? 0.35 : -1.15, index ? 4.9 : 3.75)
    context.strokeStyle = index
      ? `rgba(231, 103, 194, ${0.38 * build})`
      : `rgba(104, 220, 255, ${0.5 * build})`
    context.lineWidth = index ? 1 : 1.4
    context.stroke()
    context.restore()
  })
  context.beginPath()
  context.arc(coreX, coreY, coreR, 0, TAU)
  context.fillStyle = `rgba(16, 45, 65, ${0.82 * build})`
  context.fill()
  context.strokeStyle = `rgba(132, 231, 255, ${0.75 * build})`
  context.lineWidth = 1.4
  context.stroke()
  node(context, coreX, coreY, 3, 0.9 * build, true)

  const moduleCenters = [
    { x: x + sceneW * 0.285, y: y + sceneH * 0.27 },
    { x: x + sceneW * 0.73, y: y + sceneH * 0.27 },
    { x: x + sceneW * 0.285, y: y + sceneH * 0.77 },
    { x: x + sceneW * 0.73, y: y + sceneH * 0.77 },
  ]

  moduleCenters.forEach((module, index) => {
    const moduleW = sceneW * 0.18
    const moduleH = sceneH * 0.2
    roundedRect(context, module.x - moduleW / 2, module.y - moduleH / 2, moduleW, moduleH, 8)
    context.fillStyle = `rgba(13, 32, 49, ${0.62 * build})`
    context.fill()
    context.strokeStyle = index === 1
      ? `rgba(234, 107, 192, ${0.42 * build})`
      : `rgba(105, 219, 255, ${0.34 * build})`
    context.lineWidth = 1
    context.stroke()

    const wireColor = index === 1 ? '234, 107, 192' : '109, 220, 255'
    const wireDrawT = clamp(build * 1.4 - index * 0.1)
    if (wireDrawT < 0.99) {
      drawPenCubic(
        context,
        { x: coreX, y: coreY },
        { x: coreX + (module.x - coreX) * 0.35, y: coreY + (module.y - coreY) * 0.1 },
        { x: coreX + (module.x - coreX) * 0.65, y: coreY + (module.y - coreY) * 0.9 },
        { x: module.x, y: module.y },
        wireDrawT,
        `rgba(${wireColor}, 0.42)`,
        1.1,
        wireColor === '109, 220, 255' ? '140, 226, 255' : '255, 160, 220',
        0.78,
      )
    } else {
      // Fully wired up: switch to an animated dashed "data flow" pulse.
      context.beginPath()
      context.moveTo(coreX, coreY)
      context.lineTo(module.x, module.y)
      context.strokeStyle = `rgba(${wireColor}, ${0.3 * build})`
      context.setLineDash([4, 6])
      context.lineDashOffset = -scroll * 36 - index * 4
      context.stroke()
      context.setLineDash([])
    }

    if (index === 0) {
      drawMiniChart(context, module.x - moduleW * 0.32, module.y - moduleH * 0.25, moduleW * 0.64, moduleH * 0.5, 0.62 * build)
    } else if (index === 1) {
      ;[-0.22, 0, 0.22].forEach((offset, row) => {
        const barW = moduleW * (0.4 + row * 0.12)
        context.fillStyle = `rgba(${row === 1 ? '235, 108, 194' : '109, 220, 255'}, ${0.45 * build})`
        context.fillRect(module.x - barW / 2, module.y + moduleH * offset - 1.5, barW, 3)
      })
    } else if (index === 2) {
      const nodes = [
        { x: module.x - moduleW * 0.27, y: module.y },
        { x: module.x, y: module.y - moduleH * 0.22 },
        { x: module.x, y: module.y + moduleH * 0.22 },
        { x: module.x + moduleW * 0.27, y: module.y },
      ]
      context.strokeStyle = `rgba(111, 224, 255, ${0.42 * build})`
      context.beginPath()
      context.moveTo(nodes[0].x, nodes[0].y)
      context.lineTo(nodes[1].x, nodes[1].y)
      context.lineTo(nodes[3].x, nodes[3].y)
      context.moveTo(nodes[0].x, nodes[0].y)
      context.lineTo(nodes[2].x, nodes[2].y)
      context.lineTo(nodes[3].x, nodes[3].y)
      context.stroke()
      nodes.forEach((point, pointIndex) => node(context, point.x, point.y, 1.7, 0.7 * build, pointIndex === 3))
    } else {
      ;[0.25, 0.48, 0.72].forEach((bar, barIndex) => {
        const barH = moduleH * bar
        context.fillStyle = `rgba(${barIndex === 2 ? '235, 108, 194' : '109, 220, 255'}, ${0.43 * build})`
        context.fillRect(module.x - moduleW * 0.28 + barIndex * moduleW * 0.2, module.y + moduleH * 0.3 - barH, moduleW * 0.09, barH)
      })
    }
  })

  moduleCenters.forEach((module, index) => {
    const phase = clamp((build - 0.16 - index * 0.055) / 0.84)
    node(
      context,
      lerp(module.x, coreX, phase),
      lerp(module.y, coreY, phase),
      2.2,
      0.72 * build,
      index === 1,
    )
  })

  context.beginPath()
  context.moveTo(cx - sceneW * 0.09, y + sceneH)
  context.lineTo(cx - sceneW * 0.13, y + sceneH * 1.11)
  context.lineTo(cx + sceneW * 0.13, y + sceneH * 1.11)
  context.lineTo(cx + sceneW * 0.09, y + sceneH)
  context.strokeStyle = `rgba(113, 221, 255, ${0.36 * alpha})`
  context.stroke()
  context.beginPath()
  context.moveTo(cx - sceneW * 0.19, y + sceneH * 1.11)
  context.lineTo(cx + sceneW * 0.19, y + sceneH * 1.11)
  context.stroke()

  context.restore()
}

function drawPerson(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  alpha: number,
  warm = false,
) {
  const color = warm ? '235, 110, 193' : '110, 223, 255'
  glow(context, x, y, radius * 3.1, `rgba(${color}, ALPHA)`, 0.1 * alpha)
  context.beginPath()
  context.arc(x, y - radius * 0.62, radius * 0.31, 0, TAU)
  context.strokeStyle = `rgba(${color}, ${0.58 * alpha})`
  context.lineWidth = 1.35
  context.stroke()
  context.beginPath()
  context.arc(x, y + radius * 0.36, radius * 0.66, Math.PI * 1.1, Math.PI * 1.9)
  context.stroke()
  context.beginPath()
  context.arc(x, y, radius, 0, TAU)
  context.strokeStyle = `rgba(${color}, ${0.18 * alpha})`
  context.lineWidth = 0.8
  context.stroke()
  node(context, x, y - radius * 0.62, 2, 0.7 * alpha, warm)
}

function drawHuman(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number,
  scroll: number,
) {
  const compact = width < 720
  const alpha = smoothstep(0.04, 0.2, progress)
  const connect = smoothstep(0.14, 0.62, progress)
  const cx = width * 0.5
  const cy = height * 0.47
  const span = Math.min(width * (compact ? 0.34 : 0.28), height * 0.34)
  const radius = Math.max(38, span * (compact ? 0.24 : 0.2))

  glow(context, cx, cy, span * 1.8, 'rgba(79, 192, 255, ALPHA)', 0.12 * alpha)
  glow(context, cx, cy + span * 0.1, span * 0.85, 'rgba(226, 92, 190, ALPHA)', 0.1 * connect)

  context.save()
  context.globalAlpha = alpha

  const people = [
    { x: cx - span, y: cy + span * 0.13, warm: false },
    { x: cx, y: cy - span * 0.23, warm: true },
    { x: cx + span, y: cy + span * 0.13, warm: false },
  ]

  const boardW = span * 1.28
  const boardH = span * 0.58
  const boardX = cx - boardW / 2
  const boardY = cy + span * 0.4
  roundedRect(context, boardX, boardY, boardW, boardH, 10)
  context.fillStyle = `rgba(10, 27, 42, ${0.48 * connect})`
  context.fill()
  context.strokeStyle = `rgba(111, 222, 255, ${0.38 * connect})`
  context.lineWidth = 1.15
  context.stroke()

  const boardNodes = [
    { x: boardX + boardW * 0.18, y: boardY + boardH * 0.53 },
    { x: boardX + boardW * 0.43, y: boardY + boardH * 0.3 },
    { x: boardX + boardW * 0.64, y: boardY + boardH * 0.67 },
    { x: boardX + boardW * 0.83, y: boardY + boardH * 0.35 },
  ]
  context.beginPath()
  boardNodes.forEach((point, index) => {
    if (index === 0) context.moveTo(point.x, point.y)
    else context.lineTo(point.x, point.y)
  })
  context.strokeStyle = `rgba(116, 226, 255, ${0.46 * connect})`
  context.lineWidth = 1.35
  context.stroke()
  boardNodes.forEach((point, index) => node(context, point.x, point.y, 1.8, 0.72 * connect, index === 1 || index === 3))

  people.forEach((person, index) => {
    const startX = lerp(cx, person.x, connect)
    const startY = lerp(cy, person.y, connect)
    drawPerson(context, startX, startY, radius, connect, person.warm)
    const boardNode = boardNodes[index + (index === 2 ? 1 : 0)]
    const color = person.warm ? '236, 109, 194' : '111, 223, 255'

    const lineDrawT = clamp(connect * 1.35 - index * 0.14)
    if (lineDrawT < 0.99) {
      drawPenCubic(
        context,
        { x: startX, y: startY + radius },
        { x: startX, y: boardY - span * 0.18 },
        { x: boardNode.x, y: boardY - span * 0.1 },
        { x: boardNode.x, y: boardNode.y },
        lineDrawT,
        `rgba(${color}, 0.42)`,
        1.1,
        person.warm ? '255, 160, 220' : '145, 228, 255',
        0.78,
      )
    } else {
      context.beginPath()
      context.moveTo(startX, startY + radius)
      context.bezierCurveTo(startX, boardY - span * 0.18, boardNode.x, boardY - span * 0.1, boardNode.x, boardNode.y)
      context.setLineDash([3, 7])
      context.lineDashOffset = -scroll * 38 - index * 7
      context.strokeStyle = `rgba(${color}, ${0.34 * connect})`
      context.lineWidth = 1.1
      context.stroke()
      context.setLineDash([])
    }
  })

  context.save()
  context.translate(cx, cy + span * 0.08)
  context.rotate(scroll * 0.6)
  context.beginPath()
  context.ellipse(0, 0, span * 1.5, span * 0.79, -0.08, -0.35, Math.PI * 1.34)
  context.strokeStyle = `rgba(113, 224, 255, ${0.17 * connect})`
  context.lineWidth = 0.8
  context.stroke()
  context.restore()

  const sharedPulse = 0.82 + Math.sin(scroll * Math.PI * 2.4) * 0.12
  const boardCompletionFlash = smoothstep(0.88, 0.98, progress) * (1 - smoothstep(0.98, 1, progress) * 0.35)
  if (boardCompletionFlash > 0.02) {
    glow(context, cx, boardY + boardH * 0.48, span * 0.55, 'rgba(255, 150, 228, ALPHA)', boardCompletionFlash * 0.3)
  }
  node(context, cx, boardY + boardH * 0.48, 3, connect * sharedPulse, true)
  context.restore()
}

function ExperienceCanvas({ progress, variant }: { progress: MotionValue<number>; variant: Variant }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const progressRef = useRef(0)
  const drawRef = useRef<() => void>(() => undefined)
  const reduceMotion = useReducedMotion()

  useMotionValueEvent(progress, 'change', (latest) => {
    progressRef.current = latest
    drawRef.current()
  })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    if (!context) return

    let width = 0
    let height = 0
    let dpr = 1

    const draw = () => {
      context.clearRect(0, 0, width, height)
      const rawProgress = reduceMotion ? 0.72 : clamp(progressRef.current)

      context.save()
      context.globalCompositeOperation = 'screen'
      if (variant === 'bottleneck') drawBottleneck(context, width, height, rawProgress, rawProgress)
      if (variant === 'computer') drawComputer(context, width, height, rawProgress, rawProgress)
      if (variant === 'human') drawHuman(context, width, height, rawProgress, rawProgress)
      context.restore()
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height
      dpr = Math.min(window.devicePixelRatio || 1, 1.6)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      draw()
    }

    progressRef.current = progress.get()
    drawRef.current = draw
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [progress, reduceMotion, variant])

  return <canvas ref={canvasRef} className="absolute inset-0 size-full opacity-95" aria-hidden="true" />
}

export function ScrollConstellation({ variant }: { variant: Variant }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.88', 'end 0.12'],
  })
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 72, damping: 26, mass: 0.48 })

  return (
    <div
      ref={ref}
      data-scroll-scene={variant}
      className="pointer-events-none absolute inset-0 z-0"
      aria-hidden="true"
    >
      <div className="sticky top-0 h-svh overflow-hidden">
        <ExperienceCanvas progress={smoothProgress} variant={variant} />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,var(--background)_0%,transparent_18%,transparent_80%,var(--background)_100%)] opacity-55" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_10%,rgba(7,9,17,.14)_68%,rgba(7,9,17,.52)_100%)]" />
      </div>
    </div>
  )
}
