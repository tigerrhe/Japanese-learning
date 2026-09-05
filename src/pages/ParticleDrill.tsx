import { useMemo, useState } from 'react'
import { particleById, particles } from '../data/particles'
import { generateParticleCloze, type ClozeExercise } from '../engine/exercises'
import { useLevelFilter } from '../engine/LevelContext'
import { recordAnswer, sortByDueFirst } from '../engine/srs'

const SESSION_SIZE = 10

function buildQueue(includesLevel: (l: (typeof particles)[number]['level']) => boolean): string[] {
  const candidates = particles.filter((p) => includesLevel(p.level) && p.examples.length > 0).map((p) => p.id)
  return sortByDueFirst(candidates).slice(0, SESSION_SIZE)
}

export function ParticleDrill() {
  const { includesLevel, filter } = useLevelFilter()
  const [queue, setQueue] = useState<string[]>(() => buildQueue(includesLevel))
  const [pos, setPos] = useState(0)
  const [exercise, setExercise] = useState<ClozeExercise | null>(() => {
    const first = queue[0]
    const p = first ? particleById.get(first) : undefined
    return p ? generateParticleCloze(p) : null
  })
  const [selected, setSelected] = useState<string | null>(null)
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [combo, setCombo] = useState(0)

  const finished = pos >= queue.length

  function loadExercise(index: number, q: string[]) {
    const id = q[index]
    const p = id ? particleById.get(id) : undefined
    setExercise(p ? generateParticleCloze(p) : null)
    setSelected(null)
  }

  function handleAnswer(option: string) {
    if (!exercise || selected) return
    setSelected(option)
    const correct = option === exercise.correctAnswer
    recordAnswer(exercise.itemId, correct)
    setScore((s) => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }))
    setCombo((c) => (correct ? c + 1 : 0))
  }

  function handleNext() {
    const nextPos = pos + 1
    setPos(nextPos)
    if (nextPos < queue.length) loadExercise(nextPos, queue)
  }

  function handleRestart() {
    const q = buildQueue(includesLevel)
    setQueue(q)
    setPos(0)
    setScore({ correct: 0, total: 0 })
    setCombo(0)
    loadExercise(0, q)
  }

  const targetParticle = useMemo(() => (exercise ? particleById.get(exercise.itemId) : undefined), [exercise])

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">助词专项训练</h1>
        <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
          范围：{filter === 'All' ? '全部等级' : `N5 ~ ${filter}`}
        </span>
      </div>
      <p className="mt-2 text-slate-400">点选正确的助词填空，选错时会解释两者的区别，而不是只告诉你答案。</p>

      {queue.length === 0 && (
        <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900/50 p-6 text-center text-slate-400">
          当前等级范围内没有可练习的助词，试试切换到更高的等级。
        </div>
      )}

      {queue.length > 0 && !finished && exercise && targetParticle && (
        <div className="mt-6">
          <div className="mb-3 flex items-center justify-between text-xs text-slate-400">
            <span>
              第 {pos + 1} / {queue.length} 题
            </span>
            <span>
              连对 <span className="font-semibold text-amber-400">{combo}</span>
            </span>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{targetParticle.level}</p>
            <p className="mt-3 text-xl leading-relaxed text-white">
              {exercise.before}
              <span className="mx-1 inline-block min-w-[2.5rem] rounded border-b-2 border-amber-400 text-center text-amber-400">
                {selected ?? '　　'}
              </span>
              {exercise.after}
            </p>
            <p className="mt-2 text-sm text-slate-400">{exercise.reading}</p>
            <p className="mt-1 text-sm text-slate-500">{exercise.zh}</p>

            <div className="mt-5 flex flex-wrap gap-3">
              {exercise.options.map((opt) => {
                const isSelected = selected === opt
                const isCorrect = opt === exercise.correctAnswer
                let style = 'border-slate-700 bg-slate-800 text-slate-200 hover:border-indigo-400'
                if (selected) {
                  if (isCorrect) style = 'border-emerald-500 bg-emerald-500/20 text-emerald-300'
                  else if (isSelected) style = 'border-rose-500 bg-rose-500/20 text-rose-300'
                  else style = 'border-slate-800 bg-slate-800/50 text-slate-500'
                }
                return (
                  <button
                    key={opt}
                    type="button"
                    disabled={!!selected}
                    onClick={() => handleAnswer(opt)}
                    className={`min-w-[3.5rem] rounded-lg border-2 px-4 py-2 text-lg font-medium transition-colors ${style}`}
                  >
                    {opt}
                  </button>
                )
              })}
            </div>

            {selected && (
              <div className="mt-5 rounded-lg bg-slate-800/70 p-4">
                <p className={`font-semibold ${selected === exercise.correctAnswer ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {selected === exercise.correctAnswer ? '答对了！' : `不对，正确答案是「${exercise.correctAnswer}」`}
                </p>
                {exercise.note && <p className="mt-2 text-sm text-slate-300">{exercise.note}</p>}
                <button
                  type="button"
                  onClick={handleNext}
                  className="mt-4 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400"
                >
                  下一题
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {queue.length > 0 && finished && (
        <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900/50 p-8 text-center">
          <p className="text-3xl font-bold text-white">
            {score.correct} / {score.total}
          </p>
          <p className="mt-2 text-slate-400">本组答对率 {Math.round((score.correct / Math.max(score.total, 1)) * 100)}%</p>
          <button
            type="button"
            onClick={handleRestart}
            className="mt-6 rounded-lg bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-400"
          >
            再来一组
          </button>
        </div>
      )}
    </div>
  )
}
