import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState, type ChangeEvent } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Check,
  ChevronDown,
  CircleHelp,
  CircleUserRound,
  ClipboardCheck,
  CloudUpload,
  Database,
  FileText,
  FolderOpen,
  Info,
  Lightbulb,
  LockKeyhole,
  MessageCircle,
  Paperclip,
  Pencil,
  Plus,
  Search,
  Send,
  Settings2,
  Sparkles,
  Star,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "InternLoom — Explainable Candidate Shortlisting" },
      {
        name: "description",
        content: "Rank internship candidates with transparent semantic and keyword evidence.",
      },
      { property: "og:title", content: "InternLoom — Explainable Candidate Shortlisting" },
      {
        property: "og:description",
        content: "Build a fair, explainable shortlist from a job description and resume batch.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: InternLoom,
});

type View = "setup" | "ranked";
type Filter = "all" | "strong" | "good" | "partial" | "limited";

type Candidate = {
  rank: number;
  name: string;
  initials: string;
  score: number;
  tier: string;
  degree: string;
  matches: string[];
  missing: string;
  detail?: string;
};

const criteria = [
  { label: "React", weight: "3×", tone: "blue" },
  { label: "Node.js", weight: "2×", tone: "yellow" },
  { label: "JavaScript (ES6+)", weight: "", tone: "mint" },
  { label: "REST APIs", weight: "", tone: "coral" },
  { label: "MongoDB", weight: "", tone: "blue" },
  { label: "Git / GitHub", weight: "", tone: "yellow" },
  { label: "Problem-solving", weight: "★", tone: "mint" },
];

const stagedResumes: [string, string, string, string][] = [
  ["AS", "Aditi_Sharma_Resume.pdf", "142 KB", "Extracted 4 projects"],
  ["RM", "Rohan_Mehta_CV_2025.pdf", "188 KB", "Extracted 6 skills"],
  ["PN", "Priya_Nair_FullStack.pdf", "210 KB", "Extracted 3 internships"],
  ["AK", "Arjun_Kapoor_Software.pdf", "165 KB", "Extracted GitHub link"],
];

const candidates: Candidate[] = [
  {
    rank: 1,
    name: "Aditi Sharma",
    initials: "AS",
    score: 92,
    tier: "Strong fit",
    degree: "B.Tech CS • 2025",
    matches: ["React (3 proj)", "Node.js API", "MongoDB", "REST APIs", "Git"],
    missing: "Unit Testing (Jest)",
    detail: "Highest dual alignment in frontend React and backend Node.js. Verifiable GitHub evidence includes RESTful CRUD projects and schema design.",
  },
  {
    rank: 2,
    name: "Rohan Mehta",
    initials: "RM",
    score: 87,
    tier: "Strong fit",
    degree: "B.S. Software Eng • 2024",
    matches: ["React Hooks", "Express.js", "JavaScript ES6+", "REST APIs"],
    missing: "No MongoDB (Uses Postgres)",
    detail: "Strongest raw JavaScript execution and Express middleware architecture. PostgreSQL experience should transfer quickly through ORM familiarity.",
  },
  {
    rank: 3,
    name: "Priya Nair",
    initials: "PN",
    score: 83,
    tier: "Strong fit",
    degree: "MCA • 2024",
    matches: ["Node.js", "JavaScript", "Git Workflow", "Full-stack Projs"],
    missing: "React depth limited",
    detail: "Outstanding Git collaboration and full-stack breadth. Frontend builds rely more on simpler view templates than complex React state trees.",
  },
  {
    rank: 4,
    name: "Arjun Kapoor",
    initials: "AK",
    score: 76,
    tier: "Good potential",
    degree: "B.Tech IT",
    matches: ["React", "JavaScript", "HTML / CSS"],
    missing: "Backend / Node.js",
  },
  {
    rank: 5,
    name: "Sneha Iyer",
    initials: "SI",
    score: 72,
    tier: "Good potential",
    degree: "B.S. Data Science",
    matches: ["Python API", "SQL Databases", "Git"],
    missing: "React frontend missing",
  },
  {
    rank: 6,
    name: "Dev Patel",
    initials: "DP",
    score: 68,
    tier: "Good potential",
    degree: "B.Tech Comp",
    matches: ["JavaScript", "Express", "MongoDB"],
    missing: "React UI experience",
  },
  {
    rank: 7,
    name: "Maya Lin",
    initials: "ML",
    score: 58,
    tier: "Partial match",
    degree: "Self-taught / Design",
    matches: ["HTML / CSS3", "Basic JS"],
    missing: "Backend, REST APIs",
  },
  {
    rank: 8,
    name: "Kabir Das",
    initials: "KD",
    score: 41,
    tier: "Limited overlap",
    degree: "B.S. Electronics",
    matches: ["Core Java", "Python"],
    missing: "JS, React, Node.js",
  },
  ...[
    ["Nisha Rao", "NR", 39, "Limited overlap", "B.Tech ECE", ["Python", "Git"], "React, Node.js"],
    ["Vikram Singh", "VS", 37, "Limited overlap", "BCA", ["HTML", "JavaScript"], "APIs, MongoDB"],
    ["Ananya Bose", "AB", 35, "Partial match", "B.Des", ["React", "CSS"], "Node.js, REST"],
    ["Ishaan Verma", "IV", 33, "Partial match", "B.Tech ME", ["Java", "Problem-solving"], "Frontend stack"],
    ["Tara Joseph", "TJ", 31, "Partial match", "BCA", ["SQL", "Git"], "React, Node.js"],
    ["Neel Shah", "NS", 28, "Partial match", "B.Tech IT", ["JavaScript"], "MongoDB, REST APIs"],
    ["Riya Menon", "RM", 25, "Partial match", "B.Sc. CS", ["HTML", "GitHub"], "Node.js, React"],
    ["Aditya Roy", "AR", 22, "Limited overlap", "B.Tech EE", ["C++", "Python"], "Web development"],
    ["Meera Kulkarni", "MK", 19, "Limited overlap", "B.Com", ["Excel", "Research"], "Core engineering skills"],
    ["Yash Gupta", "YG", 16, "Limited overlap", "BBA", ["Communication"], "Technical stack"],
  ].map(([name, initials, score, tier, degree, matches, missing], index) => ({
    rank: index + 9,
    name: name as string,
    initials: initials as string,
    score: score as number,
    tier: tier as string,
    degree: degree as string,
    matches: matches as string[],
    missing: missing as string,
  })),
];

