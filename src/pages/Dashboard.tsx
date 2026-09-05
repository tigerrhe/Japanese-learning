import { Link } from 'react-router-dom'
import { grammarNodes } from '../data/grammarNodes'
import { particles } from '../data/particles'
import { LEVELS } from '../data/types'
import { computeStats } from '../engine/srs'
import { useLevelFilter } from '../engine/LevelContext'

function LevelRow({ level }: { level: (typeof LEVELS)[number] }) {
  const ids = [...particles, ...grammarNodes].filter((n) => n.level === level).map((n) => n.id)
  const stats = computeStats(ids)
  const pct = stats.total === 0 ? 0 : Math.round(((stats.familiar + stats.mastered) / stats.total) * 100)

  return (
    <div className="flex items-center gap-3">
      <span className="w-10 shrink-0 text-sm font-semibold text-slate-300">{level}</span>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-800">
        <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${pct}%` }} />
      </div>
      <span className="w-24 shrink-0 text-right text-xs text-slate-400">
        {stats.familiar + stats.mastered}/{stats.total} 熟悉
      </span>
      {stats.dueNow > 0 && (
        <span className="shrink-0 rounded-full bg-amber-500/20 px-2 py-0.5 text-xs font-medium text-amber-400">
          {stats.dueNow} 待复习
        </span>
      )}
    </div>
  )
}

export function Dashboard() {
  const { filter } = useLevelFilter()
  const allIds = [...particles, ...grammarNodes].map((n) => n.id)
  const overall = computeStats(allIds)

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold text-white">日语学习星图</h1>
      <p className="mt-2 text-slate-400">
        不是线性课程条，而是一张会生长的知识网络。当前范围：
        <span className="ml-1 font-semibold text-amber-400">{filter === 'All' ? '全部等级' : `N5 ~ ${filter}`}</span>
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="总知识点" value={overall.total} />
        <StatCard label="已掌握" value={overall.mastered} tone="text-emerald-400" />
        <StatCard label="熟悉中" value={overall.familiar} tone="text-sky-400" />
        <StatCard label="待复习" value={overall.dueNow} tone="text-amber-400" />
      </div>

      <section className="mt-8">
        <h2 className="mb-3 text-lg font-semibold text-white">各等级掌握度</h2>
        <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/50 p-4">
          {LEVELS.map((lvl) => (
            <LevelRow key={lvl} level={lvl} />
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        <ModuleCard
          to="/starmap"
          title="知识星图"
          desc="按 N5→N1 分层的关联网络，点开每个节点看易混淆点，探索代替打卡。"
        />
        <ModuleCard
          to="/particles"
          title="助词专项训练"
          desc="针对最容易混淆的助词做对比练习，错题自动进入复习队列。"
        />
        <ModuleCard
          to="/keigo"
          title="敬语关系滑块"
          desc="拖动你和对方的关系远近，同一句话实时切换敬语级别，直观理解敬语逻辑。"
        />
      </section>
    </div>
  )
}

function StatCard({ label, value, tone }: { label: string; value: number; tone?: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 text-center">
      <div className={`text-2xl font-bold ${tone ?? 'text-white'}`}>{value}</div>
      <div className="mt-1 text-xs text-slate-400">{label}</div>
    </div>
  )
}

function ModuleCard({ to, title, desc }: { to: string; title: string; desc: string }) {
  return (
    <Link
      to={to}
      className="block rounded-xl border border-slate-800 bg-slate-900/50 p-5 transition-colors hover:border-indigo-500 hover:bg-slate-900"
    >
      <h3 className="font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm text-slate-400">{desc}</p>
    </Link>
  )
}
