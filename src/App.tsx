import { useEffect, useMemo, useState } from "react";
import { unit1 } from "./data/unit1";
import { unit2 } from "./data/unit2";
import { unit3 } from "./data/unit3";
import { unit4, unit5 } from "./data/unit45";
import { glossary } from "./data/quiz";
import { syllabusRaw } from "./data/raw";
import type { Unit } from "./types";
import { BlockView } from "./components/BlockView";
import { Flashcards, Quiz } from "./components/Quiz";
import { quizBank } from "./data/quiz";
import { PrintDoc } from "./components/PrintDoc";
import hero from "./assets/hero.png";

const units: Unit[] = [unit1, unit2, unit3, unit4, unit5];
const TOTAL_TOPICS = units.reduce((a, u) => a + u.topics.length, 0);
const TOTAL_MINUTES = units.reduce((a, u) => a + u.topics.reduce((x, t) => x + t.minutes, 0), 0);

type View = "home" | "unit" | "syllabus" | "practice" | "glossary" | "books" | "plan";

const ACCENT: Record<string, { chip: string; grad: string; text: string; border: string; dot: string }> = {
  cyan: { chip: "bg-cyan-100 text-cyan-800 dark:bg-cyan-500/20 dark:text-cyan-300", grad: "from-cyan-500 to-sky-600", text: "text-cyan-600 dark:text-cyan-400", border: "border-cyan-300 dark:border-cyan-500/40", dot: "bg-cyan-500" },
  violet: { chip: "bg-violet-100 text-violet-800 dark:bg-violet-500/20 dark:text-violet-300", grad: "from-violet-500 to-purple-600", text: "text-violet-600 dark:text-violet-400", border: "border-violet-300 dark:border-violet-500/40", dot: "bg-violet-500" },
  emerald: { chip: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300", grad: "from-emerald-500 to-teal-600", text: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-300 dark:border-emerald-500/40", dot: "bg-emerald-500" },
  amber: { chip: "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300", grad: "from-amber-500 to-orange-600", text: "text-amber-600 dark:text-amber-400", border: "border-amber-300 dark:border-amber-500/40", dot: "bg-amber-500" },
  rose: { chip: "bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-300", grad: "from-rose-500 to-pink-600", text: "text-rose-600 dark:text-rose-400", border: "border-rose-300 dark:border-rose-500/40", dot: "bg-rose-500" },
};

function useStored<T>(key: string, initial: T) {
  const [v, setV] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(v));
    } catch {}
  }, [key, v]);
  return [v, setV] as const;
}

