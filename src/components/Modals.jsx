// src/components/Modals.jsx
import { useState, useEffect } from 'react';
import { Modal, Spinner } from './UI.jsx';

// ─── CONSULT MODAL ─────────────────────────────────────────────────────────────
export function ConsultModal({ show, onClose, doc, addToast, logVault, onPay }) {
  const [form, setForm] = useState({ name: '', issue: '', duration: '10' });
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));
  if (!doc) return null;
  const total = parseInt(form.duration) * doc.rate;

  const proceed = () => {
    if (!form.name.trim())  { addToast('Please enter your name', 'error');          return; }
    if (!form.issue.trim()) { addToast('Please describe your issue', 'error');      return; }
    logVault('Consult Booked', `${doc.name} – ${form.duration} min`, 'consult');
    onClose();
    setTimeout(() => onPay(total), 300);
  };

  return (
    <Modal show={show} onClose={onClose} title='<i class="bi bi-camera-video me-2 text-blue"></i>Start Consultation' size="lg"
      footer={
        <>
          <button className="btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={proceed}><i className="bi bi-lock-fill" /> Pay &amp; Connect</button>
        </>
      }
    >
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        {/* Doctor info */}
        <div style={{ minWidth: 180 }}>
          <div className="bg-grad-soft rounded-custom text-center" style={{ padding: 24 }}>
            <img src={doc.img} className="doc-avatar mb3" alt={doc.name} style={{ width: 80, height: 80, borderRadius: '50%' }} />
            <h5>{doc.name}</h5>
            <p className="small text-muted mb1">{doc.spec}</p>
            <div className="rating-stars mb2">{'★'.repeat(Math.floor(doc.rating))} {doc.rating}</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 12 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', animation: 'pulse 2s infinite' }} />
              <small style={{ color: 'var(--success)', fontWeight: 600 }}>Available Now</small>
            </div>
            <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 12, padding: 12 }}>
              <p className="small text-muted" style={{ margin: '0 0 4px' }}>Consultation Rate</p>
              <h4 style={{ color: 'var(--blue)', margin: 0 }}>₹{doc.rate}/min</h4>
            </div>
          </div>
        </div>

        {/* Form */}
        <div style={{ flex: 1, minWidth: 240 }}>
          <h6 style={{ marginBottom: 16 }}>Consultation Details</h6>
          <div style={{ marginBottom: 14 }}>
            <label className="form-label">Your Name</label>
            <input type="text" className="form-control" placeholder="Full name" value={form.name} onChange={e => f('name', e.target.value)} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label className="form-label">Describe Your Issue</label>
            <textarea className="form-control" rows={3} placeholder="Briefly describe your symptoms..." value={form.issue} onChange={e => f('issue', e.target.value)} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label className="form-label">Duration (minutes)</label>
            <select className="form-control" value={form.duration} onChange={e => f('duration', e.target.value)}>
              {['5','10','15','20','30'].map(d => <option key={d} value={d}>{d} minutes</option>)}
            </select>
          </div>
          <div className="bg-grad-soft rounded-custom" style={{ padding: 16 }}>
            <div className="flex-between mb1"><span>Duration</span><span>{form.duration} minutes</span></div>
            <div className="flex-between mb1"><span>Rate</span><span>₹{doc.rate}/min</span></div>
            <div style={{ height: 1, background: 'var(--border)', margin: '8px 0' }} />
            <div className="flex-between" style={{ fontWeight: 700 }}><span>Estimated Cost</span><span style={{ color: 'var(--blue)' }}>₹{total.toLocaleString()}</span></div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

// ─── PAYMENT MODAL ─────────────────────────────────────────────────────────────
const PAY_METHODS = [
  { id: 'upi',        label: 'UPI / QR Code',       sub: 'GPay, PhonePe, Paytm, BHIM', icon: 'bi-phone-fill'  },
  { id: 'card',       label: 'Credit / Debit Card',  sub: 'Visa, Mastercard, RuPay',    icon: 'bi-credit-card' },
  { id: 'netbanking', label: 'Net Banking',           sub: 'All major banks supported',  icon: 'bi-bank'        },
  { id: 'cod',        label: 'Cash on Delivery',      sub: 'Pay when you receive',       icon: 'bi-cash-coin'   },
];

