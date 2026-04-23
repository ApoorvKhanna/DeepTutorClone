// Aurora — Apple Intelligence / visionOS. Cool pastel gradients, frosted glass, halos.
// Wrapped in a MacBook-ish browser chrome. 1440×900.

const aurora = {
  bg: '#F6F5FB',
  ink: '#13111C',
  sub: 'rgba(19,17,28,0.55)',
  hair: 'rgba(19,17,28,0.08)',
  glassBg: 'rgba(255,255,255,0.55)',
  glassBorder: 'rgba(255,255,255,0.7)',
  glassShadow: '0 1px 2px rgba(19,17,28,0.04), 0 12px 40px rgba(99,78,191,0.08)',
  hue1: '#B9A8FF',
  hue2: '#9EE5FF',
  hue3: '#FFB8D1',
  hue4: '#C8FFE1',
};

function AuroraHalo({ style }) {
  const t = useTick(true);
  const a = (t / 40) % 360;
  return (
    <div aria-hidden style={{
      position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none',
      ...style,
    }}>
      <div style={{
        position: 'absolute', top: '-30%', left: '-20%', width: '90%', height: '120%',
        background: `radial-gradient(circle at 40% 40%, ${aurora.hue1} 0%, transparent 60%)`,
        filter: 'blur(70px)', opacity: 0.55,
        transform: `rotate(${a}deg)`,
      }}/>
      <div style={{
        position: 'absolute', top: '-10%', right: '-20%', width: '80%', height: '110%',
        background: `radial-gradient(circle at 60% 40%, ${aurora.hue2} 0%, transparent 65%)`,
        filter: 'blur(80px)', opacity: 0.6,
        transform: `rotate(${-a}deg)`,
      }}/>
      <div style={{
        position: 'absolute', bottom: '-30%', left: '10%', width: '90%', height: '90%',
        background: `radial-gradient(circle at 50% 50%, ${aurora.hue3} 0%, transparent 60%)`,
        filter: 'blur(90px)', opacity: 0.45,
        transform: `rotate(${a/2}deg)`,
      }}/>
      <div style={{
        position: 'absolute', bottom: '-20%', right: '-10%', width: '70%', height: '80%',
        background: `radial-gradient(circle at 50% 50%, ${aurora.hue4} 0%, transparent 60%)`,
        filter: 'blur(80px)', opacity: 0.4,
        transform: `rotate(${-a/3}deg)`,
      }}/>
    </div>
  );
}

function AuroraGlass({ children, style, strong = false }) {
  return (
    <div style={{
      background: strong ? 'rgba(255,255,255,0.72)' : aurora.glassBg,
      border: `1px solid ${aurora.glassBorder}`,
      backdropFilter: 'blur(24px) saturate(180%)',
      WebkitBackdropFilter: 'blur(24px) saturate(180%)',
      boxShadow: aurora.glassShadow,
      borderRadius: 20,
      ...style,
    }}>{children}</div>
  );
}

function AuroraChrome({ url = 'lumen.app', children, style }) {
  return (
    <div style={{
      width: '100%', height: '100%', background: '#E8E6EF',
      borderRadius: 14, overflow: 'hidden',
      boxShadow: '0 30px 80px rgba(19,17,28,0.12), 0 4px 12px rgba(19,17,28,0.06)',
      display: 'flex', flexDirection: 'column',
      ...style,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
        background: 'linear-gradient(180deg, #F0EEF6 0%, #E8E6EF 100%)',
        borderBottom: `1px solid ${aurora.hair}`,
      }}>
        <div style={{display:'flex', gap:6}}>
          <span style={{width:11,height:11,borderRadius:'50%',background:'#FF6058',boxShadow:'inset 0 0 0 0.5px rgba(0,0,0,0.1)'}}/>
          <span style={{width:11,height:11,borderRadius:'50%',background:'#FFBD2E',boxShadow:'inset 0 0 0 0.5px rgba(0,0,0,0.1)'}}/>
          <span style={{width:11,height:11,borderRadius:'50%',background:'#28C940',boxShadow:'inset 0 0 0 0.5px rgba(0,0,0,0.1)'}}/>
        </div>
        <div style={{flex:1, display:'flex', justifyContent:'center'}}>
          <div style={{
            display:'flex', alignItems:'center', gap:6, padding:'4px 14px',
            background:'rgba(255,255,255,0.7)', borderRadius: 6,
            fontSize:11, color: aurora.sub, minWidth: 280, justifyContent:'center',
          }}>
            <span style={{opacity:.7, fontSize:10}}>🔒</span> {url}
          </div>
        </div>
        <div style={{width: 60}}/>
      </div>
      <div style={{flex:1, position:'relative', overflow:'hidden'}}>{children}</div>
    </div>
  );
}

