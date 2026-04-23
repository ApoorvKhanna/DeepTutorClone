// Shared primitives across all three variants.

function useTick(running = true) {
  const [, set] = React.useState(0);
  React.useEffect(() => {
    if (!running) return;
    let raf;
    const loop = () => { set(n => (n + 1) % 1e9); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [running]);
  return Date.now();
}

function useLoop(period = 16000) {
  const t = useTick(true);
  const [start] = React.useState(() => Date.now());
  const elapsed = (t - start) % period;
  return { t: elapsed / period, elapsed, period };
}

const Icon = ({ d, size = 18, stroke = 'currentColor', sw = 1.5, fill = 'none', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={style}>{d}</svg>
);
const I = {
  search: <Icon d={<><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></>} />,
  sparkle: <Icon d={<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M18 6l-2.5 2.5M8.5 15.5L6 18"/>} />,
  book: <Icon d={<><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17H6.5A2.5 2.5 0 0 0 4 21.5"/><path d="M4 4.5V21.5"/><path d="M20 19v3H6.5"/></>} />,
  bolt: <Icon d={<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>} />,
  graph: <Icon d={<><circle cx="5" cy="6" r="2"/><circle cx="19" cy="6" r="2"/><circle cx="12" cy="18" r="2"/><path d="M7 7l4 9M17 7l-4 9M7 6h10"/></>} />,
  doc: <Icon d={<><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M8 13h8M8 17h5"/></>} />,
  chat: <Icon d={<path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-4-1L3 20l1-5.5A8.38 8.38 0 0 1 3 11 8.5 8.5 0 0 1 11.5 3a8.38 8.38 0 0 1 8.5 8.5z"/>} />,
  plus: <Icon d={<><path d="M12 5v14M5 12h14"/></>} />,
  arrowUp: <Icon d={<><path d="M12 19V5M5 12l7-7 7 7"/></>} />,
  arrowRight: <Icon d={<><path d="M5 12h14M12 5l7 7-7 7"/></>} />,
  check: <Icon d={<path d="M20 6L9 17l-5-5"/>} />,
  cmd: <Icon d={<path d="M15 6V3a3 3 0 1 1 3 3h-3zM9 6V3a3 3 0 1 0-3 3h3zM15 18v3a3 3 0 1 0 3-3h-3zM9 18v3a3 3 0 1 1-3-3h3zM9 9h6v6H9z"/>} />,
  settings: <Icon d={<><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>} />,
  globe: <Icon d={<><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></>} />,
  code: <Icon d={<><path d="M8 6l-6 6 6 6M16 6l6 6-6 6"/></>} />,
  flask: <Icon d={<path d="M9 3v6l-5 9a2 2 0 0 0 2 3h12a2 2 0 0 0 2-3l-5-9V3M8 3h8M7 14h10"/>} />,
  layers: <Icon d={<><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/></>} />,
  history: <Icon d={<><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>} />,
  lumen: <Icon d={<><circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/></>} />,
  notebook: <Icon d={<><path d="M4 4h13a3 3 0 0 1 3 3v13H7a3 3 0 0 1-3-3z"/><path d="M4 8h3M4 12h3M4 16h3"/></>} />,
  stop: <Icon d={<rect x="6" y="6" width="12" height="12" rx="2"/>} />,
  download: <Icon d={<><path d="M12 3v12M6 11l6 6 6-6M4 21h16"/></>} />,
  share: <Icon d={<><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/></>} />,
  pause: <Icon d={<><path d="M6 4h4v16H6zM14 4h4v16h-4z"/></>} />,
  play: <Icon d={<path d="M8 5v14l11-7z"/>} />,
};

function PH({ label = 'figure', style, tone = 'light' }) {
  const bg = tone === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)';
  const stripe = tone === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)';
  const fg = tone === 'dark' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)';
  return (
    <div style={{
      width: '100%', height: '100%', minHeight: 60,
      background: bg,
      backgroundImage: `repeating-linear-gradient(135deg, ${stripe} 0 1px, transparent 1px 10px)`,
      border: `1px dashed ${fg}`, borderRadius: 8,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: fg,
      letterSpacing: 0.5, textTransform: 'lowercase',
      ...style,
    }}>{label}</div>
  );
}

const AGENT_SCRIPT = [
  { at: 0.00, agent: 'Rephrase', type: 'plan',  text: 'Optimizing topic', detail: 'Transformer attention mechanisms in NLP — scoped to 2017–2024, long-context methods.' },
  { at: 0.06, agent: 'Decompose', type: 'plan', text: 'Decomposing into 5 subtopics', detail: 'Scaled dot-product · Multi-head · Positional encoding · Sparse/linear attention · Long-context tricks.' },
  { at: 0.14, agent: 'Manager',  type: 'queue', text: 'Queue scheduled, parallel = 3', detail: 'Topics PENDING → RESEARCHING. Semaphore locked at 3 concurrent.' },
  { at: 0.22, agent: 'Research', type: 'tool',  text: 'rag.hybrid("scaled dot-product")', detail: '7 chunks retrieved from "attention-is-all-you-need.pdf" · score 0.91' },
  { at: 0.32, agent: 'Research', type: 'tool',  text: 'paper_search("sparse attention 2023")', detail: '12 results · filtering by citation count & venue relevance.' },
  { at: 0.40, agent: 'Note',     type: 'note',  text: 'Compressed 2,400 tokens → 340', detail: 'CIT-1-03 registered. Paper-search summary committed to memory.' },
  { at: 0.48, agent: 'Research', type: 'tool',  text: 'web_search("FlashAttention-3 release")', detail: 'Tracing kernel-level optimizations · 3 primary sources identified.' },
  { at: 0.58, agent: 'Research', type: 'code',  text: 'run_code: O(n²) → O(n log n) viz', detail: 'matplotlib · generated complexity comparison plot.' },
  { at: 0.68, agent: 'Note',     type: 'note',  text: 'Cross-topic link detected', detail: 'Subtopic 3 ↔ Subtopic 5 — rotary embeddings enable long-context.' },
  { at: 0.76, agent: 'Manager',  type: 'queue', text: 'All 5 topics COMPLETED', detail: '32 citations · 4 papers · 11 web sources · 2 code artifacts.' },
  { at: 0.84, agent: 'Reporting', type: 'plan', text: 'Building three-level outline', detail: 'H1 × 5 · H2 × 14 · H3 × 22. Citation map resolved.' },
  { at: 0.92, agent: 'Reporting', type: 'done', text: 'Report ready · 8,241 words', detail: 'Inline citations [1]..[32] linked. Exporting to Markdown + PDF.' },
];

function useAgentTimeline(periodMs = 18000) {
  const { t } = useLoop(periodMs);
  const visible = AGENT_SCRIPT.filter(s => s.at <= t).map(s => ({
    ...s,
    age: (t - s.at) * periodMs / 1000,
  }));
  return { t, visible, total: AGENT_SCRIPT.length };
}

const SUBTOPICS = [
  { id: 1, name: 'Scaled dot-product attention',    startAt: 0.14, dur: 0.22, citations: 6 },
  { id: 2, name: 'Multi-head attention',            startAt: 0.18, dur: 0.26, citations: 5 },
  { id: 3, name: 'Positional encoding & RoPE',      startAt: 0.26, dur: 0.24, citations: 7 },
  { id: 4, name: 'Sparse / linear attention',       startAt: 0.34, dur: 0.30, citations: 8 },
  { id: 5, name: 'Long-context methods',            startAt: 0.44, dur: 0.28, citations: 6 },
];
function subtopicProgress(t, s) {
  if (t < s.startAt) return { pct: 0, status: 'PENDING' };
  if (t > s.startAt + s.dur) return { pct: 1, status: 'COMPLETED' };
  return { pct: (t - s.startAt) / s.dur, status: 'RESEARCHING' };
}

Object.assign(window, { I, Icon, PH, useTick, useLoop, useAgentTimeline, AGENT_SCRIPT, SUBTOPICS, subtopicProgress });
