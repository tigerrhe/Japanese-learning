import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { LEVELS, type JLPTLevel } from '../data/types'

export type LevelFilter = JLPTLevel | 'All'

interface LevelContextValue {
  filter: LevelFilter
  setFilter: (f: LevelFilter) => void
  maxRank: number
  includesLevel: (level: JLPTLevel) => boolean
}

const LevelContext = createContext<LevelContextValue | null>(null)

const STORAGE_KEY = 'jp-learn-level-filter'

export function LevelProvider({ children }: { children: ReactNode }) {
  const [filter, setFilterState] = useState<LevelFilter>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved === 'All' || LEVELS.includes(saved as JLPTLevel)) return saved as LevelFilter
    } catch {
      // ignore
    }
    return 'All'
  })

  const setFilter = (f: LevelFilter) => {
    setFilterState(f)
    try {
      localStorage.setItem(STORAGE_KEY, f)
    } catch {
      // ignore
    }
  }

  const value = useMemo<LevelContextValue>(() => {
    const maxRank = filter === 'All' ? LEVELS.length - 1 : LEVELS.indexOf(filter)
    return {
      filter,
      setFilter,
      maxRank,
      includesLevel: (level: JLPTLevel) => filter === 'All' || LEVELS.indexOf(level) <= maxRank,
    }
  }, [filter])

  return <LevelContext.Provider value={value}>{children}</LevelContext.Provider>
}

export function useLevelFilter(): LevelContextValue {
  const ctx = useContext(LevelContext)
  if (!ctx) throw new Error('useLevelFilter must be used within LevelProvider')
  return ctx
}
