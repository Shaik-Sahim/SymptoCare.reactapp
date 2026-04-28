// src/components/Footer.jsx
const QUICK_LINKS = [
  ['store','Medicine Store'], ['pharmacy','Pharmacy'], ['vision','Vision AI'],
  ['telemedicine','Telemedicine'], ['emergency','Emergency'], ['lab','Diagnostics'],
];

const SERVICES = ['AI Health Scanning','Online Pharmacy & Store','Lab Diagnostics','Doctor Consultations','Health Tracking','Medical Records Vault'];
const CONTACT  = [
  { icon: 'bi-geo-alt-fill', text: 'Hyderabad, Telangana – 500001' },
  { icon: 'bi-telephone-fill', text: '+91 123 456 7890' },
  { icon: 'bi-envelope-fill', text: 'support@symptocare.com' },
  { icon: 'bi-clock-fill', text: '24/7 Available' },
];

export default function Footer({ setView }) {
  return (
    <footer style={{ background: 'var(--dark)', color: '#fff', padding: '50px 0 24px', marginTop: 60 }}>
      <div className="container-sc">
        <div className="grid grid-4 mb4">
          <div>
            <div className="brand mb3" style={{ display: 'block', fontSize: '1.5rem', cursor: 'pointer' }} onClick={() => setView('home')}>
              <i className="bi bi-heart-pulse-fill me-2" style={{ color: 'var(--blue)' }} />
              Sympto<span style={{ color: '#fff' }}>Care</span><span style={{ color: 'var(--blue)' }}>.</span>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '.9rem' }}>AI-powered healthcare companion. Professional services, diagnostics &amp; wellness tracking.</p>
          </div>
          <div>
            <h6 style={{ fontWeight: 700, marginBottom: 12 }}>Quick Links</h6>
            {QUICK_LINKS.map(([id, label]) => (
              <div key={id} style={{ marginBottom: 8 }}>
                <button onClick={() => setView(id)} style={{ background: 'none', border: 'none', color: id === 'emergency' ? 'var(--danger)' : '#94a3b8', cursor: 'pointer', fontSize: '.9rem', textAlign: 'left', padding: 0 }}>
                  <i className="bi bi-chevron-right me-2" style={{ color: 'var(--blue)', fontSize: '.75rem' }} />{label}
                </button>
              </div>
            ))}
          </div>
          <div>
            <h6 style={{ fontWeight: 700, marginBottom: 12 }}>Our Services</h6>
            <ul style={{ color: '#94a3b8', fontSize: '.9rem', listStyle: 'none', padding: 0, margin: 0 }}>
              {SERVICES.map(s => (
                <li key={s} style={{ marginBottom: 8 }}>
                  <i className="bi bi-check2 me-2" style={{ color: 'var(--success)' }} />{s}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h6 style={{ fontWeight: 700, marginBottom: 12 }}>Contact Us</h6>
            {CONTACT.map(c => (
              <div key={c.text} style={{ marginBottom: 12 }}>
                <i className={`bi ${c.icon} me-2`} style={{ color: 'var(--blue)' }} />
                <span style={{ color: '#94a3b8', fontSize: '.9rem' }}>{c.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.25)', borderRadius: 16, padding: '20px 24px', marginBottom: 24 }}>
          <div className="flex-between" style={{ flexWrap: 'wrap', gap: 12 }}>
            <div className="flex-start">
              <i className="bi bi-exclamation-triangle-fill" style={{ fontSize: '1.5rem', color: 'var(--danger)' }} />
              <div>
                <strong>Emergency Helpline</strong>
                <p style={{ margin: 0, fontSize: '.85rem', color: '#94a3b8' }}>24/7 immediate medical assistance</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              {[['tel:108','108'], ['tel:112','112']].map(([href, num]) => (
                <a key={num} href={href} style={{
                  ...(num === '108' ? { background: 'var(--danger)', color: '#fff' } : { border: '2px solid var(--danger)', color: 'var(--danger)' }),
                  padding: '8px 20px', borderRadius: 20, fontWeight: 700,
                  display: 'inline-flex', alignItems: 'center', gap: 6, textDecoration: 'none',
                }}>
                  <i className="bi bi-telephone-fill" />{num}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #1e293b', paddingTop: 20, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <p style={{ color: '#64748b', fontSize: '.83rem', margin: 0 }}>
            © 2026 SymptoCare. Made with <i className="bi bi-heart-fill" style={{ color: 'var(--danger)' }} /> in Hyderabad, India
          </p>
          <div>
            {['Privacy Policy','Terms','Cookies'].map(l => (
              <button key={l} style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '.83rem', marginLeft: 14, cursor: 'pointer' }}>{l}</button>
            ))}
          </div>
        </div>
        <div className="text-center mt3">
          <small style={{ color: '#475569', fontSize: '.78rem' }}>
            <i className="bi bi-shield-fill-check me-1" style={{ color: 'var(--success)' }} />ISO 9001:2015 &nbsp;|&nbsp;
            <i className="bi bi-award-fill me-1" style={{ color: 'var(--warning)' }} />HIPAA Compliant &nbsp;|&nbsp;
            <i className="bi bi-lock-fill me-1" style={{ color: 'var(--cyan)' }} />SSL Secured
          </small>
        </div>
      </div>
    </footer>
  );
}