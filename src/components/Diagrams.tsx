import type { DiagramId } from "../types";

const T = "fill-slate-600 dark:fill-slate-300";
const fill = "fill-white dark:fill-slate-800";
const stroke = "stroke-cyan-500 dark:stroke-cyan-400";
void fill;
void stroke;
void T;

function G({ x, y, w, h, label, sub, tone = "cyan" }: any) {
  const tones: Record<string, string> = {
    cyan: "stroke-cyan-500 fill-cyan-50 dark:fill-cyan-500/10 text-cyan-900 dark:text-cyan-200",
    violet: "stroke-violet-500 fill-violet-50 dark:fill-violet-500/10 text-violet-900 dark:text-violet-200",
    amber: "stroke-amber-500 fill-amber-50 dark:fill-amber-500/10 text-amber-900 dark:text-amber-200",
    rose: "stroke-rose-500 fill-rose-50 dark:fill-rose-500/10 text-rose-900 dark:text-rose-200",
    emerald: "stroke-emerald-500 fill-emerald-50 dark:fill-emerald-500/10 text-emerald-900 dark:text-emerald-200",
    slate: "stroke-slate-400 fill-slate-50 dark:fill-slate-700/40 text-slate-700 dark:text-slate-200",
  };
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={10} strokeWidth={2} className={tones[tone]} />
      <text x={x + w / 2} y={y + (sub ? h / 2 - 2 : h / 2 + 5)} textAnchor="middle" className="fill-current text-[15px] font-semibold">
        {label}
      </text>
      {sub && (
        <text x={x + w / 2} y={y + h / 2 + 16} textAnchor="middle" className="fill-current text-[11px] opacity-70">
          {sub}
        </text>
      )}
    </g>
  );
}

function Arrow({ x1, y1, x2, y2, dashed, red }: any) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      strokeWidth={2}
      strokeDasharray={dashed ? "6 5" : undefined}
      className={red ? "stroke-rose-500" : "stroke-slate-400 dark:stroke-slate-500"}
      markerEnd="url(#ah)"
    />
  );
}

function Wrap({ h, children, caption }: { h: number; children: React.ReactNode; caption: string }) {
  return (
    <figure className="not-prose my-5 overflow-x-auto rounded-2xl border border-slate-200 bg-slate-50/60 p-3 dark:border-slate-700 dark:bg-slate-800/40">
      <svg viewBox={`0 0 840 ${h}`} className="w-full min-w-[620px]" role="img">
        <defs>
          <marker id="ah" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto">
            <polygon points="0 0, 9 3.5, 0 7" className="fill-slate-400 dark:fill-slate-500" />
          </marker>
        </defs>
        {children}
      </svg>
      <figcaption className="mt-2 text-center text-xs text-slate-500 dark:text-slate-400">{caption}</figcaption>
    </figure>
  );
}