function InternLoom() {
  const [view, setView] = useState<View>("setup");
  const [filter, setFilter] = useState<Filter>("all");
  const [expanded, setExpanded] = useState<number | null>(1);
  const [loadedAll, setLoadedAll] = useState(false);
  const [files, setFiles] = useState<[string, string, string, string][]>(stagedResumes);
  const [notice, setNotice] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [relaxed, setRelaxed] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const visibleCandidates = useMemo(() => {
    const filtered = filter === "all" ? candidates : candidates.filter((candidate) => tierKey(candidate.tier) === filter);
    return (loadedAll ? filtered : filtered.slice(0, 8));
  }, [filter, loadedAll]);

  function addFiles(event: ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files ?? []);
    if (!selected.length) return;
    const additions = selected.slice(0, 18 - files.length).map((file) => {
      const cleanName = file.name.replace(/\.[^/.]+$/, "");
      const initials = cleanName.split(/[_\s-]+/).slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "").join("");
      return [initials || "PDF", file.name, `${Math.max(1, Math.round(file.size / 1024))} KB`, "Ready to parse"] as [string, string, string, string];
    });
    setFiles((current) => [...current, ...additions]);
    setNotice(`${additions.length} resume${additions.length === 1 ? "" : "s"} added to the staged batch.`);
    event.target.value = "";
  }

  function askQuestion(nextQuestion = question) {
    if (!nextQuestion.trim()) return;
    setQuestion(nextQuestion);
    setAnswer(nextQuestion.toLowerCase().includes("priya")
      ? "Priya would need deeper React state management evidence and direct MongoDB work to overtake the top two. Her Git workflow and full-stack breadth already make her a strong third-place match."
      : "Aditi is the strongest complete-stack match: her resume cites React, Express, RESTful CRUD work, MongoDB schemas, and GitHub evidence in the same project trail.");
  }

  return (
    <div className="min-h-screen notebook-surface text-ink">
      <header className="sticky top-0 z-50 border-b-2 border-ink bg-paper/95 shadow-paper backdrop-blur-sm">
        <div className="mx-auto flex min-h-20 max-w-[1440px] items-center justify-between gap-4 px-4 md:px-10">
          <div className="flex min-w-0 items-center gap-3">
            <button aria-label="Go to setup" className="flex shrink-0 items-center gap-2 text-left" onClick={() => setView("setup")}>
              <span className="logo-mark -rotate-2"><Sparkles size={22} strokeWidth={2.5} /></span>
              <span className="font-hand text-2xl font-bold tracking-tight md:text-3xl">InternLoom</span>
            </button>
            <span className="hidden rotate-1 items-center rounded-full border border-dashed border-navy bg-blue-soft px-2 py-1 font-label text-navy shadow-chip sm:inline-flex">Smart Shortlisting Engine</span>
          </div>
          <nav className="hidden items-center gap-1 sm:flex" aria-label="Workspace views">
            <Button variant="ghost" className={view === "setup" ? "nav-active" : "nav-link"} onClick={() => setView("setup")}>Set Up Workspace</Button>
            <Button variant="ghost" className={view === "ranked" ? "nav-active" : "nav-link"} onClick={() => setView("ranked")}>Ranked Shortlist</Button>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="hidden rounded-full border-2 border-ink bg-paper shadow-chip lg:inline-flex" onClick={() => setNotice("The engine combines exact skill evidence with semantic context.")}>
              <CircleHelp size={16} className="text-coral" /> How it works
            </Button>
            <span className="avatar-mark rotate-2"><CircleUserRound size={18} /></span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1440px] px-4 pb-10 md:px-10">
        {view === "setup" ? (
          <SetupView
            files={files}
            inputRef={inputRef}
            notice={notice}
            onAddFiles={addFiles}
            onClear={() => { setFiles([]); setNotice("Staged resumes cleared."); }}
            onRank={() => setView("ranked")}
            onUpload={() => inputRef.current?.click()}
          />
        ) : (
          <RankedView
            answer={answer}
            expanded={expanded}
            filter={filter}
            loadedAll={loadedAll}
            notice={notice}
            question={question}
            relaxed={relaxed}
            visibleCandidates={visibleCandidates}
            onAsk={askQuestion}
            onBack={() => setView("setup")}
            onExpand={(rank) => setExpanded(expanded === rank ? null : rank)}
            onFilter={(next) => { setFilter(next); setLoadedAll(false); }}
            onLoadAll={() => setLoadedAll(true)}
            onNotice={setNotice}
            onQuestion={setQuestion}
            onRelax={() => { setRelaxed(true); setNotice("Year requirement softened for this comparison."); }}
          />
        )}
      </main>

      <footer className="border-t-2 border-ink bg-paper px-4 py-5 md:px-10">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-2 text-center sm:flex-row sm:text-left">
          <div className="flex items-center gap-2 font-label text-muted"><span className="status-dot" /> InternLoom Notebook Engine • Tactile Recruiter Edition</div>
          <div className="text-sm text-muted">Crafted with ballpoint, cardstock &amp; rubric precision</div>
        </div>
      </footer>
    </div>
  );
}