export function PaymentModal({ show, onClose, total, addToast, logVault, onSuccess }) {
  const [step,      setStep]      = useState(1);
  const [addr,      setAddr]      = useState({ name:'', phone:'', addr1:'', addr2:'', city:'Hyderabad', state:'Telangana', pin:'' });
  const [payMethod, setPayMethod] = useState('upi');
  const [order,     setOrder]     = useState(null);
  const [spinning,  setSpinning]  = useState(false);
  const [upiId,     setUpiId]     = useState('');
  const [card,      setCard]      = useState({ number:'', expiry:'', cvv:'', name:'' });

  const a = (k, v) => setAddr(p => ({ ...p, [k]: v }));

  useEffect(() => { if (show) { setStep(1); setOrder(null); setUpiId(''); setCard({ number:'', expiry:'', cvv:'', name:'' }); } }, [show]);

  const next = () => {
    if (step === 1) {
      if (!addr.name.trim() || !addr.addr1.trim() || !addr.pin.trim()) {
        addToast('Please fill all required fields', 'error'); return;
      }
      setStep(2);
    } else if (step === 2) {
      setSpinning(true);
      setTimeout(() => {
        const id = '#SC' + Math.floor(100000 + Math.random() * 900000);
        const orderObj = { id, amount: total, method: payMethod.toUpperCase(), date: new Date().toLocaleString(), status: 'Confirmed' };
        setOrder(orderObj);
        try {
          const prev = JSON.parse(localStorage.getItem('symptocare_orders') || '[]');
          localStorage.setItem('symptocare_orders', JSON.stringify([orderObj, ...prev].slice(0, 50)));
        } catch {}
        logVault('Order Placed', id + ' – ₹' + total, 'pharmacy');
        setSpinning(false);
        setStep(3);
      }, 1800);
    }
  };

  const STEPS = [['Address', 1], ['Payment', 2], ['Confirm', 3]];

  return (
    <>
      <Spinner show={spinning} text="Processing your order..." />
      <Modal show={show} onClose={onClose} title='<i class="bi bi-lock-fill me-2 text-blue"></i>Secure Checkout' size="lg"
        footer={step < 3 ? (
          <div style={{ display: 'flex', gap: 12 }}>
            {step === 2 && <button className="btn-outline" onClick={() => setStep(1)}><i className="bi bi-arrow-left" /> Back</button>}
            <button className="btn-primary" onClick={next}>
              {step === 1 ? 'Continue' : 'Place Order'} <i className="bi bi-arrow-right ms-2" />
            </button>
          </div>
        ) : null}
      >
        {/* Step indicator */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 0, marginBottom: 24 }}>
          {STEPS.map(([label, n], i) => (
            <div key={n} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: 13,
                  background: step > n ? 'var(--success)' : step === n ? 'var(--blue)' : '#e5e7eb',
                  color: step >= n ? '#fff' : '#9ca3af',
                }}>
                  {step > n ? '✓' : n}
                </div>
                <span style={{ fontSize: 10, fontWeight: 600, color: step === n ? 'var(--blue)' : step > n ? 'var(--success)' : '#9ca3af', textTransform: 'uppercase' }}>{label}</span>
              </div>
              {i < STEPS.length - 1 && <div style={{ width: 60, height: 2, background: step > n ? 'var(--success)' : '#e5e7eb', margin: '0 6px', marginBottom: 20 }} />}
            </div>
          ))}
        </div>

        {/* Step 1: Address */}
        {step === 1 && (
          <div>
            <h6 style={{ marginBottom: 16 }}>Delivery Address</h6>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div><label className="form-label">Full Name *</label><input type="text" className="form-control" placeholder="Your name" value={addr.name} onChange={e => a('name', e.target.value)} /></div>
              <div><label className="form-label">Phone</label><input type="text" className="form-control" placeholder="+91 XXXXX XXXXX" value={addr.phone} onChange={e => a('phone', e.target.value)} /></div>
            </div>
            <div style={{ marginBottom: 12 }}><label className="form-label">Address Line 1 *</label><input type="text" className="form-control" placeholder="House/Flat No., Street" value={addr.addr1} onChange={e => a('addr1', e.target.value)} /></div>
            <div style={{ marginBottom: 12 }}><label className="form-label">Address Line 2</label><input type="text" className="form-control" placeholder="Area, Landmark (optional)" value={addr.addr2} onChange={e => a('addr2', e.target.value)} /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
              <div><label className="form-label">City</label><input type="text" className="form-control" placeholder="City" value={addr.city} onChange={e => a('city', e.target.value)} /></div>
              <div>
                <label className="form-label">State</label>
                <select className="form-control" value={addr.state} onChange={e => a('state', e.target.value)}>
                  {['Telangana','Andhra Pradesh','Maharashtra','Karnataka','Tamil Nadu','Delhi','Other'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div><label className="form-label">PIN Code *</label><input type="text" className="form-control" placeholder="500001" maxLength={6} value={addr.pin} onChange={e => a('pin', e.target.value)} /></div>
            </div>
            <div className="flex-between bg-grad-soft rounded-custom" style={{ padding: 16 }}>
              <span style={{ fontWeight: 600 }}>Order Total</span>
              <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--blue)' }}>₹{total?.toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* Step 2: Payment */}
        {step === 2 && (
          <div>
            <h6 style={{ marginBottom: 16 }}>Select Payment Method</h6>
            {PAY_METHODS.map(m => (
              <div key={m.id} onClick={() => setPayMethod(m.id)}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderRadius: 12, border: `2px solid ${payMethod === m.id ? 'var(--blue)' : 'var(--border)'}`, background: payMethod === m.id ? 'rgba(14,165,233,.04)' : '#fff', cursor: 'pointer', marginBottom: 10, transition: 'all 0.2s' }}>
                <input type="radio" checked={payMethod === m.id} onChange={() => {}} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{m.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>{m.sub}</div>
                </div>
                <i className={`bi ${m.icon}`} style={{ fontSize: '1.2rem', color: 'var(--blue)' }} />
              </div>
            ))}

            {payMethod === 'upi' && (
              <div style={{ marginTop: 16, padding: 16, background: '#f8fafc', borderRadius: 12 }}>
                <label className="form-label">UPI ID</label>
                <input type="text" className="form-control mb3" placeholder="yourname@upi" value={upiId} onChange={e => setUpiId(e.target.value)} />
                <div className="text-center">
                  <div style={{ width: 100, height: 100, background: 'var(--grad)', borderRadius: 12, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="bi bi-qr-code" style={{ fontSize: '2.5rem', color: '#fff' }} />
                  </div>
                  <small className="text-muted" style={{ display: 'block', marginTop: 8 }}>Scan QR to pay instantly</small>
                </div>
              </div>
            )}

            {payMethod === 'card' && (
              <div style={{ marginTop: 16, padding: 16, background: '#f8fafc', borderRadius: 12 }}>
                <div style={{ marginBottom: 12 }}><label className="form-label">Cardholder Name</label><input type="text" className="form-control" placeholder="Name on card" value={card.name} onChange={e => setCard(p => ({ ...p, name: e.target.value }))} /></div>
                <div style={{ marginBottom: 12 }}><label className="form-label">Card Number</label><input type="text" className="form-control" placeholder="XXXX XXXX XXXX XXXX" maxLength={19} value={card.number} onChange={e => setCard(p => ({ ...p, number: e.target.value }))} /></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div><label className="form-label">Expiry</label><input type="text" className="form-control" placeholder="MM/YY" maxLength={5} value={card.expiry} onChange={e => setCard(p => ({ ...p, expiry: e.target.value }))} /></div>
                  <div><label className="form-label">CVV</label><input type="password" className="form-control" placeholder="•••" maxLength={3} value={card.cvv} onChange={e => setCard(p => ({ ...p, cvv: e.target.value }))} /></div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && order && (
          <div className="text-center" style={{ padding: '20px 0' }}>
            <div style={{ width: 80, height: 80, background: 'rgba(16,185,129,.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <i className="bi bi-check-circle-fill" style={{ fontSize: '2.5rem', color: 'var(--success)' }} />
            </div>
            <h4 style={{ marginBottom: 8 }}>Order Placed Successfully!</h4>
            <p className="text-muted" style={{ marginBottom: 20 }}>Your order has been confirmed. Estimated delivery: 2–4 hours.</p>
            <div className="bg-grad-soft rounded-custom" style={{ padding: 20, marginBottom: 20 }}>
              {[['Order ID', order.id], ['Amount Paid', '₹' + total?.toLocaleString()], ['Payment', order.method]].map(([label, value]) => (
                <div key={label} className="flex-between" style={{ marginBottom: 8 }}>
                  <span className="text-muted">{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
            <button className="btn-primary" onClick={() => { onClose(); onSuccess?.(); addToast('Order confirmed! Track it in My Orders.'); }}>
              <i className="bi bi-bag-check" /> View My Orders
            </button>
          </div>
        )}
      </Modal>
    </>
  );
}