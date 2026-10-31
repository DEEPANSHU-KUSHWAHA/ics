import type { Unit } from "../types";
import hero from "../assets/hero.jpg";
import phishing from "../assets/phishing.jpg";

export const unit1: Unit = {
  id: "unit-1",
  no: 1,
  title: "Internet & Cyber Security Fundamentals",
  accent: "cyan",
  image: hero,
  imageCaption:
    "Every device on the Internet is a node — every node is a possible target. Unit I builds the vocabulary you need before you can defend anything.",
  syllabus:
    "Internet: Introduction, WWW, Domain-Name, Services, Email, Protocol. Cyber-Security: Principles, threats and attack techniques, cyber security policy, information security: confidentiality, integrity, availability, security threats and attacks, Weak/Strong Passwords and Password Cracking, Insecure Network connections, Phishing, Identity-Theft, Botnet.",
  summary:
    "Unit I answers two questions: “How does the Internet actually work?” and “What exactly are we protecting, and from whom?” You will move from packets and domain names to the CIA triad, attack taxonomies, password entropy, phishing anatomy, identity theft and botnets.",
  objectives: [
    "Explain how data travels across the Internet using IPs, protocols, DNS and the WWW",
    "Define the CIA triad and map each threat to the property it breaks",
    "Distinguish between a vulnerability, a threat, an attack, a risk and an impact",
    "Compute password strength mathematically and design a strong-password policy",
    "Dissect a phishing e-mail, spot red flags and describe the identity-theft kill chain",
    "Describe how a botnet is built, commanded (C&C) and dismantled",
  ],
  topics: [
    {
      id: "u1-internet",
      title: "Introduction to the Internet",
      tag: "Foundation",
      minutes: 12,
      keyPoints: [
        "The Internet is a network of networks; the Web is only one service running on it.",
        "Every host is identified by an IP address; humans use domain names, DNS translates between them.",
        "Packet switching + layered protocols make the Internet resilient and scalable.",
      ],
      examQs: [
        "Define the Internet. Differentiate between Internet, intranet and extranet.",
        "Explain packet switching and why it is more robust than circuit switching.",
        "List any five services available on the Internet.",
      ],
      blocks: [
        {
          t: "p",
          text: "The Internet is a global, decentralized system of interconnected computer networks that use the TCP/IP protocol suite to link billions of devices. There is no single owner and no single point of control — it is an agreement about how machines talk, not a piece of hardware you can point at.",
        },
        {
          t: "list",
          items: [
            "Network of networks — millions of private, public, academic, business and government networks.",
            "Carrier of many services — WWW, e-mail, file transfer, voice/video (VoIP), remote login, streaming, IoT.",
            "Address-based — every device needs a unique IP address (IPv4 is 32-bit, e.g. 142.250.183.14; IPv6 is 128-bit, e.g. 2404:6800:4009:80b::200e).",
            "Layered — each layer (Link → Internet → Transport → Application) does one job and hands work to the layer above/below.",
            " Stateless but connection-oriented at transport level — TCP guarantees ordered, error-checked delivery; UDP trades reliability for speed.",
          ],
        },
        { t: "diagram", id: "internet" },
        {
          t: "h",
          text: "Internet vs Intranet vs Extranet",
        },
        {
          t: "table",
          head: ["Property", "Internet", "Intranet", "Extranet"],
          rows: [
            ["Ownership", "Public, nobody owns it", "One organisation", "Organisation + trusted partners"],
            ["Access", "Anyone", "Employees only", "Vendors, dealers, clients"],
            ["Security need", "High, hostile by default", "Moderate, but insider risk", "High, needs VPN + authentication"],
            ["Example", "www.google.com", "Company HR portal", "Supplier order-tracking portal"],
          ],
        },
        {
          t: "callout",
          kind: "exam",
          title: "Exam favourite",
          text: "“Extranet = intranet extended to authorised outsiders.” Memorise the three-way table; it is asked almost every year as a 5-mark differentiate question.",
        },
        {
          t: "h",
          text: "A short history you can quote",
        },
        {
          t: "list",
          ordered: true,
          items: [
            "1969 — ARPANET, first packet-switching network, 4 nodes (UCLA, SRI, UCSB, Utah).",
            "1974 — Vint Cerf & Bob Kahn publish the TCP specification.",
            "1983 — 1 January: ARPANET switches to TCP/IP; many call this the Internet's birthday.",
            "1989-91 — Tim Berners-Lee at CERN invents the World Wide Web (HTML, HTTP, URL).",
            "1993 — Mosaic browser makes the Web graphical; the Internet goes commercial.",
            "1998 — Google founded; 2007 — smartphones put the Internet in every pocket; 2020s — cloud, IoT and AI dominate traffic.",
          ],
        },
        {
          t: "callout",
          kind: "tip",
          title: "Memory hook",
          text: "IP = address, TCP = delivery guarantee, DNS = phone book, HTTP = language of the Web, URL = full postal address of a page.",
        },
      ],
    },
    {
      id: "u1-www",
      title: "The World Wide Web (WWW)",
      tag: "Foundation",
      minutes: 10,
      keyPoints: [
        "WWW = hypertext documents linked by URLs and fetched over HTTP(S).",
        "Browser = client, web server = responder; HTTP is stateless so cookies maintain session.",
        "Web 1.0 read-only → Web 2.0 social → Web 3.0 semantic/decentralised.",
      ],
      examQs: [
        "What is the WWW? How is it different from the Internet?",
        "Explain the components of a URL with an example.",
        "Why is HTTP called a stateless protocol and how is statelessness overcome?",
      ],
      blocks: [
        {
          t: "p",
          text: "The World Wide Web is an information space where documents and other web resources are identified by Uniform Resource Locators (URLs), interlinked by hypertext links, and accessible over the Internet. The Web is a service on the Internet — like e-mail, FTP and streaming — but it is by far the largest.",
        },
        {
          t: "table",
          head: ["URL part", "Example", "Meaning"],
          rows: [
            ["Scheme / protocol", "https://", "How to talk (secure HTTP, port 443)"],
            ["Host / domain", "www.examportal.ac.in", "Which machine (DNS resolves to an IP)"],
            ["Port", ":8443", "Which door on that machine (default hidden)"],
            ["Path", "/results/2026", "Which folder/resource"],
            ["Query string", "?roll=21cs041", "Parameters for the server"],
            ["Fragment", "#section3", "Position inside the page (never sent to server)"],
          ],
        },
        {
          t: "p",
          text: "When you type a URL the browser performs: DNS resolution → TCP three-way handshake → TLS handshake (if https) → HTTP request → server renders/responds → browser parses HTML, fetches CSS/JS/images → paints the page. Anything unencrypted inside that journey is visible to an attacker on the path.",
        },
        {
          t: "callout",
          kind: "example",
          title: "Web evolution in one line",
          text: "Web 1.0 (read, static pages) → Web 2.0 (read-write, social, user content) → Web 3.0 (semantic, decentralised, machine-understandable, blockchain/AI driven).",
        },
        {
          t: "h",
          text: "Security relevance of the Web",
        },
        {
          t: "list",
          items: [
            "HTTP is plaintext — credentials sent over HTTP can be read by anyone on the network.",
            "Cookies store session IDs; a stolen session cookie = account takeover without knowing the password.",
            "Mixed content: an https page loading http scripts breaks the security model.",
            "Browser attacks: drive-by downloads, XSS, clickjacking, malicious extensions.",
          ],
        },
      ],
    },
    {
      id: "u1-dns",
      title: "Domain Names & DNS",
      tag: "Foundation",
      minutes: 11,
      keyPoints: [
        "DNS converts a human-readable FQDN into a machine-usable IP address.",
        "The hierarchy runs Root → TLD → Second-level → Sub-domain, served by recursive and authoritative servers.",
        "Attacks: DNS spoofing/poisoning, cache poisoning, hijacking, subdomain takeover, DNS tunnelling.",
      ],
      examQs: [
        "Explain DNS name resolution with a neat diagram.",
        "What is domain name structure? Explain generic and country-code TLDs.",
        "Describe DNS spoofing/poisoning and its countermeasures.",
      ],
      blocks: [
        {
          t: "p",
          text: "A domain name is the human-friendly identity of a resource on the Internet. The Domain Name System (DNS) is the distributed, hierarchical database that translates names into IP addresses — the “phone book of the Internet”. Without DNS, every user would have to memorise 32-bit numbers.",
        },
        { t: "diagram", id: "domain" },
        {
          t: "h",
          text: "Anatomy of a fully qualified domain name",
        },
        {
          t: "table",
          head: ["Part", "Example", "Note"],
          rows: [
            ["Root", "( . ) — implicit", "13 logical root server clusters (A–M) run by 12 organisations"],
            ["TLD", ".in / .com / .edu", "gTLD (generic) and ccTLD (country code)"],
            ["Second-level", "aktu.ac.in", "Registered with a registrar for a yearly fee"],
            ["Sub-domain / host", "results.aktu.ac.in", "Created by the owner, free"],
            ["FQDN", "www.results.aktu.ac.in.", "Ends with the implicit root dot"],
          ],
        },
        {
          t: "h",
          text: "The resolution sequence (learn this order)",
        },
        {
          t: "list",
          ordered: true,
          items: [
            "Browser/host cache → OS resolver cache → recursive resolver (ISP or 8.8.8.8).",
            "Resolver asks a root server: “who handles .ac.in?” → returns TLD server address.",
            "Resolver asks the TLD server: “who is authoritative for aktu.ac.in?” → returns nameserver.",
            "Authoritative nameserver returns the A record (IPv4) / AAAA (IPv6) / MX / CNAME / TXT.",
            "Resolver caches the answer according to TTL and returns it to the browser.",
          ],
        },
        { t: "diagram", id: "dns" },
        {
          t: "h",
          text: "Records worth remembering",
        },
        {
          t: "table",
          head: ["Record", "Purpose"],
          rows: [
            ["A / AAAA", "Name → IPv4 / IPv6 address"],
            ["CNAME", "Alias pointing to another name"],
            ["MX", "Mail exchanger for the domain (mail routing)"],
            ["NS", "Authoritative name server"],
            ["TXT / SPF / DKIM / DMARC", "Anti-spoofing records used to prove a mail really came from that domain"],
            ["SOA", "Start of authority — zone metadata and serial"],
          ],
        },
        {
          t: "callout",
          kind: "warn",
          title: "DNS is the trust anchor of the Web — attack it and everything falls",
          text: "DNS spoofing redirects victims to a look-alike server; cache poisoning injects a fake record into a resolver so thousands of users are affected; registrar account hijacking can steal a whole brand. Defences: DNSSEC (digital signatures on records), DNS over HTTPS/TLS, short TTLs, registrar 2FA and registry lock.",
        },
        {
          t: "callout",
          kind: "tip",
          title: "Cybersquatting link",
          text: "Registering a domain identical/similar to a trademark in bad faith is cybersquatting — covered in depth in Unit V along with UDRP and the Indian Anticybersquatting Consumer Protection twist.",
        },
      ],
    },
    {
      id: "u1-services",
      title: "Internet Services & Ports",
      tag: "Foundation",
      minutes: 9,
      keyPoints: [
        "Each service runs on a well-known TCP/UDP port; blocking/monitoring ports is a basic control.",
        "Open ports are the first thing a scanner enumerates — the attacker's map of your attack surface.",
        "E-mail uses SMTP to send and POP3/IMAP to receive; web uses HTTP/HTTPS.",
      ],
      examQs: [
        "List common Internet services with their protocols and default ports.",
        "Explain the working of e-mail describing SMTP, POP3 and IMAP.",
        "Why is knowing open ports important for both attacker and defender?",
      ],
      blocks: [
        {
          t: "table",
          head: ["Service", "Protocol / Port", "Security note"],
          rows: [
            ["Web", "HTTP 80 / HTTPS 443", "Always prefer HTTPS (TLS) — HTTP is sniffable"],
            ["Mail send", "SMTP 25 / 587 / 465", "25 is often blocked to stop spam bots; 587 with STARTTLS for submission"],
            ["Mail receive", "POP3 110/995, IMAP 143/993", "IMAP keeps mail on server; POP3 downloads it"],
            ["File transfer", "FTP 21, SFTP 22, FTPS 990", "Plain FTP sends credentials in cleartext — never use"],
            ["Remote login", "Telnet 23, SSH 22", "Telnet is banned in any real network; use SSH keys"],
            ["Name service", "DNS 53", "Cache poisoning, amplification DDoS"],
            ["DHCP", "UDP 67/68", "Rogue DHCP = man-in-the-middle gateway"],
            ["Windows share", "SMB 445", "WannaCry's entry door"],
            ["Database", "MySQL 3306, MSSQL 1433", "Never expose directly to the Internet"],
          ],
        },
        { t: "diagram", id: "email" },
        {
          t: "h",
          text: "How an e-mail actually travels",
        },
        {
          t: "list",
          ordered: true,
          items: [
            "Composer writes the mail in a Mail User Agent (MUA) — Outlook, Gmail app.",
            "MUA pushes it to the Mail Transfer Agent (MTA) using SMTP submission.",
            "MTAs relay server-to-server using SMTP, consulting DNS MX records to find the destination.",
            "Spam/virus filters, SPF, DKIM and DMARC checks happen along the way.",
            "Destination MDA stores the mail; recipient pulls it with IMAP (sync, keeps server copy) or POP3 (download).",
          ],
        },
        {
          t: "callout",
          kind: "exam",
          title: "1-mark gold",
          text: "SMTP = Simple Mail Transfer Protocol (sending). POP3 = Post Office Protocol (download, delete). IMAP = Internet Message Access Protocol (synchronise, keep on server). MIME = Multipurpose Internet Mail Extensions (attachments, non-ASCII, multimedia).",
        },
        {
          t: "callout",
          kind: "warn",
          title: "E-mail is not secure by default",
          text: "SMTP was designed in 1971 with no authentication and no encryption. That is why spoofing a From: address is trivial and why we need SPF/DKIM/DMARC plus PGP/S-MIME end-to-end encryption for confidentiality.",
        },
      ],
    },
    {
      id: "u1-principles",
      title: "Cyber Security Principles & the CIA Triad",
      tag: "Core",
      minutes: 14,
      keyPoints: [
        "CIA = Confidentiality, Integrity, Availability; the AAAs (Authentication, Authorization, Accounting, Audit, Assurance) support it.",
        "Every control you will ever study exists to protect one or more CIA properties.",
        "Non-repudiation, authenticity and privacy are extensions frequently asked in 2-mark questions.",
      ],
      examQs: [
        "Define information security. Explain the CIA triad with examples.",
        "What is meant by non-repudiation? How is it achieved?",
        "Differentiate authentication and authorization.",
      ],
      blocks: [
        {
          t: "p",
          text: "Information security is the practice of protecting information and information systems from unauthorised access, use, disclosure, disruption, modification or destruction. It is conventionally expressed as the protection of three core properties — the CIA triad.",
        },
        { t: "diagram", id: "triad" },
        {
          t: "table",
          head: ["Property", "Meaning", "Broken by", "Typical controls"],
          rows: [
            ["Confidentiality", "Only authorised people can read the data", "Sniffing, breach, insider leak, shoulder surfing", "Encryption, access control, classification, DLP"],
            ["Integrity", "Data is accurate, complete and unaltered", "Tampering, MITM, malware, human error", "Hashing, digital signatures, version control, checksums"],
            ["Availability", "Data/services are usable when needed", "DDoS, ransomware, hardware failure, disaster", "Redundancy, backups, load balancers, anti-DDoS, DR site"],
          ],
        },
        {
          t: "callout",
          kind: "example",
          title: "One incident, three broken properties",
          text: "Ransomware: files encrypted = confidentiality of backup + integrity of live data lost, and services offline = availability lost. That is why ransomware is the perfect exam example — it hits the whole triad at once.",
        },
        {
          t: "h",
          text: "The supporting A's",
        },
        {
          t: "list",
          items: [
            "Authentication — proving you are who you claim (password, OTP, biometric, certificate).",
            "Authorization — deciding what an authenticated identity may do (permissions, roles).",
            "Accounting / Auditing — recording who did what, when (logs, SIEM).",
            "Non-repudiation — the sender cannot later deny having sent it (digital signature + trusted timestamp).",
            "Authenticity — the data genuinely originates from the claimed source.",
            "Privacy — the individual's right to control their personal data (a legal, not just technical, idea).",
          ],
        },
        {
          t: "callout",
          kind: "exam",
          title: "Model 5-mark answer skeleton",
          text: "Define information security → state the CIA triad → give one example of each → mention authentication/authorization/non-repudiation as supporting services → close with “security is a process, not a product” (Bruce Schneier).",
        },
      ],
    },
    {
      id: "u1-threats",
      title: "Security Threats, Attacks & Attack Techniques",
      tag: "Core",
      minutes: 16,
      keyPoints: [
        "Chain to memorise: Asset → Vulnerability → Threat → Attack → Risk → Impact → Safeguard.",
        "Passive attacks observe (hard to detect, easy to prevent); active attacks modify (easy to detect, hard to prevent).",
        "Malware taxonomy: virus, worm, trojan, ransomware, spyware, rootkit, keylogger, fileless.",
      ],
      examQs: [
        "Differentiate between passive and active attacks with examples.",
        "Define vulnerability, threat and risk with a suitable example.",
        "Write short notes on: virus, worm, trojan horse, ransomware, rootkit.",
      ],
      blocks: [
        {
          t: "p",
          text: "Cyber security vocabulary is precise. An asset is something you value. A vulnerability is a weakness in that asset or its environment. A threat is anything that can exploit that weakness. When a threat actor actually exploits it, that is an attack. Risk is the probability × impact of that happening, and a safeguard (control) reduces the risk to an acceptable residual level.",
        },
        {
          t: "table",
          head: ["Term", "Definition", "Example"],
          rows: [
            ["Asset", "Anything of value to the organisation", "Customer database, source code, reputation"],
            ["Vulnerability", "Weakness that can be exploited", "Unpatched Apache, weak password policy, misconfigured S3 bucket"],
            ["Threat", "Potential cause of an unwanted incident", "Hacker group, insider, flood, power cut"],
            ["Attack", "Actual realisation of a threat", "SQL injection executed against the login page"],
            ["Risk", "Likelihood × impact of loss", "20% chance of ₹1 crore loss = ₹20 lakh risk"],
            ["Safeguard / Control", "Measure that reduces risk", "WAF, MFA, backup, staff training"],
            ["Residual risk", "Risk left after controls", "Accepted, transferred (insurance) or treated further"],
          ],
        },
        {
          t: "h",
          text: "Passive vs Active attacks",
        },
        {
          t: "table",
          head: ["", "Passive", "Active"],
          rows: [
            ["Goal", "Observe / eavesdrop", "Alter, disrupt or destroy"],
            ["Data changed?", "No", "Yes"],
            ["Detection", "Very hard", "Comparatively easy"],
            ["Prevention", "Easy (encryption)", "Hard (need integrity + availability controls)"],
            ["Examples", "Sniffing, traffic analysis, shoulder surfing", "DoS/DDoS, MITM, replay, masquerade, message modification, SQLi, XSS"],
          ],
        },
        {
          t: "h",
          text: "Malware family tree",
        },
        {
          t: "table",
          head: ["Type", "How it behaves", "Famous case"],
          rows: [
            ["Virus", "Attaches to a host file, needs user action to spread", "Melissa (1999)"],
            ["Worm", "Self-replicates over the network, no host needed", "Morris (1988), WannaCry (2017)"],
            ["Trojan", "Malicious code hidden inside useful software", "Zeus banking trojan"],
            ["Ransomware", "Encrypts data, demands payment", "WannaCry, NotPetya, LockBit"],
            ["Spyware / Adware", "Silently collects activity / pushes ads", "Pegasus"],
            ["Keylogger", "Records keystrokes → credentials", "Often bundled with phishing kits"],
            ["Rootkit", "Hides at OS/kernel level, survives detection", "Sony BMG rootkit (2005)"],
            ["Bot", "Infected machine under remote control → part of a botnet", "Mirai IoT botnet"],
            ["Fileless", "Lives in memory / trusted tools like PowerShell", "APT favourites"],
          ],
        },
        { t: "diagram", id: "sniff" },
        {
          t: "callout",
          kind: "warn",
          title: "Attack technique checklist",
          text: "Eavesdropping/sniffing · Man-in-the-middle · Replay · Denial of Service · Phishing/social engineering · Password attacks (guessing, dictionary, brute force, rainbow table, credential stuffing) · Injection (SQL/OS/LDAP) · XSS · Privilege escalation · Zero-day exploitation · Supply-chain compromise · Insider threat.",
        },
        {
          t: "sim",
          id: "sniffer",
        },
      ],
    },
    {
      id: "u1-policy",
      title: "Cyber Security Policy",
      tag: "Governance",
      minutes: 9,
      keyPoints: [
        "Policy = management's written intent; standards, procedures and guidelines make it operational.",
        "A policy must be approved by management, reviewed periodically and enforceable.",
        "India's national strategy: National Cyber Security Policy 2013, CERT-In directions 2022, DPDP Act 2023.",
      ],
      examQs: [
        "What is a cyber security policy? List its components and types.",
        "Differentiate policy, standard, procedure and guideline.",
        "Write a note on the National Cyber Security Policy of India.",
      ],
      blocks: [
        {
          t: "p",
          text: "A cyber security policy is a formal, documented statement of management's expectations and rules for protecting information assets. Technology alone cannot secure an organisation; policy tells people what is acceptable, who is responsible and what happens when rules are broken.",
        },
        {
          t: "table",
          head: ["Document", "What it says", "Example"],
          rows: [
            ["Policy", "WHAT and WHY — mandatory, high level, management approved", "“All laptops must be encrypted.”"],
            ["Standard", "Specific technologies/parameters required", "“BitLocker, AES-256, TPM 2.0.”"],
            ["Procedure", "Step-by-step HOW", "“Run gpupdate, verify in Intune, record asset ID…”"],
            ["Guideline", "Recommended, not compulsory", "“Prefer full-disk encryption on mobiles too.”"],
            ["Baseline", "Minimum acceptable configuration", "CIS Benchmark level 1"],
          ],
        },
        {
          t: "h",
          text: "Common policy types",
        },
        {
          t: "list",
          items: [
            "Acceptable Use Policy (AUP) — what employees may do with IT resources.",
            "Password / Authentication Policy — length, complexity, rotation, MFA.",
            "Access Control & Remote Access Policy (incl. VPN/BYOD).",
            "Data Classification & Handling Policy — public/internal/confidential/restricted.",
            "Backup & Retention Policy, Change Management Policy.",
            "Incident Response Policy + Escalation matrix.",
            "Email, Internet and Social Media Usage Policy.",
            "Vendor / Third-party & Cloud Security Policy.",
            "Clean Desk & Clear Screen Policy.",
          ],
        },
        {
          t: "callout",
          kind: "tip",
          title: "Characteristics of a good policy",
          text: "It must be written, approved by top management, scope-limited, unambiguous, enforceable, measurable, reviewed at least annually and communicated to every employee with an acknowledgement.",
        },
        {
          t: "h",
          text: "Indian context",
        },
        {
          t: "list",
          items: [
            "National Cyber Security Policy 2013 — aims to build a secure cyberspace ecosystem, create a 5-lakh strong cyber workforce, and set up NCIPC/NCCC.",
            "CERT-In — the national incident response agency under MeitY; its 2022 directions mandate 6-hour incident reporting.",
            "IT Act 2000 (amended 2008) — legal framework, covered in Unit IV.",
            "Digital Personal Data Protection Act, 2023 — consent-based processing of personal data, Data Protection Board, penalties up to ₹250 crore.",
            "Sector regulators — RBI (banks), SEBI (markets), TRAI (telecom) issue their own security guidelines.",
          ],
        },
      ],
    },
    {
      id: "u1-passwords",
      title: "Weak vs Strong Passwords & Password Cracking",
      tag: "Core",
      minutes: 18,
      keyPoints: [
        "Strength is measured in entropy bits = length × log2(alphabet size).",
        "Attackers use guessing, dictionary, brute force, rainbow tables, credential stuffing and hash spraying.",
        "Length beats complexity; password managers + MFA beat everything.",
      ],
      examQs: [
        "Differentiate weak and strong passwords with examples.",
        "Explain dictionary, brute-force and rainbow-table attacks.",
        "How is password strength mathematically measured? Give the formula and one worked example.",
        "Suggest best practices for creating and managing passwords.",
      ],
      blocks: [
        {
          t: "p",
          text: "A password is a shared secret known only to the user and the system. Because it is the cheapest authentication factor to deploy, it is also the most attacked. Password strength is not about replacing 'a' with '@' — it is about how much uncertainty (entropy) an attacker must overcome.",
        },
        {
          t: "code",
          label: "Password entropy — the formula every answer should include",
          text: `Search space S = (alphabet size) ^ (length)
Entropy in bits  = length × log2(alphabet size)

Examples of alphabet size:
  lowercase only              26
  lowercase + digits          36
  mixed case + digits         62
  all printable ASCII        ~95

Worked example: 8-char lowercase  -> 26^8  ≈ 2.09e11 -> 37.6 bits (weak)
                12-char mixed+digits -> 62^12 ≈ 3.2e21 -> 71.5 bits (strong)
                16-char mixed+digits -> 62^16 ≈ 4.8e28 -> 95.3 bits (excellent)`,
        },
        {
          t: "table",
          head: ["Weak password", "Why it fails", "Stronger alternative"],
          rows: [
            ["123456 / password", "Top of every cracked-password list", "Passphrase of 4 random words"],
            ["ramesh1985", "Name + year, on social media", "Correct-Horse-Battery-9!"],
            ["P@ssw0rd", "Only trivial substitution; in all dictionaries", "Long, unique, stored in a manager"],
            ["Same password on 5 sites", "One breach = total takeover", "Unique per site, MFA everywhere"],
            ["Pet/child name", "Guessable from Facebook", "Random generator output, 16+ chars"],
          ],
        },
        { t: "sim", id: "password" },
        {
          t: "h",
          text: "How passwords are cracked",
        },
        {
          t: "list",
          items: [
            "Guessing / social engineering — the attacker simply knows you (pet, birthday, favourite team).",
            "Shoulder surfing & keyboard sniffing — camera over your shoulder, hardware keylogger, ATM skimmer.",
            "Dictionary attack — tries whole words and common mutations; fast because human passwords cluster.",
            "Brute force — tries every combination; cost grows exponentially with length (that's the whole defence).",
            "Hybrid / rule-based — dictionary word + rule engine ('password' → 'P@ssw0rd1').",
            "Rainbow table — pre-computed hash chains; defeats unsalted hashes instantly. Countermeasure: salt every hash.",
            "Credential stuffing — replays username/password pairs leaked from one site against hundreds of others.",
            "Hash spraying — one weak password ('Summer2026!') tried against thousands of accounts, defeats lockouts.",
            "Phishing / keylogger / MFA-fatigue push bombing — stealing rather than cracking the secret.",
          ],
        },
        {
          t: "callout",
          kind: "warn",
          title: "The 2012 LinkedIn lesson",
          text: "117 million unsalted SHA-1 hashes leaked. Because there was no salt, rainbow tables and GPU rigs recovered most of them in days. Storage rule: never store passwords — store a salted, slow hash (bcrypt, scrypt, Argon2, PBKDF2) with a unique salt and a high work factor.",
        },
        {
          t: "table",
          head: ["Layer", "Best practice"],
          rows: [
            ["Length", "Minimum 12–16 characters; passphrases preferred"],
            ["Uniqueness", "Never reuse across accounts"],
            ["Complexity", "Mixed case + digits + symbols, but only after length"],
            ["Rotation", "Change immediately on suspicion of breach (NIST now discourages forced periodic changes)"],
            ["Storage", "Password manager (KeePass, Bitwarden, 1Password)"],
            ["MFA", "Something you KNOW + HAVE + ARE — TOTP app or hardware key over SMS"],
            ["System side", "Salted slow hash, lockout/throttling, CAPTCHA, breach-password blacklist, monitoring"],
          ],
        },
        {
          t: "callout",
          kind: "exam",
          title: "Three authentication factors",
          text: "Type 1 — Something you know (password, PIN, pattern). Type 2 — Something you have (smart card, OTP token, phone). Type 3 — Something you are (fingerprint, iris, face, voice). Add: somewhere you are (geolocation) and something you do (behavioural biometrics).",
        },
      ],
    },
    {
      id: "u1-insecure",
      title: "Insecure Network Connections",
      tag: "Core",
      minutes: 12,
      keyPoints: [
        "Open Wi-Fi + HTTP = broadcasting your session to everyone in the room.",
        "MITM techniques: ARP spoofing, DNS spoofing, rogue AP (evil twin), SSL stripping, rogue DHCP.",
        "Defence: HTTPS everywhere, VPN, WPA2/WPA3, certificate validation, disable auto-join.",
      ],
      examQs: [
        "What are the risks of using an open/public Wi-Fi network?",
        "Explain man-in-the-middle attack and ARP poisoning with a diagram.",
        "How can a user secure a connection on a public network?",
      ],
      blocks: [
        {
          t: "p",
          text: "An insecure network connection is any path where an attacker can read or modify your traffic. Public Wi-Fi, hotel networks, airport hotspots, unencrypted HTTP sites, abandoned old VPNs and misconfigured IoT devices all fall in this bucket. The attacker does not need to break the encryption — they only need to be on the path or to trick you onto their path.",
        },
        {
          t: "table",
          head: ["Technique", "How it works", "Countermeasure"],
          rows: [
            ["Packet sniffing", "Passive capture of broadcast frames on shared Wi-Fi", "TLS, WPA3, switch instead of hub"],
            ["ARP spoofing / poisoning", "Fake ARP replies map the gateway's IP to attacker's MAC → traffic is relayed", "Dynamic ARP inspection, static ARP, port security"],
            ["DNS spoofing", "Forged DNS responses point the domain at the attacker's IP", "DNSSEC, DoH/DoT, trusted resolvers"],
            ["Evil twin / rogue AP", "Attacker clones the SSID of a free hotspot", "Verify SSID, use mobile hotspot, VPN"],
            ["SSL stripping", "Downgrades https links to http before you connect", "HSTS, HTTPS-Only mode, padlock check"],
            ["Rogue DHCP", "Attacker becomes your default gateway", "DHCP snooping"],
            ["Session hijacking", "Steals the session cookie and replays it", "Secure + HttpOnly + SameSite cookies, short TTL, re-auth"],
            ["Replay attack", "Captures a valid transmission and resends it", "Timestamps, nonces, sequence numbers"],
          ],
        },
        { t: "sim", id: "sniffer" },
        {
          t: "callout",
          kind: "tip",
          title: "Ten-second public Wi-Fi checklist",
          text: "1) Prefer mobile data or a personal hotspot. 2) Turn off auto-connect and file sharing. 3) Switch on your VPN before opening anything. 4) Confirm the padlock and certificate name. 5) Never log into banking/admin panels on open Wi-Fi. 6) Forget the network when you leave.",
        },
        {
          t: "callout",
          kind: "example",
          title: "FireSheep (2010)",
          text: "A Firefox extension let anyone on a café Wi-Fi hijack Facebook/Twitter sessions because those sites sent session cookies over HTTP. It forced the industry-wide move to HTTPS-by-default — a perfect example to cite when asked how insecure connections cause real damage.",
        },
      ],
    },
    {
      id: "u1-phishing",
      title: "Phishing, Social Engineering & Identity Theft",
      tag: "Core",
      minutes: 16,
      keyPoints: [
        "Phishing = social engineering + a fake digital lure + a data-harvesting destination.",
        "Variants: spear phishing, whaling, vishing, smishing, angler, clone, pharming, BEC.",
        "Identity theft follows a predictable chain: acquire → verify → monetise → disappear.",
      ],
      examQs: [
        "Define phishing. Explain its types with examples.",
        "How does phishing lead to identity theft? Suggest preventive measures.",
        "List the warning signs of a phishing e-mail.",
      ],
      blocks: [
        {
          t: "p",
          text: "Phishing is a social-engineering attack in which the attacker impersonates a trustworthy entity in an electronic communication to trick the victim into revealing credentials, financial data or personal information, or into installing malware. It targets the human, not the machine — the weakest and most exploitable layer of any system.",
        },
        { t: "image", src: phishing, caption: "Anatomy of a phishing campaign: the lure (e-mail/SMS/call), the fake landing page, the harvest, the cash-out." },
        {
          t: "table",
          head: ["Variant", "Target", "Channel"],
          rows: [
            ["Phishing (mass)", "Anyone — volume game", "E-mail"],
            ["Spear phishing", "One researched individual", "Personalised e-mail"],
            ["Whaling / CEO fraud", "Senior executives", "E-mail, fake invoice, gift-card request"],
            ["Vishing", "Anyone", "Voice call, often spoofed caller-ID or IVR"],
            ["Smishing", "Mobile users", "SMS / WhatsApp with a shortened link"],
            ["Angler phishing", "Complaining customers", "Fake brand support accounts on social media"],
            ["Clone phishing", "Previous recipients", "Legitimate mail cloned with a malicious attachment"],
            ["Pharming", "Broad", "DNS poisoning → you type the right URL, land on a fake site"],
            ["BEC / W-2 fraud", "Finance & HR teams", "Spoofed/compromised executive mailbox"],
          ],
        },
        {
          t: "h",
          text: "Seven red flags in any message",
        },
        {
          t: "list",
          ordered: true,
          items: [
            "Urgency and threat language — “verify within 24 hours or your account will be permanently closed”.",
            "Generic greeting — “Dear Customer” instead of your name.",
            "Mismatched or look-alike sender domain — rnicrosoft.com, paypa1.com, support@yourbank-secure.co.",
            "Hover-over mismatch — the visible link text says one thing, the real href another.",
            "Unexpected attachment or credential request — no legitimate bank asks for your OTP/PIN.",
            "Poor grammar, odd formatting, pixelated logo.",
            "Too good to be true — lottery, refund, prize, crypto doubling.",
          ],
        },
        { t: "sim", id: "phishing" },
        {
          t: "h",
          text: "From phishing to identity theft",
        },
        {
          t: "list",
          ordered: true,
          items: [
            "Acquisition — phished credentials, leaked databases, stolen Aadhaar/PAN/SSN photocopies, discarded documents (dumpster diving), skimmers, oversharing on social media.",
            "Verification — attacker checks which combos work via credential stuffing against many sites.",
            "Monetisation — bank/credit fraud, new-account fraud, SIM-swap to intercept OTPs, tax refund fraud, medical identity theft, applying for loans.",
            "Cover-up — mail-forwarding rules, deleted alerts, sold on dark-web markets, victim notices months later.",
          ],
        },
        {
          t: "table",
          head: ["Type of identity theft", "What is stolen / misused"],
          rows: [
            ["Financial", "Card, bank and credit details → fraudulent transactions and loans"],
            ["Criminal", "Impersonation during arrest/crime using your documents"],
            ["Medical", "Insurance number used to claim treatment → corrupts your records"],
            ["Synthetic", "Real fragments (your PAN + fake name) combined into a new identity"],
            ["Child identity theft", "Unused clean credit history — often undetected for years"],
            ["Corporate / executive", "Fake social profile of an executive used to defraud staff"],
          ],
        },
        {
          t: "callout",
          kind: "tip",
          title: "Defence in depth against phishing",
          text: "Technical — SPF, DKIM, DMARC, mail gateway sandboxing, URL rewriting, MFA (prefer FIDO2 keys: phishing-resistant), FIDO/passkeys. Human — mandatory awareness training, simulated phishing drills, a one-click 'Report Phishing' button and a no-blame culture. Process — dual approval for payments, out-of-band verification of any bank-detail change request.",
        },
        {
          t: "callout",
          kind: "warn",
          title: "If you already clicked",
          text: "Disconnect from the network → change the password from a clean device → revoke sessions/tokens → enable MFA → scan for malware → alert IT/security and your bank → freeze/block the card → file a report at cybercrime.gov.in or call 1930 (India).",
        },
      ],
    },
    {
      id: "u1-botnet",
      title: "Botnets & Command-and-Control",
      tag: "Core",
      minutes: 13,
      keyPoints: [
        "A botnet is a network of compromised 'zombie' machines under a botmaster's C&C.",
        "Topologies: centralised (client-server, IRC/HTTP) vs decentralised (P2P, harder to kill).",
        "Revenue: DDoS-for-hire, spam, ransomware distribution, click fraud, credential and proxy resale.",
      ],
      examQs: [
        "What is a botnet? Explain its architecture and working.",
        "How are botnets used to launch DDoS attacks? How can they be stopped?",
        "Differentiate a bot, a botnet and a zombie.",
      ],
      blocks: [
        {
          t: "p",
          text: "A botnet (robot + network) is a collection of internet-connected devices — PCs, servers, routers, CCTV cameras, IoT gadgets — that have been infected with malware allowing an attacker to control them remotely. Each infected device is a bot or zombie; the controller is the bot herder or botmaster; the channel used to issue instructions is the command-and-control (C&C/C2) infrastructure.",
        },
        {
          t: "h",
          text: "Life cycle of a botnet",
        },
        {
          t: "list",
          ordered: true,
          items: [
            "Infection — drive-by download, malicious attachment, cracked software, default IoT credentials, worm propagation.",
            "Connection — the bot dials home to a hardcoded or algorithmically generated C&C domain (DGA).",
            "Command — the botmaster pushes instructions: download module, scan, attack, mine, spam.",
            "Activity — the botnet performs the criminal task while the owner notices only a slow machine.",
            "Maintenance & update — new binaries pushed to survive patches and antivirus signatures.",
            "Takedown — sinkholing the C&C domain, seizure by law enforcement, ISP blackholing, firmware patching of IoT.",
          ],
        },
        {
          t: "table",
          head: ["Architecture", "Description", "Pros / cons for the attacker"],
          rows: [
            ["Centralised (IRC/HTTP C&C)", "All bots talk to one or few servers", "Fast and simple, but a single seizure kills the botnet"],
            ["P2P / decentralised", "Bots share commands peer-to-peer", "Resilient, no single point, but slower and noisier"],
            ["Fast-flux / DGA", "Rotating IPs / algorithmically generated domains", "Hides the real C&C behind a shifting cloud"],
            ["Proxy / TOR chained", "Traffic relayed through anonymity layers", "Very hard to attribute"],
          ],
        },
        { t: "sim", id: "botnet" },
        {
          t: "table",
          head: ["Famous botnet", "Peak size", "Claim to fame"],
          rows: [
            ["Zeus", "3.6 M PCs (2009)", "Banking credentials, man-in-the-browser"],
            ["Mirai", "~600 k IoT devices (2016)", "Took down Dyn DNS → Twitter, Netflix, Reddit; default passwords"],
            ["Emotet", "1.5 M+ (2018)", "'Malware as a service' loader; dismantled by Europol 2021"],
            ["Necurs", "~6 M", "World's largest spam distributor"],
            ["Gameover ZeuS / Conficker", "Millions", "P2P design, bank fraud, still partially alive"],
          ],
        },
        {
          t: "callout",
          kind: "tip",
          title: "Is your machine a zombie?",
          text: "Symptoms: sudden sluggishness, fan at full speed while idle, unknown outbound connections, disabled antivirus, e-mail contacts receiving spam from you, browser redirects, unexplained bandwidth spikes. Check with netstat -ano, Task Manager startup entries and an offline scanner.",
        },
        {
          t: "callout",
          kind: "exam",
          title: "DoS vs DDoS — one line each",
          text: "DoS: a single source floods a target to exhaust bandwidth, connections or CPU. DDoS: many distributed sources (usually a botnet) flood simultaneously, making source-blocking impossible. Sub-types: volumetric (bandwidth), protocol (SYN flood, ping of death), application layer (HTTP flood, Slowloris), plus amplification/reflection using DNS or NTP.",
        },
      ],
    },
  ],
};
