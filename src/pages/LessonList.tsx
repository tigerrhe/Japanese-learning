import { Link } from 'react-router-dom'
import { lessons, TOTAL_PLANNED_LESSONS } from '../data/lessons'
import { countLearned } from '../engine/lessonProgress'

function lessonItemIds(lesson: (typeof lessons)[number]): string[] {
  return [
    ...lesson.vocab.map((v) => v.id),
    ...lesson.grammar.map((g) => g.id),
    ...lesson.notes.map((n) => n.id),
  ]
}

export function LessonList() {
  const availableNumbers = new Set(lessons.map((l) => l.number))

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold text-white">教材思维导图</h1>
      <p className="mt-2 text-slate-400">
        按《大家的日本语》课程顺序梳理，每一课的词汇、语法点、注意点都做成可点击的思维导图，而不是一份长长的笔记。
      </p>

      <div className="mt-6 grid grid-cols-5 gap-3 sm:grid-cols-8 md:grid-cols-10">
        {Array.from({ length: TOTAL_PLANNED_LESSONS }, (_, i) => i + 1).map((num) => {
          const available = availableNumbers.has(num)
          const lesson = lessons.find((l) => l.number === num)
          const total = lesson ? lessonItemIds(lesson).length : 0
          const learned = lesson ? countLearned(lessonItemIds(lesson)) : 0
          const done = total > 0 && learned === total

          if (!available) {
            return (
              <div
                key={num}
                className="flex aspect-square items-center justify-center rounded-lg border border-slate-800 bg-slate-900/40 text-sm text-slate-600"
                title="待补充"
              >
                {num}
              </div>
            )
          }

          return (
            <Link
              key={num}
              to={`/textbook/${num}`}
              className={`flex aspect-square flex-col items-center justify-center rounded-lg border text-sm font-semibold transition-colors ${
                done
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
                  : learned > 0
                    ? 'border-indigo-500 bg-indigo-500/10 text-indigo-300'
                    : 'border-slate-700 bg-slate-800 text-slate-200 hover:border-indigo-400'
              }`}
            >
              <span>{num}</span>
              {total > 0 && (
                <span className="mt-0.5 text-[10px] font-normal text-slate-400">
                  {learned}/{total}
                </span>
              )}
            </Link>
          )
        })}
      </div>

      <p className="mt-4 text-xs text-slate-500">灰色的课号是尚未补充的内容，随时可以继续扩充。</p>

      <div className="mt-8 space-y-3">
        {lessons.map((lesson) => (
          <Link
            key={lesson.number}
            to={`/textbook/${lesson.number}`}
            className="block rounded-xl border border-slate-800 bg-slate-900/50 p-4 transition-colors hover:border-indigo-500"
          >
            <p className="text-sm font-semibold text-amber-400">第{lesson.number}课 · {lesson.title}</p>
            <p className="mt-1 text-sm text-slate-400">{lesson.summary}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
