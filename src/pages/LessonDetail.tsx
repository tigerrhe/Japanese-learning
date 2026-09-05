import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { lessonByNumber } from '../data/lessons'
import type { GrammarPoint, LessonNote, VocabItem } from '../data/lessons'
import { isLearned, toggleLearned } from '../engine/lessonProgress'

type CategoryKey = 'vocab' | 'grammar' | 'notes'

interface CategoryDef {
  key: CategoryKey
  label: string
  color: string
  angleDeg: number
}

const CATEGORIES: CategoryDef[] = [
  { key: 'grammar', label: '语法点', color: '#6366f1', angleDeg: -90 },
  { key: 'notes', label: '注意点', color: '#f59e0b', angleDeg: 30 },
  { key: 'vocab', label: '词汇', color: '#10b981', angleDeg: 150 },
]

const CENTER = { x: 420, y: 320 }
const BRANCH_RADIUS = 130
const LEAF_RINGS = [200, 250, 300]

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = (deg * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

interface SelectedLeaf {
  category: CategoryKey
  id: string
}

/** Spreads items across a fan of concentric rings so labels don't collide, even with 10+ items. */
function layoutLeaves(items: Array<{ id: string }>, centerAngle: number): Map<string, { x: number; y: number }> {
  const ringCount = items.length <= 4 ? 1 : items.length <= 8 ? 2 : 3
  const spread = Math.min(130, Math.max(55, items.length * 13))
  const positions = new Map<string, { x: number; y: number }>()

  const rings: Array<{ id: string }[]> = Array.from({ length: ringCount }, () => [])
  items.forEach((item, i) => rings[i % ringCount].push(item))

  rings.forEach((ringItems, ringIndex) => {
    const radius = LEAF_RINGS[ringIndex] ?? LEAF_RINGS[LEAF_RINGS.length - 1]
    ringItems.forEach((item, i) => {
      const step = ringItems.length > 1 ? spread / (ringItems.length - 1) : 0
      const deg = centerAngle - spread / 2 + step * i
      positions.set(item.id, polar(CENTER.x, CENTER.y, radius, deg))
    })
  })

  return positions
}

export function LessonDetail() {
  const { number } = useParams<{ number: string }>()
  const lesson = number ? lessonByNumber.get(Number(number)) : undefined
  const [expanded, setExpanded] = useState<CategoryKey | null>(null)
  const [selected, setSelected] = useState<SelectedLeaf | null>(null)
  const [, forceRerender] = useState(0)

  const leafPositions = useMemo(() => {
    if (!lesson || !expanded) return new Map<string, { x: number; y: number }>()
    const category = CATEGORIES.find((c) => c.key === expanded)!
    const items = lesson[category.key] as Array<{ id: string }>
    return layoutLeaves(items, category.angleDeg)
  }, [lesson, expanded])

  if (!lesson) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8 text-center text-slate-400">
        <p>这一课还没有补充内容。</p>
        <Link to="/textbook" className="mt-3 inline-block text-indigo-400 hover:underline">
          返回课程列表
        </Link>
      </div>
    )
  }

  function handleToggleLearned(id: string) {
    toggleLearned(id)
    forceRerender((n) => n + 1)
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="flex items-center justify-between">
        <div>
          <Link to="/textbook" className="text-xs text-slate-500 hover:text-slate-300">
            ← 返回课程列表
          </Link>
          <h1 className="mt-1 text-2xl font-bold text-white">
            第{lesson.number}课 · {lesson.title}
          </h1>
          <p className="mt-1 text-sm text-slate-400">{lesson.summary}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
          <svg viewBox="0 0 840 660" className="h-auto w-full">
            {CATEGORIES.map((cat) => {
              const pos = polar(CENTER.x, CENTER.y, BRANCH_RADIUS, cat.angleDeg)
              return (
                <line key={cat.key} x1={CENTER.x} y1={CENTER.y} x2={pos.x} y2={pos.y} stroke="#334155" strokeWidth={1.5} />
              )
            })}

            {expanded &&
              (lesson[expanded] as Array<{ id: string }>).map((item) => {
                const branch = CATEGORIES.find((c) => c.key === expanded)!
                const branchPos = polar(CENTER.x, CENTER.y, BRANCH_RADIUS, branch.angleDeg)
                const leafPos = leafPositions.get(item.id)
                if (!leafPos) return null
                return (
                  <line
                    key={item.id}
                    x1={branchPos.x}
                    y1={branchPos.y}
                    x2={leafPos.x}
                    y2={leafPos.y}
                    stroke="#1e293b"
                    strokeWidth={1}
                  />
                )
              })}

            <circle cx={CENTER.x} cy={CENTER.y} r={44} fill="#1e1b4b" stroke="#818cf8" strokeWidth={2} />
            <text x={CENTER.x} y={CENTER.y - 4} textAnchor="middle" fontSize={18} fontWeight={700} fill="white">
              第{lesson.number}课
            </text>
            <text x={CENTER.x} y={CENTER.y + 16} textAnchor="middle" fontSize={11} fill="#a5b4fc">
              点击分支展开
            </text>

            {CATEGORIES.map((cat) => {
              const pos = polar(CENTER.x, CENTER.y, BRANCH_RADIUS, cat.angleDeg)
              const items = lesson[cat.key] as Array<{ id: string }>
              const isOpen = expanded === cat.key
              return (
                <g
                  key={cat.key}
                  transform={`translate(${pos.x}, ${pos.y})`}
                  className="cursor-pointer"
                  onClick={() => setExpanded(isOpen ? null : cat.key)}
                >
                  <circle r={34} fill={cat.color} opacity={isOpen ? 1 : 0.75} stroke="#0f172a" strokeWidth={2} />
                  <text textAnchor="middle" dy={-2} fontSize={13} fontWeight={600} fill="white">
                    {cat.label}
                  </text>
                  <text textAnchor="middle" dy={14} fontSize={10} fill="white" opacity={0.85}>
                    {items.length}项
                  </text>
                </g>
              )
            })}

            {expanded &&
              (lesson[expanded] as Array<{ id: string }>).map((item) => {
                const pos = leafPositions.get(item.id)
                if (!pos) return null
                const category = CATEGORIES.find((c) => c.key === expanded)!
                const learned = isLearned(item.id)
                const isSelected = selected?.id === item.id
                const label =
                  expanded === 'vocab'
                    ? (item as VocabItem).word
                    : expanded === 'grammar'
                      ? (item as GrammarPoint).title
                      : (item as LessonNote).title

                const displayLabel = label.length > 8 ? `${label.slice(0, 8)}…` : label
                const boxWidth = Math.min(120, Math.max(44, displayLabel.length * 13 + 16))

                return (
                  <g
                    key={item.id}
                    transform={`translate(${pos.x}, ${pos.y})`}
                    className="cursor-pointer"
                    onClick={() => setSelected({ category: expanded, id: item.id })}
                  >
                    <rect
                      x={-boxWidth / 2}
                      y={-15}
                      width={boxWidth}
                      height={30}
                      rx={8}
                      fill={learned ? '#064e3b' : '#1e293b'}
                      stroke={isSelected ? '#fbbf24' : learned ? '#10b981' : category.color}
                      strokeWidth={isSelected ? 2.5 : 1.5}
                    />
                    <text textAnchor="middle" dy={4} fontSize={11} fill="white" className="select-none">
                      {displayLabel}
                    </text>
                  </g>
                )
              })}
          </svg>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
          {!selected && <p className="text-sm text-slate-500">点击中心节点周围的分支展开，再点具体条目查看解释。</p>}

          {selected && selected.category === 'vocab' && (
            <VocabDetail item={lesson.vocab.find((v) => v.id === selected.id)!} onToggle={handleToggleLearned} />
          )}
          {selected && selected.category === 'grammar' && (
            <GrammarDetail item={lesson.grammar.find((g) => g.id === selected.id)!} onToggle={handleToggleLearned} />
          )}
          {selected && selected.category === 'notes' && (
            <NoteDetail item={lesson.notes.find((n) => n.id === selected.id)!} onToggle={handleToggleLearned} />
          )}
        </div>
      </div>
    </div>
  )
}

