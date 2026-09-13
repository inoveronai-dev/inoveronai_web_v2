export function smoothstep(from: number, to: number, value: number) {
  const x = Math.max(0, Math.min(1, (value - from) / (to - from)))
  return x * x * (3 - 2 * x)
}

function seededRandom(seed: number) {
  let state = seed >>> 0
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0
    return state / 4294967296
  }
}

/** Sparse fibonacci sphere — clean geometric shell. */
function fibonacciSphere(count: number, radius: number, out: Float32Array, offset: number) {
  const golden = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < count; i += 1) {
    const y = 1 - (i / Math.max(1, count - 1)) * 2
    const r = Math.sqrt(Math.max(0, 1 - y * y))
    const theta = golden * i
    const idx = (offset + i) * 3
    out[idx] = Math.cos(theta) * r * radius
    out[idx + 1] = y * radius
    out[idx + 2] = Math.sin(theta) * r * radius
  }
}

/** Regular octahedron vertices — light, readable silhouette. */
function octahedronVertices(radius: number): number[] {
  return [
    0, radius, 0,
    0, -radius, 0,
    radius, 0, 0,
    -radius, 0, 0,
    0, 0, radius,
    0, 0, -radius,
  ]
}

/** Midpoints of octahedron edges for a slightly richer but still sparse frame. */
function octahedronEdgeMidpoints(radius: number): number[] {
  const verts = [
    [0, 1, 0],
    [0, -1, 0],
    [1, 0, 0],
    [-1, 0, 0],
    [0, 0, 1],
    [0, 0, -1],
  ]
  const edges: [number, number][] = [
    [0, 2], [0, 3], [0, 4], [0, 5],
    [1, 2], [1, 3], [1, 4], [1, 5],
    [2, 4], [4, 3], [3, 5], [5, 2],
  ]
  const out: number[] = []
  for (const [a, b] of edges) {
    const x = (verts[a][0] + verts[b][0]) * 0.5
    const y = (verts[a][1] + verts[b][1]) * 0.5
    const z = (verts[a][2] + verts[b][2]) * 0.5
    const len = Math.hypot(x, y, z) || 1
    out.push((x / len) * radius, (y / len) * radius, (z / len) * radius)
  }
  return out
}

export type NeuralMorphGeometry = {
  start: Float32Array
  end: Float32Array
  colors: Float32Array
  edgeIndex: Uint32Array
  count: number
}

export function buildNeuralMorphGeometry(count: number): NeuralMorphGeometry {
  const random = seededRandom(20260913)
  const start = new Float32Array(count * 3)
  const end = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)

  // --- end: sparse octahedron frame + light spherical shell ---
  const hubs = [...octahedronVertices(1.65), ...octahedronEdgeMidpoints(1.65)]
  const hubCount = Math.min(count, hubs.length / 3)
  const shellCount = count - hubCount

  for (let i = 0; i < hubCount; i += 1) {
    end[i * 3] = hubs[i * 3]
    end[i * 3 + 1] = hubs[i * 3 + 1]
    end[i * 3 + 2] = hubs[i * 3 + 2]
  }

  // Soft shell — slightly smaller radius so hubs read as structure
  fibonacciSphere(shellCount, 1.85, end, hubCount)

  // Compose slightly right of center for headline clearance
  for (let i = 0; i < count; i += 1) {
    end[i * 3] += 0.7
    end[i * 3 + 1] += 0.06
  }

  // --- start: breathable scatter ---
  for (let i = 0; i < count; i += 1) {
    const spread = 2.1 + random() * 1.4
    const theta = random() * Math.PI * 2
    const phi = Math.acos(2 * random() - 1)
    const r = spread * (0.5 + random() * 0.55)
    start[i * 3] = Math.sin(phi) * Math.cos(theta) * r + (random() - 0.5) * 0.9 + 0.35
    start[i * 3 + 1] = Math.cos(phi) * r + (random() - 0.5) * 0.8
    start[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * r + (random() - 0.5) * 0.9

    // Soft cyan / magenta accents
    if (random() > 0.55) {
      colors[i * 3] = 0.85
      colors[i * 3 + 1] = 0.35 + random() * 0.2
      colors[i * 3 + 2] = 0.9
    } else {
      colors[i * 3] = 0.25 + random() * 0.15
      colors[i * 3 + 1] = 0.8 + random() * 0.15
      colors[i * 3 + 2] = 1
    }
  }

  const edgeIndex = buildNearestEdges(end, count, 1)

  return { start, end, colors, edgeIndex, count }
}

/** One nearest neighbor per node — sparse, readable network. */
function buildNearestEdges(positions: Float32Array, count: number, neighbors: number) {
  const indices: number[] = []
  const maxDist = 1.15

  for (let i = 0; i < count; i += 1) {
    const ix = positions[i * 3]
    const iy = positions[i * 3 + 1]
    const iz = positions[i * 3 + 2]
    const nearest: { j: number; d2: number }[] = []

    for (let j = 0; j < count; j += 1) {
      if (j === i) continue
      // Only add each undirected edge once
      if (j < i) continue
      const dx = ix - positions[j * 3]
      const dy = iy - positions[j * 3 + 1]
      const dz = iz - positions[j * 3 + 2]
      const d2 = dx * dx + dy * dy + dz * dz
      if (d2 < maxDist * maxDist) {
        nearest.push({ j, d2 })
      }
    }

    nearest.sort((a, b) => a.d2 - b.d2)
    for (const n of nearest.slice(0, neighbors)) {
      indices.push(i, n.j)
    }
  }

  // Guaranteed octahedron silhouette (first 6 hubs)
  const frame: [number, number][] = [
    [0, 2], [0, 3], [0, 4], [0, 5],
    [1, 2], [1, 3], [1, 4], [1, 5],
    [2, 4], [4, 3], [3, 5], [5, 2],
  ]
  for (const [a, b] of frame) {
    if (a < count && b < count) indices.push(a, b)
  }

  return Uint32Array.from(indices)
}

/**
 * Continuous morph across full scroll progress — no early lock-off plateau
 * that causes a visual “mode change” near the end.
 */
export function morphPositions(
  current: Float32Array,
  start: Float32Array,
  end: Float32Array,
  t: number,
  timeMs: number,
) {
  // Ease across nearly the entire scrub so t=1 is a true settled state
  const s = smoothstep(0.02, 0.92, t)
  const chaos = 1 - s
  const jitterAmp = 0.045 * chaos

  for (let i = 0; i < current.length; i += 3) {
    const nx = Math.sin(timeMs * 0.0009 + i * 0.17) * jitterAmp
    const ny = Math.cos(timeMs * 0.0007 + i * 0.13) * jitterAmp
    const nz = Math.sin(timeMs * 0.001 + i * 0.11) * jitterAmp
    current[i] = start[i] + (end[i] - start[i]) * s + nx
    current[i + 1] = start[i + 1] + (end[i + 1] - start[i + 1]) * s + ny
    current[i + 2] = start[i + 2] + (end[i + 2] - start[i + 2]) * s + nz
  }
}

export function writeEdgePositions(
  linePositions: Float32Array,
  pointPositions: Float32Array,
  edgeIndex: Uint32Array,
) {
  for (let e = 0; e < edgeIndex.length; e += 1) {
    const pi = edgeIndex[e] * 3
    const li = e * 3
    linePositions[li] = pointPositions[pi]
    linePositions[li + 1] = pointPositions[pi + 1]
    linePositions[li + 2] = pointPositions[pi + 2]
  }
}
