// Top-level canvas — Aurora landing + workspace.

function App() {
  return (
    <DesignCanvas>
      <DCSection
        title="Lumen — Aurora direction"
        subtitle="A fresh UI for DeepTutor. Apple-Intelligence-adjacent, with the Deep Research module as the hero. Scroll horizontally, pinch to zoom."
      >
        <div style={{display:'flex', flexDirection:'column', gap: 28}}>
          <DCArtboard label="Aurora · Landing · 1440 × 900" width={1440} height={900}>
            <AuroraLanding/>
          </DCArtboard>
          <DCArtboard label="Aurora · Deep Research · 1440 × 900" width={1440} height={900}>
            <AuroraWorkspace/>
          </DCArtboard>
        </div>

        <div style={{
          width: 360, marginLeft: 20, display:'flex', flexDirection:'column', gap: 18,
          fontFamily:'Inter, sans-serif',
        }}>
          <div style={{fontSize: 13, fontWeight: 600, color:'rgba(40,30,20,0.85)', marginBottom: 4}}>Reading guide</div>

          <NoteCard title="Aurora" c="#B9A8FF">
            Apple Intelligence / visionOS. Cool pastel halo, frosted-glass panels, soft rounded radii. The premium "wow" pick — feels native on Apple silicon. Default direction.
          </NoteCard>

          <div style={{
            marginTop: 8, padding: 14,
            background:'rgba(255,255,255,0.5)', border:'1px solid rgba(19,17,28,0.08)',
            borderRadius: 10, fontSize: 12.5, lineHeight: 1.45, color:'rgba(19,17,28,0.7)',
          }}>
            <b style={{color:'rgba(19,17,28,0.9)'}}>Shared moves</b> across all three:
            <ul style={{margin:'8px 0 0 16px', padding: 0}}>
              <li>Live reasoning stream — the 6 agents narrate in real time on a ~18s loop</li>
              <li>Topic queue with parallel progress bars (matches DeepTutor's queue architecture)</li>
              <li>"ResearchAgent is reasoning…" pulse indicator</li>
              <li>Module strip at the bottom of landing — all 6 agents accessible</li>
            </ul>
          </div>

          <DCPostIt top={-20} left={-40} rotate={-4} width={220}>
            Pick one and I'll run with it — add KB + Solver + Co-writer next.
          </DCPostIt>
        </div>
      </DCSection>
    </DesignCanvas>
  );
}

function NoteCard({ title, c, children }) {
  return (
    <div style={{
      padding: 16, background:'rgba(255,255,255,0.7)',
      border:'1px solid rgba(19,17,28,0.08)', borderRadius: 12,
      fontSize: 12.5, lineHeight: 1.5, color:'rgba(19,17,28,0.8)',
    }}>
      <div style={{display:'flex', alignItems:'center', gap: 8, marginBottom: 6}}>
        <span style={{width: 10, height: 10, borderRadius: 3, background: c}}/>
        <b style={{color:'rgba(19,17,28,0.95)', fontSize: 13}}>{title}</b>
      </div>
      {children}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