function SetupView({
  files,
  inputRef,
  notice,
  onAddFiles,
  onClear,
  onRank,
  onUpload,
}: {
  files: [string, string, string, string][];
  inputRef: React.RefObject<HTMLInputElement | null>;
  notice: string;
  onAddFiles: (event: ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  onRank: () => void;
  onUpload: () => void;
}) {
  const [activeCriteria, setActiveCriteria] = useState<string[]>(criteria.map((item) => item.label));
  return (
    <div className="py-8 md:py-10">
      <section className="relative mx-auto max-w-4xl text-center">
        <span className="hidden stamp stamp-left md:block">V2.4 tactile engine</span>
        <span className="hidden note note-right lg:flex"><span className="pin-dot" /> Strictly explainable</span>
        <p className="eyebrow">A better first read</p>
        <h1 className="font-hand text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">Find the right people, without the pile<span className="text-coral">!</span></h1>
        <div className="mx-auto mt-1 h-3 max-w-xl squiggle" />
        <p className="mx-auto mt-4 max-w-2xl text-lg font-medium leading-relaxed text-muted md:text-xl">Compares semantic meaning <strong className="text-navy">+</strong> explicit candidate skills to build a fair, explainable shortlist in seconds.</p>
      </section>

      {notice && <div className="notice-banner mx-auto mt-6 max-w-3xl"><BadgeCheck size={17} /> {notice}</div>}

      <div className="mt-10 grid items-start gap-8 lg:grid-cols-2">
        <section className="relative pt-3">
          <span className="section-label">01. The role</span>
          <div className="paper-card p-5 pt-9 md:p-7 md:pt-10">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-dashed border-line pb-4">
              <div className="flex items-center gap-2 font-label text-muted"><FileText size={18} className="text-navy" /> Job description</div>
              <Button variant="outline" size="sm" className="rounded-lg border-2 border-ink bg-paper shadow-chip" onClick={() => alert("Upload a JD PDF to replace the sample role.")}><Paperclip size={15} /> Upload JD PDF</Button>
            </div>
            <div className="mt-5">
              <h2 className="font-display text-2xl font-bold">Junior Full Stack Developer Intern</h2>
              <p className="mt-1 font-semibold text-navy">TechNova Solutions</p>
              <p className="mt-4 leading-relaxed text-muted">Looking for a curious junior developer who loves building user interfaces and RESTful APIs. You&apos;ll collaborate on our core web platform using modern web technologies, participating in architecture reviews, code testing, and feature rollouts.</p>
            </div>
            <div className="mt-6 rounded-lg border-2 border-line bg-blue-soft/50 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-label text-navy">ACTIVE PROFILE TARGET</span>
                <span className="flex items-center gap-1 font-label text-mint-strong"><Sparkles size={14} /> Live Semantic Parsing Active</span>
              </div>
              <div className="mt-4 grid gap-1 text-sm sm:grid-cols-2"><span><b>Role:</b> Junior Full Stack Developer Intern</span><span><b>Company:</b> TechNova Solutions</span></div>
            </div>
            <div className="mt-6">
              <div className="flex items-center justify-between gap-2"><h3 className="font-hand text-xl font-bold">Extracted Criteria Chips <span className="font-body text-xs font-semibold text-muted">(7 key anchors)</span></h3><Settings2 size={17} className="text-muted" /></div>
              <div className="mt-3 flex flex-wrap gap-2">{criteria.map((item) => <button key={item.label} className={`criteria-chip tone-${item.tone} ${activeCriteria.includes(item.label) ? "criteria-on" : "criteria-off"}`} onClick={() => setActiveCriteria((current) => current.includes(item.label) ? current.filter((label) => label !== item.label) : [...current, item.label])}>{item.label}{item.weight && <b>{item.weight}</b>}</button>)}</div>
            </div>
            <div className="tip-box mt-6"><Lightbulb size={20} className="shrink-0 text-yellow-strong" /><div><b>Recruiter Tip:</b><p className="mt-1 text-sm text-muted">We&apos;ll weigh exact skills + related experience so untraditional talent isn&apos;t lost in strict keyword filters.</p></div></div>
          </div>
        </section>

        <section className="relative pt-3">
          <span className="section-label section-label-coral">02. The candidates</span>
          <div className="paper-card p-5 pt-9 md:p-7 md:pt-10">
            <button className="upload-zone" onClick={onUpload}><CloudUpload size={30} className="text-navy" /><span className="mt-2 font-display text-lg font-bold">Drop resume PDFs here</span><span className="text-sm text-muted">or <u className="font-bold text-navy">browse files</u> from your computer</span></button>
            <input ref={inputRef} type="file" accept="application/pdf,.pdf" multiple className="hidden" onChange={onAddFiles} />
            <div className="mt-5 flex items-center justify-between gap-3"><span className="flex items-center gap-2 font-label text-mint-strong"><BadgeCheck size={17} /> {Math.max(files.length, 18)} resumes successfully added</span><Button variant="ghost" size="sm" className="text-coral" onClick={onClear}><Trash2 size={15} /> Clear all</Button></div>
            <div className="mt-4 space-y-2">
              <p className="font-label text-muted">Staged Batch <span className="font-body normal-case tracking-normal">(Showing {Math.min(files.length, 4)} of {Math.max(files.length, 18)})</span></p>
              {files.slice(0, 4).map(([initials, name, size, detail]) => <div key={`${name}-${size}`} className="file-row"><span className="file-avatar">{initials}</span><span className="min-w-0 flex-1"><b className="block truncate text-sm">{name}</b><span className="text-xs text-muted">{size} • {detail}</span></span><button aria-label={`Remove ${name}`} className="icon-button" onClick={() => onClear()}><X size={16} /></button></div>)}
              {!files.length && <div className="empty-state">No resumes staged yet. Add PDF files to start the comparison.</div>}
            </div>
            <div className="mt-5 flex gap-2 rounded-md border-l-4 border-yellow-strong bg-yellow-soft px-3 py-2 text-xs text-muted"><span>📌</span><span><b>Note:</b> 15–18 resumes works best for this live demo comparison and matrix accuracy.</span></div>
          </div>
        </section>
      </div>

      <section className="ready-strip mt-8"><div className="flex min-w-0 items-center gap-3"><span className="ready-icon"><Database size={20} /></span><div><b className="block font-display">1 job description + 18 resumes ready to analyze</b><span className="text-sm text-muted">Weights mapped • Hybrid token scoring prepared • Zero hallucination guardrails</span></div></div><Button className="rank-button" onClick={onRank}>One-click ranking <ArrowRight size={17} /></Button></section>
      <p className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-muted"><LockKeyhole size={14} /> Semantic context + exact keyword evidence — zero black-box scoring</p>
    </div>
  );
}

function RankedView({
  answer, expanded, filter, loadedAll, notice, question, relaxed, visibleCandidates, onAsk, onBack, onExpand, onFilter, onLoadAll, onNotice, onQuestion, onRelax,
}: {
  answer: string; expanded: number | null; filter: Filter; loadedAll: boolean; notice: string; question: string; relaxed: boolean; visibleCandidates: Candidate[];
  onAsk: (question?: string) => void; onBack: () => void; onExpand: (rank: number) => void; onFilter: (filter: Filter) => void; onLoadAll: () => void; onNotice: (notice: string) => void; onQuestion: (question: string) => void; onRelax: () => void;
}) {
  const filters: [Filter, string, number][] = [["all", "All", 18], ["strong", "Strong fit", 3], ["good", "Good potential", 6], ["partial", "Partial match", 7], ["limited", "Limited overlap", 2]];
  return (
    <div className="py-8 md:py-10">
      <div className="flex flex-wrap items-center justify-between gap-4"><Button variant="ghost" className="px-0 text-navy" onClick={onBack}><ArrowLeft size={17} /> Back: Edit role or resumes</Button><div className="flex gap-2"><Button variant="outline" size="sm" className="border-2 border-ink bg-paper shadow-chip" onClick={() => onNotice("PDF dossier prepared with rubric annotations.")}><FileText size={15} /> Export PDF Dossier</Button><Button size="sm" className="border-2 border-ink shadow-chip" onClick={() => onNotice("Batch ready for ATS export.")}><Send size={15} /> Push to ATS</Button></div></div>
      {notice && <div className="notice-banner mt-4"><BadgeCheck size={17} /> {notice}</div>}
      <header className="relative mx-auto mt-8 max-w-4xl text-center"><p className="eyebrow">Batch #409 • Analysis complete</p><h1 className="font-hand text-4xl font-bold leading-tight sm:text-5xl">Your shortlist is ready<span className="text-coral">!</span></h1><p className="mt-3 text-lg text-muted">18 candidates ranked against <b className="text-ink">Junior Full Stack Developer Intern</b> at <b className="text-navy">TechNova Solutions</b></p></header>
      <div className="mt-8 grid gap-4 md:grid-cols-3"><Metric icon={<Database size={19} />} label="Volume Filter" value="18" sub="Resumes reviewed" tone="blue" /><Metric icon={<ClipboardCheck size={19} />} label="Parsing status" value="100%" sub="parsed & verified across rubric" tone="mint" /><Metric icon={<Star size={19} />} label="Benchmark Peak" value="92" sub="/ 100" tone="yellow" /></div>
      <div className="analysis-proof mt-4"><span className="flex items-center gap-2"><BadgeCheck size={17} className="text-mint-strong" /> <b>Aditi Sharma</b> • High semantic match</span><span className="hidden items-center gap-2 text-sm text-muted sm:flex"><LockKeyhole size={14} /> Semantic + rubric scoring</span><span className="hidden items-center gap-2 text-sm text-muted lg:flex"><Info size={14} /> Explainability active on all 18 files</span></div>

      <section className="mt-8"><div className="flex flex-wrap items-center justify-between gap-3"><div className="flex flex-wrap gap-2">{filters.map(([key, label, count], index) => <button key={key} className={`filter-pill ${filter === key ? "filter-active" : ""} rotate-${index % 3}`} onClick={() => onFilter(key)}>{label} ({count})</button>)}</div><div className="flex items-center gap-2 text-sm text-muted"><span>Sort:</span><Button variant="outline" size="sm" className="border-2 border-ink bg-paper shadow-chip">Score (High → Low) <ArrowDown size={15} /></Button></div></div>
        <div className="candidate-table mt-4"><div className="hidden grid-cols-[58px_1.4fr_100px_1.3fr_1fr_90px] gap-4 border-b-2 border-ink bg-blue-soft px-4 py-3 font-label text-navy md:grid"><span>RANK</span><span>CANDIDATE &amp; FIT TIER</span><span>MATCH SCORE</span><span>KEY MATCHES (JD RUBRIC)</span><span>GROWTH / MISSING</span><span>EVIDENCE</span></div>
          {visibleCandidates.map((candidate) => <CandidateRow key={candidate.rank} candidate={candidate} expanded={expanded === candidate.rank} onExpand={() => onExpand(candidate.rank)} />)}
        </div>
        {!loadedAll && <Button variant="link" className="mx-auto mt-5 flex text-navy" onClick={onLoadAll}>Load all 18 candidates <ChevronDown size={15} /></Button>}
      </section>

      <section className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_.9fr]">
        <div><div className="flex items-center gap-2"><span className="paperclip-tag"><Star size={15} /> Top 3 comparison</span><h2 className="font-hand text-3xl font-bold">Why these three?</h2></div><p className="mt-1 text-sm text-muted">Direct rubric comparison, grounded in cited evidence.</p><div className="mt-4 space-y-3">{candidates.slice(0, 3).map((candidate) => <div key={candidate.rank} className="comparison-note"><div className="flex items-baseline justify-between gap-4"><b className="font-display">{candidate.name} <span className="font-body text-sm text-muted">(#{candidate.rank})</span></b><span className="font-hand text-2xl font-bold text-navy">{candidate.score}/100</span></div><p className="mt-2 text-sm leading-relaxed text-muted">{candidate.detail}</p><p className="mt-2 text-xs font-bold text-navy">Key differentiator: {candidate.rank === 1 ? "Complete full-stack database integration." : candidate.rank === 2 ? "Advanced JS core logic; minor SQL to NoSQL ramp up." : "Exemplary teamwork & clean repository conventions."}</p></div>)}</div></div>
        <div className="space-y-5"><div className="assistant-panel"><div className="flex items-start justify-between gap-3"><div><span className="flex items-center gap-2 font-label text-navy"><MessageCircle size={17} /> GROUNDED IN RESUME CITATIONS</span><h2 className="mt-2 font-hand text-2xl font-bold">Ask about the ranking</h2></div><Sparkles size={22} className="text-yellow-strong" /></div>{answer && <div className="answer-bubble mt-4"><b>InternLoom:</b><p className="mt-1 text-sm leading-relaxed text-muted">{answer}</p></div>}<div className="mt-4 flex flex-wrap gap-2"><button className="question-chip" onClick={() => onAsk("Why is Aditi ranked above Rohan?")}>Why is Aditi ranked above Rohan?</button><button className="question-chip" onClick={() => onAsk("What would make Priya Rank 1?")}>What would make Priya Rank 1?</button></div><div className="mt-3 flex gap-2"><input value={question} onChange={(event) => onQuestion(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") onAsk(); }} placeholder="Ask a grounded question…" className="question-input" /><Button size="sm" className="shrink-0 border-2 border-ink shadow-chip" onClick={() => onAsk()}><Send size={15} /> Ask</Button></div></div>
          <div className={`warning-panel ${relaxed ? "warning-softened" : ""}`}><div className="flex items-start gap-3"><span className="warning-icon">{relaxed ? <Check size={18} /> : <Info size={18} />}</span><div className="min-w-0"><h3 className="font-hand text-xl font-bold">JD Rubric Warning</h3><p className="mt-1 text-sm leading-relaxed text-muted">{relaxed ? "Year requirement softened. Ranking now prioritizes portfolio evidence and relevant project depth." : <>Your job post states <b>“3+ years production experience”</b> for an internship titled <b>Junior Full Stack</b>.</>}</p>{!relaxed && <p className="mt-2 text-sm text-muted"><b>Impact on pool:</b> This requirement artificially drops promising builders like Priya Nair and penalizes 4 student applicants.</p>}<Button variant="outline" size="sm" className="mt-3 border-2 border-ink bg-coral text-paper shadow-chip hover:bg-coral/90" onClick={onRelax}>{relaxed ? "Requirement softened" : "Soft-relax year requirement"} <Pencil size={14} /></Button></div></div></div>
        </div>
      </section>
    </div>
  );
}

function Metric({ icon, label, value, sub, tone }: { icon: React.ReactNode; label: string; value: string; sub: string; tone: string }) {
  return <div className={`metric-card metric-${tone}`}><span className="metric-icon">{icon}</span><span className="font-label text-muted">{label}</span><b className="font-display text-3xl">{value}</b><span className="text-sm text-muted">{sub}</span></div>;
}

function CandidateRow({ candidate, expanded, onExpand }: { candidate: Candidate; expanded: boolean; onExpand: () => void }) {
  const top = candidate.rank <= 3;
  return <article className={`candidate-row ${top ? "candidate-top" : ""}`}><div className="grid gap-3 md:grid-cols-[58px_1.4fr_100px_1.3fr_1fr_90px] md:items-start md:gap-4"><div className="flex items-center gap-2"><span className="rank-number">#{candidate.rank}</span>{top && <Star size={15} className="text-yellow-strong" fill="currentColor" />}</div><div><div className="flex flex-wrap items-center gap-2"><b className="font-display text-lg">{candidate.name}</b><span className={`tier-badge tier-${tierKey(candidate.tier)}`}>{candidate.tier}</span></div><span className="text-sm text-muted">{candidate.degree}</span></div><div><span className="font-display text-3xl font-bold text-navy">{candidate.score}</span><span className="text-sm text-muted"> / 100</span></div><div className="flex flex-wrap gap-1.5">{candidate.matches.map((match) => <span className="match-chip" key={match}>{match}</span>)}</div><div className="flex items-start gap-1 text-sm text-muted"><span className="text-coral">{candidate.rank <= 3 ? <ArrowUpRight size={16} /> : <Info size={15} />}</span>{candidate.missing}</div><div><Button variant="outline" size="sm" className="w-full border-2 border-ink bg-paper shadow-chip" onClick={onExpand}>{expanded ? "Close" : top ? "Proof" : "View"}<ChevronDown size={14} className={expanded ? "rotate-180" : ""} /></Button></div></div>{expanded && <div className="evidence-drawer mt-4 md:ml-[58px]"><div className="grid gap-4 md:grid-cols-3"><Evidence title="Exact Keyword Proof" icon={<Search size={16} />} text={candidate.rank === 1 ? "React: 3 production projects and published portfolio code on GitHub. Node.js: Express microservices for a campus management app. MongoDB: Mongoose schema modeling and aggregation pipelines." : `${candidate.matches.join(", ")} appear explicitly in the resume evidence.`} /><Evidence title="Semantic Context" icon={<Sparkles size={16} />} text={candidate.detail ?? "Relevant adjacent experience supports a meaningful transfer into this role."} /><Evidence title="Growth & Gaps" icon={<Lightbulb size={16} />} text={`${candidate.missing} is the clearest next proof point. The scoring model keeps this visible instead of hiding it inside a single number.`} /></div>{top && <div className="mt-4 flex items-center justify-between gap-4 border-t border-line pt-3 text-sm"><span className="text-muted"><b>Recruiter quick note:</b> Recommended for Technical Screen Round 1.</span><Button variant="link" size="sm" className="text-navy" onClick={() => alert(`Opening raw resume record for ${candidate.name}.`)}>View Raw Resume <ArrowUpRight size={14} /></Button></div>}</div>}</article>;
}

function Evidence({ title, icon, text }: { title: string; icon: React.ReactNode; text: string }) {
  return <div><h4 className="flex items-center gap-2 font-hand text-lg font-bold text-navy">{icon}{title}</h4><p className="mt-1 text-sm leading-relaxed text-muted">{text}</p></div>;
}

function tierKey(tier: string): Filter {
  if (tier === "Strong fit") return "strong";
  if (tier === "Good potential") return "good";
  if (tier === "Partial match") return "partial";
  return "limited";
}