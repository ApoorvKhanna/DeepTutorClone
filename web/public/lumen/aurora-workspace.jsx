// Aurora workspace — the Deep Research module, live agent stream
function AuroraWorkspace() {
  const { visible, t } = useAgentTimeline(18000);
  const progress = Math.min(1, t / 0.92);

  return (
    <AuroraChrome url="lumen.app/research/r_transformer_attention">
      <div style={{
        width:'100%', height:'100%', position:'relative',
        background: aurora.bg, color: aurora.ink, display:'flex',
      }}>
        <AuroraHalo style={{opacity: 0.55}}/>

        {/* sidebar */}
        <div style={{
          width: 220, padding: '20px 14px', position:'relative', zIndex: 2,
          borderRight: `1px solid ${aurora.hair}`,
          background: 'rgba(255,255,255,0.35)', backdropFilter:'blur(20px)',
          display:'flex', flexDirection:'column', gap: 4,
        }}>
          <div style={{display:'flex', alignItems:'center', gap: 10, padding: '4px 8px 18px'}}>
            <div style={{
              width: 22, height: 22, borderRadius: 7,
              background: `conic-gradient(from 180deg, ${aurora.hue1}, ${aurora.hue2}, ${aurora.hue3}, ${aurora.hue4}, ${aurora.hue1})`,
            }}/>
            <div style={{fontSize: 14, fontWeight: 600}}>Lumen</div>
          </div>

          <div style={{
            display:'flex', alignItems:'center', gap: 8, padding:'8px 10px',
            background:'rgba(255,255,255,0.6)', borderRadius: 10,
            border: `1px solid ${aurora.hair}`, fontSize: 12, color: aurora.sub,
            marginBottom: 14,
          }}>
            {I.search} Search or ⌘K
          </div>

          {[
            {ic: I.flask, label:'Deep Research', active: true, count:'3'},
            {ic: I.bolt, label:'Smart Solver'},
            {ic: I.book, label:'Guided Learning'},
            {ic: I.doc, label:'Co-writer'},
            {ic: I.graph, label:'Idea Gen'},
            {ic: I.layers, label:'Knowledge Base'},
            {ic: I.notebook, label:'Notebook'},
          ].map((it, i) => (
            <div key={i} style={{
              display:'flex', alignItems:'center', gap: 10, padding:'8px 10px',
              borderRadius: 10, fontSize: 12.5, color: it.active ? aurora.ink : aurora.sub,
              background: it.active ? 'rgba(255,255,255,0.7)' : 'transparent',
              border: it.active ? `1px solid ${aurora.glassBorder}` : '1px solid transparent',
              fontWeight: it.active ? 500 : 400,
            }}>
              <span style={{opacity: it.active ? 1 : 0.65}}>{it.ic}</span>
              <span style={{flex:1}}>{it.label}</span>
              {it.count && <span style={{
                fontSize: 10, padding:'1px 6px', borderRadius: 999,
                background:`linear-gradient(135deg, ${aurora.hue1}, ${aurora.hue2})`,
                color:'#1D1842', fontWeight: 600,
              }}>{it.count}</span>}
            </div>
          ))}

          <div style={{marginTop: 'auto', padding: '12px 10px', fontSize: 10.5, color: aurora.sub, letterSpacing: 0.3}}>
            <div style={{textTransform:'uppercase', marginBottom: 8, opacity: 0.7}}>Recent</div>
            <div style={{padding:'4px 0'}}>RLHF reward models</div>
            <div style={{padding:'4px 0'}}>Spectral clustering</div>
            <div style={{padding:'4px 0'}}>CRISPR off-targets</div>
          </div>
        </div>

        {/* main */}
        <div style={{flex: 1, position:'relative', zIndex: 2, display:'flex', flexDirection:'column', minWidth: 0}}>
          {/* header */}
          <div style={{
            padding: '18px 28px 14px', borderBottom:`1px solid ${aurora.hair}`,
            display:'flex', alignItems:'center', justifyContent:'space-between',
          }}>
            <div>
              <div style={{fontSize: 11, color: aurora.sub, letterSpacing: 0.4, marginBottom: 4, display:'flex', gap:8, alignItems:'center'}}>
                <span>DEEP RESEARCH</span>
                <span style={{opacity:.4}}>/</span>
                <span>ai_textbook.kb</span>
                <span style={{opacity:.4}}>/</span>
                <span>preset: deep · parallel</span>
              </div>
              <div style={{fontSize: 22, fontWeight: 500, fontFamily:'Instrument Serif, serif', fontStyle:'italic', letterSpacing:-0.3}}>
                How do transformers handle long context?
              </div>
            </div>
            <div style={{display:'flex', gap: 8}}>
              <button style={abtn()}>{I.pause} Pause</button>
              <button style={abtn()}>{I.share} Share</button>
              <button style={{...abtn(), background: aurora.ink, color:'white', border:'1px solid '+aurora.ink}}>{I.download} Export</button>
            </div>
          </div>

          {/* progress bar */}
          <div style={{padding:'14px 28px', display:'flex', alignItems:'center', gap: 16}}>
            <div style={{flex:1, height: 3, background: 'rgba(19,17,28,0.08)', borderRadius: 999, overflow:'hidden'}}>
              <div style={{
                height:'100%', width: `${progress*100}%`,
                background: `linear-gradient(90deg, ${aurora.hue1}, ${aurora.hue2}, ${aurora.hue3})`,
                transition:'width 0.3s',
              }}/>
            </div>
            <div style={{fontSize: 11, color: aurora.sub, fontFamily:'JetBrains Mono, monospace'}}>
              {Math.round(progress*100)}% · {visible.length}/12 steps
            </div>
          </div>

          {/* body: agent stream + subtopics */}
          <div style={{flex: 1, display:'grid', gridTemplateColumns: '1fr 320px', gap: 20, padding: '8px 28px 28px', minHeight: 0}}>
            <AuroraGlass strong style={{padding: 20, display:'flex', flexDirection:'column', minHeight: 0, overflow:'hidden'}}>
              <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 14}}>
                <div style={{fontSize: 12, fontWeight: 600, letterSpacing: 0.3, textTransform:'uppercase', color: aurora.sub}}>Reasoning stream</div>
                <div style={{fontSize: 11, color: aurora.sub, display:'flex', gap:10}}>
                  <span>● 3 agents active</span>
                  <span>{Math.round(t*100)}%</span>
                </div>
              </div>

              <div style={{flex: 1, overflow:'hidden', display:'flex', flexDirection:'column', gap: 10}}>
                {visible.slice(-8).map((s, i, arr) => {
                  const fresh = s.age < 0.35;
                  return (
                    <div key={s.at} style={{
                      display:'flex', gap: 12, opacity: fresh ? 0 : 1,
                      transform: fresh ? 'translateY(6px)' : 'translateY(0)',
                      animation: fresh ? 'aurIn 0.4s forwards' : 'none',
                    }}>
                      <AgentBadge agent={s.agent}/>
                      <div style={{flex:1, minWidth:0}}>
                        <div style={{fontSize: 12.5, color: aurora.ink}}>
                          <span style={{fontWeight: 500}}>{s.agent}Agent</span>
                          <span style={{color: aurora.sub}}> · {s.text}</span>
                        </div>
                        <div style={{
                          fontSize: 11.5, color: aurora.sub, marginTop: 3,
                          fontFamily: s.type === 'tool' || s.type === 'code' ? 'JetBrains Mono, monospace' : 'inherit',
                        }}>{s.detail}</div>
                      </div>
                      <div style={{fontSize: 10, color: aurora.sub, fontFamily:'JetBrains Mono, monospace', marginTop: 3}}>
                        +{(s.age).toFixed(1)}s
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{
                marginTop: 14, padding: '10px 12px',
                background: `linear-gradient(90deg, rgba(185,168,255,0.12), rgba(158,229,255,0.12))`,
                border: `1px solid ${aurora.glassBorder}`, borderRadius: 12,
                display:'flex', alignItems:'center', gap: 10, fontSize: 12, color: aurora.sub,
              }}>
                <div style={{display:'flex', gap: 3}}>
                  {[0,1,2].map(i => (
                    <span key={i} style={{
                      width: 5, height: 5, borderRadius: '50%',
                      background: aurora.hue1, opacity: 0.8,
                      animation: `aurPulse 1.2s ${i*0.15}s infinite`,
                    }}/>
                  ))}
                </div>
                ResearchAgent is reasoning…
              </div>
            </AuroraGlass>

            <div style={{display:'flex', flexDirection:'column', gap: 12, minHeight:0, overflow:'hidden'}}>
              <AuroraGlass style={{padding: 16}}>
                <div style={{fontSize: 12, fontWeight: 600, letterSpacing: 0.3, textTransform:'uppercase', color: aurora.sub, marginBottom: 14}}>Topic queue</div>
                {SUBTOPICS.map(s => {
                  const {pct, status} = subtopicProgress(t, s);
                  return (
                    <div key={s.id} style={{marginBottom: 12}}>
                      <div style={{display:'flex', justifyContent:'space-between', fontSize: 11.5, marginBottom: 5}}>
                        <span style={{color: aurora.ink, fontWeight: 500}}>{s.name}</span>
                        <span style={{
                          fontFamily:'JetBrains Mono, monospace', fontSize: 9.5, letterSpacing: 0.3,
                          color: status === 'COMPLETED' ? '#2BA94E' : status === 'RESEARCHING' ? '#6E55D9' : aurora.sub,
                        }}>{status}</span>
                      </div>
                      <div style={{height: 3, background:'rgba(19,17,28,0.06)', borderRadius: 999, overflow:'hidden'}}>
                        <div style={{
                          height:'100%', width: `${pct*100}%`,
                          background: status === 'COMPLETED'
                            ? '#2BA94E'
                            : `linear-gradient(90deg, ${aurora.hue1}, ${aurora.hue2})`,
                          transition:'width 0.25s',
                        }}/>
                      </div>
                      <div style={{fontSize: 10, color: aurora.sub, marginTop: 4, fontFamily:'JetBrains Mono, monospace'}}>
                        {status === 'COMPLETED' ? `${s.citations} citations` : status === 'RESEARCHING' ? 'running tools…' : 'queued'}
                      </div>
                    </div>
                  );
                })}
              </AuroraGlass>

              <AuroraGlass style={{padding: 16}}>
                <div style={{fontSize: 12, fontWeight: 600, letterSpacing: 0.3, textTransform:'uppercase', color: aurora.sub, marginBottom: 10}}>Sources discovered</div>
                <div style={{display:'flex', flexDirection:'column', gap: 8}}>
                  {[
                    {k:'PDF', v:'attention-is-all-you-need.pdf', hue: aurora.hue1},
                    {k:'PAPER', v:'FlashAttention-3 (2024)', hue: aurora.hue2},
                    {k:'WEB', v:'lilianweng.github.io/…', hue: aurora.hue3},
                    {k:'CODE', v:'complexity_plot.py', hue: aurora.hue4},
                  ].map((s,i) => (
                    <div key={i} style={{display:'flex', alignItems:'center', gap: 8, fontSize: 11.5, color: aurora.ink}}>
                      <span style={{
                        padding:'1px 6px', background: s.hue, color:'#1D1842',
                        borderRadius: 4, fontSize: 9, fontFamily:'JetBrains Mono, monospace', fontWeight: 600,
                      }}>{s.k}</span>
                      <span style={{whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{s.v}</span>
                    </div>
                  ))}
                </div>
              </AuroraGlass>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes aurIn { to { opacity: 1; transform: translateY(0); } }
        @keyframes aurPulse { 0%,100% { opacity: 0.3; transform: scale(1); } 50% { opacity: 1; transform: scale(1.4); } }
      `}</style>
    </AuroraChrome>
  );
}

function abtn() {
  return {
    padding:'7px 12px', background:'rgba(255,255,255,0.6)',
    border:`1px solid ${aurora.hair}`, borderRadius: 10,
    fontSize: 12, color: aurora.ink, fontFamily:'inherit', cursor:'pointer',
    display:'flex', alignItems:'center', gap: 6,
  };
}

function AgentBadge({ agent }) {
  const hues = {
    Rephrase:   [aurora.hue1, aurora.hue2],
    Decompose:  [aurora.hue2, aurora.hue4],
    Manager:    [aurora.hue3, aurora.hue1],
    Research:   [aurora.hue1, aurora.hue4],
    Note:       [aurora.hue4, aurora.hue2],
    Reporting:  [aurora.hue3, aurora.hue1],
  };
  const [a,b] = hues[agent] || [aurora.hue1, aurora.hue2];
  return (
    <div style={{
      width: 26, height: 26, borderRadius: 8, flexShrink:0,
      background: `linear-gradient(135deg, ${a}, ${b})`,
      display:'flex', alignItems:'center', justifyContent:'center',
      fontSize: 10, fontWeight: 700, color:'#1D1842', fontFamily:'JetBrains Mono, monospace',
      boxShadow:'0 2px 6px rgba(19,17,28,0.08)',
    }}>{agent.slice(0,2).toUpperCase()}</div>
  );
}

Object.assign(window, { AuroraWorkspace });
