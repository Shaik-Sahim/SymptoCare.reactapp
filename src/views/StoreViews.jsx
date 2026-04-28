import { useState } from 'react';
import { Spinner } from "../components/UI.jsx";
import { PRODUCTS, PHARM_MEDS } from "../data/index.js";

// ─── STORE VIEW ───────────────────────────────────────────────────────────────
export function StoreView({ addToCart, addToast }) {
  const [cat,    setCat]    = useState('all');
  const [search, setSearch] = useState('');

  const filtered = PRODUCTS.filter(p =>
    (cat === 'all' || p.cat === cat) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) ||
     p.brand.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="view">
      <div className="container-sc py4">
        <div className="section-head">
          <h2><i className="bi bi-shop me-2 text-blue" />Medicine &amp; Wellness Store</h2>
          <p>Order medicines, skincare, dental &amp; wellness products — delivered to your door</p>
        </div>

        {/* Category filter */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 24 }}>
          {[['all','All Products'],['medicine','💊 Medicines'],['skincare','✨ Skincare'],['dental','🦷 Dental'],['wellness','🌿 Wellness']].map(([c, l]) => (
            <button key={c} className={`cat-btn${cat === c ? ' active' : ''}`} onClick={() => setCat(c)}>{l}</button>
          ))}
        </div>

        {/* Search */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          <div className="input-group" style={{ maxWidth: 480, width: '100%' }}>
            <span className="input-group-text"><i className="bi bi-search" /></span>
            <input
              type="text" className="form-control"
              placeholder="Search medicines, brands..."
              value={search} onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center" style={{ padding: '60px 0', color: 'var(--muted)' }}>
            <i className="bi bi-search" style={{ fontSize: '3rem', display: 'block', marginBottom: 12 }} />
            <p>No products found</p>
          </div>
        ) : (
          <div className="grid grid-4">
            {filtered.map(p => (
              <div key={p.id} className="product-card">
                <div className="product-img">{p.icon}</div>
                <span className="badge-custom badge-blue mb2" style={{ display: 'inline-block' }}>{p.cat.toUpperCase()}</span>
                <h6 style={{ marginBottom: 4 }}>{p.name}</h6>
                <p className="small text-muted" style={{ marginBottom: 4 }}>{p.brand}</p>
                <p className="small text-muted" style={{ marginBottom: 8 }}>{p.desc}</p>
                <div className="rating-stars mb3">★★★★★ <span style={{ color: 'var(--dark)', fontSize: '.82rem' }}>{p.rating}</span></div>
                <div className="flex-between" style={{ borderTop: '1px solid var(--border)', paddingTop: 12 }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--blue)' }}>₹{p.price}</div>
                    <small className="text-muted">Per pack</small>
                  </div>
                  <button className="btn-success" onClick={() => { addToCart(p); addToast(`Added to cart: ${p.name}`); }}>
                    <i className="bi bi-cart-plus" />Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── PHARMACY VIEW ────────────────────────────────────────────────────────────
const SYMPTOM_LIST = Object.keys(PHARM_MEDS);

export function PharmacyView({ addToCart, addToast, logVault }) {
  const [selected, setSelected] = useState([]);
  const [results,  setResults]  = useState([]);
  const [spinning, setSpinning] = useState(false);

  const toggle = s => setSelected(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  const generate = () => {
    if (!selected.length) { addToast('Please select at least one symptom', 'error'); return; }
    setSpinning(true);
    setTimeout(() => {
      setResults(selected.map(s => ({ sym: s, med: PHARM_MEDS[s] })).filter(x => x.med));
      setSpinning(false);
      logVault('Pharmacy AI', `${selected.length} symptoms analyzed – medications recommended`, 'pharmacy');
    }, 1500);
  };

  return (
    <div className="view">
      <Spinner show={spinning} />
      <div className="container-sc py4">
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div className="card-base card-hover-none">
            <div className="section-head">
              <h2><i className="bi bi-prescription2 me-2 text-blue" />AI-Powered Symptom Pharmacy</h2>
              <p>Select your symptoms to get instant, personalized medication recommendations</p>
            </div>

            <p style={{ color: 'var(--muted)', fontSize: '.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 12 }}>
              Select Symptoms (Multiple allowed)
            </p>
            <div>
              {SYMPTOM_LIST.map(s => (
                <span
                  key={s}
                  className={`stag${selected.includes(s) ? ' sel' : ''}`}
                  onClick={() => toggle(s)}
                >
                  {s.split('/')[0]}
                </span>
              ))}
            </div>

            <div className="text-center mt4">
              <button className="btn-primary" onClick={generate}>
                <i className="bi bi-cpu" />Generate AI Recommendations
              </button>
            </div>

            {results.length > 0 && (
              <div className="grid grid-3 mt4">
                {results.map(({ sym, med }) => (
                  <div key={sym} className="product-card" style={{ borderColor: 'rgba(14,165,233,.2)' }}>
                    <div className="flex-between mb3">
                      <span className="badge-custom badge-blue">{sym.split('/')[0]}</span>
                      <i className="bi bi-capsule" style={{ fontSize: '1.3rem', color: 'var(--blue)' }} />
                    </div>
                    <h6>{med.name}</h6>
                    <p className="small text-muted mb1"><strong>Brand:</strong> {med.brand}</p>
                    <p className="small text-muted mb3"><i className="bi bi-info-circle me-1" />{med.note}</p>
                    <div className="flex-between" style={{ borderTop: '1px solid var(--border)', paddingTop: 12 }}>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--blue)' }}>₹{med.price}</div>
                        <small className="text-muted">Per pack</small>
                      </div>
                      <button
                        className="btn-success"
                        onClick={() => { addToCart({ id: med.id, name: med.name, price: med.price, icon: '💊' }); addToast(`Added: ${med.name}`); }}
                      >
                        <i className="bi bi-cart-plus" />Buy Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}