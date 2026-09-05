export type JLPTLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1'

export const LEVELS: JLPTLevel[] = ['N5', 'N4', 'N3', 'N2', 'N1']

export interface Example {
  jp: string
  reading: string
  zh: string
}

export interface Particle {
  id: string
  particle: string
  level: JLPTLevel
  meaning: string
  usage: string
  examples: Example[]
  confusedWith: string[]
  contrastNote: string
}

export type NodeKind = 'particle' | 'grammar'

export interface GrammarNode {
  id: string
  kind: NodeKind
  label: string
  level: JLPTLevel
  meaning: string
  usage: string
  example: Example
}

export type EdgeType = 'confusable' | 'family' | 'prerequisite'

export interface StarEdge {
  from: string
  to: string
  type: EdgeType
  note: string
}

export type KeigoLevel = 'casual' | 'polite' | 'sonkeigo' | 'kenjougo'

export interface KeigoVariant {
  stageMin: number
  stageMax: number
  level: KeigoLevel
  levelLabel: string
  sentence: string
  reading: string
  zh: string
  changedWord: string
}

export interface KeigoScenario {
  id: string
  situation: string
  baseAction: string
  perspective: 'other' | 'self'
  variants: KeigoVariant[]
}
