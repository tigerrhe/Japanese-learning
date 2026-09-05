import { useMemo, useState } from 'react'
import { keigoScenarios } from '../data/keigoScenarios'
import type { KeigoScenario, KeigoVariant } from '../data/types'
import { recordAnswer } from '../engine/srs'

function pickVariant(scenario: KeigoScenario, stage: number): KeigoVariant {
  return (
    scenario.variants.find((v) => stage >= v.stageMin && stage <= v.stageMax) ??
    scenario.variants[scenario.variants.length - 1]
  )
}

function HighlightedSentence({ sentence, changedWord }: { sentence: string; changedWord: string }) {
  const idx = sentence.indexOf(changedWord)
  if (idx === -1) return <>{sentence}</>
  return (
    <>
      {sentence.slice(0, idx)}
      <span className="rounded bg-amber-400/20 px-1 text-amber-300">{changedWord}</span>
      {sentence.slice(idx + changedWord.length)}
    </>
  )
}

function relationshipLabel(stage: number, perspective: 'other' | 'self'): string {
  if (stage <= 33) return '关系很近：家人、朋友（普通体 タメ口）'
  if (stage <= 66) return '一般社交距离：同事、初次见面（丁寧語）'
  return perspective === 'other' ? '对方地位高：上司、长辈（尊敬語，抬高对方）' : '面对地位高的人谈自己：（謙譲語，自谦）'
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function randomRound() {
  const scenario = keigoScenarios[Math.floor(Math.random() * keigoScenarios.length)]
  const targetVariant = scenario.variants[Math.floor(Math.random() * scenario.variants.length)]
  const options = shuffle(scenario.variants)
  return { scenario, targetVariant, options }
}

function QuizMode() {
  const [round, setRound] = useState(() => randomRound())
  const [selected, setSelected] = useState<string | null>(null)
  const { scenario, targetVariant, options } = round

  function handlePick(v: KeigoVariant) {
    if (selected) return
    setSelected(v.level)
    recordAnswer(`keigo-${scenario.id}-${targetVariant.level}`, v.level === targetVariant.level)
  }

  function next() {
    setRound(randomRound())
    setSelected(null)
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
      <p className="text-sm text-slate-400">情境：{scenario.situation}</p>
      <p className="mt-1 text-sm font-medium text-indigo-300">
        对象关系：{relationshipLabel((targetVariant.stageMin + targetVariant.stageMax) / 2, scenario.perspective)}
      </p>
      <p className="mt-4 text-xs text-slate-500">请选出这个关系下最合适的说法：</p>
      <div className="mt-3 flex flex-col gap-2">
        {options.map((v) => {
          const isSelected = selected === v.level
          const isCorrect = v.level === targetVariant.level
          let style = 'border-slate-700 bg-slate-800 hover:border-indigo-400'
          if (selected) {
            if (isCorrect) style = 'border-emerald-500 bg-emerald-500/20'
            else if (isSelected) style = 'border-rose-500 bg-rose-500/20'
            else style = 'border-slate-800 bg-slate-800/50 opacity-60'
          }
          return (
            <button
              key={v.level}
              type="button"
              disabled={!!selected}
              onClick={() => handlePick(v)}
              className={`rounded-lg border-2 px-4 py-3 text-left text-white transition-colors ${style}`}
            >
              {v.sentence}
              <span className="ml-2 text-xs text-slate-400">{v.reading}</span>
            </button>
          )
        })}
      </div>
      {selected && (
        <div className="mt-4 rounded-lg bg-slate-800/70 p-4 text-sm">
          <p className={selected === targetVariant.level ? 'font-semibold text-emerald-400' : 'font-semibold text-rose-400'}>
            {selected === targetVariant.level ? '答对了！' : `正确答案是：${targetVariant.sentence}`}
          </p>
          <button type="button" onClick={next} className="mt-3 rounded-lg bg-indigo-500 px-4 py-2 font-semibold text-white hover:bg-indigo-400">
            下一题
          </button>
        </div>
      )}
    </div>
  )
}

export function Keigo() {
  const [scenarioId, setScenarioId] = useState(keigoScenarios[0].id)
  const [stage, setStage] = useState(10)
  const [mode, setMode] = useState<'explore' | 'quiz'>('explore')

  const scenario = useMemo(() => keigoScenarios.find((s) => s.id === scenarioId) ?? keigoScenarios[0], [scenarioId])
  const variant = useMemo(() => pickVariant(scenario, stage), [scenario, stage])

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold text-white">敬语关系滑块</h1>
      <p className="mt-2 text-slate-400">拖动滑块改变你和对方的社会距离，同一句话会实时切换敬语级别——看得见敬语背后的逻辑。</p>

      <div className="mt-5 flex gap-2">
        <button
          type="button"
          onClick={() => setMode('explore')}
          className={`rounded-lg px-4 py-2 text-sm font-medium ${mode === 'explore' ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-300'}`}
        >
          探索模式
        </button>
        <button
          type="button"
          onClick={() => setMode('quiz')}
          className={`rounded-lg px-4 py-2 text-sm font-medium ${mode === 'quiz' ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-300'}`}
        >
          小测验
        </button>
      </div>

      {mode === 'explore' ? (
        <div className="mt-6">
          <label htmlFor="scenario-select" className="mb-2 block text-sm text-slate-400">
            选择情境
          </label>
          <select
            id="scenario-select"
            value={scenarioId}
            onChange={(e) => setScenarioId(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white"
          >
            {keigoScenarios.map((s) => (
              <option key={s.id} value={s.id}>
                {s.situation}
              </option>
            ))}
          </select>

          <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900/50 p-6">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              动作：{scenario.baseAction} · {scenario.perspective === 'other' ? '对方视角' : '自己视角'}
            </p>

            <p className="mt-4 text-2xl leading-relaxed text-white">
              <HighlightedSentence sentence={variant.sentence} changedWord={variant.changedWord} />
            </p>
            <p className="mt-2 text-sm text-slate-400">{variant.reading}</p>
            <p className="mt-1 text-sm text-slate-500">{variant.zh}</p>
            <p className="mt-3 inline-block rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-medium text-indigo-300">
              {variant.levelLabel}
            </p>

            <div className="mt-6">
              <input
                type="range"
                min={0}
                max={100}
                value={stage}
                onChange={(e) => setStage(Number(e.target.value))}
                className="w-full accent-indigo-500"
              />
              <div className="mt-1 flex justify-between text-xs text-slate-500">
                <span>家人朋友</span>
                <span>同事/一般关系</span>
                <span>上司/长辈/客户</span>
              </div>
              <p className="mt-2 text-center text-xs text-slate-400">{relationshipLabel(stage, scenario.perspective)}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-6">
          <QuizMode />
        </div>
      )}
    </div>
  )
}
