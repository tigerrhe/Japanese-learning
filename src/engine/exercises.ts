import { particleById, particles } from '../data/particles'
import type { Particle } from '../data/types'

export interface ClozeExercise {
  itemId: string
  before: string
  after: string
  reading: string
  zh: string
  correctAnswer: string
  options: string[]
  note: string
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function buildOptions(target: Particle): string[] {
  const distractorGlyphs = new Set<string>()

  for (const id of target.confusedWith) {
    const p = particleById.get(id)
    if (p) distractorGlyphs.add(p.particle)
  }

  const sameLevelPool = particles.filter((p) => p.level === target.level && p.particle !== target.particle)
  let guard = 0
  while (distractorGlyphs.size < 3 && sameLevelPool.length > 0 && guard < 30) {
    guard++
    const candidate = pickRandom(sameLevelPool)
    if (candidate.particle !== target.particle) distractorGlyphs.add(candidate.particle)
  }

  if (distractorGlyphs.size < 3) {
    for (const p of particles) {
      if (distractorGlyphs.size >= 3) break
      if (p.particle !== target.particle) distractorGlyphs.add(p.particle)
    }
  }

  const options = [target.particle, ...Array.from(distractorGlyphs).slice(0, 3)]
  return shuffle(options)
}

export function generateParticleCloze(target: Particle): ClozeExercise | null {
  if (target.examples.length === 0) return null
  const example = pickRandom(target.examples)
  const idx = example.jp.indexOf(target.particle)
  if (idx === -1) return null

  const before = example.jp.slice(0, idx)
  const after = example.jp.slice(idx + target.particle.length)

  return {
    itemId: target.id,
    before,
    after,
    reading: example.reading,
    zh: example.zh,
    correctAnswer: target.particle,
    options: buildOptions(target),
    note: target.contrastNote,
  }
}