// LANDING — 1440×900
function AuroraLanding() {
  return (
    <AuroraChrome url="lumen.app">
      <div style={{
        width: '100%', height: '100%', position: 'relative',
        background: aurora.bg, color: aurora.ink,
      }}>
        <AuroraHalo />

        <div style={{
          position:'relative', display:'flex', alignItems:'center', justifyContent:'space-between',
          padding: '20px 40px', zIndex: 2,
        }}>
          <div style={{display:'flex', alignItems:'center', gap: 10}}>
            <div style={{
              width: 28, height: 28, borderRadius: 8,
              background: `conic-gradient(from 180deg, ${aurora.hue1}, ${aurora.hue2}, ${aurora.hue3}, ${aurora.hue4}, ${aurora.hue1})`,
              boxShadow: '0 4px 12px rgba(99,78,191,0.25)',
            }}/>
            <div style={{fontSize: 18, fontWeight: 600, letterSpacing: -0.4}}>Lumen</div>
          </div>
          <div style={{display:'flex', gap: 28, fontSize: 13, color: aurora.sub}}>
            <span>Research</span><span>Knowledge</span><span>Co-writer</span><span>Changelog</span>
          </div>
          <div style={{display:'flex', gap: 10, alignItems:'center'}}>
            <span style={{fontSize: 13, color: aurora.sub}}>Sign in</span>
            <button style={{
              padding:'8px 16px', background: aurora.ink, color: 'white',
              border:'none', borderRadius: 999, fontSize: 12.5, fontWeight: 500,
              fontFamily:'inherit', cursor:'pointer',
            }}>Try Lumen  →</button>
          </div>
        </div>

        <div style={{
          position:'relative', zIndex: 2, padding: '50px 80px 0',
          display:'grid', gridTemplateColumns: '1.1fr 1fr', gap: 48, alignItems:'start',
        }}>
          <div>
            <AuroraGlass style={{
              display:'inline-flex', alignItems:'center', gap: 8,
              padding:'6px 14px 6px 8px', borderRadius: 999, marginBottom: 28,
            }}>
              <span style={{
                padding:'2px 8px', borderRadius: 999, fontSize: 10.5, fontWeight: 600,
                background: 'linear-gradient(135deg, #B9A8FF 0%, #9EE5FF 100%)', color: '#1D1842',
                letterSpacing: 0.3,
              }}>NEW</span>
              <span style={{fontSize: 12.5, color: aurora.ink}}>v0.6 · Parallel research across 5 topics</span>
              <span style={{color: aurora.sub}}>→</span>
            </AuroraGlass>

            <h1 style={{
              fontFamily: 'Instrument Serif, serif',
              fontSize: 76, lineHeight: 0.98, letterSpacing: -2.5,
              margin: 0, fontWeight: 400,
            }}>
              Your mind,<br/>
              <span style={{fontStyle:'italic'}}>expanded.</span>
            </h1>
            <p style={{
              fontSize: 17, lineHeight: 1.5, color: aurora.sub, margin: '24px 0 36px',
              maxWidth: 440,
            }}>
              Six agents, one obsession: understanding whatever you're trying to learn. Drop in a PDF, a question, or a hunch — Lumen does the reading for you.
            </p>

            <div style={{display:'flex', gap: 12, alignItems:'center'}}>
              <button style={{
                padding: '14px 22px', background: aurora.ink, color:'white',
                border:'none', borderRadius: 14, fontSize: 14, fontWeight: 500,
                fontFamily:'inherit', cursor:'pointer', display:'flex', alignItems:'center', gap: 8,
              }}>Start researching {I.arrowRight}</button>
              <button style={{
                padding:'14px 22px', background: 'rgba(255,255,255,0.6)',
                border:`1px solid ${aurora.hair}`, borderRadius: 14,
                fontSize: 14, fontWeight: 500, color: aurora.ink, backdropFilter:'blur(10px)',
                fontFamily:'inherit', cursor:'pointer',
              }}>Watch 90s demo</button>
            </div>

            <div style={{
              marginTop: 56, display:'flex', gap: 32,
              fontSize: 11.5, color: aurora.sub, letterSpacing: 0.4, textTransform: 'uppercase',
            }}>
              <span>Stanford</span><span>ETH Zurich</span><span>Cambridge</span><span>HKU</span><span>+ 2,400 researchers</span>
            </div>
          </div>

          <AuroraGlass strong style={{padding: 20, position:'relative', marginTop: 40}}>
            <div style={{fontSize: 11, color: aurora.sub, letterSpacing: 0.5, marginBottom: 12, display:'flex', justifyContent:'space-between'}}>
              <span>DEEP RESEARCH · 00:42 ELAPSED</span>
              <span style={{color:'#2BA94E'}}>● LIVE</span>
            </div>
            <div style={{
              fontFamily:'Instrument Serif, serif', fontSize: 22, lineHeight: 1.2,
              fontStyle:'italic', marginBottom: 18,
            }}>"How do transformers handle long context?"</div>

            <AuroraMiniStream />

            <div style={{
              marginTop: 16, display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap: 8,
            }}>
              {['14 papers','32 citations','8,241 words'].map(s => (
                <div key={s} style={{
                  padding: '10px 12px', background:'rgba(255,255,255,0.55)',
                  borderRadius: 10, fontSize: 11, color: aurora.ink, fontWeight: 500,
                  border:`1px solid ${aurora.glassBorder}`,
                }}>{s}</div>
              ))}
            </div>
          </AuroraGlass>
        </div>

        <div style={{
          position:'absolute', left: 80, right: 80, bottom: 40, zIndex: 2,
          display:'grid', gridTemplateColumns:'repeat(6, 1fr)', gap: 10,
        }}>
          {[
            {ic: I.bolt, label:'Solver'},
            {ic: I.flask, label:'Research'},
            {ic: I.book, label:'Guide'},
            {ic: I.doc, label:'Co-writer'},
            {ic: I.graph, label:'Ideagen'},
            {ic: I.layers, label:'Knowledge'},
          ].map((m,i) => (
            <AuroraGlass key={i} style={{
              padding: '12px 14px', display:'flex', alignItems:'center', gap: 10,
            }}>
              <span style={{color: aurora.ink, opacity: .7}}>{m.ic}</span>
              <span style={{fontSize: 12.5, fontWeight: 500}}>{m.label}</span>
            </AuroraGlass>
          ))}
        </div>
      </div>
    </AuroraChrome>
  );
}

