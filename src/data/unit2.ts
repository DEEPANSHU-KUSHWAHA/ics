import type { Unit } from "../types";

export const unit2: Unit = {
  id: "unit-2",
  no: 2,
  title: "Authentication & Network Security",
  accent: "violet",
  image:
    "https://images.pexels.com/photos/37730211/pexels-photo-37730211.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  imageCaption:
    "Network security is applied cryptography plus disciplined identity management — you prove who you are, then you encrypt everything that leaves the box.",
  syllabus:
    "Authentication: Identification, Authentication, Authentication by passwords, Access control structures, Types of access control. Network Security: Cryptographic mechanisms, Digital signatures, Encryption, digital signature certification, suspension and revocation of digital signature certificate.",
  summary:
    "Unit II is the technical heart of the paper. Identification says who you claim to be, authentication proves it, and access control decides what you may touch. Then cryptography turns plaintext into ciphertext, and digital signatures give you integrity, authenticity and non-repudiation backed by a certificate authority.",
  objectives: [
    "Distinguish identification, authentication, authorization and accounting",
    "Compare authentication factors, protocols and single sign-on models",
    "Build and evaluate access-control structures: ACL, capability, matrix, MAC/DAC/RBAC/ABAC",
    "Explain symmetric vs asymmetric encryption, hashing and PKI end to end",
    "Trace the digital-signature lifecycle including issuance, suspension and revocation (CRL/OCSP)",
  ],
  topics: [
    {
      id: "u2-idauth",
      title: "Identification vs Authentication",
      tag: "Core",
      minutes: 12,
      keyPoints: [
        "Identification = claim; Authentication = proof; Authorization = permission; Accounting = record.",
        "Three factors: know / have / are — combine at least two for MFA.",
        "AAAS (identification, authentication, authorization, accountability) is the standard 5-mark answer frame.",
      ],
      examQs: [
        "Define identification and authentication. How do they differ?",
        "Explain the concept of multi-factor authentication and its advantages.",
        "What is accountability and why is auditing essential?",
      ],
      blocks: [
        {
          t: "p",
          text: "Identification is the act of a user claiming an identity to a system — a username, an employee ID, a card number, an e-mail address. It carries no proof. Authentication is the process of verifying that claim by checking something only the genuine holder should possess. Only after both are complete does authorization decide what resources the verified identity may use.",
        },
        {
          t: "table",
          head: ["Step", "Question answered", "Example"],
          rows: [
            ["Identification", "Who are you?", "Username rahul.k"],
            ["Authentication", "Can you prove it?", "Password + TOTP code"],
            ["Authorization", "What may you do?", "Read-only access to /reports"],
            ["Accountability", "Who did what, when?", "Log entry 12:04:33 export financials.csv"],
            ["Non-repudiation", "Can you deny it?", "Digitally signed transaction record"],
          ],
        },
        {
          t: "h",
          text: "Authentication factors",
        },
        {
          t: "table",
          head: ["Factor", "Something…", "Examples", "Weakness"],
          rows: [
            ["Type 1 — Knowledge", "you know", "Password, PIN, pattern, security question", "Phishable, guessable, reusable"],
            ["Type 2 — Possession", "you have", "OTP token, smart card, mobile TOTP, FIDO2 key", "Theft, SIM swap, loss"],
            ["Type 3 — Inherence", "you are", "Fingerprint, iris, face, voice, retina", "Cannot be revoked, spoofable, privacy"],
            ["Type 4 — Location/Behaviour", "you do / where you are", "Keystroke dynamics, gait, GPS, typing rhythm", "Newer, statistical"],
          ],
        },
        {
          t: "callout",
          kind: "warn",
          title: "2FA ≠ MFA, and SMS is the weakest 2FA",
          text: "Two factors of the same type (password + PIN) is still single-factor. SMS OTP can be intercepted by SIM swapping and SS7 attacks — prefer authenticator apps (TOTP) or hardware security keys (FIDO2/WebAuthn), which are phishing-resistant because they are bound to the origin.",
        },
        {
          t: "h",
          text: "Authentication protocols worth naming",
        },
        {
          t: "list",
          items: [
            "PAP — sends credentials in plaintext; never use.",
            "CHAP — challenge–response with MD5 hash, no replay of the password.",
            "Kerberos — ticket-granting tickets via a trusted KDC; the backbone of Windows domains.",
            "RADIUS / TACACS+ — centralised AAA for network devices; TACACS+ encrypts the whole payload.",
            "OAuth 2.0 — delegated authorization (log in with Google, but for permissions).",
            "OpenID Connect — authentication layer on top of OAuth 2.0.",
            "SAML 2.0 — XML assertions for enterprise SSO; JWT for stateless web tokens.",
            "FIDO2 / WebAuthn / Passkeys — public-key credentials bound to the website, immune to phishing.",
          ],
        },
        {
          t: "callout",
          kind: "example",
          title: "Kerberos in five lines",
          text: "User → AS: 'here is my ID' → AS returns a Ticket Granting Ticket encrypted with the user's key → User presents TGT to the TGS → TGS issues a service ticket → Service validates the ticket. Mutual authentication, no password on the wire, no replay because of timestamps.",
        },
      ],
    },
    {
      id: "u2-authpw",
      title: "Authentication by Passwords",
      tag: "Core",
      minutes: 12,
      keyPoints: [
        "Correct flow: user → salted slow hash → constant-time compare; never store plaintext or fast hashes.",
        "Policy: length first, block breached lists, throttling + lockout, breach alerts, MFA.",
        "Alternatives: passphrases, PINs, pattern, picture password, biometrics, hardware tokens, passkeys.",
      ],
      examQs: [
        "Explain how passwords should be stored and verified in a secure system.",
        "What is salting? Why is it necessary even with a strong hash?",
        "Compare password-based authentication with biometric authentication.",
      ],
      blocks: [
        {
          t: "p",
          text: "Password-based authentication remains the default because it is cheap and familiar. Its security depends entirely on two things: how the server stores the secret, and how disciplined the user is. If the server stores a plaintext or weakly hashed password, the strongest user password in the world is meaningless after one breach.",
        },
        {
          t: "code",
          label: "Secure password storage — the whole recipe",
          text: `# Registration
salt   = random(16 bytes)                 # unique per user, stored in clear
hash   = Argon2id(password, salt, m=64MB, t=3, p=4)
store  = { user, salt, hash, params }

# Login
candidate = Argon2id(input, stored_salt, stored_params)
verify    = constant_time_compare(candidate, stored_hash)   # avoid timing attacks
on_fail   -> exponential backoff + lockout + alert

# NEVER: MD5(password), SHA1(password), AES(password) with a key in the code,
#        plaintext in a DB, password in logs, password in a GET query string.`,
        },
        {
          t: "h",
          text: "Why salt + slow hash?",
        },
        {
          t: "table",
          head: ["Technique", "What it stops"],
          rows: [
            ["Salting (unique per user)", "Rainbow tables and identical-hash detection across users"],
            ["Peppering (secret server-side value)", "Offline cracking if only the DB is stolen"],
            ["Slow KDF (bcrypt/scrypt/Argon2/PBKDF2)", "Mass GPU/ASIC brute forcing — each guess costs milliseconds instead of microseconds"],
            ["Work-factor increase over time", "Yesterday's parameters becoming today's weakness"],
            ["Constant-time comparison", "Timing side-channel that leaks how many characters were correct"],
          ],
        },
        {
          t: "callout",
          kind: "exam",
          title: "Biometrics — advantages vs limitations",
          text: "Advantages: cannot be forgotten or easily shared, always with the user, fast, non-transferable. Limitations: false accept rate (FAR) vs false reject rate (FRR), spoofing with latex/gait replay, privacy and legal issues, unusable if injured, expensive sensors, and you can never 'reset' a fingerprint — so biometric templates must be stored as protected hashes, never raw images.",
        },
        {
          t: "callout",
          kind: "tip",
          title: "Modern policy (NIST SP 800-63B spirit)",
          text: "Length over composition rules, check against known-breached password lists, no forced 90-day rotation unless compromise is suspected, no security questions whose answers are on social media, no password hints, allow paste and password managers, and always offer MFA.",
        },
      ],
    },
    {
      id: "u2-access",
      title: "Access Control Structures",
      tag: "Core",
      minutes: 15,
      keyPoints: [
        "Core model: Subject → Operation/Right → Object, guarded by a reference monitor.",
        "Structures: access control matrix, ACL (column), capability list (row), lock-and-key, group/nested groups.",
        "Choose the model per environment: DAC for flexibility, MAC for military/data centres, RBAC for enterprises, ABAC for scale and context.",
      ],
      examQs: [
        "Explain the access control matrix, ACL and capability list with diagrams.",
        "Differentiate DAC, MAC, RBAC and ABAC.",
        "Explain Bell-LaPadula and Biba models.",
        "Define least privilege, separation of duties and need-to-know.",
      ],
      blocks: [
        {
          t: "p",
          text: "Access control is the set of mechanisms that decides, for every request by a subject to perform an operation on an object, whether that request should be allowed. The decision point is the reference monitor — a tamper-proof, always-invoked, small enough to be verified component that enforces the security policy.",
        },
        { t: "diagram", id: "accessmodels" },
        {
          t: "h",
          text: "Structures used to store permissions",
        },
        {
          t: "table",
          head: ["Structure", "How it is organised", "Strength / Weakness"],
          rows: [
            ["Access Control Matrix", "Rows = subjects, columns = objects, cells = rights", "Complete view but huge and sparse in real systems"],
            ["Access Control List (ACL)", "Stored with the object: who can touch me", "Easy to audit 'who can read this file'; hard to see a user's total rights"],
            ["Capability List", "Stored with the subject: what may I touch", "Easy delegation and revocation per user; hard to audit one object"],
            ["Lock & key / token", "Cryptographic capability carried by the user", "Efficient and distributed; leaked token = access"],
            ["Group / Role nesting", "Users → groups → roles → permissions", "Scales well; needs periodic role-mining and cleanup"],
          ],
        },
        {
          t: "h",
          text: "The four classical models",
        },
        {
          t: "table",
          head: ["Model", "Who sets permissions", "Typical place", "Key risk"],
          rows: [
            ["DAC — Discretionary", "The object's owner", "Windows file sharing, Unix permissions, Google Docs", "Owner may over-share; trojan can pass rights on"],
            ["MAC — Mandatory", "System policy via labels (Top Secret / Secret / Confidential / Unclassified)", "Military, defence, some cloud tenants", "Rigid, high administration cost"],
            ["RBAC — Role based", "Administrator maps roles → permissions, users → roles", "Enterprises, ERPs, banks", "Role explosion without governance"],
            ["ABAC — Attribute based", "Policy engine evaluates subject/object/environment attributes", "Cloud IAM, zero-trust networks", "Complex policy authoring and debugging"],
          ],
        },
        {
          t: "h",
          text: "Formal security models to name-drop",
        },
        {
          t: "list",
          items: [
            "Bell-LaPadula (confidentiality) — 'no read up, no write down'. Protects secrets from leaking downward.",
            "Biba (integrity) — the mirror image: 'no read down, no write up'. Protects data from being contaminated.",
            "Clark-Wilson — well-formed transactions plus separation of duties for commercial integrity.",
            "Chinese Wall / Brewer-Nash — prevents conflicts of interest; access depends on what you already touched.",
            "Graham-Denning & Harrison-Ruzzo-Ullman — how to create/delete subjects, objects and rights; HRU proves the general safety problem is undecidable.",
          ],
        },
        {
          t: "h",
          text: "Principles every design must obey",
        },
        {
          t: "list",
          items: [
            "Least privilege — give the minimum rights needed, for the minimum time.",
            "Need to know — even an authorised user gets only the data relevant to the task.",
            "Separation of duties — no single person can both create and approve a payment.",
            "Defence in depth — multiple independent layers so one failure is not fatal.",
            "Fail safe / deny by default — if the decision cannot be made, refuse.",
            "Zero trust — never trust, always verify; authenticate and authorise every request regardless of network location.",
          ],
        },
        { t: "sim", id: "access" },
      ],
    },
    {
      id: "u2-crypto",
      title: "Cryptographic Mechanisms & Encryption",
      tag: "Core",
      minutes: 20,
      keyPoints: [
        "Five primitives: symmetric cipher, asymmetric cipher, hash, MAC/HMAC, digital signature + PKI.",
        "Symmetric = fast, shared key, key-distribution problem; Asymmetric = slow, key pair, solves distribution.",
        "Hash = one-way, fixed length, collision resistant — provides integrity but never confidentiality.",
        "Real systems (TLS, PGP, UPI) are hybrid: asymmetric to exchange a session key, symmetric for bulk data.",
      ],
      examQs: [
        "Explain symmetric and asymmetric encryption with diagrams. Compare them.",
        "Describe the working of RSA / Diffie–Hellman / AES.",
        "What is a hash function? State its properties and applications.",
        "Explain how a hybrid cryptosystem such as TLS/PGP works.",
      ],
      blocks: [
        {
          t: "p",
          text: "Cryptography is the science of transforming information so that it is unreadable or unverifiable to anyone who is not authorised. Plaintext + key, under an algorithm, produces ciphertext; the reverse process with the correct key recovers the plaintext. Kerckhoffs' principle states that the security must reside only in the key — assume the attacker knows the algorithm.",
        },
        {
          t: "h",
          text: "Vocabulary you must use precisely",
        },
        {
          t: "list",
          items: [
            "Cryptanalysis — breaking ciphers; Cryptology = cryptography + cryptanalysis.",
            "Substitution — replace symbols (Caesar, Vigenère); Transposition — reorder symbols (rail fence, columnar).",
            "Stream cipher — encrypts bit by bit with a keystream (RC4, ChaCha20, A5/1).",
            "Block cipher — encrypts fixed blocks with modes ECB/CBC/CTR/GCM (DES 56-bit, 3DES, AES 128/192/256).",
            "Key space — total number of possible keys; 128-bit AES = 2^128 ≈ 3.4 × 10^38 keys.",
            "Salt / IV / nonce — randomness that makes repeated plaintexts look different.",
          ],
        },
        { t: "sim", id: "crypto" },
        {
          t: "h",
          text: "Symmetric (secret-key) cryptography",
        },
        {
          t: "list",
          items: [
            "One shared secret key for both encryption and decryption.",
            "Algorithms: AES (the world standard), ChaCha20, DES/3DES (obsolete), IDEA, Blowfish/Twofish, RC4 (broken).",
            "Modes: ECB (insecure — identical blocks leak patterns), CBC, CFB, OFB, CTR, GCM (authenticated encryption, preferred).",
            "Advantage: 100–1000× faster than asymmetric, suitable for bulk data.",
            "Problem: how do you deliver the key securely to the other side? (Key distribution problem) and n users need n(n−1)/2 keys.",
          ],
        },
        {
          t: "h",
          text: "Asymmetric (public-key) cryptography",
        },
        {
          t: "list",
          items: [
            "Key pair: public key (freely distributed) and private key (never leaves the owner).",
            "Algorithms: RSA, Diffie–Hellman/DH-ECC, ElGamal, ECC/ECDSA (small keys, mobile friendly), DSA.",
            "Confidentiality: encrypt with the recipient's PUBLIC key, decrypt with their private key.",
            "Authentication & signature: encrypt/hash with your PRIVATE key; anyone verifies with your public key.",
            "Solves key distribution, enables digital signatures — but is 100–1000× slower and needs much longer keys (3072-bit RSA ≈ 128-bit symmetric).",
          ],
        },
        { t: "diagram", id: "symasym" },
        {
          t: "table",
          head: ["Basis", "Symmetric", "Asymmetric"],
          rows: [
            ["Keys", "1 shared secret", "2 mathematically linked keys"],
            ["Speed", "Very fast", "Slow"],
            ["Key length", "128–256 bits", "2048–4096 bits RSA / 256-bit ECC"],
            ["Key distribution", "Hard, needs a secure channel", "Public key can be posted openly (via PKI)"],
            ["Keys for n users", "n(n−1)/2", "n key pairs"],
            ["Provides", "Confidentiality (+ integrity with a MAC)", "Confidentiality, authentication, non-repudiation"],
            ["Used for", "Bulk data encryption", "Key exchange, digital signatures, certificates"],
            ["Examples", "AES, ChaCha20, DES", "RSA, ECC, Diffie–Hellman, ElGamal"],
          ],
        },
        {
          t: "h",
          text: "Hash functions and MACs",
        },
        {
          t: "list",
          items: [
            "Properties: fixed-length output, one-way (pre-image resistance), second pre-image resistance, collision resistance, avalanche effect.",
            "Algorithms: SHA-2 family (SHA-256/512) and SHA-3; MD5 and SHA-1 are broken (collisions demonstrated).",
            "Uses: file integrity checksums, password storage (with salt + KDF), blockchains, digital signatures, HMAC for message authentication.",
            "HMAC = Hash-based Message Authentication Code — a hash keyed with a secret; gives integrity AND authenticity, unlike a plain hash.",
          ],
        },
        {
          t: "h",
          text: "Hybrid cryptosystems — how TLS actually works",
        },
        {
          t: "list",
          ordered: true,
          items: [
            "Client sends 'ClientHello' with supported cipher suites and a random value.",
            "Server responds with its certificate (public key) and chosen suite.",
            "Client validates the certificate chain, then uses the server's public key (or ECDHE) to agree on a session key.",
            "Both sides now share a symmetric session key; all further traffic is AES-GCM encrypted and MAC-protected.",
            "Session keys are discarded at the end → forward secrecy if ECDHE is used.",
          ],
        },
        {
          t: "callout",
          kind: "warn",
          title: "Do not invent your own crypto",
          text: "Never reuse an IV/nonce with the same key, never use ECB for structured data, never encrypt without authenticating, never store keys in source code, and never use 'double encryption' as a security argument. Cryptographic failures are silent — the data still looks safe.",
        },
      ],
    },
    {
      id: "u2-sig",
      title: "Digital Signatures",
      tag: "Core",
      minutes: 16,
      keyPoints: [
        "Hash the document → encrypt the digest with the signer's private key → anyone verifies with the public key.",
        "Delivers integrity, authenticity and non-repudiation — but NOT confidentiality (combine with encryption).",
        "Legal in India under Sections 3, 3A and 3B of the IT Act, using an asymmetric crypto system and hash function.",
      ],
      examQs: [
        "Explain the working of a digital signature with a neat diagram.",
        "How does a digital signature differ from a digital certificate and from a digitised (scanned) signature?",
        "What properties does a digital signature guarantee?",
      ],
      blocks: [
        {
          t: "p",
          text: "A digital signature is a mathematical scheme for verifying the authenticity and integrity of a digital message or document. It is generated from the content itself using the signer's private key, so any change to the content invalidates the signature. This is fundamentally different from a scanned handwritten signature, which is just an image that can be pasted anywhere.",
        },
        { t: "diagram", id: "sigflow" },
        {
          t: "h",
          text: "Signing (sender side)",
        },
        {
          t: "list",
          ordered: true,
          items: [
            "Compute the message digest h = SHA-256(document).",
            "Encrypt the digest with the signer's PRIVATE key using RSA/ECDSA → this is the signature.",
            "Attach the signature, the certificate and the hash algorithm to the document.",
            "(Optional) encrypt document + signature with the recipient's public key if confidentiality is also needed.",
          ],
        },
        {
          t: "h",
          text: "Verifying (receiver side)",
        },
        {
          t: "list",
          ordered: true,
          items: [
            "Recompute the digest of the received document.",
            "Decrypt the signature using the signer's PUBLIC key to get the original digest.",
            "Compare the two digests — match ⇒ document is intact and genuinely signed by the holder of that private key.",
            "Additionally validate the certificate chain and check revocation status (CRL/OCSP) and the validity period.",
          ],
        },
        {
          t: "callout",
          kind: "exam",
          title: "What a digital signature guarantees",
          text: "Message authentication (it really came from the private-key holder) · Integrity (any single bit change breaks it) · Non-repudiation (the signer cannot deny it, because only they hold the private key). It does NOT provide confidentiality, does not prove the signer's identity by itself (that is the CA's job), and does not protect against a compromised private key.",
        },
        {
          t: "table",
          head: ["", "Digital signature", "Digital certificate", "Digitised signature"],
          rows: [
            ["What it is", "Cryptographic value computed from the document", "An electronic document that binds a public key to an identity, signed by a CA", "A scanned image of a handwritten signature"],
            ["Provides", "Integrity, authenticity, non-repudiation", "Trust in the binding of key ↔ identity", "Nothing cryptographic"],
            ["Tamper evidence", "Yes, mathematically", "Yes, CA signature", "No"],
            ["Legal status in India", "Recognised under IT Act Sec. 3", "Issued by licensed Certifying Authority, Sec. 24/35", "Evidentiary value only"],
          ],
        },
        {
          t: "callout",
          kind: "example",
          title: "Where you already use digital signatures",
          text: "Aadhaar e-KYC and DSC-based MCA/Income-tax filing, GST returns, e-tenders and e-procurement, PDF signing in Adobe, signed Android/iOS apps, code-signing of drivers, PGP-signed e-mail, JWT tokens, blockchain transactions, HTTPS certificates, and India's CBDC/UPI message signing at the switch.",
        },
      ],
    },
    {
      id: "u2-pki",
      title: "Digital Signature Certificates, PKI, Suspension & Revocation",
      tag: "Core",
      minutes: 16,
      keyPoints: [
        "PKI = hardware + software + policies + CA/RA + repositories that manage key lifecycles.",
        "A DSC binds a public key to an identity; classes I–III give increasing assurance.",
        "Revocation is published via CRL (pull, bulky) or OCSP (real-time) or OCSP stapling.",
      ],
      examQs: [
        "What is PKI? Explain its components and functions.",
        "Explain the process of issuance, suspension and revocation of a Digital Signature Certificate.",
        "Differentiate CRL and OCSP.",
      ],
      blocks: [
        {
          t: "p",
          text: "Public Key Infrastructure (PKI) is the complete framework of hardware, software, people, policies, procedures and legal agreements needed to create, manage, distribute, use, store and revoke digital certificates. Cryptography gives you mathematics; PKI gives you trust in who owns which key.",
        },
        {
          t: "table",
          head: ["Component", "Role"],
          rows: [
            ["Certificate Authority (CA)", "Trusted third party that issues and signs certificates (eSimplify, eMudhra, Sify, Capricorn, DigiCert, Let's Encrypt)"],
            ["Registration Authority (RA)", "Verifies the applicant's identity before the CA issues the certificate"],
            ["Certificate repository", "Public directory of issued certificates (LDAP/HTTP)"],
            ["CRL / OCSP responder", "Publishes revoked or suspended certificates in real time"],
            ["Certificate policies (CPS)", "The legal and operational rules the CA follows"],
            ["HSM / cryptographic module", "Tamper-resistant hardware that stores CA root keys"],
            ["Subscriber / relying party", "The certificate holder and the person who trusts it"],
          ],
        },
        {
          t: "h",
          text: "Digital Signature Certificate — contents & classes",
        },
        {
          t: "list",
          items: [
            "Contains: subject name, public key, serial number, validity (not before/not after), issuing CA, key usage, signature algorithm, CRL distribution points, and the CA's digital signature.",
            "Class 1 — e-mail identity only, minimal assurance.",
            "Class 2 — identity verified against a pre-verified database; used for income-tax / ROC filing (being phased out for individuals).",
            "Class 3 — highest assurance, physical/face-to-face or video verification; mandatory for e-tenders, e-auctions and MCA filings.",
            "Formats: X.509 v3 is the standard; PGP/GPG web-of-trust is an alternative model.",
          ],
        },
        {
          t: "h",
          text: "Lifecycle: issuance → suspension → revocation",
        },
        {
          t: "list",
          ordered: true,
          items: [
            "Key generation — subscriber generates (or HSM generates) the key pair; the private key NEVER leaves the token.",
            "Application + proof of identity — documents, Aadhaar e-KYC, video verification by the RA.",
            "Verification & approval — RA confirms; CA signs the certificate and publishes it in the repository.",
            "Installation on a FIPS-compliant USB crypto token with the private key protected by a PIN.",
            "Suspension — a temporary hold when the private key may be at risk but compromise is not confirmed, or at the subscriber's request (e.g. on leave); the certificate appears with status 'on hold' in the CRL and can be reinstated.",
            "Revocation — permanent invalidation before expiry, when the key is compromised, the identity information becomes false, the subscriber dies/dissolves, or the subscriber requests it; the CA publishes it in the next CRL (or immediately via OCSP) and it is irreversible.",
            "Expiry / renewal — certificates have a validity (1–3 years); renewal may reuse the key or generate a new pair.",
            "Archiving — keys used for signing should be destroyed; keys used for decryption may be escrowed to recover old data.",
          ],
        },
        {
          t: "table",
          head: ["", "CRL — Certificate Revocation List", "OCSP — Online Certificate Status Protocol"],
          rows: [
            ["Mechanism", "Signed, time-stamped list of revoked serial numbers published periodically", "Real-time query/response: 'is this serial valid?'"],
            ["Freshness", "Only as fresh as the last publication", "Near real-time"],
            ["Size / cost", "Grows unbounded; heavy to download", "Single small response; needs an always-available responder"],
            ["Failure mode", "Client may 'soft-fail' and accept", "Soft-fail vs hard-fail trade-off"],
            ["Improvement", "Delta CRLs (only changes)", "OCSP stapling — server fetches the response and attaches it, preserving privacy"],
          ],
        },
        {
          t: "callout",
          kind: "warn",
          title: "Indian legal frame to quote",
          text: "IT Act 2000 Sec. 3 — authentication of electronic records by asymmetric crypto + hash. Sec. 3A — electronic signature. Sec. 35 — licence to issue DSC. Sec. 37–39 — suspension and revocation of licences. Controller of Certifying Authorities (CCA India) licenses CAs and maintains the root. Under Sec. 42, a subscriber must exercise reasonable care and is liable until the CA is informed of compromise.",
        },
      ],
    },
  ],
};
