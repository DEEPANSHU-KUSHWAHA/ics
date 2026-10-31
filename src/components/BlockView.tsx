import { useState } from "react";
import type { Block } from "../types";
import { Diagram } from "./Diagrams";
import { Simulation } from "./Sims";

const calloutStyles: Record<string, { wrap: string; icon: string; label: string }> = {
  tip: { wrap: "border-emerald-300 bg-emerald-50 dark:border-emerald-500/40 dark:bg-emerald-500/10", icon: "💡", label: "Tip" },
  warn: { wrap: "border-rose-300 bg-rose-50 dark:border-rose-500/40 dark:bg-rose-500/10", icon: "⚠️", label: "Watch out" },
  exam: { wrap: "border-amber-300 bg-amber-50 dark:border-amber-500/40 dark:bg-amber-500/10", icon: "🎯", label: "Exam pointer" },
  example: { wrap: "border-indigo-300 bg-indigo-50 dark:border-indigo-500/40 dark:bg-indigo-500/10", icon: "📌", label: "Example" },
};

export function BlockView({ b }: { b: Block }) {
  switch (b.t) {
    case "h":
      return (
        <h3 className="mt-6 mb-2 text-lg font-bold tracking-tight text-slate-900 dark:text-white">
          <span className="mr-2 text-indigo-500">§</span>
          {b.text}
        </h3>
      );
    case "p":
      return <p className="my-3 leading-relaxed text-slate-700 dark:text-slate-300">{b.text}</p>;
    case "list":
      return b.ordered ? (
        <ol className="my-3 list-decimal space-y-1.5 pl-6 text-slate-700 dark:text-slate-300">
          {b.items.map((i, k) => (
            <li key={k} className="leading-relaxed pl-1">{i}</li>
          ))}
        </ol>
      ) : (
        <ul className="my-3 space-y-1.5 pl-5 text-slate-700 dark:text-slate-300">
          {b.items.map((i, k) => (
            <li key={k} className="leading-relaxed">
              <span className="mr-2 text-indigo-500">▸</span>
              {i}
            </li>
          ))}
        </ul>
      );
    case "table":
      return (
        <div className="my-5 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
          <table className="w-full min-w-[520px] border-collapse text-sm">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800">
                {b.head.map((h, i) => (
                  <th key={i} className="border-b border-slate-200 px-3 py-2 text-left font-bold text-slate-800 dark:border-slate-700 dark:text-slate-100">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {b.rows.map((r, i) => (
                <tr key={i} className={i % 2 ? "bg-slate-50/70 dark:bg-slate-800/40" : ""}>
                  {r.map((c, j) => (
                    <td key={j} className={`border-b border-slate-100 px-3 py-2 align-top text-slate-700 dark:border-slate-800 dark:text-slate-300 ${j === 0 ? "font-semibold text-slate-900 dark:text-white" : ""}`}>
                      {c}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "callout": {
      const s = calloutStyles[b.kind];
      return (
        <aside className={`my-4 rounded-xl border-l-4 p-4 ${s.wrap}`}>
          <p className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
            <span>{s.icon}</span>
            {s.label} — {b.title}
          </p>
          <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">{b.text}</p>
        </aside>
      );
    }
    case "code":
      return (
        <figure className="my-4 overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
          {b.label && <div className="border-b border-slate-700 px-4 py-2 text-xs font-semibold text-slate-300">{b.label}</div>}
          <pre className="overflow-x-auto p-4 text-[12.5px] leading-relaxed text-emerald-300">
            <code>{b.text}</code>
          </pre>
        </figure>
      );
    case "image":
      return (
        <figure className="my-5">
          <img src={b.src} alt={b.caption} className="w-full rounded-xl border border-slate-200 object-cover shadow-sm dark:border-slate-700" loading="lazy" />
          <figcaption className="mt-2 text-center text-xs text-slate-500 dark:text-slate-400">{b.caption}</figcaption>
        </figure>
      );
    case "diagram":
      return <Diagram id={b.id} />;
    case "sim":
      return <Simulation id={b.id} />;
    default:
      return null;
  }
}

export function Collapsible({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
      <button onClick={() => setOpen((o) => !o)} className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-slate-50 dark:hover:bg-slate-800/60">
        <span className={`text-indigo-500 transition-transform ${open ? "rotate-90" : ""}`}>▶</span>
        <span className="flex-1 text-sm font-bold text-slate-800 dark:text-slate-100">{title}</span>
      </button>
      {open && <div className="border-t border-slate-100 px-4 py-1 dark:border-slate-800">{children}</div>}
    </div>
  );
}
