import type { Unit } from "../types";

export const unit3: Unit = {
  id: "unit-3",
  no: 3,
  title: "Protection Measures, Legal & Ethical Issues",
  accent: "emerald",
  image:
    "https://images.pexels.com/photos/17323801/pexels-photo-17323801.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  imageCaption:
    "Protection is a management cycle, not a purchase: analyse risk, prevent, detect, respond, recover — then do it again.",
  syllabus:
    "Protection Measures: Business risk analysis, Prevention, detection and response, security policies, security procedures and guidelines, business continuity and disaster recovery. Legal and Ethical Issues: Protection of data and Information Laws, Software failure, Computer Crime, Privacy, and Ethics.",
  summary:
    "Unit III turns the technical material into a business discipline. You learn how to quantify risk, build layered prevention, wire up detection, run an incident response, and survive a disaster with BCM/BCP/DRP. The second half covers the legal duty to protect data, software liability, categories of computer crime, privacy and professional ethics.",
  objectives: [
    "Perform a qualitative and quantitative business risk analysis (ALE = SLE × ARO)",
    "Design a layered prevention–detection–response architecture with named controls",
    "Write and evaluate security policies, procedures, standards and guidelines",
    "Explain BCM, BIA, BCP, DRP, RPO/RTO and alternate-site strategies",
    "Summarise data-protection law in India and abroad, software failure liability and ethical codes",
  ],
  topics: [
    {
      id: "u3-risk",
      title: "Business Risk Analysis",
      tag: "Governance",
      minutes: 16,
      keyPoints: [
        "Risk = Threat × Vulnerability × Impact ÷ (safeguards).",
        "Qualitative: likelihood × impact matrix. Quantitative: SLE = AV × EF, ALE = SLE × ARO.",
        "Four treatments: mitigate, accept, transfer, avoid. Always compute residual risk.",
      ],
      examQs: [
        "Define risk analysis. Explain qualitative and quantitative risk analysis.",
        "Explain the terms asset value, exposure factor, SLE, ARO and ALE with an example.",
        "What are the four options for handling risk?",
      ],
      blocks: [
        {
          t: "p",
          text: "Business risk analysis is the systematic process of identifying what the organisation values, what can damage it, how likely that is, and how much it would cost — so that scarce security budget is spent where it reduces the most loss. Without it, security becomes an arbitrary shopping list.",
        },
        {
          t: "h",
          text: "The six steps",
        },
        {
          t: "list",
          ordered: true,
          items: [
            "Asset identification & valuation — data, hardware, software, people, reputation, revenue streams; assign monetary or criticality value.",
            "Threat identification — hackers, insiders, malware, natural disaster, power failure, supplier failure, regulatory action.",
            "Vulnerability identification — missing patches, weak configuration, untrained staff, single points of failure, dark data.",
            "Control analysis — what safeguards already exist and how effective are they.",
            "Likelihood & impact determination — use historical data, threat intelligence and expert judgement.",
            "Risk determination, prioritisation and treatment — rank risks, apply treatment, monitor and re-assess at least annually.",
          ],
        },
        {
          t: "code",
          label: "Quantitative formulas — write them, then plug in numbers",
          text: `EF  Exposure Factor      = % of asset lost in one incident
SLE Single Loss Expectancy = Asset Value x EF
ARO Annualised Rate of Occurrence = how many times per year
ALE Annualised Loss Expectancy = SLE x ARO

Cost/benefit of a control:
  CBA = ALE(before) - ALE(after) - Annual cost of control
  If CBA > 0  -> the control is worth buying.

Example: server worth Rs 20,00,000; fire would destroy 60% (EF = 0.6)
  SLE = 20,00,000 x 0.6 = Rs 12,00,000
  Fire expected once in 20 years -> ARO = 0.05
  ALE = 12,00,000 x 0.05 = Rs 60,000 per year
  A fire-suppression + monitoring system costing Rs 35,000/yr that cuts ALE
  to Rs 10,000  ->  CBA = 60,000 - 10,000 - 35,000 = Rs 15,000  -> deploy.`,
        },
        {
          t: "h",
          text: "The 5×5 risk matrix",
        },
        {
          t: "table",
          head: ["Likelihood ↓ / Impact →", "Negligible", "Minor", "Moderate", "Major", "Severe"],
          rows: [
            ["Almost certain", "Medium", "High", "Extreme", "Extreme", "Extreme"],
            ["Likely", "Medium", "Medium", "High", "Extreme", "Extreme"],
            ["Possible", "Low", "Medium", "Medium", "High", "Extreme"],
            ["Unlikely", "Low", "Low", "Medium", "High", "High"],
            ["Rare", "Low", "Low", "Low", "Medium", "High"],
          ],
        },
        { t: "sim", id: "risk" },
        {
          t: "callout",
          kind: "tip",
          title: "Four ways to treat risk",
          text: "Mitigate/Reduce — apply controls. Accept — consciously retain with management sign-off (document it!). Transfer/Share — insurance, outsourcing, contracts. Avoid/Terminate — stop the activity that creates the risk. Residual risk must always be re-measured and reported to the risk committee.",
        },
      ],
    },
    {
      id: "u3-pdr",
      title: "Prevention, Detection and Response",
      tag: "Operations",
      minutes: 17,
      keyPoints: [
        "Preventive controls stop it; detective controls tell you it happened; corrective controls fix it; deterrent, compensating and directive controls complete the taxonomy.",
        "Detection stack: logs → SIEM → correlation rules → IDS/IPS → SOC analyst triage.",
        "Response = the six-step IR lifecycle: Preparation → Identification → Containment → Eradication → Recovery → Lessons Learned.",
      ],
      examQs: [
        "Classify security controls with examples of each category.",
        "Explain the incident response life cycle with a diagram.",
        "Differentiate IDS and IPS; compare HIDS and NIDS.",
        "What is a SOC and a SIEM?",
      ],
      blocks: [
        {
          t: "h",
          text: "1. Prevention — make the attack fail",
        },
        {
          t: "table",
          head: ["Layer", "Controls"],
          rows: [
            ["Physical", "Locks, biometric door access, CCTV, mantrap, fire suppression, UPS, environmental sensors"],
            ["Network", "Firewall, next-gen firewall, network segmentation/VLAN, NAC, WPA3, VPN, anti-DDoS, DNS filtering"],
            ["Endpoint", "Patch management, EDR/antivirus, host firewall, disk encryption, application whitelisting, USB control"],
            ["Application", "Secure SDLC, code review, SAST/DAST, input validation, prepared statements, WAF, dependency scanning"],
            ["Identity", "MFA, least privilege, PAM, joiner-mover-leaver process, password policy"],
            ["Data", "Classification, encryption at rest/in transit, DLP, tokenisation, backup with immutability"],
            ["Human", "Awareness training, simulated phishing, acceptable-use sign-off, background verification"],
          ],
        },
        {
          t: "h",
          text: "2. Detection — know that it is happening",
        },
        {
          t: "list",
          items: [
            "Logging everywhere — OS, application, database, firewall, cloud audit trails; centralise and protect the logs (attacker deletes logs first).",
            "SIEM — aggregates, normalises and correlates events into alerts; adds UEBA and threat-intel feeds.",
            "IDS — passive sensor that raises an alarm. IPS — inline sensor that blocks. HIDS watches one host; NIDS watches a segment.",
            "Detection styles — signature-based (known bad, no unknowns), anomaly/behaviour-based (finds zero days, more false positives), heuristic and reputation-based.",
            "Deception — honeypots, honeynets, canary tokens and honeyfiles to detect and slow intruders.",
            "Vulnerability scanning and penetration testing — proactive detection of weakness before the attacker finds it.",
          ],
        },
        {
          t: "h",
          text: "3. Response — act, contain, learn",
        },
        {
          t: "list",
          ordered: true,
          items: [
            "Preparation — IR team, playbooks, out-of-band communication, retainers with forensics firms, drills.",
            "Identification — triage the alert, validate it, classify severity, start the timeline of evidence.",
            "Containment — isolate hosts, block IPs, disable accounts, cut VLANs; short-term vs long-term containment decisions.",
            "Eradication — remove malware, close the vulnerability, rebuild from a known-good image, rotate all credentials.",
            "Recovery — restore from clean backups, monitor intensively, phased return to production, verify integrity.",
            "Lessons learned — blameless post-mortem within two weeks, update playbooks, controls and training; report to regulator if mandated.",
          ],
        },
        {
          t: "callout",
          kind: "warn",
          title: "Evidence handling (chain of custody)",
          text: "Acquire → hash (SHA-256) → record who/when/where → store write-protected → analyse only on a copy → document every transfer. A broken chain of custody makes even conclusive digital evidence inadmissible under Section 65B of the Indian Evidence Act.",
        },
        {
          t: "callout",
          kind: "example",
          title: "Order of volatility — collect in this sequence",
          text: "CPU registers & RAM → swap/pagefile → temporary file systems → disk → remote logs & monitoring data → physical configuration and network topology → archival media.",
        },
      ],
    },
    {
      id: "u3-policy",
      title: "Security Policies, Procedures and Guidelines",
      tag: "Governance",
      minutes: 11,
      keyPoints: [
        "Policy hierarchy: Policy → Standard → Procedure → Guideline → Baseline.",
        "Standards frameworks: ISO/IEC 27001/27002, NIST CSF (Identify–Protect–Detect–Respond–Recover), NIST 800-53, PCI-DSS, HIPAA, GDPR, CERT-In directions.",
        "Enforcement needs ownership, communication, measurement and periodic review.",
      ],
      examQs: [
        "Explain the hierarchy of security documentation with examples.",
        "What are the essential characteristics of a good security policy?",
        "Write short notes on ISO 27001 and the NIST Cybersecurity Framework.",
      ],
      blocks: [
        {
          t: "p",
          text: "Technology cannot compensate for an organisation that has not decided what 'secure' means. Policy documents convert business intent into enforceable rules; procedures make them repeatable; guidelines advise where flexibility is needed.",
        },
        {
          t: "table",
          head: ["Level", "Nature", "Audience", "Example"],
          rows: [
            ["Policy", "Mandatory intent, 'what & why'", "Everyone, approved by board", "Data Protection Policy"],
            ["Standard", "Mandatory specifics", "Technical staff", "Encryption standard: AES-256, TLS 1.3"],
            ["Procedure", "Step-by-step 'how'", "Operators", "Backup restore runbook"],
            ["Guideline", "Recommended, flexible", "All", "Working-from-home security tips"],
            ["Baseline", "Minimum configuration", "Admins", "CIS Level-1 hardening baseline"],
          ],
        },
        {
          t: "h",
          text: "Frameworks to cite in an answer",
        },
        {
          t: "list",
          items: [
            "ISO/IEC 27001 — requirements for an Information Security Management System (ISMS); 27002 = code of practice/controls; 27005 = risk management; 27017/27018 = cloud & privacy.",
            "NIST Cybersecurity Framework 2.0 — Govern, Identify, Protect, Detect, Respond, Recover.",
            "NIST SP 800-53 / 800-63B / 800-61 (IR) — control catalogues and guidance.",
            "PCI-DSS 4.0 — 12 requirements for anyone handling card data.",
            "COBIT — IT governance; ITIL — service management; CIS Controls v8 — 18 prioritised actions.",
            "India — IT Act 2000 + rules, CERT-In 2022 directions (6-hour reporting, 180-day log retention), DPDP Act 2023, RBI/SEBI/IRDAI sector guidelines.",
          ],
        },
        {
          t: "callout",
          kind: "exam",
          title: "Characteristics of a good policy (7 points)",
          text: "Written and published · Approved by top management · Clear scope and ownership · Unambiguous, enforceable language · Realistic and business-aligned · Measurable and auditable · Reviewed and updated periodically, with staff acknowledgement records.",
        },
      ],
    },
    {
      id: "u3-bcp",
      title: "Business Continuity & Disaster Recovery",
      tag: "Operations",
      minutes: 15,
      keyPoints: [
        "BCM is the programme; BIA finds what matters; BCP keeps the business running; DRP restores IT.",
        "RPO = maximum tolerable data loss; RTO = maximum tolerable downtime; MTD is the ceiling.",
        "Sites: cold (space only) → warm (equipped, no data) → hot (running, near-real-time) → mobile → cloud/multi-cloud.",
        "Backup rule: 3-2-1-1-0 — three copies, two media, one offsite, one offline/immutable, zero errors verified.",
      ],
      examQs: [
        "Differentiate BCP and DRP. What is a Business Impact Analysis?",
        "Explain RPO, RTO and MTD with examples.",
        "Compare hot, warm and cold sites.",
        "Explain the 3-2-1 backup strategy.",
      ],
      blocks: [
        {
          t: "p",
          text: "Business Continuity Management ensures that critical business functions continue during and after a disruption. Disaster Recovery is the IT-focused subset that restores systems, data and infrastructure. Continuity without recovery is theatre; recovery without continuity planning restores the wrong things first.",
        },
        { t: "diagram", id: "ipdr" },
        {
          t: "h",
          text: "Business Impact Analysis — the four questions",
        },
        {
          t: "list",
          ordered: true,
          items: [
            "Which processes are critical, and what do they depend on (people, apps, vendors, data)?",
            "What is the maximum tolerable downtime (MTD/RTO) before unacceptable damage?",
            "How much data can we afford to lose (RPO) and how old can the last good backup be?",
            "What are the financial, regulatory, reputational and safety impacts over time (hour, day, week)?",
          ],
        },
        {
          t: "table",
          head: ["Metric", "Meaning", "Example"],
          rows: [
            ["RPO — Recovery Point Objective", "Maximum acceptable data loss measured backwards in time", "Sync replication → RPO ≈ 0; nightly backup → RPO = 24 h"],
            ["RTO — Recovery Time Objective", "Maximum acceptable time to restore the service", "Payment gateway RTO = 15 min"],
            ["MTD / MAD — Maximum Tolerable Downtime", "Total business ceiling before the business fails", "MTD = 4 h ⇒ RTO + detection + decision must fit inside it"],
            ["WRT — Work Recovery Time", "Time to verify and reconcile data after systems are back", "Re-running failed batches"],
          ],
        },
        {
          t: "table",
          head: ["Site type", "What is available", "RTO", "Cost"],
          rows: [
            ["Cold site", "Empty building, power, cooling, cabling", "Days–weeks", "Lowest"],
            ["Warm site", "Hardware in place, needs data restore and configuration", "Hours–days", "Medium"],
            ["Hot site", "Fully equipped, mirrored, near-real-time replication", "Minutes–hours", "Highest"],
            ["Mobile site", "Trailer with preloaded equipment", "Hours", "Medium"],
            ["Reciprocal / mutual aid", "Agreement with another organisation", "Variable", "Cheap but risky"],
            ["Cloud DR / DRaaS", "Replicate to another region/provider; run on demand", "Minutes", "Pay-per-use, needs exit plan"],
          ],
        },
        {
          t: "callout",
          kind: "tip",
          title: "RAID is not a backup, and neither is sync",
          text: "RAID protects against a disk failure; ransomware and accidental deletion replicate instantly. Follow 3-2-1-1-0: three copies, two different media, one offsite, one offline/immutable, zero restore errors verified by a scheduled test restore. Ransomware crews specifically hunt for backup servers and delete shadow copies first.",
        },
        {
          t: "callout",
          kind: "exam",
          title: "Test your plan or you do not have one",
          text: "Drill types: checklist/review, tabletop exercise, structured walk-through, simulation, parallel test, full interruption test. Always record findings, update the plan, and re-test after every major change. ISO 22301 is the BCM certification standard.",
        },
      ],
    },
    {
      id: "u3-law",
      title: "Protection of Data & Information Laws",
      tag: "Legal",
      minutes: 15,
      keyPoints: [
        "India: IT Act 2000 + SPDI Rules 2011 + DPDP Act 2023 + CERT-In directions.",
        "Global: GDPR (EU), CCPA/CPRA (California), HIPAA (US health), SOX, GLBA, PIPEDA, PDPA, China PIPL.",
        "Core rights: notice, consent, purpose limitation, access, correction, erasure, portability, grievance redressal.",
      ],
      examQs: [
        "Explain the need for data protection legislation.",
        "Write a note on the Digital Personal Data Protection Act, 2023.",
        "Compare the Indian DPDP Act with the EU GDPR.",
        "What are the duties of a data fiduciary?",
      ],
      blocks: [
        {
          t: "p",
          text: "Information law exists because data about people can be used to harm them, and because modern commerce depends on the confident flow of that data. Data protection law balances two interests: the individual's right to privacy and the organisation's need to process data for legitimate purposes.",
        },
        {
          t: "h",
          text: "Key vocabulary",
        },
        {
          t: "list",
          items: [
            "Personal data — any data about an identifiable individual (name, phone, Aadhaar, IP, location, biometrics).",
            "Sensitive personal data — health, sexual orientation, religion, caste, biometrics, financial data, passwords.",
            "Data principal / data subject — the person the data is about. Data fiduciary / controller — decides purpose and means. Data processor — processes on behalf of the fiduciary.",
            "Consent — free, specific, informed, unconditional, unambiguous, with an easy withdrawal mechanism.",
            "Purpose limitation & data minimisation — collect only what is needed, use it only for the stated purpose.",
            "Data localisation — a legal requirement to store certain data within the country's borders.",
            "Breach notification — statutory duty to inform the regulator and affected individuals within a fixed time.",
          ],
        },
        {
          t: "table",
          head: ["Law", "Region", "Key idea"],
          rows: [
            ["IT Act 2000 + SPDI Rules 2011", "India", "Reasonable security practices for sensitive data; body corporate liability (Sec. 43A)"],
            ["DPDP Act 2023", "India", "Consent-based processing, Data Protection Board, duties of data fiduciaries, penalties up to ₹250 crore"],
            ["GDPR 2018", "EU/EEA", "Lawful basis, DPO, DPIA, 72-hour breach notice, fines up to 4% of global turnover"],
            ["CCPA/CPRA", "California, USA", "Right to know, delete, opt out of sale/share"],
            ["HIPAA", "USA", "Protects health information (PHI), Privacy + Security Rules"],
            ["GLBA / SOX", "USA", "Financial institution safeguards / corporate accounting controls"],
            ["PIPEDA / Law 25", "Canada / Quebec", "Consent-based commercial data handling"],
            ["China PIPL / SL", "China", "Strict localisation and cross-border transfer approval"],
          ],
        },
        {
          t: "callout",
          kind: "exam",
          title: "DPDP Act 2023 — 6 points for a 10-mark answer",
          text: "1) Applies to digital personal data collected in India and outside if used to offer goods/services in India. 2) Notice + consent, with deemed consent for legitimate uses. 3) Rights of the data principal: access, correction, erasure, grievance, nomination. 4) Duties of the data fiduciary: accuracy, security safeguards, breach notification, erasure on purpose completion, children's data rules. 5) Significant Data Fiduciaries face audits and DPO appointment in India. 6) Penalties up to ₹250 crore for failing security safeguards; enforcement by the Data Protection Board of India. Exemptions exist for national security, courts and research.",
        },
        {
          t: "callout",
          kind: "tip",
          title: "Technical controls that satisfy the law",
          text: "Encryption at rest and in transit, access control with least privilege, data masking/tokenisation for test systems, retention schedules and automated deletion, audit logging, DPIA before new processing, vendor due diligence and DPAs, privacy-by-design in new products.",
        },
      ],
    },
    {
      id: "u3-failure",
      title: "Software Failure & Liability",
      tag: "Legal",
      minutes: 10,
      keyPoints: [
        "Root causes: requirement/requirement-misunderstanding, design flaws, coding bugs, integration errors, unrealistic schedules, poor testing, scope creep, unmanaged change.",
        "Famous failures: Ariane 5, Therac-25, Mars Climate Orbiter, Knight Capital, AT&T 1990, Boeing 737 MAX MCAS, Aadhaar/PDS mismatches.",
        "Liability questions: who is responsible — developer, vendor, integrator, operator or user? Contracts, warranties, EULA limits and professional negligence decide.",
      ],
      examQs: [
        "Explain the major causes of software failure with examples.",
        "Discuss liability issues arising out of software failure.",
        "How can software failures be minimised? Explain the role of testing and quality assurance.",
      ],
      blocks: [
        {
          t: "p",
          text: "Software failure is the inability of a software system to meet its specified requirements in a given environment. In cyber security the stakes are higher: a defect is not just a bug, it is often an open door. Most large breaches begin as an unpatched vulnerability or a design flaw that was known and deferred.",
        },
        {
          t: "table",
          head: ["Category", "Typical cause", "Example"],
          rows: [
            ["Requirements failure", "Ambiguous, incomplete or changing requirements", "Insurance portal that cannot express a valid policy"],
            ["Design failure", "Wrong architecture, no security by design", "Single database for all tenants, no isolation"],
            ["Coding defect", "Buffer overflow, injection, off-by-one, race condition", "SQL injection in a login form"],
            ["Integration failure", "Incompatible modules/versions, unit mismatch", "Mars Climate Orbiter — pound-seconds vs newton-seconds"],
            ["Operational failure", "Bad configuration, missed patch, weak change control", "Knight Capital 2012 — $440 M in 45 minutes from reused a flag"],
            ["Human factor", "Fatigue, untrained operator, ignored alarm", "Therac-25 race condition plus operator habituation"],
            ["Third-party / supply chain", "Compromised dependency or update", "SolarWinds 2020, Log4Shell 2021"],
          ],
        },
        {
          t: "h",
          text: "Minimising failure",
        },
        {
          t: "list",
          items: [
            "Secure SDLC — security requirements, threat modelling (STRIDE), design review, coding standards.",
            "Testing pyramid — unit, integration, system, regression, performance, fuzzing, penetration, UAT.",
            "Static analysis (SAST), dynamic analysis (DAST), software composition analysis (SCA) for open-source components.",
            "Version control, CI/CD, code review, feature flags, canary and blue-green deployment, rollback plan.",
            "Independent QA, defect tracking, root-cause analysis, post-release monitoring (SLO/error budgets).",
            "Documentation, operator training, graceful degradation and safe defaults.",
          ],
        },
        {
          t: "callout",
          kind: "warn",
          title: "Who pays when software fails?",
          text: "Contract law: express and implied warranties, limitation-of-liability clauses, indemnities and SLAs with service credits. Tort/consumer law: negligence and product liability under the Consumer Protection Act 2019 in India. Professional negligence: duty of care, breach, causation, loss. Insurance/cyber policies may transfer some loss. Criminal liability if there is intent or gross negligence. Courts have generally been reluctant to impose strict liability on software vendors — which is why security researchers argue for a 'secure by design and default' duty.",
        },
      ],
    },
    {
      id: "u3-crime",
      title: "Computer Crime, Privacy and Ethics",
      tag: "Legal",
      minutes: 16,
      keyPoints: [
        "Computer crime: computer as target, computer as instrument, computer as incidental, computer as associate of traditional crime.",
        "Privacy dimensions: informational, bodily, territorial, communicational, decisional; threats from surveillance, profiling, aggregation, inference and breach.",
        "Ethics: ACM/IEEE codes, the Ten Commandments of Computer Ethics, the four ethical frameworks.",
      ],
      examQs: [
        "Classify computer crime with examples.",
        "What is privacy? Discuss the technological threats to privacy.",
        "State the Ten Commandments of Computer Ethics.",
        "Discuss ethical issues faced by computer professionals.",
      ],
      blocks: [
        {
          t: "table",
          head: ["Class", "Meaning", "Examples"],
          rows: [
            ["Computer as target", "The machine/system is the victim", "Hacking, DoS, malware, data theft, vandalism"],
            ["Computer as instrument", "The machine is the weapon", "Fraud, phishing, identity theft, spam, cyberstalking, stock manipulation"],
            ["Computer as incidental", "Computer used but not essential", "Money laundering records, evidence stored on a laptop, drug-deal chat logs"],
            ["Computer as associate", "New crimes that exist only because of computers", "Software piracy, IP theft, selling exploits, botnet rental"],
          ],
        },
        {
          t: "h",
          text: "Privacy — the dimensions and the threats",
        },
        {
          t: "list",
          items: [
            "Dimensions: informational (control over your data), bodily/genetic, territorial (your home/devices), communicational (your messages), decisional (your choices).",
            "Threats: mass surveillance, CCTV/face recognition, cookies and trackers, ad-tech profiling, location history, IoT telemetry, smart TV/assistant always-listening, breached databases, data brokers, aggregate inference (your purchases predicting pregnancy), employer monitoring, deepfakes, and social scoring.",
            "Protections: legal (consent, purpose limitation, DPDP/GDPR) + technical (encryption, E2EE, VPN/Tor, tracker blockers, minimal data collection, differential privacy, anonymisation/pseudonymisation) + behavioural (think before you share, review permissions, separate identities).",
          ],
        },
        {
          t: "callout",
          kind: "exam",
          title: "The Ten Commandments of Computer Ethics (CEI, 1992)",
          text: "1) Thou shalt not use a computer to harm other people. 2) Thou shalt not interfere with other people's computer work. 3) Thou shalt not snoop around in other people's computer files. 4) Thou shalt not use a computer to steal. 5) Thou shalt not use a computer to bear false witness. 6) Thou shalt not copy or use proprietary software for which you have not paid. 7) Thou shalt not use other people's computer resources without authorization or proper compensation. 8) Thou shalt not appropriate other people's intellectual output. 9) Thou shalt think about the social consequences of the program you are writing. 10) Thou shalt always use a computer in ways that ensure consideration and respect for your fellow humans.",
        },
        {
          t: "h",
          text: "Four ethical lenses you can apply to any scenario",
        },
        {
          t: "table",
          head: ["Framework", "Question it asks", "Applied to a data leak"],
          rows: [
            ["Deontology (duty)", "Is the act right in itself, regardless of outcome?", "Was there a duty of confidentiality that was breached?"],
            ["Consequentialism / Utilitarianism", "Does the outcome produce the greatest good?", "Even a 'well-intentioned' leak harms many — wrong."],
            ["Rights-based", "Whose rights are violated?", "Right to privacy and informational self-determination."],
            ["Virtue ethics", "What would an honest professional do?", "Disclose responsibly, do not sell the data."],
          ],
        },
        {
          t: "callout",
          kind: "tip",
          title: "Professional codes to cite",
          text: "ACM Code of Ethics (2018) — general principles, professional responsibilities, leadership, compliance. IEEE Code — public, clients and employers, products, judgement, management, profession, colleagues, self. ISC² Code of Ethics — protect society, act honourably, provide diligent service, advance the profession. Also: whistle-blowing, conflict of interest, informed consent, and responsible/coordinated vulnerability disclosure.",
        },
      ],
    },
  ],
};