export function Diagram({ id }: { id: DiagramId }) {
  switch (id) {
    case "internet":
      return (
        <Wrap h={250} caption="Fig: The Internet is a network of networks — your device reaches a server through ISP, backbone and DNS, not directly.">
          <G x={20} y={95} w={130} h={60} label="Your device" sub="IP: 192.168.1.10" tone="cyan" />
          <G x={190} y={95} w={120} h={60} label="Router / ISP" tone="slate" />
          <G x={350} y={40} w={140} h={60} label="DNS resolver" sub="name → IP" tone="violet" />
          <G x={350} y={150} w={140} h={60} label="Backbone / IX" sub="packet switching" tone="slate" />
          <G x={530} y={95} w={130} h={60} label="Web server" sub="IP: 142.250.x.x" tone="emerald" />
          <G x={690} y={95} w={130} h={60} label="Other services" sub="mail · ftp · voip" tone="amber" />
          <Arrow x1={150} y1={125} x2={188} y2={125} />
          <Arrow x1={310} y1={110} x2={348} y2={80} />
          <Arrow x1={310} y1={140} x2={348} y2={170} />
          <Arrow x1={490} y1={80} x2={528} y2={110} />
          <Arrow x1={490} y1={170} x2={528} y2={140} />
          <Arrow x1={660} y1={125} x2={688} y2={125} />
          <text x={420} y={235} textAnchor="middle" className={`fill-current text-[12px] ${T}`}>
            No single owner — every hop is a possible interception point, so encryption must be end-to-end.
          </text>
        </Wrap>
      );

    case "domain":
      return (
        <Wrap h={210} caption="Fig: Domain name hierarchy — read from right (root) to left (host).">
          <G x={30} y={20} w={780} h={54} label="Root  ( . )  →  Top Level Domain .ac.in  →  Second level  aktu.ac.in  →  Sub-domain  results.aktu.ac.in" tone="violet" />
          <G x={30} y={100} w={180} h={54} label="gTLD" sub=".com .org .edu .info" tone="cyan" />
          <G x={230} y={100} w={180} h={54} label="ccTLD" sub=".in .uk .jp .us" tone="cyan" />
          <G x={430} y={100} w={180} h={54} label="Registrant" sub="buys from registrar" tone="emerald" />
          <G x={630} y={100} w={180} h={54} label="Nameserver" sub="holds A / MX / TXT" tone="amber" />
          <text x={420} y={190} textAnchor="middle" className={`fill-current text-[12px] ${T}`}>
            Squatters abuse this namespace: typo-squatting, look-alike TLDs and fake renewal mails.
          </text>
        </Wrap>
      );

    case "dns":
      return (
        <Wrap h={300} caption="Fig: Recursive DNS resolution — every step is a possible spoof unless DNSSEC/DoH protects it.">
          <G x={20} y={120} w={140} h={60} label="Client" sub="browser cache" tone="cyan" />
          <G x={200} y={120} w={150} h={60} label="Recursive resolver" sub="ISP / 8.8.8.8" tone="violet" />
          <G x={400} y={20} w={130} h={55} label="Root server" tone="slate" />
          <G x={400} y={95} w={130} h={55} label="TLD server" sub=".ac.in" tone="slate" />
          <G x={400} y={170} w={130} h={55} label="Authoritative NS" sub="aktu.ac.in" tone="slate" />
          <G x={620} y={120} w={180} h={60} label="Answer: 93.184.216.34" sub="cached until TTL" tone="emerald" />
          <Arrow x1={160} y1={150} x2={198} y2={150} />
          <Arrow x1={350} y1={135} x2={398} y2={55} />
          <Arrow x1={350} y1={150} x2={398} y2={125} />
          <Arrow x1={350} y1={165} x2={398} y2={195} />
          <Arrow x1={530} y1={150} x2={618} y2={150} />
          <Arrow x1={618} y1={168} x2={170} y2={176} dashed red />
          <text x={420} y={280} textAnchor="middle" className={`fill-current text-[12px] ${T}`}>
            Red arrow = forged response (cache poisoning) — the resolver trusts it until the TTL expires.
          </text>
        </Wrap>
      );

    case "email":
      return (
        <Wrap h={230} caption="Fig: E-mail journey — SMTP between servers, POP3/IMAP for retrieval. Nothing here is encrypted by default.">
          <G x={20} y={85} w={130} h={60} label="Sender MUA" sub="Outlook / Gmail" tone="cyan" />
          <G x={195} y={85} w={140} h={60} label="Outgoing MTA" sub="SMTP :587" tone="violet" />
          <G x={380} y={85} w={120} h={60} label="Filters" sub="SPF·DKIM·DMARC" tone="amber" />
          <G x={545} y={85} w={120} h={60} label="Recipient MTA" sub="SMTP :25 · MX" tone="violet" />
          <G x={710} y={85} w={110} h={60} label="MDA store" tone="emerald" />
          <Arrow x1={150} y1={115} x2={193} y2={115} />
          <Arrow x1={335} y1={115} x2={378} y2={115} />
          <Arrow x1={500} y1={115} x2={543} y2={115} />
          <Arrow x1={665} y1={115} x2={708} y2={115} />
          <G x={300} y={175} w={240} h={44} label="Retrieval:  IMAP 143/993  or  POP3 110/995" tone="slate" />
          <Arrow x1={765} y1={147} x2={430} y2={197} dashed />
          <text x={420} y={230} textAnchor="middle" className={`fill-current text-[12px] ${T}`}>
            Weak links: spoofed From header, no authentication in the original SMTP, plaintext relay.
          </text>
        </Wrap>
      );

    case "triad":
      return (
        <Wrap h={300} caption="Fig: The CIA triad — every security control exists to protect one of these three properties.">
          <polygon points="420,25 620,240 220,240" className="fill-cyan-50 stroke-cyan-500 dark:fill-cyan-500/10" strokeWidth={3} />
          <text x={420} y={70} textAnchor="middle" className="fill-current text-[15px] font-bold text-cyan-700 dark:text-cyan-300">
            INFORMATION SECURITY
          </text>
          <G x={300} y={100} w={240} h={44} label="Confidentiality" tone="cyan" />
          <G x={255} y={175} w={140} h={44} label="Integrity" tone="violet" />
          <G x={445} y={175} w={140} h={44} label="Availability" tone="emerald" />
          <text x={420} y={252} textAnchor="middle" className="fill-current text-[12px] text-slate-600 dark:text-slate-300">
            + Authentication · Authorization · Auditing · Non-repudiation · Privacy
          </text>
          <text x={110} y={125} textAnchor="middle" className={`fill-current text-[12px] ${T}`}>
            Broken by sniffing,
          </text>
          <text x={110} y={143} textAnchor="middle" className={`fill-current text-[12px] ${T}`}>
            breach, insider leak
          </text>
          <text x={730} y={125} textAnchor="middle" className={`fill-current text-[12px] ${T}`}>
            Broken by DoS,
          </text>
          <text x={730} y={143} textAnchor="middle" className={`fill-current text-[12px] ${T}`}>
            ransomware, disaster
          </text>
          <text x={420} y={285} textAnchor="middle" className={`fill-current text-[12px] ${T}`}>
            Integrity broken by tampering, MITM, unauthorised modification.
          </text>
        </Wrap>
      );

    case "sniff":
      return (
        <Wrap h={280} caption="Fig: Man-in-the-middle on a shared Wi-Fi — the attacker relays and reads traffic that the victim believes is direct.">
          <G x={30} y={105} w={140} h={60} label="Victim laptop" sub="thinks it talks to server" tone="cyan" />
          <G x={350} y={105} w={150} h={60} label="ATTACKER" sub="ARP-spoofed gateway" tone="rose" />
          <G x={670} y={105} w={140} h={60} label="Bank server" tone="emerald" />
          <Arrow x1={170} y1={125} x2={348} y2={125} />
          <Arrow x1={500} y1={125} x2={668} y2={125} />
          <Arrow x1={668} y1={150} x2={512} y2={150} dashed />
          <Arrow x1={350} y1={150} x2={172} y2={150} dashed />
          <G x={30} y={210} w={370} h={50} label="Plaintext over HTTP → user, password, OTP visible" tone="rose" />
          <G x={430} y={210} w={380} h={50} label="HTTPS/TLS + VPN → attacker sees only ciphertext" tone="emerald" />
          <text x={420} y={35} textAnchor="middle" className="fill-current text-[13px] font-semibold text-rose-600 dark:text-rose-400">
            The attacker never breaks the maths — they just stand on the path.
          </text>
        </Wrap>
      );

    case "symasym":
      return (
        <Wrap h={300} caption="Fig: Symmetric (one shared key) vs Asymmetric (public + private key pair). Real systems use both.">
          <text x={210} y={26} textAnchor="middle" className="fill-current text-[14px] font-bold text-cyan-700 dark:text-cyan-300">
            SYMMETRIC (AES)
          </text>
          <G x={30} y={45} w={90} h={44} label="Plaintext" tone="slate" />
          <G x={160} y={45} w={100} h={44} label="Encrypt" tone="cyan" />
          <G x={300} y={45} w={120} h={44} label="Ciphertext" tone="slate" />
          <G x={160} y={130} w={100} h={44} label="Shared key" tone="amber" />
          <Arrow x1={120} y1={67} x2={158} y2={67} />
          <Arrow x1={260} y1={67} x2={298} y2={67} />
          <Arrow x1={210} y1={128} x2={210} y2={91} />
          <text x={210} y={200} textAnchor="middle" className={`fill-current text-[12px] ${T}`}>
            Fast · one key · n(n−1)/2 keys for n users
          </text>
          <text x={210} y={220} textAnchor="middle" className={`fill-current text-[12px] ${T}`}>
            Problem: how do you share the key?
          </text>
          <line x1={420} y1={20} x2={420} y2={280} strokeWidth={2} strokeDasharray="6 6" className="stroke-slate-300 dark:stroke-slate-600" />
          <text x={620} y={26} textAnchor="middle" className="fill-current text-[14px] font-bold text-violet-700 dark:text-violet-300">
            ASYMMETRIC (RSA/ECC)
          </text>
          <G x={450} y={45} w={90} h={44} label="Plaintext" tone="slate" />
          <G x={580} y={45} w={100} h={44} label="Encrypt with" sub="PUBLIC key" tone="violet" />
          <G x={450} y={190} w={110} h={44} label="Decrypt with" sub="PRIVATE key" tone="rose" />
          <G x={700} y={45} w={120} h={44} label="Ciphertext" tone="slate" />
          <Arrow x1={540} y1={67} x2={578} y2={67} />
          <Arrow x1={680} y1={67} x2={698} y2={67} />
          <Arrow x1={640} y1={92} x2={560} y2={212} />
          <text x={620} y={200} textAnchor="middle" className={`fill-current text-[12px] ${T}`}>
            Solves key distribution
          </text>
          <text x={620} y={220} textAnchor="middle" className={`fill-current text-[12px] ${T}`}>
            Enables signatures — but 100–1000× slower
          </text>
        </Wrap>
      );

    case "sigflow":
      return (
        <Wrap h={320} caption="Fig: Digital signature — sign with the private key, verify with the public key. Any single bit change breaks the hash.">
          <G x={20} y={30} w={130} h={50} label="Document" tone="slate" />
          <G x={190} y={30} w={120} h={50} label="SHA-256 hash" tone="cyan" />
          <G x={350} y={30} w={150} h={50} label="Encrypt digest" sub="with PRIVATE key" tone="rose" />
          <G x={540} y={30} w={130} h={50} label="SIGNATURE" tone="amber" />
          <Arrow x1={150} y1={55} x2={188} y2={55} />
          <Arrow x1={310} y1={55} x2={348} y2={55} />
          <Arrow x1={500} y1={55} x2={538} y2={55} />
          <G x={20} y={130} w={330} h={70} label="Document + Signature + Certificate" sub="sent to the receiver" tone="violet" />
          <Arrow x1={600} y1={80} x2={360} y2={130} />
          <G x={390} y={130} w={150} h={70} label="Fresh hash of" sub="received document" tone="cyan" />
          <G x={580} y={130} w={230} h={70} label="Decrypt signature with PUBLIC key" tone="rose" />
          <Arrow x1={350} y1={165} x2={388} y2={165} />
          <Arrow x1={540} y1={165} x2={578} y2={165} />
          <G x={190} y={240} w={190} h={54} label="MATCH → Valid" sub="intact + authentic" tone="emerald" />
          <G x={440} y={240} w={230} h={54} label="MISMATCH → Tampered" sub="reject the document" tone="rose" />
          <Arrow x1={465} y1={202} x2={300} y2={240} />
          <Arrow x1={695} y1={202} x2={570} y2={240} />
        </Wrap>
      );

    case "accessmodels":
      return (
        <Wrap h={270} caption="Fig: Subject → right → object, enforced by a reference monitor, structured as an ACL, capability list or matrix.">
          <G x={20} y={95} w={130} h={55} label="SUBJECT" sub="user / process" tone="cyan" />
          <G x={350} y={95} w={140} h={55} label="REFERENCE" sub="MONITOR" tone="violet" />
          <G x={690} y={95} w={130} h={55} label="OBJECT" sub="file / table / device" tone="emerald" />
          <Arrow x1={150} y1={122} x2={348} y2={122} />
          <Arrow x1={490} y1={122} x2={688} y2={122} />
          <G x={20} y={20} w={290} h={48} label="Identification → Authentication" sub="who claims, who proves" tone="slate" />
          <Arrow x1={165} y1={68} x2={280} y2={95} />
          <G x={540} y={20} w={280} h={48} label="Authorization → Accounting" sub="what is allowed, what is logged" tone="slate" />
          <Arrow x1={680} y1={68} x2={560} y2={95} />
          <G x={20} y={190} w={190} h={54} label="ACL" sub="list stored on object" tone="amber" />
          <G x={230} y={190} w={190} h={54} label="Capability list" sub="stored with subject" tone="amber" />
          <G x={440} y={190} w={180} h={54} label="ACM" sub="matrix S × O" tone="amber" />
          <G x={640} y={190} w={180} h={54} label="Roles / Attributes" sub="RBAC · ABAC" tone="amber" />
        </Wrap>
      );

    case "ipdr":
      return (
        <Wrap h={250} caption="Fig: Continuity and recovery timeline — how far back you can lose data (RPO) vs how fast you must be back (RTO).">
          <line x1={40} y1={140} x2={800} y2={140} strokeWidth={3} className="stroke-slate-400 dark:stroke-slate-500" />
          <circle cx={70} cy={140} r={8} className="fill-emerald-500" />
          <text x={70} y={120} textAnchor="middle" className={`fill-current text-[12px] ${T}`}>
            Disaster strikes
          </text>
          <circle cx={330} cy={140} r={8} className="fill-amber-500" />
          <text x={330} y={120} textAnchor="middle" className={`fill-current text-[12px] ${T}`}>
            Service restored
          </text>
          <circle cx={620} cy={140} r={8} className="fill-cyan-500" />
          <text x={620} y={120} textAnchor="middle" className={`fill-current text-[12px] ${T}`}>
            Data reconciled (WRT)
          </text>
          <G x={90} y={160} w={210} h={44} label="RTO = 4 hours" tone="amber" />
          <G x={350} y={160} w={240} h={44} label="WRT = verification window" tone="cyan" />
          <G x={40} y={60} w={280} h={44} label="RPO — last good backup" sub="everything after this is lost" tone="rose" />
          <G x={560} y={60} w={230} h={44} label="MTD — business ceiling" sub="must contain RTO + WRT" tone="violet" />
          <text x={420} y={235} textAnchor="middle" className={`fill-current text-[12px] ${T}`}>
            Backup rule 3-2-1-1-0 · sites: cold → warm → hot → cloud DRaaS
          </text>
        </Wrap>
      );

    case "hackphases":
      return (
        <Wrap h={230} caption="Fig: The hacking cycle — a defender can insert a control at every stage.">
          {[
            { x: 40, n: "1. Reconnaissance", s: "OSINT · WHOIS · Shodan", t: "cyan" },
            { x: 175, n: "2. Scanning", s: "nmap · Nessus", t: "cyan" },
            { x: 310, n: "3. Gaining access", s: "exploit · phishing", t: "rose" },
            { x: 445, n: "4. Persistence", s: "backdoor · C2", t: "rose" },
            { x: 580, n: "5. Exfiltrate", s: "lateral move · data theft", t: "rose" },
            { x: 690, n: "6. Cover tracks", s: "clear logs", t: "slate" },
          ].map((b) => (
            <g key={b.n}>
              <G x={b.x} y={70} w={125} h={62} label={b.n} sub={b.s} tone={b.t} />
            </g>
          ))}
          <Arrow x1={165} y1={101} x2={173} y2={101} />
          <Arrow x1={300} y1={101} x2={308} y2={101} />
          <Arrow x1={435} y1={101} x2={443} y2={101} />
          <Arrow x1={570} y1={101} x2={578} y2={101} />
          <Arrow x1={705} y1={101} x2={713} y2={101} />
          <text x={420} y={30} textAnchor="middle" className="fill-current text-[14px] font-bold text-rose-600 dark:text-rose-400">
            Same six steps whether the hacker is criminal or ethical — only authorisation differs
          </text>
          <G x={60} y={170} w={720} h={44} label="Defence mapping:  limit public info → patch & segment → MFA + EDR → integrity monitoring → DLP + egress filter → immutable off-host logs" tone="emerald" />
        </Wrap>
      );

    case "itact":
      return (
        <Wrap h={260} caption="Fig: The Information Technology Act, 2000 — thirteen chapters from definitions to offences.">
          {[
            { y: 20, t: "I–II  Preliminary · Definitions · e-Signature", s: "Sec. 1–3B", tone: "slate" },
            { y: 55, t: "III–V  E-Governance · Attribution · Secure records", s: "Sec. 4–17", tone: "emerald" },
            { y: 90, t: "VI–VIII  Certifying Authorities · DSC · Subscribers", s: "Sec. 18–42", tone: "violet" },
            { y: 125, t: "IX–X  Penalties · Adjudication · Cyber Appellate Tribunal", s: "Sec. 43–64", tone: "amber" },
            { y: 160, t: "XI  OFFENCES — 65 to 74 (hacking, identity theft, cyber terrorism)", s: "Chapter XI", tone: "rose" },
            { y: 195, t: "XII–XIII  Intermediaries · CII · Amendments to other laws", s: "Sec. 75–90", tone: "slate" },
          ].map((r) => (
            <g key={r.t}>
              <G x={30} y={r.y} w={700} h={30} label={r.t} tone={r.tone} />
              <text x={750} y={r.y + 20} className={`fill-current text-[12px] ${T}`}>
                {r.s}
              </text>
            </g>
          ))}
        </Wrap>
      );

    default:
      return null;
  }
}
