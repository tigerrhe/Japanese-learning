import { useMemo, useState } from 'react'
import { starEdges } from '../data/grammarNodes'
import { LEVELS } from '../data/types'
import { useLevelFilter } from '../engine/LevelContext'
import { generateParticleCloze } from '../engine/exercises'
import { particleById } from '../data/particles'
import { computeLayout, starNodeById, starNodes } from '../engine/starNodes'
import { getMastery, masteryBucket, recordAnswer, type MasteryBucket } from '../engine/srs'

const BUCKET_COLOR: Record<MasteryBucket, string> = {
  new: '#475569', // slate-600
  learning: '#0ea5e9', // sky-500
  familiar: '#6366f1', // indigo-500
  mastered: '#10b981', // emerald-500
}

const EDGE_COLOR: Record<string, string> = {
  confusable: '#f43f5e',
  family: '#64748b',
  prerequisite: '#a78bfa',
}

export function StarMap() {
  const { includesLevel } = useLevelFilter()
  const positions = useMemo(() => computeLayout(), [])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [, forceRerender] = useState(0)

  const selectedNode = selectedId ? starNodeById.get(selectedId) : undefined
  const relatedEdges = selectedId ? starEdges.filter((e) => e.from === selectedId || e.to === selectedId) : []

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-bold text-white">知识星图</h1>
      <p className="mt-2 text-slate-400">
        由内到外是 N5 → N1。红色虚线连接的是最容易混淆的一对，点节点看详情，答对练习会让它发光变亮。
      </p>

      <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-400">
        <Legend color={BUCKET_COLOR.new} label="未学" />
        <Legend color={BUCKET_COLOR.learning} label="学习中" />
        <Legend color={BUCKET_COLOR.familiar} label="熟悉" />
        <Legend color={BUCKET_COLOR.mastered} label="已掌握" />
        <span className="ml-2 text-rose-400">- - - 易混淆</span>
        <span className="text-slate-500">— 同类/关联</span>
      </div>

      <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
          <svg viewBox="0 0 800 800" className="h-auto w-full">
            {LEVELS.map((lvl, i) => (
              <circle
                key={lvl}
                cx={400}
                cy={400}
                r={100 + i * 70}
                fill="none"
                stroke="#1e293b"
                strokeWidth={1}
              />
            ))}

            {starEdges.map((edge, i) => {
              const a = positions.get(edge.from)
              const b = positions.get(edge.to)
              if (!a || !b) return null
              const dim =
                !includesLevel(starNodeById.get(edge.from)?.level ?? 'N1') ||
                !includesLevel(starNodeById.get(edge.to)?.level ?? 'N1')
              return (
                <line
                  key={i}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke={EDGE_COLOR[edge.type]}
                  strokeWidth={edge.type === 'confusable' ? 1.5 : 1}
                  strokeDasharray={edge.type === 'confusable' ? '4 3' : undefined}
                  opacity={dim ? 0.08 : 0.5}
                />
              )
            })}

            {starNodes.map((node) => {
              const pos = positions.get(node.id)
              if (!pos) return null
              const bucket = masteryBucket(node.id)
              const dim = !includesLevel(node.level)
              const isSelected = selectedId === node.id
              return (
                <g
                  key={node.id}
                  transform={`translate(${pos.x}, ${pos.y})`}
                  onClick={() => setSelectedId(node.id)}
                  className="cursor-pointer"
                  opacity={dim ? 0.25 : 1}
                >
                  <circle
                    r={node.kind === 'particle' ? 15 : 12}
                    fill={BUCKET_COLOR[bucket]}
                    stroke={isSelected ? '#fbbf24' : '#0f172a'}
                    strokeWidth={isSelected ? 3 : 1.5}
                  />
                  <text
                    textAnchor="middle"
                    dy={node.kind === 'particle' ? 5 : 4}
                    fontSize={node.kind === 'particle' ? 14 : 9}
                    fill="white"
                    className="pointer-events-none select-none"
                  >
                    {node.kind === 'particle' ? node.label : node.label.slice(0, 4)}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
          {!selectedNode && <p className="text-sm text-slate-500">点击左侧任意一个节点查看详情。</p>}
          {selectedNode && (
            <div>
              <p className="text-xs font-medium uppercase text-slate-500">
                {selectedNode.level} · {selectedNode.kind === 'particle' ? '助词' : '语法点'}
              </p>
              <h2 className="mt-1 text-2xl font-bold text-white">{selectedNode.label}</h2>
              <p className="mt-1 text-sm text-indigo-300">{selectedNode.meaning}</p>
              <p className="mt-3 text-sm text-slate-400">{selectedNode.usage}</p>

              <div className="mt-3 space-y-2">
                {selectedNode.examples.map((ex, i) => (
                  <div key={i} className="rounded-lg bg-slate-800/60 p-3 text-sm">
                    <p className="text-white">{ex.jp}</p>
                    <p className="mt-1 text-slate-400">{ex.reading}</p>
                    <p className="text-slate-500">{ex.zh}</p>
                  </div>
                ))}
              </div>

              {relatedEdges.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-semibold uppercase text-slate-500">关联节点</p>
                  <div className="mt-2 space-y-2">
                    {relatedEdges.map((edge, i) => {
                      const otherId = edge.from === selectedId ? edge.to : edge.from
                      const other = starNodeById.get(otherId)
                      if (!other) return null
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setSelectedId(otherId)}
                          className="block w-full rounded-lg border border-slate-700 bg-slate-800/40 p-2 text-left text-xs hover:border-indigo-400"
                        >
                          <span className="font-semibold text-amber-400">{other.label}</span>
                          <span className="ml-2 text-slate-400">{edge.note}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {selectedNode.kind === 'particle' ? (
                <MiniParticleQuiz
                  itemId={selectedNode.id}
                  onAnswered={() => forceRerender((n) => n + 1)}
                />
              ) : (
                <SelfCheck itemId={selectedNode.id} onAnswered={() => forceRerender((n) => n + 1)} />
              )}

              <p className="mt-4 text-xs text-slate-500">当前掌握度：{Math.round(getMastery(selectedNode.id) * 100)}%</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </span>
  )
}

function MiniParticleQuiz({ itemId, onAnswered }: { itemId: string; onAnswered: () => void }) {
  const particle = particleById.get(itemId)
  const [exercise, setExercise] = useState(() => (particle ? generateParticleCloze(particle) : null))
  const [selected, setSelected] = useState<string | null>(null)

  if (!particle || !exercise) return null

  function handlePick(opt: string) {
    if (selected) return
    setSelected(opt)
    recordAnswer(itemId, opt === exercise!.correctAnswer)
    onAnswered()
  }

  function retry() {
    setExercise(generateParticleCloze(particle!))
    setSelected(null)
  }

  return (
    <div className="mt-4 rounded-lg border border-slate-700 bg-slate-800/40 p-3">
      <p className="text-xs font-semibold uppercase text-slate-500">小练习</p>
      <p className="mt-2 text-sm text-white">
        {exercise.before}
        <span className="mx-1 text-amber-400">＿＿</span>
        {exercise.after}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {exercise.options.map((opt) => {
          const isCorrect = opt === exercise.correctAnswer
          let style = 'border-slate-600 bg-slate-700 text-slate-200'
          if (selected) {
            if (isCorrect) style = 'border-emerald-500 bg-emerald-500/20 text-emerald-300'
            else if (selected === opt) style = 'border-rose-500 bg-rose-500/20 text-rose-300'
          }
          return (
            <button
              key={opt}
              type="button"
              disabled={!!selected}
              onClick={() => handlePick(opt)}
              className={`rounded-md border px-3 py-1 text-sm ${style}`}
            >
              {opt}
            </button>
          )
        })}
      </div>
      {selected && (
        <button type="button" onClick={retry} className="mt-3 text-xs font-medium text-indigo-400 hover:underline">
          再练一次
        </button>
      )}
    </div>
  )
}

function SelfCheck({ itemId, onAnswered }: { itemId: string; onAnswered: () => void }) {
  const [answered, setAnswered] = useState(false)

  function mark(correct: boolean) {
    recordAnswer(itemId, correct)
    setAnswered(true)
    onAnswered()
  }

  return (
    <div className="mt-4 rounded-lg border border-slate-700 bg-slate-800/40 p-3">
      <p className="text-xs font-semibold uppercase text-slate-500">自我检测</p>
      <p className="mt-2 text-sm text-slate-300">合上例句，你能自己造一个用到这个语法点的句子吗？</p>
      {!answered ? (
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={() => mark(true)}
            className="rounded-md border border-emerald-500 bg-emerald-500/20 px-3 py-1 text-sm text-emerald-300"
          >
            我能
          </button>
          <button
            type="button"
            onClick={() => mark(false)}
            className="rounded-md border border-rose-500 bg-rose-500/20 px-3 py-1 text-sm text-rose-300"
          >
            还不行
          </button>
        </div>
      ) : (
        <p className="mt-3 text-xs text-slate-500">已记录，会安排在合适的时间再复习一次。</p>
      )}
    </div>
  )
}
