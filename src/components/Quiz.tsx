import { useMemo, useState } from "react";
import { flashcards, quizBank } from "../data/quiz";
import { btn, btn2 } from "./simsStyle";

/* ---------------------------------- quiz ---------------------------------- */

export function Quiz({ unitFilter, onScore }: { unitFilter?: number; onScore?: (pct: number) => void }) {
  const qs = useMemo(() => (unitFilter ? quizBank.filter((q) => q.unit === unitFilter) : quizBank), [unitFilter]);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  if (!qs.length) return null;

  if (done) {
    const pct = Math.round((score / qs.length) * 100);
    return (
      <div className="rounded-2xl border border-indigo-200 bg-white p-6 text-center dark:border-indigo-500/30 dark:bg-slate-900">
        <p className="text-6xl font-black text-indigo-600 dark:text-indigo-400">{pct}%</p>
        <p className="mt-1 text-slate-600 dark:text-slate-300">
          {score} of {qs.length} correct · {pct >= 80 ? "Exam ready 🎉" : pct >= 50 ? "Good — revise the flagged topics" : "Re-read the unit and try again"}
        </p>
        <button
          className={`${btn} mt-4`}
          onClick={() => {
            setIdx(0); setPicked(null); setScore(0); setDone(false);
            onScore?.(pct);
          }}
        >
          Retry this set
        </button>
      </div>
    );
  }

  const q = qs[idx];
  return (
    <div className="rounded-2xl border border-indigo-200 bg-white p-5 dark:border-indigo-500/30 dark:bg-slate-900">
      <div className="mb-3 flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
        <span>Question {idx + 1} / {qs.length} · Unit {q.unit}</span>
        <span>Score {score}</span>
      </div>
      <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
        <div className="h-full bg-indigo-500 transition-all" style={{ width: `${((idx) / qs.length) * 100}%` }} />
      </div>
      <p className="mb-4 text-base font-semibold text-slate-900 dark:text-white">{q.q}</p>
      <div className="space-y-2">
        {q.options.map((o, i) => {
          const state = picked === null ? "idle" : i === q.answer ? "right" : i === picked ? "wrong" : "dim";
          return (
            <button
              key={i}
              disabled={picked !== null}
              onClick={() => {
                setPicked(i);
                if (i === q.answer) setScore((s) => s + 1);
              }}
              className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition ${
                state === "right"
                  ? "border-emerald-400 bg-emerald-50 font-semibold text-emerald-900 dark:bg-emerald-500/20 dark:text-emerald-200"
                  : state === "wrong"
                  ? "border-rose-400 bg-rose-50 font-semibold text-rose-900 dark:bg-rose-500/20 dark:text-rose-200"
                  : state === "dim"
                  ? "border-slate-200 text-slate-400 dark:border-slate-700 dark:text-slate-500"
                  : "border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 dark:border-slate-700 dark:hover:bg-slate-800"
              }`}
            >
              <span className="mr-2 font-bold">{String.fromCharCode(65 + i)}.</span>
              {o}
            </button>
          );
        })}
      </div>
      {picked !== null && (
        <div className="mt-4 rounded-xl bg-slate-50 p-3 text-sm dark:bg-slate-800/60">
          <p className="font-semibold text-slate-800 dark:text-slate-100">
            {picked === q.answer ? "✅ Correct!" : "❌ Not quite."}
          </p>
          <p className="mt-1 text-slate-600 dark:text-slate-300">{q.why}</p>
          <button
            className={`${btn} mt-3`}
            onClick={() => {
              if (idx + 1 >= qs.length) { setDone(true); onScore?.(Math.round((score / qs.length) * 100)); }
              else { setIdx((i) => i + 1); setPicked(null); }
            }}
          >
            {idx + 1 >= qs.length ? "See result" : "Next question →"}
          </button>
        </div>
      )}
    </div>
  );
}

/* ------------------------------- flashcards ------------------------------- */

export function Flashcards({ unitFilter }: { unitFilter?: number }) {
  const cards = useMemo(() => (unitFilter ? flashcards.filter((f) => f.unit === unitFilter) : flashcards), [unitFilter]);
  const [i, setI] = useState(0);
  const [flip, setFlip] = useState(false);
  if (!cards.length) return null;
  const c = cards[i % cards.length];
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
      <div className="mb-3 flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
        <span>Card {(i % cards.length) + 1} / {cards.length}</span>
        <span>Unit {c.unit}</span>
      </div>
      <button
        onClick={() => setFlip((f) => !f)}
        className="min-h-[150px] w-full rounded-xl border-2 border-dashed border-indigo-300 bg-indigo-50/50 p-5 text-left transition hover:bg-indigo-50 dark:border-indigo-500/40 dark:bg-indigo-500/5 dark:hover:bg-indigo-500/10"
      >
        {flip ? (
          <p className="text-sm leading-relaxed text-slate-800 dark:text-slate-100">{c.back}</p>
        ) : (
          <p className="text-lg font-bold text-slate-900 dark:text-white">{c.front}</p>
        )}
        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">{flip ? "click to hide" : "click to reveal"}</p>
      </button>
      <div className="mt-3 flex gap-2">
        <button className={btn2} onClick={() => { setI((x) => (x - 1 + cards.length) % cards.length); setFlip(false); }}>← Prev</button>
        <button className={btn} onClick={() => { setI((x) => (x + 1) % cards.length); setFlip(false); }}>Next →</button>
        <button className={btn2} onClick={() => setFlip((f) => !f)}>Flip</button>
      </div>
    </div>
  );
}
