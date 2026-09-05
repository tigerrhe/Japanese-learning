const STORAGE_KEY = 'jp-learn-lesson-progress-v1'

function loadSet(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set()
  } catch {
    return new Set()
  }
}

function saveSet(set: Set<string>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]))
  } catch {
    // ignore
  }
}

export function isLearned(itemId: string): boolean {
  return loadSet().has(itemId)
}

export function toggleLearned(itemId: string): boolean {
  const set = loadSet()
  const next = !set.has(itemId)
  if (next) set.add(itemId)
  else set.delete(itemId)
  saveSet(set)
  return next
}

export function countLearned(itemIds: string[]): number {
  const set = loadSet()
  return itemIds.filter((id) => set.has(id)).length
}
