import { NavLink } from 'react-router-dom'
import { LEVELS } from '../data/types'
import { useLevelFilter } from '../engine/LevelContext'

const linkBase =
  'px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap'

export function NavBar() {
  const { filter, setFilter } = useLevelFilter()

  return (
    <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <nav className="flex items-center gap-1 overflow-x-auto">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `${linkBase} ${isActive ? 'bg-indigo-500 text-white' : 'text-slate-300 hover:bg-slate-800'}`
            }
          >
            总览
          </NavLink>
          <NavLink
            to="/starmap"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? 'bg-indigo-500 text-white' : 'text-slate-300 hover:bg-slate-800'}`
            }
          >
            知识星图
          </NavLink>
          <NavLink
            to="/particles"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? 'bg-indigo-500 text-white' : 'text-slate-300 hover:bg-slate-800'}`
            }
          >
            助词训练
          </NavLink>
          <NavLink
            to="/keigo"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? 'bg-indigo-500 text-white' : 'text-slate-300 hover:bg-slate-800'}`
            }
          >
            敬语关系
          </NavLink>
        </nav>

        <div className="flex items-center gap-1 overflow-x-auto">
          <button
            type="button"
            onClick={() => setFilter('All')}
            className={`${linkBase} ${filter === 'All' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            全部
          </button>
          {LEVELS.map((lvl) => (
            <button
              key={lvl}
              type="button"
              onClick={() => setFilter(lvl)}
              className={`${linkBase} ${filter === lvl ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:bg-slate-800'}`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>
    </header>
  )
}