export default function App() {
  const [view, setView] = useState<View>("home");
  const [unitId, setUnitId] = useState(units[0].id);
  const [topicId, setTopicId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [dark, setDark] = useStored("ics.dark", true);
  const [done, setDone] = useStored<Record<string, boolean>>("ics.done", {});
  const [notes, setNotes] = useStored<Record<string, string>>("ics.notes", {});
  const [navOpen, setNavOpen] = useState(false);
  const [printReady, setPrintReady] = useState(false);

  const unit = units.find((u) => u.id === unitId)!;
  const topic = unit.topics.find((t) => t.id === topicId) ?? null;
  const progress = Math.round((Object.values(done).filter(Boolean).length / TOTAL_TOPICS) * 100);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  useEffect(() => {
    if (!printReady) return;
    const restore = () => {
      if (dark) document.documentElement.classList.add("dark");
      setPrintReady(false);
    };
    window.addEventListener("afterprint", restore);
    if (dark) document.documentElement.classList.remove("dark");
    const t = setTimeout(() => window.print(), 400);
    return () => {
      clearTimeout(t);
      window.removeEventListener("afterprint", restore);
    };
  }, [printReady, dark]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [view, unitId, topicId]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        const el = document.getElementById("global-search") as HTMLInputElement | null;
        el?.focus();
      }
      if (e.key === "Escape") setQuery("");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    const out: { unit: Unit; title: string; snippet: string; id: string }[] = [];
    for (const u of units)
      for (const t of u.topics) {
        const hay = (t.title + " " + u.title + " " + t.blocks.map((b) => ("text" in b ? String((b as any).text) : "")).join(" ")).toLowerCase();
        const at = hay.indexOf(q);
        if (at >= 0)
          out.push({
            unit: u,
            title: t.title,
            id: t.id,
            snippet: "…" + hay.slice(Math.max(0, at - 60), at + 110).replace(/[<>]/g, "") + "…",
          });
      }
    return out.slice(0, 12);
  }, [query]);

  const go = (v: View, u?: string, t?: string) => {
    setView(v);
    if (u) setUnitId(u);
    if (t) setTopicId(t);
    setNavOpen(false);
  };

  const NavItem = ({ v, label, icon }: { v: View; label: string; icon: string }) => (
    <button
      onClick={() => go(v)}
      className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-semibold transition ${
        view === v ? "bg-indigo-600 text-white shadow" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
      }`}
    >
      <span className="w-5 text-center">{icon}</span>
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-[#0b1020] dark:text-slate-100">
      {/* ---------------------------- top bar ---------------------------- */}
      <header className="no-print sticky top-0 z-40 border-b border-slate-200 bg-white/85 backdrop-blur-lg dark:border-slate-800 dark:bg-[#0b1020]/85">
        <div className="mx-auto flex max-w-[1400px] items-center gap-3 px-3 py-2.5 sm:px-5">
          <button className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden" onClick={() => setNavOpen((o) => !o)}>
            ☰
          </button>
          <div className="flex min-w-0 items-center gap-2">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-lg shadow-lg shadow-indigo-500/30">
              🛡️
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-black uppercase tracking-tight">Internet &amp; Cyber Security</p>
              <p className="truncate text-[11px] text-slate-500 dark:text-slate-400">Interactive syllabus companion · notes · simulations · PDF</p>
            </div>
          </div>

          <div className="relative ml-auto hidden max-w-sm flex-1 md:block">
            <input
              id="global-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search topics — phishing, RSA, Sec. 66F, RTO…  (Ctrl+K)"
              className="w-full rounded-full border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800"
            />
            <span className="pointer-events-none absolute left-3 top-2.5 text-slate-400">🔍</span>
            {results.length > 0 && (
              <div className="absolute left-0 right-0 top-11 max-h-96 overflow-y-auto rounded-xl border border-slate-200 bg-white p-2 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
                {results.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => {
                      go("unit", r.unit.id, r.id);
                      setQuery("");
                    }}
                    className="block w-full rounded-lg px-3 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <p className="text-sm font-semibold">{r.title}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Unit {r.unit.no} · {r.snippet}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="ml-auto flex items-center gap-2 md:ml-0">
            <div className="hidden items-center gap-2 sm:flex">
              <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all" style={{ width: `${progress}%` }} />
              </div>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{progress}%</span>
            </div>
            <button
              onClick={() => setPrintReady(true)}
              className="rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-3 py-2 text-xs font-bold text-white shadow hover:brightness-110"
              title="Print the complete study guide or save it as PDF"
            >
              🖨️ Save as PDF
            </button>
            <button onClick={() => setDark((d) => !d)} className="rounded-lg border border-slate-300 px-2.5 py-2 text-sm dark:border-slate-700" title="Toggle theme">
              {dark ? "☀️" : "🌙"}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1400px] gap-6 px-3 py-5 sm:px-5">
        {/* --------------------------- sidebar --------------------------- */}
        <aside className={`no-print ${navOpen ? "fixed inset-y-0 left-0 z-50 w-72 overflow-y-auto bg-white p-4 shadow-2xl dark:bg-slate-900" : "hidden"} shrink-0 lg:sticky lg:top-[68px] lg:block lg:h-[calc(100vh-84px)] lg:w-64 lg:overflow-y-auto lg:bg-transparent lg:p-0 lg:shadow-none`}>
          {navOpen && <button className="absolute right-3 top-3 text-xl" onClick={() => setNavOpen(false)}>✕</button>}
          <nav className="space-y-1">
            <NavItem v="home" label="Dashboard" icon="🏠" />
            <NavItem v="syllabus" label="Syllabus (official)" icon="📄" />
            <NavItem v="practice" label="Practice & MCQs" icon="🎯" />
            <NavItem v="glossary" label="Glossary" icon="📖" />
            <NavItem v="plan" label="Study plan" icon="🗓️" />
            <NavItem v="books" label="Books & references" icon="📚" />
          </nav>

          <p className="mb-2 mt-5 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">Units</p>
          <div className="space-y-1">
            {units.map((u) => {
              const uDone = u.topics.filter((t) => done[t.id]).length;
              const a = ACCENT[u.accent];
              return (
                <div key={u.id} className="rounded-lg">
                  <button
                    onClick={() => go("unit", u.id)}
                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold transition ${
                      view === "unit" && unitId === u.id ? "bg-slate-900 text-white dark:bg-slate-800" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                    }`}
                  >
                    <span className={`h-2 w-2 rounded-full ${a.dot}`} />
                    <span className="flex-1 truncate">Unit {u.no} · {u.title.split("&")[0].trim()}</span>
                    <span className="text-[10px] opacity-70">{uDone}/{u.topics.length}</span>
                  </button>
                  {view === "unit" && unitId === u.id && (
                    <div className="ml-5 mt-1 space-y-0.5 border-l-2 border-slate-200 pl-2 dark:border-slate-700">
                      {u.topics.map((t) => (
                        <button
                          key={t.id}
                          onClick={() => setTopicId(t.id)}
                          className={`block w-full truncate rounded px-2 py-1 text-left text-xs transition ${
                            topicId === t.id ? "font-bold text-indigo-600 dark:text-indigo-400" : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                          }`}
                        >
                          {done[t.id] ? "✅ " : "○ "}
                          {t.title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-6 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-700 p-4 text-white">
            <p className="text-xs font-bold uppercase tracking-wider opacity-80">Your progress</p>
            <p className="text-3xl font-black">{progress}%</p>
            <p className="text-xs opacity-80">
              {Object.values(done).filter(Boolean).length} of {TOTAL_TOPICS} topics marked complete
            </p>
            <button onClick={() => setDone({})} className="mt-2 rounded bg-white/20 px-2 py-1 text-[11px] font-semibold hover:bg-white/30">
              Reset progress
            </button>
          </div>
        </aside>

        {navOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setNavOpen(false)} />}

        {/* ---------------------------- content ---------------------------- */}
        <main className="no-print min-w-0 flex-1">
          {view === "home" && <Home go={go} done={done} />}
          {view === "syllabus" && <SyllabusView go={go} />}
          {view === "glossary" && <GlossaryView />}
          {view === "books" && <BooksView />}
          {view === "plan" && <PlanView done={done} />}

          {view === "practice" && (
            <PracticeView />
          )}

          {view === "unit" && (
            <div className="animate-fade-up">
              {/* unit header */}
              <div className={`overflow-hidden rounded-2xl border ${ACCENT[unit.accent].border} bg-white shadow-sm dark:bg-slate-900`}>
                <div className={`bg-gradient-to-r ${ACCENT[unit.accent].grad} px-5 py-4 text-white`}>
                  <p className="text-xs font-bold uppercase tracking-[0.25em] opacity-90">Unit {unit.no}</p>
                  <h1 className="text-2xl font-black tracking-tight sm:text-3xl">{unit.title}</h1>
                </div>
                {unit.image && (
                  <div className={`relative h-48 bg-gradient-to-br ${ACCENT[unit.accent].grad} sm:h-64`}>
                    <img src={unit.image} alt={unit.title} className="h-full w-full object-cover" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                    <p className="absolute bottom-3 left-4 right-4 text-xs italic text-white/90 sm:text-sm">{unit.imageCaption}</p>
                  </div>
                )}
                <div className="grid gap-5 p-5 lg:grid-cols-3">
                  <div className="lg:col-span-2">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Syllabus covered in this unit</p>
                    <p className="mt-1 text-sm italic leading-relaxed text-slate-700 dark:text-slate-300">{unit.syllabus}</p>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{unit.summary}</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">After this unit you can</p>
                    <ul className="mt-2 space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                      {unit.objectives.map((o, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-emerald-500">✔</span>
                          {o}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* topic nav strip */}
              <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
                {unit.topics.map((t, i) => (
                  <button
                    key={t.id}
                    onClick={() => setTopicId(t.id)}
                    className={`shrink-0 rounded-xl border px-3 py-2 text-left text-xs font-semibold transition ${
                      topicId === t.id
                        ? "border-indigo-500 bg-indigo-600 text-white"
                        : "border-slate-200 bg-white text-slate-600 hover:border-indigo-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                    }`}
                  >
                    <span className="opacity-60">{i + 1}.</span> {t.title}
                  </button>
                ))}
              </div>

              {!topic && (
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {unit.topics.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTopicId(t.id)}
                      className="group rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-400 hover:shadow-md dark:border-slate-700 dark:bg-slate-900"
                    >
                      <div className="flex items-center gap-2">
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${ACCENT[unit.accent].chip}`}>{t.tag}</span>
                        <span className="text-[11px] text-slate-400">⏱ {t.minutes} min</span>
                        {done[t.id] && <span className="ml-auto text-emerald-500">✅</span>}
                      </div>
                      <p className="mt-2 text-base font-bold group-hover:text-indigo-600 dark:group-hover:text-indigo-400">{t.title}</p>
                      <p className="mt-1 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">
                        {t.blocks.find((b) => b.t === "p") && "text" in (t.blocks.find((b) => b.t === "p") as any) ? ((t.blocks.find((b) => b.t === "p") as any).text as string).slice(0, 130) + "…" : "Detailed notes, diagrams and exam questions."}
                      </p>
                    </button>
                  ))}
                </div>
              )}

              {topic && (
                <article className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-7">
                  <div className="mb-4 flex flex-wrap items-center gap-2 border-b border-slate-100 pb-4 dark:border-slate-800">
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${ACCENT[unit.accent].chip}`}>{topic.tag}</span>
                    <h2 className="text-xl font-black tracking-tight sm:text-2xl">{topic.title}</h2>
                    <span className="ml-auto text-xs text-slate-400">⏱ {topic.minutes} min read</span>
                  </div>

                  {topic.blocks.map((b, i) => (
                    <BlockView key={i} b={b} />
                  ))}

                  <div className="mt-7 grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-500/30 dark:bg-emerald-500/10">
                      <p className="mb-2 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">🔑 Key points to remember</p>
                      <ul className="space-y-1.5 text-sm text-emerald-900 dark:text-emerald-100">
                        {topic.keyPoints.map((k, i) => (
                          <li key={i} className="flex gap-2"><span>•</span>{k}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-500/30 dark:bg-amber-500/10">
                      <p className="mb-2 text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">📝 Likely exam questions</p>
                      <ol className="space-y-1.5 text-sm text-amber-900 dark:text-amber-100">
                        {topic.examQs.map((k, i) => (
                          <li key={i} className="flex gap-2"><span className="font-bold">{i + 1}.</span>{k}</li>
                        ))}
                      </ol>
                    </div>
                  </div>

                  <div className="mt-5 rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">✍️ Your notes for this topic (saved in this browser)</p>
                    <textarea
                      value={notes[topic.id] ?? ""}
                      onChange={(e) => setNotes({ ...notes, [topic.id]: e.target.value })}
                      rows={4}
                      placeholder="Write your own short answer, mnemonic or doubt here…"
                      className="w-full rounded-xl border border-slate-300 bg-white p-3 text-sm outline-none focus:border-indigo-500 dark:border-slate-600 dark:bg-slate-800"
                    />
                  </div>

                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => setDone({ ...done, [topic.id]: !done[topic.id] })}
                      className={done[topic.id] ? "rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white" : "rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white dark:bg-slate-100 dark:text-slate-900"}
                    >
                      {done[topic.id] ? "✅ Marked as studied" : "Mark as studied"}
                    </button>
                    <button
                      className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold dark:border-slate-600"
                      onClick={() => {
                        const i = unit.topics.findIndex((t) => t.id === topic.id);
                        setTopicId(unit.topics[i + 1]?.id ?? null);
                      }}
                    >
                      Next topic →
                    </button>
                    <button className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold dark:border-slate-600" onClick={() => setTopicId(null)}>
                      All topics
                    </button>
                    <button className="ml-auto text-sm font-semibold text-indigo-600 hover:underline dark:text-indigo-400" onClick={() => go("practice")}>
                      Test yourself on Unit {unit.no} →
                    </button>
                  </div>
                </article>
              )}

              <div className="mt-6 flex justify-between gap-3">
                <button
                  disabled={unit.no === 1}
                  onClick={() => go("unit", units[unit.no - 2].id)}
                  className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold disabled:opacity-30 dark:border-slate-700"
                >
                  ← Unit {unit.no - 1}
                </button>
                <button
                  disabled={unit.no === 5}
                  onClick={() => go("unit", units[unit.no].id)}
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-30"
                >
                  Unit {unit.no + 1} →
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      <footer className="no-print border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
        <p className="font-semibold">Internet &amp; Cyber Security — Interactive Study Guide</p>
        <p className="mt-1">5 units · {TOTAL_TOPICS} topics · 12 diagrams · 8 live simulations · {glossary.length} glossary terms · ≈{Math.round(TOTAL_MINUTES / 60)} hours of guided study</p>
        <p className="mt-2">Use “Save as PDF” to export the entire guide with notes, tables, diagrams and question bank for offline revision.</p>
      </footer>

      {/* --------------------------- printable doc --------------------------- */}
      {printReady && (
        <div className="print-doc-wrapper">
          <PrintDoc units={units} title="Internet and Cyber Security" />
        </div>
      )}
    </div>
  );
}

/* ------------------------------- sub views -------------------------------- */

function SectionTitle({ icon, title, sub }: { icon: string; title: string; sub: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-xl shadow-lg shadow-indigo-500/30">{icon}</div>
      <div>
        <h1 className="text-2xl font-black tracking-tight">{title}</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">{sub}</p>
      </div>
    </div>
  );
}

const simLabels: Record<string, [string, string, string]> = {
  password: ["🔑", "Password Strength Lab", "Entropy maths + crack-time estimator"],
  phishing: ["🎣", "Phishing Inspector", "Find all six red flags in a real-style mail"],
  botnet: ["🤖", "Botnet & DDoS Defence", "Watch the infection spread, then mitigate"],
  sniffer: ["📡", "Network Sniffer", "Plain HTTP vs HTTPS + ARP spoofing"],
  crypto: ["🔐", "Encryption & Hash Lab", "Shift cipher and tamper detection"],
  signature: ["✍️", "Digital Signature & PKI", "Sign, tamper, suspend and revoke"],
  access: ["🗂️", "Access Control Engine", "DAC / MAC / RBAC / ABAC decisions"],
  risk: ["📊", "Risk Analysis Calculator", "SLE, ALE and cost-benefit of a control"],
};

function Home({ go, done }: { go: (v: View, u?: string, t?: string) => void; done: Record<string, boolean> }) {
  return (
    <div className="space-y-8 animate-fade-up">
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-900 shadow-xl dark:border-slate-700">
        <img src={hero} alt="Cyber security" className="absolute inset-0 h-full w-full object-cover opacity-45" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b1020]/95 via-[#0b1020]/75 to-transparent" />
        <div className="relative px-6 py-10 sm:px-10 sm:py-14">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-cyan-300 ring-1 ring-cyan-400/40">
            <span className="h-1.5 w-1.5 animate-glow rounded-full bg-cyan-400" /> Complete syllabus · fully explained
          </span>
          <h1 className="mt-4 max-w-2xl text-3xl font-black leading-tight tracking-tight text-white sm:text-5xl">
            Internet and <span className="bg-gradient-to-r from-cyan-300 to-violet-400 bg-clip-text text-transparent">Cyber Security</span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
            Every line of your syllabus turned into detailed notes, 12 annotated diagrams, 8 live simulations you can play with,
            exam-ready answers, a {glossary.length}-term glossary and a {quizBank.length}-question bank — and the whole guide exports to PDF.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={() => go("unit", "unit-1")} className="rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-900 shadow-lg transition hover:scale-[1.03]">
              Start Unit I →
            </button>
            <button onClick={() => go("practice")} className="rounded-xl bg-white/10 px-5 py-3 text-sm font-bold text-white ring-1 ring-white/30 backdrop-blur transition hover:bg-white/20">
              🎯 Attempt MCQs
            </button>
            <button onClick={() => go("syllabus")} className="rounded-xl bg-white/10 px-5 py-3 text-sm font-bold text-white ring-1 ring-white/30 backdrop-blur transition hover:bg-white/20">
              📄 View syllabus
            </button>
          </div>
          <div className="mt-8 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ["5", "Units"],
              [`${units.reduce((a, u) => a + u.topics.length, 0)}`, "Topics"],
              ["8", "Simulations"],
              [`${units.reduce((a, u) => a + u.topics.filter((t) => done[t.id]).length, 0)}`, "Completed"],
            ].map(([n, l]) => (
              <div key={l} className="rounded-xl bg-white/10 px-3 py-2 ring-1 ring-white/15 backdrop-blur">
                <p className="text-2xl font-black text-white">{n}</p>
                <p className="text-[11px] uppercase tracking-wider text-slate-300">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {(() => {
        const next = units.flatMap((u) => u.topics.map((t) => ({ u, t }))).find((x) => !done[x.t.id]);
        if (!next) return null;
        return (
          <button
            onClick={() => go("unit", next.u.id, next.t.id)}
            className="flex w-full items-center gap-4 rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50 to-violet-50 p-5 text-left transition hover:shadow-md dark:border-indigo-500/30 dark:from-indigo-500/10 dark:to-violet-500/10"
          >
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-indigo-600 text-xl text-white">▶</span>
            <span>
              <span className="block text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Continue where you left off</span>
              <span className="block text-lg font-bold">
                Unit {next.u.no} · {next.t.title}
              </span>
              <span className="block text-xs text-slate-500 dark:text-slate-400">{next.t.minutes} min read · {next.t.tag}</span>
            </span>
          </button>
        );
      })()}

      <section>
        <h2 className="mb-3 text-lg font-black tracking-tight">Choose a unit</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {units.map((u) => {
            const a = ACCENT[u.accent];
            const d = u.topics.filter((t) => done[t.id]).length;
            return (
              <button
                key={u.id}
                onClick={() => go("unit", u.id)}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-700 dark:bg-slate-900"
              >
                <div className={`h-1.5 bg-gradient-to-r ${a.grad}`} />
                <div className="p-5">
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${a.chip}`}>Unit {u.no}</span>
                    <span className="text-[11px] text-slate-400">{u.topics.length} topics</span>
                    <span className="ml-auto text-[11px] font-bold text-slate-500">{d}/{u.topics.length} ✅</span>
                  </div>
                  <p className="mt-2 text-lg font-black leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400">{u.title}</p>
                  <p className="mt-1 line-clamp-3 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{u.summary}</p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {u.topics.slice(0, 4).map((t) => (
                      <span key={t.id} className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {t.title.length > 26 ? t.title.slice(0, 26) + "…" : t.title}
                      </span>
                    ))}
                    {u.topics.length > 4 && <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] dark:bg-slate-800">+{u.topics.length - 4}</span>}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-black tracking-tight">🧪 Simulation labs — learn by doing</h2>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {units
            .flatMap((u) =>
              u.topics
                .filter((t) => t.blocks.some((b) => b.t === "sim"))
                .map((t) => ({ u, t, sim: t.blocks.find((b) => b.t === "sim") as any }))
            )
            .map(({ u, t, sim }) => (
              <button
                key={t.id}
                onClick={() => go("unit", u.id, t.id)}
                className="group rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:-translate-y-0.5 hover:border-indigo-400 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900"
              >
                <p className="text-2xl">{simLabels[sim.id]?.[0] ?? "🧪"}</p>
                <p className="mt-1 font-bold group-hover:text-indigo-600 dark:group-hover:text-indigo-400">{simLabels[sim.id]?.[1] ?? sim.id}</p>
                <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                  {simLabels[sim.id]?.[2]} · Unit {u.no} · {t.title}
                </p>
              </button>
            ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          { i: "🧪", t: "Learn by doing", d: "Crack passwords, inspect a phishing mail, run a DDoS and stop it, sign and revoke certificates — all in the browser." },
          { i: "🎯", t: "Answer like a topper", d: "Every topic ends with key points and the exact questions examiners ask, plus model answer skeletons." },
          { i: "🖨️", t: "Take it offline", d: "One click builds a clean A4 document with cover page, contents, all notes, tables, diagrams and the question bank." },
        ].map((c) => (
          <div key={c.t} className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
            <p className="text-2xl">{c.i}</p>
            <p className="mt-2 font-bold">{c.t}</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{c.d}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

function SyllabusView({ go }: { go: (v: View, u?: string) => void }) {
  return (
    <div className="space-y-6 animate-fade-up">
      <SectionTitle icon="📄" title="Official Syllabus" sub="The exact text from your question paper, mapped to the topics in this guide." />
      <div className="grid gap-4 lg:grid-cols-2">
        <pre className="whitespace-pre-wrap rounded-2xl border border-slate-200 bg-white p-5 font-serif text-sm leading-relaxed dark:border-slate-700 dark:bg-slate-900">
          {syllabusRaw}
        </pre>
        <div className="space-y-3">
          {units.map((u) => (
            <button
              key={u.id}
              onClick={() => go("unit", u.id)}
              className="block w-full rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-indigo-400 dark:border-slate-700 dark:bg-slate-900"
            >
              <p className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Unit {u.no}</p>
              <p className="font-bold">{u.title}</p>
              <p className="mt-1 text-xs italic text-slate-500 dark:text-slate-400">{u.syllabus.slice(0, 150)}…</p>
              <p className="mt-2 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">{u.topics.length} detailed topics →</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function GlossaryView() {
  const [q, setQ] = useState("");
  const [u, setU] = useState(0);
  const list = glossary
    .filter((g) => (u === 0 ? true : g.unit === u))
    .filter((g) => (q ? (g.term + g.def).toLowerCase().includes(q.toLowerCase()) : true))
    .sort((a, b) => a.term.localeCompare(b.term));
  return (
    <div className="space-y-5 animate-fade-up">
      <SectionTitle icon="📖" title={`Glossary — ${glossary.length} key terms`} sub="Two-mark definitions, alphabetically. Perfect for last-minute revision." />
      <div className="flex flex-wrap gap-2">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search a term…" className="w-full max-w-xs rounded-full border border-slate-300 px-4 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" />
        {[0, 1, 2, 3, 4, 5].map((n) => (
          <button key={n} onClick={() => setU(n)} className={`rounded-full px-3 py-1 text-xs font-bold ${u === n ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"}`}>
            {n === 0 ? "All" : `Unit ${n}`}
          </button>
        ))}
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {list.map((g) => (
          <div key={g.term} className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
            <p className="flex items-baseline gap-2 font-bold">
              {g.term}
              <span className="ml-auto rounded bg-slate-100 px-1.5 text-[10px] font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">U{g.unit}</span>
            </p>
            <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{g.def}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function BooksView() {
  return (
    <div className="space-y-6 animate-fade-up">
      <SectionTitle icon="📚" title="Text Books & References" sub="As printed in the syllabus, plus what each book is best used for." />
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Text Books</p>
          <ol className="space-y-3 text-sm">
            <li>
              <b>1. Cyber Laws and Cyber Security in Developing and Emerging Economies</b> — Zeinab Karake Shalhoub, Luna Al Qasimi
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Best for Units III, IV and V — governance, legal frameworks, developing-economy perspective on cyber crime and IPR.</p>
            </li>
            <li>
              <b>2. Computer Security</b> — Dieter Gollmann, John Wiley &amp; Sons
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Best for Units I and II — foundations, authentication, access control, cryptographic mechanisms and security models.</p>
            </li>
          </ol>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Reference Books</p>
          <ol className="space-y-3 text-sm">
            <li>
              <b>1. Computer Security: Art and Science</b> — Matt Bishop, Addison-Wesley, 2nd edition
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">The definitive reference for formal models (Bell-LaPadula, Biba, Clark-Wilson), vulnerability analysis and assurance.</p>
            </li>
            <li>
              <b>2. Computer Security, 2nd ed.</b> — Author: Dieter Gollmann, Publisher: John Wiley &amp; Sons, 2006, ISBN: 0-470-86293-9
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Cite this ISBN when quoting the reference in long answers or project reports.</p>
            </li>
          </ol>
          <div className="mt-4 rounded-xl bg-amber-50 p-3 text-xs text-amber-900 dark:bg-amber-500/10 dark:text-amber-200">
            <b>Also worth skimming:</b> NIST SP 800-12 (glossary), NIST SP 800-61 (incident handling), IT Act 2000 bare act with 2008 amendments, CERT-In advisories, and William Stallings' <i>Cryptography and Network Security</i> for the maths in Unit II.
          </div>
        </div>
      </div>
    </div>
  );
}

function PlanView({ done }: { done: Record<string, boolean> }) {
  const days = [
    { d: "Day 1", u: 1, focus: "Internet, WWW, DNS, services + CIA triad, threats, passwords, phishing, botnet", sims: ["password", "phishing", "botnet", "sniffer"] },
    { d: "Day 2", u: 2, focus: "Identification/authentication, access control models, symmetric vs asymmetric, digital signature, PKI + revocation", sims: ["crypto", "signature", "access"] },
    { d: "Day 3", u: 3, focus: "Risk analysis (SLE/ALE), PDR controls, policies, BCM/BCP/DRP, data-protection law, ethics", sims: ["risk"] },
    { d: "Day 4", u: 4, focus: "Cyber governance, user issues, crime taxonomy, IT Act 2000 + 2008 amendment, e-governance", sims: [] },
    { d: "Day 5", u: 5, focus: "Hacking phases, ethical vs criminal, cybersquatting/RDNH, spamming, IPR, piracy, plagiarism", sims: [] },
    { d: "Day 6", focus: "Full question bank + flashcards + glossary drill. Rewrite three 10-mark answers from memory.", sims: [] },
  ] as const;
  return (
    <div className="space-y-5 animate-fade-up">
      <SectionTitle icon="🗓️" title="6-Day Revision Plan" sub="Roughly 2–3 focused hours a day. Tick topics off as you finish them — the tracker on the left updates automatically." />
      <div className="space-y-3">
        {days.map((d) => (
          <div key={d.d} className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-lg bg-indigo-600 px-2.5 py-1 text-xs font-bold text-white">{d.d}</span>
              {"u" in d && <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold dark:bg-slate-800">Unit {d.u}</span>}
              {d.sims.length > 0 && <span className="rounded-lg bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">{d.sims.length} simulations</span>}
              {"u" in d && (
                <span className="ml-auto text-xs font-semibold text-slate-500">
                  {units[d.u - 1].topics.filter((t) => done[t.id]).length}/{units[d.u - 1].topics.length} done
                </span>
              )}
            </div>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{d.focus}</p>
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-500/30 dark:bg-amber-500/10">
        <p className="font-bold text-amber-800 dark:text-amber-200">How to write a 10-mark answer (works for every unit)</p>
        <ol className="mt-2 ml-5 list-decimal space-y-1 text-sm text-amber-900 dark:text-amber-100">
          <li><b>Define</b> the term in one precise sentence.</li>
          <li><b>Classify / list</b> the components — examiners mark the structure.</li>
          <li><b>Draw</b> a small labelled diagram or a 3-column table.</li>
          <li><b>Give one real example</b> (WannaCry, Mirai, Shreya Singhal, Bazee.com…).</li>
          <li><b>Close with controls/limitations</b> or the Indian legal section number.</li>
        </ol>
      </div>
    </div>
  );
}

function PracticeView() {
  const [filter, setFilter] = useState(0);
  const [mode, setMode] = useState<"quiz" | "cards">("quiz");
  return (
    <div className="space-y-6 animate-fade-up">
      <SectionTitle icon="🎯" title="Practice Arena" sub="MCQs with explanations plus flip-cards for rapid revision. Filter by unit or attempt the whole bank." />

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap gap-2">
          {[0, 1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => setFilter(n)}
              className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
                filter === n ? "bg-indigo-600 text-white shadow" : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
              }`}
            >
              {n === 0 ? "All units" : `Unit ${n}`}
            </button>
          ))}
        </div>
        <div className="ml-auto flex overflow-hidden rounded-full border border-slate-300 dark:border-slate-700">
          {(["quiz", "cards"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-4 py-1.5 text-xs font-bold transition ${mode === m ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900" : "text-slate-500"}`}
            >
              {m === "quiz" ? "MCQ mode" : "Flashcard mode"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {mode === "quiz" ? <Quiz key={filter} unitFilter={filter || undefined} /> : <Flashcards key={filter} unitFilter={filter || undefined} />}
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">How to use this arena</p>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li>▸ Answer, then read the <b>explanation</b> — that one line is usually the 2-mark definition.</li>
              <li>▸ Score below 50%? Re-read the unit; below 80%? Re-read only the topics you missed.</li>
              <li>▸ Switch to <b>flashcard mode</b> the night before the exam for rapid recall.</li>
              <li>▸ Then attempt the <b>written questions</b> listed at the end of every topic — those are the 5 and 10 markers.</li>
            </ul>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 p-5 text-white">
            <p className="text-xs font-bold uppercase tracking-wider opacity-80">Question bank</p>
            <p className="text-4xl font-black">{quizBank.length}</p>
            <p className="text-sm opacity-90">MCQs across all five units, each with a one-line reasoning you can quote directly in theory answers.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