function AuroraMiniStream() {
  const { visible } = useAgentTimeline(18000);
  const last5 = visible.slice(-5);
  return (
    <div style={{display:'flex', flexDirection:'column', gap: 8, minHeight: 190}}>
      {last5.map((s, i) => {
        const opacity = Math.max(0.3, 1 - (last5.length - 1 - i) * 0.15);
        return (
          <div key={s.at} style={{
            display:'flex', gap: 10, alignItems:'flex-start', opacity,
            transition: 'opacity 0.4s',
          }}>
            <div style={{
              width: 22, height: 22, borderRadius: 7, flexShrink: 0, marginTop: 1,
              background: `linear-gradient(135deg, ${aurora.hue1}, ${aurora.hue2})`,
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize: 9, fontWeight: 700, color:'#1D1842', fontFamily:'JetBrains Mono, monospace',
            }}>{s.agent.slice(0,1)}</div>
            <div style={{flex:1, minWidth:0}}>
              <div style={{fontSize: 12, fontWeight: 500, color: aurora.ink}}>
                <span style={{color: aurora.sub, fontWeight: 400}}>{s.agent}Agent · </span>
                {s.text}
              </div>
              <div style={{fontSize: 11, color: aurora.sub, marginTop: 2, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{s.detail}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

Object.assign(window, { AuroraLanding, aurora, AuroraGlass, AuroraHalo, AuroraChrome });
