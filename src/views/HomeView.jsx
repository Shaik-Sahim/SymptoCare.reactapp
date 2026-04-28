// src/views/HomeView.jsx
const SERVICES = [
  { id:'profile', icon:'bi-person-circle', color:'var(--blue)', label:'User Profile', sub:'Manage personal info & health records' },
  { id:'wallet', icon:'bi-wallet2', color:'var(--success)', label:'Digital Wallet', sub:'Add funds, view transactions & pay' },
  { id:'store', icon:'bi-shop', color:'var(--blue)', label:'Medicine Store', sub:'Buy medicines & wellness products' },
  { id:'vision', icon:'bi-camera-fill', color:'var(--cyan)', label:'Vision AI Scanner', sub:'Facial & dental analysis' },
  { id:'pharmacy', icon:'bi-prescription2', color:'var(--warning)', label:'Smart Pharmacy', sub:'Symptom-based recommendations' },
  { id:'lab', icon:'bi-clipboard2-pulse-fill', color:'var(--purple)', label:'Diagnostic Lab', sub:'Complete blood & organ analysis' },
  { id:'telemedicine', icon:'bi-hospital-fill', color:'var(--danger)', label:'Telemedicine', sub:'Live video + per-min billing' },
  { id:'appointments', icon:'bi-calendar-check-fill', color:'var(--success)', label:'Appointments', sub:'Book with top specialists' },
];

const TRUST_FEATURES = [
  { icon:'bi-shield-fill-check', title:'HIPAA Compliant & ISO Certified', sub:'Your medical data is encrypted and protected' },
  { icon:'bi-people-fill', title:'500+ Verified Doctors', sub:'Board-certified specialists across all fields' },
  { icon:'bi-clock-fill', title:'Instant AI Analysis', sub:'Results in under 30 seconds' },
];

export default function HomeView({ setView, toggleVault }) {
  return (
    <div className="view">
      <div className="hero-section">
        <div className="container-sc py4">
          <div className="hero-row">
            <div className="hero-text">
              <div className="hero-badge"><i className="bi bi-cpu me-2" />AI-Powered Healthcare Platform</div>
              <div className="display-1 mb3" style={{ color: '#fff' }}>
                Your Complete<br /><span style={{ opacity: .85 }}>Health</span> Partner
              </div>
              <p style={{ color: 'rgba(255,255,255,.8)', marginBottom: 32, fontSize: '1.1rem' }}>
                AI diagnostics, telemedicine, pharmacy &amp; health tracking — all in one place.
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <button
                  className="btn-primary"
                  style={{ background: 'rgba(255,255,255,.15)', border: '2px solid rgba(255,255,255,.4)', backdropFilter: 'blur(10px)' }}
                  onClick={() => setView('vision')}
                >
                  <i className="bi bi-camera-fill" />Start AI Scan
                </button>
                <button
                  className="btn-primary"
                  style={{ background: 'rgba(255,255,255,1)', color: 'var(--blue)' }}
                  onClick={() => setView('telemedicine')}
                >
                  <i className="bi bi-camera-video-fill" />Consult Doctor
                </button>
              </div>
              <div style={{ display: 'flex', gap: 32, marginTop: 40, flexWrap: 'wrap' }}>
                {[['50K+','Patients'], ['500+','Doctors'], ['<30s','AI Results'], ['24/7','Support']].map(([n, l]) => (
                  <div key={l} className="hero-stat" style={{ color: '#fff' }}>
                    <div className="stat-num">{n}</div>
                    <div style={{ fontSize: '.8rem', opacity: .75 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="hero-img-side">
              <img
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=600"
                className="w-100"
                style={{ borderRadius: 24, boxShadow: '0 25px 60px rgba(0,0,0,.25)' }}
                alt="Healthcare"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container-sc py4">
        <div className="section-head mt4">
          <h2>Complete Healthcare Ecosystem</h2>
          <p>Everything you need for full health management, in one place</p>
        </div>
        <div className="grid grid-4" style={{ marginBottom: 48 }}>
          {SERVICES.map(s => (
            <div
              key={s.id}
              className="card-base text-center card-click"
              onClick={() => s.id === 'vault' ? toggleVault() : setView(s.id)}
              style={{ cursor: 'pointer' }}
            >
              <i className={`bi ${s.icon}`} style={{ fontSize: '2.5rem', color: s.color, display: 'block', marginBottom: 12 }} />
              <h6 style={{ marginBottom: 6 }}>{s.label}</h6>
              <p className="small text-muted" style={{ margin: 0 }}>{s.sub}</p>
            </div>
          ))}
        </div>

        <div className="bg-grad-soft rounded-custom" style={{ padding: '40px' }}>
          <div className="hero-row">
            <div style={{ flex: 1, minWidth: 260 }}>
              <h3 className="mb3">Why 50,000+ Patients Trust SymptoCare</h3>
              {TRUST_FEATURES.map(f => (
                <div key={f.title} className="flex-start mb3">
                  <div style={{ width: 40, height: 40, background: 'var(--grad)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <i className={`bi ${f.icon} text-white`} />
                  </div>
                  <div>
                    <h6 style={{ marginBottom: 2 }}>{f.title}</h6>
                    <p className="small text-muted" style={{ margin: 0 }}>{f.sub}</p>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ flex: 1, minWidth: 260 }}>
              <img
                src="https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&q=80&w=600"
                className="w-100 rounded-custom"
                style={{ boxShadow: '0 15px 40px rgba(0,0,0,.1)' }}
                alt="Trust"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}