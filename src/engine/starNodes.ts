import { grammarNodes } from '../data/grammarNodes'
import { particles } from '../data/particles'
import type { Example, JLPTLevel, NodeKind } from '../data/types'

export interface StarNode {
  id: string
  label: string
  level: JLPTLevel
  kind: NodeKind
  meaning: string
  usage: string
  examples: Example[]
}

export const starNodes: StarNode[] = [
  ...particles.map<StarNode>((p) => ({
    id: p.id,
    label: p.particle,
    level: p.level,
    kind: 'particle',
    meaning: p.meaning,
    usage: p.usage,
    examples: p.examples,
  })),
  ...grammarNodes.map<StarNode>((g) => ({
    id: g.id,
    label: g.label,
    level: g.level,
    kind: 'grammar',
    meaning: g.meaning,
    usage: g.usage,
    examples: [g.example],
  })),
]

export const starNodeById = new Map(starNodes.map((n) => [n.id, n]))

const RING_RADIUS: Record<JLPTLevel, number> = {
  N5: 100,
  N4: 170,
  N3: 240,
  N2: 310,
  N1: 380,
}

const RING_ROTATION: Record<JLPTLevel, number> = {
  N5: 0,
  N4: 0.35,
  N3: 0.7,
  N2: 1.05,
  N1: 1.4,
}

export interface Point {
  x: number
  y: number
}

export function computeLayout(): Map<string, Point> {
  const byLevel = new Map<JLPTLevel, StarNode[]>()
  for (const n of starNodes) {
    const list = byLevel.get(n.level) ?? []
    list.push(n)
    byLevel.set(n.level, list)
  }

  const positions = new Map<string, Point>()
  const CENTER = 400

  for (const [level, nodes] of byLevel) {
    const radius = RING_RADIUS[level]
    const rotation = RING_ROTATION[level]
    nodes.forEach((node, i) => {
      const angle = (i / nodes.length) * Math.PI * 2 + rotation
      positions.set(node.id, {
        x: CENTER + radius * Math.cos(angle),
        y: CENTER + radius * Math.sin(angle),
      })
    })
  }

  return positions
}
