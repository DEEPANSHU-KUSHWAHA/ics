export type SimId =
  | "password"
  | "phishing"
  | "crypto"
  | "signature"
  | "botnet"
  | "access"
  | "risk"
  | "sniffer";

export type DiagramId =
  | "internet"
  | "dns"
  | "email"
  | "triad"
  | "sniff"
  | "symasym"
  | "sigflow"
  | "accessmodels"
  | "ipdr"
  | "hackphases"
  | "itact"
  | "domain";

export type Block =
  | { t: "p"; text: string }
  | { t: "h"; text: string }
  | { t: "list"; items: string[]; ordered?: boolean }
  | { t: "table"; head: string[]; rows: string[][] }
  | { t: "callout"; kind: "tip" | "warn" | "exam" | "example"; title: string; text: string }
  | { t: "code"; label?: string; text: string }
  | { t: "image"; src: string; caption: string }
  | { t: "sim"; id: SimId }
  | { t: "diagram"; id: DiagramId };

export type Topic = {
  id: string;
  title: string;
  tag: string;
  minutes: number;
  blocks: Block[];
  keyPoints: string[];
  examQs: string[];
};

export type Unit = {
  id: string;
  no: number;
  title: string;
  syllabus: string;
  accent: string;
  image?: string;
  imageCaption?: string;
  summary: string;
  objectives: string[];
  topics: Topic[];
};

export type QuizQ = {
  id: string;
  unit: number;
  q: string;
  options: string[];
  answer: number;
  why: string;
};

export type Flashcard = { unit: number; front: string; back: string };

export type GlossaryItem = { term: string; def: string; unit: number };
