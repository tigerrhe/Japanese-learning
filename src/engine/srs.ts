const STORAGE_KEY = 'jp-learn-srs-v1'

export interface SRSItemState {
  box: number // 0-5, Leitner box
  dueAt: number // epoch ms
  correctStreak: number
  seenCount: number
  lastResult: 'correct' | 'wrong' | null
}

type SRSStore = Record<string, SRSItemState>

const BOX_INTERVAL_MS = [
  0, // box 0: due immediately
  1000 * 60 * 60 * 24 * 1, // box 1: 1 day
  1000 * 60 * 60 * 24 * 3, // box 2: 3 days
  1000 * 60 * 60 * 24 * 7, // box 3: 7 days
  1000 * 60 * 60 * 24 * 14, // box 4: 14 days
  1000 * 60 * 60 * 24 * 30, // box 5: 30 days
]

function loadStore(): SRSStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as SRSStore) : {}
  } catch {
    return {}
  }
}

function saveStore(store: SRSStore) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
  } catch {
    // storage unavailable, silently ignore
  }
}

const defaultState: SRSItemState = {
  box: 0,
  dueAt: 0,
  correctStreak: 0,
  seenCount: 0,
  lastResult: null,
}

export function getItemState(id: string): SRSItemState {
  const store = loadStore()
  return store[id] ?? { ...defaultState }
}

export function getAllStates(): SRSStore {
  return loadStore()
}

export function recordAnswer(id: string, correct: boolean): SRSItemState {
  const store = loadStore()
  const prev = store[id] ?? { ...defaultState }
  const nextBox = correct ? Math.min(prev.box + 1, 5) : Math.max(prev.box - 1, 0)
  const next: SRSItemState = {
    box: nextBox,
    dueAt: Date.now() + BOX_INTERVAL_MS[nextBox],
    correctStreak: correct ? prev.correctStreak + 1 : 0,
    seenCount: prev.seenCount + 1,
    lastResult: correct ? 'correct' : 'wrong',
  }
  store[id] = next
  saveStore(store)
  return next
}

export function isDue(id: string): boolean {
  const state = getItemState(id)
  return state.dueAt <= Date.now()
}

/** Mastery in [0, 1], derived from Leitner box. */
export function getMastery(id: string): number {
  return getItemState(id).box / 5
}

export type MasteryBucket = 'new' | 'learning' | 'familiar' | 'mastered'

export function masteryBucket(id: string): MasteryBucket {
  const state = getItemState(id)
  if (state.seenCount === 0) return 'new'
  if (state.box <= 1) return 'learning'
  if (state.box <= 3) return 'familiar'
  return 'mastered'
}

export function sortByDueFirst(ids: string[]): string[] {
  return [...ids].sort((a, b) => getItemState(a).dueAt - getItemState(b).dueAt)
}

export interface LevelStats {
  total: number
  new: number
  learning: number
  familiar: number
  mastered: number
  dueNow: number
}

export function computeStats(ids: string[]): LevelStats {
  const stats: LevelStats = { total: ids.length, new: 0, learning: 0, familiar: 0, mastered: 0, dueNow: 0 }
  for (const id of ids) {
    stats[masteryBucket(id)]++
    if (isDue(id) && masteryBucket(id) !== 'new') stats.dueNow++
  }
  return stats
}
