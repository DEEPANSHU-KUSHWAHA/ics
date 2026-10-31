import type { Block, Unit } from "../types";
import { Diagram } from "./Diagrams";
import { glossary, quizBank } from "../data/quiz";
import { syllabusRaw } from "../data/raw";

function PBlock({ b }: { b: Block }) {
  switch (b.t) {
    case "h":
      return <h3 className="mt-3 mb-1 text-[12pt] font-bold text-slate-900">{b.text}</h3>;
    case "p":
      return <p className="mb-2 text-justify text-[10.5pt] leading-snug text-slate-800">{b.text}</p>;
    case "list":
      return b.ordered ? (
        <ol className="mb-2 ml-6 list-decimal space-y-0.5 text-[10.5pt] leading-snug text-slate-800">
          {b.items.map((i, k) => <li key={k}>{i}</li>)}
        </ol>
      ) : (
        <ul className="mb-2 ml-5 list-disc space-y-0.5 text-[10.5pt] leading-snug text-slate-800">
          {b.items.map((i, k) => <li key={k}>{i}</li>)}
        </ul>
      );
    case "table":
      return (
        <table className="my-2 w-full border-collapse text-[9pt]">
          <thead>
            <tr>{b.head.map((h, i) => <th key={i} className="border border-slate-400 bg-slate-100 px-1.5 py-1 text-left font-bold">{h}</th>)}</tr>
          </thead>
          <tbody>
            {b.rows.map((r, i) => (
              <tr key={i}>
                {r.map((c, j) => <td key={j} className={`border border-slate-300 px-1.5 py-1 align-top ${j === 0 ? "font-semibold" : ""}`}>{c}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      );
    case "callout":
      return (
        <div className="my-2 border-l-4 border-indigo-500 bg-indigo-50 px-3 py-2">
          <p className="text-[9pt] font-bold uppercase tracking-wide text-indigo-900">{b.kind} — {b.title}</p>
          <p className="text-[10pt] leading-snug text-slate-800">{b.text}</p>
        </div>
      );
    case "code":
      return (
        <div className="my-2 rounded border border-slate-300 bg-slate-50 p-2">
          {b.label && <p className="mb-1 text-[8.5pt] font-bold uppercase text-slate-500">{b.label}</p>}
          <pre className="whitespace-pre-wrap text-[8.5pt] leading-tight text-slate-800">{b.text}</pre>
        </div>
      );
    case "image":
      return (
        <figure className="my-2">
          <img src={b.src} alt={b.caption} className="max-h-[70mm] w-full rounded object-cover" />
          <figcaption className="text-center text-[8.5pt] text-slate-500">{b.caption}</figcaption>
        </figure>
      );
    case "diagram":
      return <Diagram id={b.id} />;
    default:
      return null;
  }
}

export function PrintDoc({ units, title }: { units: Unit[]; title: string }) {
  const totalTopics = units.reduce((a, u) => a + u.topics.length, 0);
  return (
    <div id="print-doc" className="print-doc bg-white text-slate-900">
      {/* cover */}
      <section className="mb-8 border-b-4 border-indigo-600 pb-4 text-center">
        <p className="text-[10pt] font-semibold uppercase tracking-[0.3em] text-indigo-700">Complete Study Guide · Notes · Simulations · Question Bank</p>
        <h1 className="mt-2 text-[26pt] font-black uppercase leading-tight tracking-tight">{title}</h1>
        <p className="mt-1 text-[11pt] text-slate-600">5 Units · {totalTopics} detailed topics · {quizBank.length} MCQs · {glossary.length} glossary terms</p>
        <p className="mt-3 text-[9.5pt] text-slate-500">Printed on {new Date().toLocaleDateString(undefined, { day: "2-digit", month: "long", year: "numeric" })}</p>
      </section>

      <section className="mb-8 break-inside-avoid">
        <h2 className="mb-2 border-b-2 border-slate-800 pb-1 text-[14pt] font-bold uppercase">Official Syllabus</h2>
        <pre className="whitespace-pre-wrap text-[10pt] leading-relaxed text-slate-800">{syllabusRaw}</pre>
      </section>

      <section className="mb-8 break-inside-avoid">
        <h2 className="mb-2 border-b-2 border-slate-800 pb-1 text-[14pt] font-bold uppercase">Contents</h2>
        <ol className="ml-6 list-decimal text-[10.5pt] leading-relaxed">
          {units.map((u) => (
            <li key={u.id}>
              <b>UNIT {u.no} — {u.title}</b>
              <ol className="ml-5 list-[lower-alpha] text-[9.5pt] text-slate-600">
                {u.topics.map((t) => <li key={t.id}>{t.title}</li>)}
              </ol>
            </li>
          ))}
          <li>Glossary of Key Terms</li>
          <li>Question Bank (MCQs with explanations)</li>
          <li>Text Books &amp; Reference Books</li>
        </ol>
      </section>

      {units.map((u) => (
        <section key={u.id} className="mb-10 break-before-page">
          <div className="mb-3 border-b-4 border-indigo-600 pb-2">
            <p className="text-[10pt] font-bold uppercase tracking-[0.25em] text-indigo-700">Unit {u.no}</p>
            <h2 className="text-[18pt] font-black uppercase leading-tight">{u.title}</h2>
          </div>
          <div className="mb-3 rounded bg-slate-100 p-2">
            <p className="text-[9pt] font-bold uppercase text-slate-500">Syllabus coverage</p>
            <p className="text-[10pt] italic text-slate-800">{u.syllabus}</p>
          </div>
          <div className="mb-3">
            <p className="text-[10pt] font-bold uppercase text-slate-700">Learning objectives</p>
            <ul className="ml-5 list-disc text-[10pt] leading-snug">
              {u.objectives.map((o, i) => <li key={i}>{o}</li>)}
            </ul>
          </div>
          {u.topics.map((t) => (
            <article key={t.id} className="mb-5 break-inside-avoid">
              <h3 className="mb-1 rounded bg-indigo-600 px-2 py-1 text-[12pt] font-bold text-white">{t.title}</h3>
              {t.blocks.map((b, i) => <PBlock key={i} b={b} />)}
              <div className="mt-2 grid grid-cols-2 gap-3">
                <div className="border border-emerald-400 bg-emerald-50 p-2">
                  <p className="text-[9pt] font-bold uppercase text-emerald-800">Key points</p>
                  <ul className="ml-4 list-disc text-[9.5pt] leading-snug">
                    {t.keyPoints.map((k, i) => <li key={i}>{k}</li>)}
                  </ul>
                </div>
                <div className="border border-amber-400 bg-amber-50 p-2">
                  <p className="text-[9pt] font-bold uppercase text-amber-800">Likely exam questions</p>
                  <ul className="ml-4 list-disc text-[9.5pt] leading-snug">
                    {t.examQs.map((k, i) => <li key={i}>{k}</li>)}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </section>
      ))}

      <section className="mb-8 break-before-page">
        <h2 className="mb-2 border-b-2 border-slate-800 pb-1 text-[14pt] font-bold uppercase">Glossary of Key Terms</h2>
        <dl className="columns-2 gap-6 text-[9.5pt] leading-snug">
          {glossary.map((g) => (
            <div key={g.term} className="mb-1.5 break-inside-avoid">
              <dt className="font-bold">{g.term} <span className="font-normal text-slate-500">(U{g.unit})</span></dt>
              <dd className="text-slate-700">{g.def}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mb-8 break-before-page">
        <h2 className="mb-2 border-b-2 border-slate-800 pb-1 text-[14pt] font-bold uppercase">Question Bank — {quizBank.length} MCQs with explanations</h2>
        {quizBank.map((q, i) => (
          <div key={q.id} className="mb-2 break-inside-avoid">
            <p className="text-[10pt] font-semibold">Q{i + 1}. {q.q}</p>
            <p className="ml-4 text-[9.5pt]">
              {q.options.map((o, k) => (
                <span key={k} className={k === q.answer ? "font-bold text-emerald-700" : "text-slate-700"}>
                  ({String.fromCharCode(97 + k)}) {o}{"  "}
                </span>
              ))}
            </p>
            <p className="ml-4 text-[9pt] italic text-slate-600">Answer: {String.fromCharCode(65 + q.answer)} — {q.why}</p>
          </div>
        ))}
      </section>

      <section className="break-inside-avoid">
        <h2 className="mb-2 border-b-2 border-slate-800 pb-1 text-[14pt] font-bold uppercase">Text Books &amp; Reference Books</h2>
        <p className="text-[10.5pt] font-bold">Text Books</p>
        <ol className="ml-6 list-decimal text-[10pt]">
          <li>Cyber laws and cyber security in developing and emerging economies — Zeinab Karake Shalhoub, Luna Al Qasimi</li>
          <li>Computer Security — Dieter Gollmann, John Wiley &amp; Sons</li>
        </ol>
        <p className="mt-2 text-[10.5pt] font-bold">Reference Books</p>
        <ol className="ml-6 list-decimal text-[10pt]">
          <li>Computer Security: Art and Science — Matt Bishop, Addison-Wesley, 2nd ed.</li>
          <li>Author: Dieter Gollmann, Publisher: John Wiley &amp; Sons, 2006, ISBN: 0-470-86293-9</li>
        </ol>
      </section>
    </div>
  );
}