function LearnedButton({ id, onToggle }: { id: string; onToggle: (id: string) => void }) {
  const learned = isLearned(id)
  return (
    <button
      type="button"
      onClick={() => onToggle(id)}
      className={`mt-4 rounded-lg border px-3 py-1.5 text-xs font-medium ${
        learned ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300' : 'border-slate-600 bg-slate-800 text-slate-300'
      }`}
    >
      {learned ? '✓ 已掌握' : '标记为已掌握'}
    </button>
  )
}

function VocabDetail({ item, onToggle }: { item: VocabItem; onToggle: (id: string) => void }) {
  return (
    <div>
      <p className="text-xs uppercase text-slate-500">词汇</p>
      <h3 className="mt-1 text-2xl font-bold text-white">{item.word}</h3>
      <p className="mt-1 text-slate-400">{item.reading}</p>
      <p className="mt-2 text-slate-300">{item.zh}</p>
      <LearnedButton id={item.id} onToggle={onToggle} />
    </div>
  )
}

function GrammarDetail({ item, onToggle }: { item: GrammarPoint; onToggle: (id: string) => void }) {
  return (
    <div>
      <p className="text-xs uppercase text-slate-500">语法点</p>
      <h3 className="mt-1 text-lg font-bold text-white">{item.title}</h3>
      <p className="mt-2 text-sm text-slate-300">{item.explanation}</p>
      <div className="mt-3 space-y-2">
        {item.examples.map((ex, i) => (
          <div key={i} className="rounded-lg bg-slate-800/60 p-3 text-sm">
            <p className="text-white">{ex.jp}</p>
            <p className="mt-1 text-slate-400">{ex.reading}</p>
            <p className="text-slate-500">{ex.zh}</p>
          </div>
        ))}
      </div>
      {item.linkedStarNodeIds && item.linkedStarNodeIds.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {item.linkedStarNodeIds.map((id) => (
            <Link
              key={id}
              to={`/starmap?node=${id}`}
              className="rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-medium text-indigo-300 hover:bg-indigo-500/30"
            >
              在知识星图中查看 →
            </Link>
          ))}
        </div>
      )}
      <LearnedButton id={item.id} onToggle={onToggle} />
    </div>
  )
}

function NoteDetail({ item, onToggle }: { item: LessonNote; onToggle: (id: string) => void }) {
  return (
    <div>
      <p className="text-xs uppercase text-amber-500">注意点</p>
      <h3 className="mt-1 text-lg font-bold text-white">{item.title}</h3>
      <p className="mt-2 text-sm text-slate-300">{item.content}</p>
      <LearnedButton id={item.id} onToggle={onToggle} />
    </div>
  )
}
