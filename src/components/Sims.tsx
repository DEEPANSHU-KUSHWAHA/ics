import { useEffect, useMemo, useState } from "react";
import type { SimId } from "../types";

/* ---------------------------------- shell --------------------------------- */

export function SimShell({
  title,
  subtitle,
  badge,
  children,
}: {
  title: string;
  subtitle: string;
  badge: string;
  children: React.ReactNode;
}) {
  return (
    <div className="my-6 overflow-hidden rounded-2xl border border-indigo-200 bg-white shadow-sm dark:border-indigo-500/30 dark:bg-slate-900">
      <div className="flex flex-wrap items-center gap-3 border-b border-indigo-100 bg-gradient-to-r from-indigo-50 to-violet-50 px-4 py-3 dark:border-indigo-500/20 dark:from-indigo-500/10 dark:to-violet-500/10">
        <span className="rounded-full bg-indigo-600 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
          Simulation
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-slate-900 dark:text-white">{title}</p>
          <p className="text-xs text-slate-600 dark:text-slate-300">{subtitle}</p>
        </div>
        <span className="rounded-md bg-white/70 px-2 py-1 text-[11px] font-semibold text-indigo-700 dark:bg-slate-800 dark:text-indigo-300">
          {badge}
        </span>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

const btn =
  "rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 active:scale-[.98] disabled:opacity-40";
const btn2 =
  "rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700";
const field =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white";

/* ------------------------------ password lab ------------------------------ */

function entropyBits(pw: string) {
  if (!pw) return 0;
  let pool = 0;
  if (/[a-z]/.test(pw)) pool += 26;
  if (/[A-Z]/.test(pw)) pool += 26;
  if (/[0-9]/.test(pw)) pool += 10;
  if (/[^a-zA-Z0-9]/.test(pw)) pool += 33;
  const uniqueRatio = new Set(pw).size / pw.length;
  return pw.length * Math.log2(pool || 1) * (0.6 + 0.4 * uniqueRatio);
}

function crackTime(bits: number, guessesPerSecond: number) {
  const combos = Math.pow(2, bits) / 2;
  const seconds = combos / guessesPerSecond;
  if (!isFinite(seconds)) return "billions of years";
  const u = [
    ["second", 1],
    ["minute", 60],
    ["hour", 3600],
    ["day", 86400],
    ["month", 2629800],
    ["year", 31557600],
    ["century", 3155760000],
  ] as [string, number][];
  let out = `${seconds.toFixed(1)} seconds`;
  for (const [name, s] of u) {
    if (seconds >= s) out = `${(seconds / s).toLocaleString(undefined, { maximumFractionDigits: 1 })} ${name}${seconds / s >= 2 ? "s" : ""}`;
  }
  return out;
}

export function PasswordLab() {
  const [pw, setPw] = useState("Sunshine1985");
  const [gps, setGps] = useState(1e11);
  const bits = entropyBits(pw);
  const weakList = ["password", "123456", "qwerty", "sunshine", "letmein", "admin", "iloveyou", "ramesh", "india", "dragon"];
  const isCommon = weakList.some((w) => pw.toLowerCase().includes(w));
  const score = Math.min(4, Math.floor(bits / 20) - (isCommon ? 2 : 0) + (pw.length >= 16 ? 1 : 0));
  const labels = ["Very weak", "Weak", "Fair", "Strong", "Excellent"];
  const colors = ["bg-rose-500", "bg-rose-500", "bg-amber-500", "bg-emerald-500", "bg-emerald-500"];

  return (
    <SimShell title="Password Strength & Cracking Lab" subtitle="See how entropy maths decides whether a password survives a GPU rig." badge="Unit I">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-3">
          <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Try a password</label>
          <input className={field} value={pw} onChange={(e) => setPw(e.target.value)} placeholder="type or generate…" />
          <div className="flex flex-wrap gap-2">
            <button className={btn2} onClick={() => setPw("Sunshine1985")}>Weak: Sunshine1985</button>
            <button className={btn2} onClick={() => setPw("P@ssw0rd")}>Weak: P@ssw0rd</button>
            <button className={btn2} onClick={() => setPw("correct-horse-battery-staple")}>Strong passphrase</button>
            <button className={btn} onClick={() => setPw(genPw(16))}>🎲 Generate 16-char</button>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Attacker hardware: {gps.toExponential(0)} guesses/second
            </label>
            <input type="range" min={6} max={14} step={1} value={Math.round(Math.log10(gps))} onChange={(e) => setGps(Math.pow(10, +e.target.value))} className="w-full accent-indigo-600" />
            <p className="text-xs text-slate-500 dark:text-slate-400">10⁷ = single CPU · 10¹¹ = 8× GPU rig · 10¹⁴ = cloud/ASIC farm</p>
          </div>
        </div>
        <div className="space-y-3 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60">
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
              <span>{labels[Math.max(0, score)]}</span>
              <span>{bits.toFixed(1)} bits of entropy</span>
            </div>
            <div className="mt-1 h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
              <div className={`h-full transition-all ${colors[Math.max(0, score)]}`} style={{ width: `${Math.min(100, (bits / 110) * 100)}%` }} />
            </div>
          </div>
          <dl className="space-y-1 text-sm">
            <Row k="Length" v={`${pw.length} characters`} />
            <Row k="Search space" v={`${Math.pow(2, bits).toExponential(2)} combinations`} />
            <Row k="Offline crack time" v={crackTime(bits, gps)} />
            <Row k="In a dictionary / leak list" v={isCommon ? "⚠️ YES — cracked instantly" : "No"} />
          </dl>
          <p className="rounded-lg bg-indigo-50 p-2 text-xs text-indigo-900 dark:bg-indigo-500/10 dark:text-indigo-200">
            Rule of thumb: below 40 bits is trivial, 60–75 bits is reasonable today, 90+ bits is future-proof. Length beats symbol-swapping.
          </p>
        </div>
      </div>
    </SimShell>
  );
}

function genPw(n: number) {
  const s = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*";
  return Array.from({ length: n }, () => s[Math.floor(Math.random() * s.length)]).join("");
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-3 border-b border-slate-200 pb-1 dark:border-slate-700">
      <dt className="text-slate-500 dark:text-slate-400">{k}</dt>
      <dd className="text-right font-semibold text-slate-900 dark:text-white">{v}</dd>
    </div>
  );
}

/* ---------------------------- phishing inspector -------------------------- */

const PHISH_MAIL = {
  from: "SBI Secure Team <support@sbi-verify-account.co.in>",
  to: "student@college.ac.in",
  subject: "URGENT: Your net-banking will be BLOCKED within 24 hours",
  body: [
    "Dear Valued Customer,",
    "We have detected unusual activity in your account. You must verify your credentials IMMEDIATELY or your account will be permanently closed within 24 hours.",
    "Click here to verify now: http://sbi-verify-account.co.in/login?id=8842",
    "Also reply with your OTP if asked so that we can complete the verification.",
    "Regards, Security Desk",
  ],
};

const REDFLAGS = [
  { id: "domain", label: "Look-alike sender domain (sbi-…-account.co.in instead of onlinesbi.sbi)", why: "Attackers register typo/look-alike domains; the display name is free text and proves nothing." },
  { id: "greeting", label: "Generic greeting — 'Dear Valued Customer'", why: "The real bank knows your name; a bulk phisher does not." },
  { id: "urgency", label: "Urgency + threat — 'blocked within 24 hours'", why: "Manufactured urgency short-circuits rational checking. Classic social engineering." },
  { id: "link", label: "http:// link (not https) and mismatched hyperlink target", why: "Hover to inspect the real href; the visible text never has to match it." },
  { id: "otp", label: "Asks for your OTP / credentials", why: "No bank, IT team or government agency ever asks for an OTP, PIN or CVV." },
  { id: "grammar", label: "Awkward phrasing and capitalised scare words", why: "Often machine-translated bulk mail; a sign of volume phishing rather than targeted spear phishing." },
];

export function PhishingInspector() {
  const [picked, setPicked] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const toggle = (id: string) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const correct = picked.filter((p) => REDFLAGS.some((r) => r.id === p)).length;
  const wrong = picked.filter((p) => !REDFLAGS.some((r) => r.id === p)).length;

  return (
    <SimShell title="Phishing E-mail Inspector" subtitle="Click every red flag you can find in this real-world style message, then check your analysis." badge="Unit I">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-[13px] dark:border-slate-700 dark:bg-slate-800">
          <p><span className="text-slate-500 dark:text-slate-400">From:</span> {PHISH_MAIL.from}</p>
          <p><span className="text-slate-500 dark:text-slate-400">To:</span> {PHISH_MAIL.to}</p>
          <p className="mb-2"><span className="text-slate-500 dark:text-slate-400">Subject:</span> <b>{PHISH_MAIL.subject}</b></p>
          <div className="rounded-lg bg-white p-3 leading-relaxed dark:bg-slate-900">
            {PHISH_MAIL.body.map((l, i) => (
              <p key={i} className={i === 2 ? "break-all text-indigo-600 underline dark:text-indigo-400" : ""}>{l}</p>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          {[
            { id: "x1", label: "The e-mail was received on a Monday" },
            { id: "x2", label: "It contains a footer with the company address" },
            { id: "x3", label: "It mentions net-banking" },
          ].map((d) => (
            <label key={d.id} className="flex cursor-pointer items-start gap-2 rounded-lg border border-slate-200 p-2 text-sm dark:border-slate-700">
              <input type="checkbox" checked={picked.includes(d.id)} onChange={() => toggle(d.id)} className="mt-1 accent-indigo-600" />
              <span>{d.label}</span>
            </label>
          ))}
          <div className="flex flex-wrap gap-2">
            <button className={btn} onClick={() => setDone(true)}>Check my analysis</button>
            <button className={btn2} onClick={() => { setPicked([]); setDone(false); }}>Reset</button>
          </div>
          {done && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm dark:border-emerald-500/30 dark:bg-emerald-500/10">
              <p className="font-bold text-emerald-800 dark:text-emerald-300">
                Score: {correct}/{REDFLAGS.length} real red flags · {wrong} incorrect pick{wrong === 1 ? "" : "s"}
              </p>
              <ul className="mt-2 space-y-2">
                {REDFLAGS.map((r) => (
                  <li key={r.id} className={picked.includes(r.id) ? "text-emerald-900 dark:text-emerald-200" : "text-slate-600 dark:text-slate-400"}>
                    <b>{picked.includes(r.id) ? "✔" : "○"} {r.label}</b>
                    <span className="block text-xs opacity-80">{r.why}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </SimShell>
  );
}

/* -------------------------------- crypto lab ------------------------------ */

const A = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
function caesar(text: string, k: number) {
  return text.replace(/[a-z]/gi, (c) => {
    const base = c === c.toLowerCase() ? 97 : 65;
    return String.fromCharCode(((c.charCodeAt(0) - base + k) % 26) + base);
  });
}
function sha256ish(s: string) {
  // simple deterministic avalanche demo (NOT real SHA-256)
  let h1 = 0x811c9dc5, h2 = 0x1000193;
  for (let i = 0; i < s.length; i++) {
    h1 = (h1 ^ s.charCodeAt(i)) * 16777619;
    h2 = (h2 + s.charCodeAt(i) * (i + 7)) ^ (h1 >>> 3);
  }
  const hex = (n: number) => (n >>> 0).toString(16).padStart(8, "0");
  return (hex(h1) + hex(h2) + hex(h1 ^ h2)).slice(0, 32);
}

export function CryptoLab() {
  const [msg, setMsg] = useState("ATTACK AT DAWN");
  const [key, setKey] = useState(3);
  const [tamper, setTamper] = useState(false);
  const ct = caesar(msg, key);
  const doc = "Transfer Rs 50,000 to account 8842";
  const received = tamper ? doc.replace("50,000", "95,000") : doc;
  const h1 = sha256ish(doc), h2 = sha256ish(received);

  return (
    <SimShell title="Encryption & Hash Playground" subtitle="Shift cipher to feel how a key changes ciphertext, then see why a hash catches a single-character tamper." badge="Unit II">
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="space-y-3">
          <h4 className="text-sm font-bold uppercase tracking-wide text-indigo-700 dark:text-indigo-300">A. Classical shift (substitution) cipher</h4>
          <input className={field} value={msg} onChange={(e) => setMsg(e.target.value)} />
          <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Key k = {key}</label>
          <input type="range" min={1} max={25} value={key} onChange={(e) => setKey(+e.target.value)} className="w-full accent-indigo-600" />
          <div className="rounded-lg bg-slate-900 p-3 font-mono text-sm text-emerald-400">
            <p className="text-slate-400">plaintext&nbsp;: {msg.toUpperCase()}</p>
            <p className="text-cyan-300">ciphertext: {ct.toUpperCase()}</p>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Alphabet: {A.slice(0, key)}<span className="font-bold text-rose-500">{A[key]}</span>{A.slice(key + 1)} → only 25 possible keys, so brute force takes seconds. That is exactly why AES uses a 128–256 bit key space.
          </p>
          <div className="flex gap-2">
            <button className={btn2} onClick={() => setKey((k) => (k % 25) + 1)}>Try next key</button>
            <button className={btn} onClick={() => setMsg(genPw(12))}>Random plaintext</button>
          </div>
        </div>
        <div className="space-y-3">
          <h4 className="text-sm font-bold uppercase tracking-wide text-indigo-700 dark:text-indigo-300">B. Hash = tamper detection</h4>
          <p className="rounded-lg bg-slate-50 p-2 font-mono text-xs dark:bg-slate-800">Original : {doc}</p>
          <p className="break-all rounded-lg bg-emerald-50 p-2 font-mono text-[11px] text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300">digest&nbsp;&nbsp;: {h1}</p>
          <p className="rounded-lg bg-slate-50 p-2 font-mono text-xs dark:bg-slate-800">Received : {received}</p>
          <p className="break-all rounded-lg bg-rose-50 p-2 font-mono text-[11px] text-rose-800 dark:bg-rose-500/10 dark:text-rose-300">digest&nbsp;&nbsp;: {h2}</p>
          <button className={btn} onClick={() => setTamper((t) => !t)}>{tamper ? "Restore original document" : "Tamper: change 50,000 → 95,000"}</button>
          <p className={`rounded-lg p-2 text-sm font-semibold ${h1 === h2 ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-200" : "bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-200"}`}>
            {h1 === h2 ? "✅ Digests MATCH — integrity intact, signature would verify." : "❌ Digests DIFFER — the document was modified; a digital signature would be rejected."}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Avalanche effect: changing one character completely changes the digest. (This demo uses a toy 128-bit mixer — real signatures use SHA-256/SHA-3.)
          </p>
        </div>
      </div>
    </SimShell>
  );
}

/* ------------------------- digital signature + PKI ------------------------ */

type CertState = "valid" | "suspended" | "revoked";

export function SignatureSim() {
  const [state, setState] = useState<CertState>("valid");
  const [tampered, setTampered] = useState(false);
  const [log, setLog] = useState<string[]>(["CA issues Class-3 DSC to Rahim → private key sealed in USB token."]);

  const docHash = tampered ? "a91f…c0de  (document MODIFIED)" : "7d8e…41aa  (document intact)";
  const verdict =
    state === "revoked"
      ? { ok: false, msg: "Certificate REVOKED — signature is invalid regardless of the hash. CRL/OCSP status: revoked." }
      : state === "suspended"
      ? { ok: false, msg: "Certificate SUSPENDED — verification on hold until the CA reinstates it." }
      : tampered
      ? { ok: false, msg: "Digest mismatch — the document was altered after signing. Non-repudiation fails." }
      : { ok: true, msg: "Signature VALID: hash matches, chain trusted, certificate not revoked. Integrity + authenticity + non-repudiation ✔" };

  const act = (s: CertState, line: string) => {
    setState(s);
    setLog((l) => [line, ...l].slice(0, 8));
  };

  return (
    <SimShell title="Digital Signature & Certificate Lifecycle" subtitle="Sign, tamper, suspend, revoke — and watch which guarantee survives." badge="Unit II">
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">1 · Subscriber signs</p>
          <p className="rounded-lg bg-slate-50 p-2 font-mono text-[11px] dark:bg-slate-800">hash(doc) = {docHash}</p>
          <p className="rounded-lg bg-slate-50 p-2 font-mono text-[11px] dark:bg-slate-800">sig = encrypt(hash, PRIVATE key)</p>
          <button className={btn} onClick={() => setTampered((t) => !t)}>{tampered ? "Untamper the document" : "⚡ Tamper with the document"}</button>
        </div>
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">2 · Relying party verifies</p>
          <ul className="space-y-1 text-sm">
            <li className={tampered ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"}>{tampered ? "✘ hash mismatch" : "✔ hash matches"}</li>
            <li className={state === "valid" ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}>
              {state === "valid" ? "✔ certificate valid, not revoked" : state === "suspended" ? "⚠ OCSP: on hold" : "✘ OCSP/CRL: revoked"}
            </li>
            <li className="text-emerald-600 dark:text-emerald-400">✔ CA chain → CCA India root</li>
          </ul>
          <div className={`rounded-lg p-3 text-sm font-semibold ${verdict.ok ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-200" : "bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-200"}`}>
            {verdict.ok ? "✅ " : "❌ "}
            {verdict.msg}
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">3 · Manage the certificate</p>
          <div className="flex flex-wrap gap-2">
            <button className={btn2} onClick={() => act("valid", "CA reinstates the certificate after identity re-verification.")}>Reinstate</button>
            <button className={btn2} onClick={() => act("suspended", "Subscriber reports a lost token → CA suspends the DSC (temporary hold, listed as 'on hold').")}>Suspend</button>
            <button className={btn} onClick={() => act("revoked", "Private key confirmed compromised → CA revokes permanently and publishes in the next CRL + OCSP.")}>Revoke</button>
          </div>
          <div className="mt-2 max-h-40 space-y-1 overflow-y-auto rounded-lg bg-slate-900 p-2 font-mono text-[11px] text-slate-300">
            {log.map((l, i) => (
              <p key={i} className={i === 0 ? "text-cyan-300" : ""}>› {l}</p>
            ))}
          </div>
        </div>
      </div>
    </SimShell>
  );
}

/* ------------------------------- botnet / ddos ---------------------------- */

export function BotnetSim() {
  const [bots, setBots] = useState(200);
  const [mitig, setMitig] = useState<string[]>([]);
  const running = bots * 40; // requests/sec
  const capacity = 20000;
  const load = Math.min(100, (running / capacity) * 100);
  const down = load >= 100 && mitig.length < 2;

  useEffect(() => {
    const t = setInterval(() => setBots((b) => (b < 2000 ? b + Math.ceil(Math.random() * 30) : b)), 900);
    return () => clearInterval(t);
  }, []);

  const toggle = (m: string) => setMitig((p) => (p.includes(m) ? p.filter((x) => x !== m) : [...p, m]));
  const effective = mitig.length;
  const effLoad = load / Math.pow(2.2, effective);

  return (
    <SimShell title="Botnet Growth & DDoS Mitigation" subtitle="Infection spreads automatically — engineer the defence before the server dies." badge="Unit I">
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl bg-slate-900 p-3 text-slate-200">
          <p className="text-xs uppercase tracking-wide text-slate-400">Botnet</p>
          <p className="text-3xl font-black text-rose-400">{bots.toLocaleString()}</p>
          <p className="text-xs text-slate-400">zombie devices · default IoT passwords</p>
          <p className="mt-2 text-xs uppercase tracking-wide text-slate-400">Attack traffic</p>
          <p className="text-xl font-bold text-amber-300">{(running / 1000).toFixed(1)}k req/s</p>
        </div>
        <div className="space-y-2 lg:col-span-2">
          <p className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Target server load</p>
          <div className="h-6 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
            <div className={`h-full transition-all ${effLoad >= 100 ? "bg-rose-500" : effLoad > 70 ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${Math.min(100, effLoad)}%` }} />
          </div>
          <p className="text-sm font-semibold">{effLoad >= 100 ? (down ? "💥 SERVICE DOWN — availability lost" : "⚠ Over capacity — users see timeouts") : `OK · ${effLoad.toFixed(0)}% of capacity`}</p>
          <p className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Apply mitigations (each multiplies your headroom)</p>
          <div className="flex flex-wrap gap-2">
            {["Rate limiting", "Anycast / CDN scrubbing", "Sinkhole the C&C", "Patch IoT firmware", "SYN cookies"].map((m) => (
              <button key={m} onClick={() => toggle(m)} className={mitig.includes(m) ? btn : btn2}>{m}</button>
            ))}
          </div>
          {mitig.length > 0 && (
            <p className="rounded-lg bg-emerald-50 p-2 text-xs text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-200">
              Active: {mitig.join(" · ")}. Note: rate limiting alone cannot stop a volumetric flood — you need upstream scrubbing (availability layer) <b>and</b> sinkholing (kills the command channel so the bots stop).
            </p>
          )}
        </div>
      </div>
    </SimShell>
  );
}

/* ------------------------------ access control ---------------------------- */

const ROLES = ["Employee", "Manager", "HR Admin", "Auditor"];
const OBJECTS = ["Payroll DB", "Own leave record", "Source code", "Audit logs"];
const GRANTS: Record<string, string[]> = {
  Employee: ["Own leave record"],
  Manager: ["Own leave record", "Payroll DB"],
  "HR Admin": ["Payroll DB", "Own leave record"],
  Auditor: ["Audit logs", "Payroll DB (read-only)"],
};

export function AccessSim() {
  const [user, setUser] = useState("Employee");
  const [model, setModel] = useState<"DAC" | "MAC" | "RBAC" | "ABAC">("RBAC");
  const [obj, setObj] = useState(OBJECTS[0]);
  const allowed = GRANTS[user].some((g) => g.startsWith(obj));
  const note: Record<string, string> = {
    DAC: "The object owner decides. Convenient but the owner may over-share, and a trojan running as the owner can pass the right on.",
    MAC: "The system enforces labels (Top Secret / Secret / Confidential). Strong, rigid, expensive to administer.",
    RBAC: "Permissions attach to roles, users attach to roles. Best enterprise fit — but watch out for role explosion.",
    ABAC: "A policy engine evaluates subject + object + environment attributes (time, device, location). This is zero-trust in practice.",
  };

  return (
    <SimShell title="Access Control Decision Engine" subtitle="Pick a user, an object and a model — see the reference monitor's decision and why." badge="Unit II">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Subject (role)</label>
          <select className={field} value={user} onChange={(e) => setUser(e.target.value)}>
            {ROLES.map((r) => <option key={r}>{r}</option>)}
          </select>
          <label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Model</label>
          <select className={field} value={model} onChange={(e) => setModel(e.target.value as any)}>
            {["DAC", "MAC", "RBAC", "ABAC"].map((m) => <option key={m}>{m}</option>)}
          </select>
          <label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Object</label>
          <select className={field} value={obj} onChange={(e) => setObj(e.target.value)}>
            {OBJECTS.map((o) => <option key={o}>{o}</option>)}
          </select>
        </div>
        <div className="space-y-2 md:col-span-2">
          <div className={`rounded-xl p-4 text-center text-lg font-black ${allowed ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-200" : "bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-200"}`}>
            {allowed ? "✔ ACCESS GRANTED" : "✘ ACCESS DENIED — deny by default"}
          </div>
          <p className="rounded-lg bg-slate-50 p-3 text-sm dark:bg-slate-800/70">{note[model]}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {user} holds: {GRANTS[user].join(" · ")}. Principle of least privilege asks whether this grant is still more than the task needs.
          </p>
        </div>
      </div>
    </SimShell>
  );
}

/* -------------------------------- risk calculator ------------------------- */

export function RiskCalc() {
  const [av, setAv] = useState(2000000);
  const [ef, setEf] = useState(60);
  const [aro, setAro] = useState(0.5);
  const [cost, setCost] = useState(35000);
  const [aleAfter, setAleAfter] = useState(10000);
  const sle = (av * ef) / 100;
  const ale = sle * aro;
  const cba = ale - aleAfter - cost;
  const likelihood = aro >= 1 ? 4 : aro >= 0.5 ? 3 : aro >= 0.2 ? 2 : 1;
  const impact = ef >= 70 ? 4 : ef >= 40 ? 3 : ef >= 20 ? 2 : 1;
  const cell = ["Low", "Medium", "High", "Extreme"][Math.min(3, Math.floor((likelihood + impact) / 2.5))];

  return (
    <SimShell title="Quantitative Business Risk Analysis" subtitle="AV × EF → SLE → ×ARO → ALE, then decide whether the control pays for itself." badge="Unit III">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Num label="Asset value (₹)" value={av} set={setAv} step={100000} />
          <Num label={`Exposure factor ${ef}%`} value={ef} set={setEf} step={5} min={5} max={100} />
          <Num label="Annualised rate of occurrence" value={aro} set={setAro} step={0.1} min={0.1} max={5} />
          <Num label="Annual cost of control (₹)" value={cost} set={setCost} step={5000} />
          <Num label="ALE after control (₹)" value={aleAfter} set={setAleAfter} step={5000} />
        </div>
        <div className="space-y-2">
          <div className="rounded-xl bg-slate-900 p-3 font-mono text-sm text-cyan-300">
            <p>SLE = {av.toLocaleString()} × {ef / 100} = ₹{sle.toLocaleString()}</p>
            <p className="text-amber-300">ALE = ₹{sle.toLocaleString()} × {aro} = ₹{Math.round(ale).toLocaleString()}</p>
            <p className="text-emerald-300">CBA = {Math.round(ale).toLocaleString()} − {Math.round(aleAfter).toLocaleString()} − {cost.toLocaleString()} = ₹{Math.round(cba).toLocaleString()}</p>
          </div>
          <div className={`rounded-xl p-3 text-center font-bold ${cba > 0 ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-200" : "bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-200"}`}>
            {cba > 0 ? `✅ Deploy the control — saves ₹${Math.round(cba).toLocaleString()} per year` : `❌ Not justified — the control costs ₹${Math.abs(Math.round(cba)).toLocaleString()} more than the loss it prevents`}
          </div>
          <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
            <p className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Qualitative 5×5 position</p>
            <p className="text-2xl font-black">{cell}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Treatment options: mitigate · accept (with sign-off) · transfer (insurance) · avoid</p>
          </div>
        </div>
      </div>
    </SimShell>
  );
}

function Num({ label, value, set, step, min = 0, max = 1e9 }: any) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">{label}</span>
      <input type="number" className={field} value={value} step={step} min={min} max={max} onChange={(e) => set(+e.target.value)} />
    </label>
  );
}

/* ---------------------------- insecure network sniffer -------------------- */

const PACKETS = [
  { proto: "HTTP", info: "POST /login  user=rahul  pass=Rahul@123" },
  { proto: "DNS", info: "A? onlinesbi.sbi → 210.210.128.60" },
  { proto: "TLS", info: "ClientHello  cipher_suites=[TLS_AES_256_GCM…]" },
  { proto: "HTTP", info: "GET /otp?value=448291  (SMS gateway)" },
  { proto: "TLS", info: "ApplicationData  len=1042  (AES-256-GCM)" },
  { proto: "ARP", info: "who-has 192.168.1.1 → tell 192.168.1.66 ⚠ duplicate" },
];

export function SnifferSim() {
  const [secure, setSecure] = useState(false);
  const [arp, setArp] = useState(false);
  const visible = useMemo(
    () =>
      PACKETS.filter((p) => {
        if (p.proto === "TLS") return true;
        if (p.proto === "ARP") return arp;
        return !secure;
      }),
    [secure, arp]
  );

  return (
    <SimShell title="Network Sniffer — Secure vs Insecure Connection" subtitle="Flip the switches and watch what an attacker on the same Wi-Fi can actually read." badge="Unit I / II">
      <div className="mb-3 flex flex-wrap gap-2">
        <button className={secure ? btn : btn2} onClick={() => setSecure((s) => !s)}>{secure ? "🔒 HTTPS + VPN ON" : "🔓 Plain HTTP mode"}</button>
        <button className={arp ? btn : btn2} onClick={() => setArp((a) => !a)}>{arp ? "☠ ARP spoofing active" : "Enable ARP spoofing"}</button>
      </div>
      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900 font-mono text-[12px]">
        <div className="grid grid-cols-[70px_1fr] gap-2 border-b border-slate-700 px-3 py-1 text-slate-400">
          <span>PROTO</span>
          <span>PAYLOAD VISIBLE TO THE ATTACKER</span>
        </div>
        {visible.map((p, i) => (
          <div key={i} className="grid grid-cols-[70px_1fr] gap-2 border-b border-slate-800 px-3 py-1">
            <span className={p.proto === "TLS" ? "text-emerald-400" : p.proto === "ARP" ? "text-rose-400" : "text-amber-400"}>{p.proto}</span>
            <span className={p.proto === "TLS" ? "text-slate-400" : p.proto === "ARP" ? "text-rose-300" : "text-rose-300"}>
              {p.proto === "TLS" ? "…ciphertext — unreadable without the session key…" : p.info}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-3 rounded-lg bg-indigo-50 p-3 text-sm text-indigo-900 dark:bg-indigo-500/10 dark:text-indigo-200">
        {secure
          ? "With TLS everywhere plus a VPN, the attacker still sees the metadata (which sites, how much data, when) but not the content. Add DNS-over-HTTPS to hide the queries too."
          : "On plain HTTP, credentials, OTPs and cookies are readable by anyone on the network. ARP spoofing makes it worse: the attacker becomes the default gateway and can also modify traffic (SSL stripping)."}
      </p>
    </SimShell>
  );
}

export function Simulation({ id }: { id: SimId }) {
  switch (id) {
    case "password":
      return <PasswordLab />;
    case "phishing":
      return <PhishingInspector />;
    case "crypto":
      return <CryptoLab />;
    case "signature":
      return <SignatureSim />;
    case "botnet":
      return <BotnetSim />;
    case "access":
      return <AccessSim />;
    case "risk":
      return <RiskCalc />;
    case "sniffer":
      return <SnifferSim />;
    default:
      return null;
  }
}
