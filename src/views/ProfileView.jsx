// src/views/ProfileView.jsx
import { useState, useRef, useEffect, useCallback } from 'react';

const BLOOD_GROUPS = ['A+','A-','B+','B-','O+','O-','AB+','AB-'];
const CHRONIC = ['Diabetes','Hypertension','Asthma','Heart Disease','Thyroid','PCOD','Arthritis','None'];

function calcAge(dob) {
  if (!dob) return null;
  const diff = Date.now() - new Date(dob).getTime();
  return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
}

function calcBMI(weight, height) {
  if (!weight || !height) return null;
  const bmi = (+weight / ((+height / 100) ** 2)).toFixed(1);
  let cat = '', color = '';
  if      (bmi < 18.5) { cat = 'Underweight'; color = '#3b82f6'; }
  else if (bmi < 25)   { cat = 'Normal';       color = '#10b981'; }
  else if (bmi < 30)   { cat = 'Overweight';   color = '#f59e0b'; }
  else                 { cat = 'Obese';         color = '#ef4444'; }
  return { bmi, cat, color };
}

function healthScore(p) {
  let s = 40;
  if (p.name && p.name !== 'Guest User') s += 10;
  if (p.phone)          s += 5;
  if (p.dob)            s += 10;
  if (p.bloodGroup)     s += 10;
  if (p.weight && p.height) s += 10;
  if (p.emergencyContact)   s += 10;
  if (p.allergies?.length)  s += 5;
  return Math.min(s, 100);
}

export default function ProfileView({ profile, updateProfile, clearProfile, setView, balance }) {
  const [tab,     setTab]     = useState('personal');
  const [editing, setEditing] = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [form,    setForm]    = useState({
    name:              profile.name             || '',
    email:             profile.email            || '',
    phone:             profile.phone            || '',
    dob:               profile.dob              || '',
    gender:            profile.gender           || '',
    address:           profile.address          || '',
    bloodGroup:        profile.bloodGroup       || '',
    weight:            profile.weight           || '',
    height:            profile.height           || '',
    allergies:         Array.isArray(profile.allergies)
                         ? profile.allergies.join(', ')
                         : (profile.allergies || ''),
    chronic:           profile.chronic          || [],
    emergencyContact:  profile.emergencyContact || '',
    emergencyPhone:    profile.emergencyPhone   || '',
    emergencyRelation: profile.emergencyRelation|| '',
    notifications:     profile.notifications    !== false,
    smsAlerts:         profile.smsAlerts        !== false,
    language:          profile.language         || 'en',
  });
  const [avatarPreview, setAvatarPreview] = useState(profile.avatar || null);
  const fileRef = useRef();

  const age   = calcAge(form.dob);
  const bmi   = calcBMI(form.weight, form.height);
  const score = healthScore({ ...form, allergies: form.allergies ? [form.allergies] : [] });

  useEffect(() => {
    setForm(prev => ({
      ...prev,
      name:       profile.name       || prev.name,
      email:      profile.email      || prev.email,
      bloodGroup: profile.bloodGroup || prev.bloodGroup,
      weight:     profile.weight     || prev.weight,
      height:     profile.height     || prev.height,
    }));
    if (profile.avatar) setAvatarPreview(profile.avatar);
  }, [profile]);

  const set = useCallback((k, v) => setForm(p => ({ ...p, [k]: v })), []);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    set(name, type === 'checkbox' ? checked : value);
  };

  const toggleChronic = c =>
    set('chronic', form.chronic.includes(c)
      ? form.chronic.filter(x => x !== c)
      : [...form.chronic, c]);

  const handleAvatar = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setAvatarPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSave = e => {
    e.preventDefault();
    updateProfile({
      ...form,
      avatar:    avatarPreview,
      allergies: form.allergies.split(',').map(s => s.trim()).filter(Boolean),
    });
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    if (!window.confirm('Clear all profile data? This cannot be undone.')) return;
    clearProfile();
    setAvatarPreview(null);
    setEditing(false);
  };

  const initials = n => (n || 'GU').split(' ').map(x => x[0]).join('').toUpperCase().slice(0, 2);

  const TABS = [
    { id: 'personal',  icon: 'bi-person-fill',            label: 'Personal'  },
    { id: 'medical',   icon: 'bi-heart-pulse-fill',        label: 'Medical'   },
    { id: 'emergency', icon: 'bi-shield-exclamation-fill', label: 'Emergency' },
    { id: 'payments',  icon: 'bi-credit-card-fill',        label: 'Payments'  },
    { id: 'settings',  icon: 'bi-gear-fill',               label: 'Settings'  },
  ];

  const inp = () => ({
    width: '100%', padding: '10px 14px', borderRadius: 10, fontSize: 14,
    border: `1.5px solid ${editing ? '#667eea' : '#e5e7eb'}`,
    background: editing ? '#fff' : '#f9fafb', outline: 'none',
    transition: 'border .2s', boxSizing: 'border-box', color: '#1f2937',
    fontFamily: 'inherit',
  });
  const lbl = { fontSize: 11, fontWeight: 700, color: '#9ca3af', marginBottom: 5,
    display: 'block', textTransform: 'uppercase', letterSpacing: '0.6px' };

  const orders = (() => {
    try { return JSON.parse(localStorage.getItem('symptocare_orders') || '[]').slice(0, 4); }
    catch { return []; }
  })();

  return (
    <div className="view" style={{ background: '#f8faff', minHeight: '100vh' }}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .pf-card { animation: fadeUp .35s ease-out; }
        .pf-tab-btn { transition: all .2s; border:none; cursor:pointer; }
        .pf-tab-btn:hover { opacity:.85; }
        .pf-input:focus { border-color: #667eea !important; box-shadow: 0 0 0 3px rgba(102,126,234,.12); }
        .pf-chip { transition: all .15s; cursor:pointer; user-select:none; }
        .pf-chip:hover { transform: translateY(-1px); }
        .pf-stat:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,.1); }
        .pf-stat { transition: all .2s; }
        .health-ring { transition: stroke-dashoffset .9s cubic-bezier(.4,0,.2,1); }
      `}</style>

      <div className="container-sc py4" style={{ maxWidth: 980 }}>

        {/* ── HERO ───────────────────────────────────────────────────────────── */}
        <div className="pf-card" style={{
          background: 'linear-gradient(135deg,#667eea 0%,#764ba2 100%)',
          borderRadius: 24, padding: '32px 36px', marginBottom: 24,
          color: '#fff', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position:'absolute', top:-60, right:-60, width:200, height:200, borderRadius:'50%', background:'rgba(255,255,255,.07)', pointerEvents:'none' }} />
          <div style={{ position:'absolute', bottom:-40, left:-40, width:160, height:160, borderRadius:'50%', background:'rgba(255,255,255,.05)', pointerEvents:'none' }} />

          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:20, position:'relative', zIndex:1 }}>
            {/* Left: avatar + name */}
            <div style={{ display:'flex', alignItems:'center', gap:20, flexWrap:'wrap' }}>
              <div style={{ position:'relative' }}>
                <div style={{
                  width:96, height:96, borderRadius:'50%',
                  border:'3px solid rgba(255,255,255,.4)',
                  background:'rgba(255,255,255,.15)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  overflow:'hidden', boxShadow:'0 8px 24px rgba(0,0,0,.2)', flexShrink:0,
                }}>
                  {avatarPreview
                    ? <img src={avatarPreview} alt="avatar" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                    : <span style={{ fontSize:36, fontWeight:800 }}>{initials(form.name)}</span>
                  }
                </div>
                {editing && (
                  <button type="button" onClick={() => fileRef.current.click()} style={{
                    position:'absolute', bottom:0, right:0, width:28, height:28,
                    borderRadius:'50%', border:'2px solid #fff', background:'#667eea',
                    color:'#fff', cursor:'pointer', fontSize:12,
                    display:'flex', alignItems:'center', justifyContent:'center',
                  }}>
                    <i className="bi bi-camera-fill" />
                  </button>
                )}
                <input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }} onChange={handleAvatar} />
              </div>

              <div>
                <h2 style={{ margin:0, fontSize:26, fontWeight:800, letterSpacing:'-0.5px' }}>
                  {form.name || 'Your Name'}
                </h2>
                <p style={{ margin:'6px 0 0', opacity:.85, fontSize:13, display:'flex', alignItems:'center', gap:6 }}>
                  <i className="bi bi-envelope" /> {form.email || '—'}
                </p>
                {form.phone && (
                  <p style={{ margin:'3px 0 0', opacity:.8, fontSize:12 }}>
                    <i className="bi bi-telephone" /> {form.phone}
                  </p>
                )}
                <div style={{ display:'flex', gap:7, marginTop:10, flexWrap:'wrap' }}>
                  {form.bloodGroup && <span style={{ fontSize:11, padding:'3px 10px', borderRadius:20, background:'rgba(255,255,255,.2)', fontWeight:700 }}>🩸 {form.bloodGroup}</span>}
                  {age            && <span style={{ fontSize:11, padding:'3px 10px', borderRadius:20, background:'rgba(255,255,255,.2)', fontWeight:700 }}>🎂 {age} yrs</span>}
                  {form.gender    && <span style={{ fontSize:11, padding:'3px 10px', borderRadius:20, background:'rgba(255,255,255,.2)', fontWeight:700, textTransform:'capitalize' }}>{form.gender}</span>}
                </div>
              </div>
            </div>

            {/* Right: health ring + actions */}
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:12 }}>
              <div style={{ position:'relative', width:90, height:90 }}>
                <svg width={90} height={90} viewBox="0 0 90 90">
                  <circle cx="45" cy="45" r="38" fill="none" stroke="rgba(255,255,255,.2)" strokeWidth="7" />
                  <circle className="health-ring" cx="45" cy="45" r="38"
                    fill="none" stroke="#fff" strokeWidth="7" strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 38}
                    strokeDashoffset={2 * Math.PI * 38 * (1 - score / 100)}
                    transform="rotate(-90 45 45)" />
                </svg>
                <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
                  <span style={{ fontWeight:900, fontSize:22, lineHeight:1 }}>{score}</span>
                  <span style={{ fontSize:9, opacity:.75, fontWeight:700, letterSpacing:1 }}>HEALTH</span>
                </div>
              </div>

              <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                {!editing ? (
                  <button type="button" onClick={() => setEditing(true)} style={{
                    padding:'9px 20px', borderRadius:10, border:'none',
                    background:'rgba(255,255,255,.18)', color:'#fff', fontWeight:700,
                    cursor:'pointer', fontSize:13, display:'flex', alignItems:'center', gap:6,
                  }}>
                    <i className="bi bi-pencil-square" /> Edit
                  </button>
                ) : (
                  <>
                    <button type="button" onClick={() => setEditing(false)} style={{
                      padding:'9px 16px', borderRadius:10, border:'1px solid rgba(255,255,255,.35)',
                      background:'transparent', color:'#fff', fontWeight:600, cursor:'pointer', fontSize:13,
                    }}>Cancel</button>
                    <button form="profile-form" type="submit" style={{
                      padding:'9px 18px', borderRadius:10, border:'none',
                      background:'#10b981', color:'#fff', fontWeight:700, cursor:'pointer', fontSize:13,
                    }}>
                      <i className="bi bi-check2" /> Save
                    </button>
                  </>
                )}
              </div>
              {saved && (
                <div style={{ fontSize:12, color:'#a7f3d0', fontWeight:700 }}>
                  <i className="bi bi-check-circle-fill" /> Saved!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── STAT TILES ─────────────────────────────────────────────────────── */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:22 }}>
          {[
            { label:'Wallet',        value:`₹${(balance||0).toLocaleString('en-IN')}`, icon:'bi-wallet2',        color:'#667eea', bg:'rgba(102,126,234,.1)', cb:() => setView?.('wallet') },
            { label:'Orders',        value: orders.length,                              icon:'bi-bag-check-fill', color:'#10b981', bg:'rgba(16,185,129,.1)'  },
            { label:'Profile Score', value:`${score}%`,                                icon:'bi-graph-up-arrow', color:'#f59e0b', bg:'rgba(245,158,11,.1)'  },
            bmi
              ? { label:'BMI',       value: bmi.bmi,                                   icon:'bi-activity',       color: bmi.color, bg:`${bmi.color}18`       }
              : { label:'BMI',       value:'Set data',                                  icon:'bi-activity',       color:'#9ca3af', bg:'#f3f4f6', cb:() => setTab('medical') },
          ].map(s => (
            <div key={s.label} className="pf-stat" onClick={s.cb}
              style={{ background:'#fff', borderRadius:16, padding:'18px 14px', border:'1px solid #f1f5f9',
                boxShadow:'0 1px 6px rgba(0,0,0,.04)', cursor: s.cb ? 'pointer' : 'default',
                display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', gap:8 }}>
              <div style={{ width:44, height:44, borderRadius:12, background:s.bg, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <i className={`bi ${s.icon}`} style={{ fontSize:20, color:s.color }} />
              </div>
              <div style={{ fontWeight:800, fontSize:20, color:'#1f2937' }}>{s.value}</div>
              <div style={{ fontSize:11, color:'#9ca3af', fontWeight:600 }}>{s.label}</div>
              {s.cb && <small style={{ fontSize:10, color:s.color, fontWeight:700 }}>Open →</small>}
            </div>
          ))}
        </div>

        {/* BMI bar */}
        {bmi && (
          <div style={{ background:'#fff', borderRadius:12, padding:'12px 20px', marginBottom:20,
            border:`1.5px solid ${bmi.color}30`, display:'flex', alignItems:'center', gap:16, flexWrap:'wrap' }}>
            <i className="bi bi-heart-pulse-fill" style={{ color:bmi.color, fontSize:20, flexShrink:0 }} />
            <span style={{ fontWeight:700, fontSize:14 }}>BMI {bmi.bmi} <span style={{ color:bmi.color }}>({bmi.cat})</span></span>
            <div style={{ flex:1, minWidth:120, height:7, background:'#f1f5f9', borderRadius:8, overflow:'hidden' }}>
              <div style={{ height:'100%', width:`${Math.min((+bmi.bmi/40)*100,100)}%`, background:bmi.color, borderRadius:8 }} />
            </div>
            <small style={{ fontSize:11, color:'#9ca3af' }}>{form.weight}kg · {form.height}cm{age ? ` · ${age} yrs` : ''}</small>
          </div>
        )}

        {/* ── TABS ─────────────────────────────────────────────────────────────── */}
        <div style={{ display:'flex', gap:4, background:'#fff', borderRadius:16, padding:5, marginBottom:20,
          boxShadow:'0 1px 8px rgba(0,0,0,.05)', overflowX:'auto' }}>
          {TABS.map(t => (
            <button key={t.id} className="pf-tab-btn" onClick={() => setTab(t.id)} style={{
              flex:'1 0 auto', padding:'10px 16px', borderRadius:12,
              background: tab === t.id ? 'linear-gradient(135deg,#667eea,#764ba2)' : 'transparent',
              color: tab === t.id ? '#fff' : '#6b7280',
              fontWeight: tab === t.id ? 700 : 500, fontSize:13,
              display:'flex', alignItems:'center', justifyContent:'center', gap:6, whiteSpace:'nowrap',
            }}>
              <i className={`bi ${t.icon}`} /> {t.label}
            </button>
          ))}
        </div>

        {/* ── FORM ────────────────────────────────────────────────────────────── */}
        <form id="profile-form" onSubmit={handleSave}>
          <div className="pf-card" style={{ background:'#fff', borderRadius:20, padding:'28px 30px',
            boxShadow:'0 2px 12px rgba(0,0,0,.05)', border:'1px solid #f1f5f9' }}>

            {/* PERSONAL */}
            {tab === 'personal' && (
              <>
                <h6 style={{ margin:'0 0 22px', display:'flex', alignItems:'center', gap:8, color:'#1f2937', fontSize:15 }}>
                  <i className="bi bi-person-fill" style={{ color:'#667eea' }} /> Personal Information
                </h6>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:18 }}>
                  {[
                    { name:'name',  label:'Full Name *',    type:'text',  ph:'Your full name',  req:true },
                    { name:'email', label:'Email Address *',type:'email', ph:'you@example.com', req:true },
                    { name:'phone', label:'Phone Number',   type:'tel',   ph:'+91 XXXXX XXXXX'  },
                    { name:'dob',   label:'Date of Birth',  type:'date'                         },
                  ].map(f => (
                    <div key={f.name}>
                      <label style={lbl}>{f.label}</label>
                      <input className="pf-input" type={f.type} name={f.name} value={form[f.name]}
                        onChange={handleChange} disabled={!editing} placeholder={f.ph}
                        required={f.req} style={inp()} />
                    </div>
                  ))}
                  <div>
                    <label style={lbl}>Gender</label>
                    <select name="gender" value={form.gender} onChange={handleChange}
                      disabled={!editing} style={inp()}>
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer-not">Prefer not to say</option>
                    </select>
                  </div>
                  <div>
                    <label style={lbl}>Address</label>
                    <input className="pf-input" type="text" name="address" value={form.address}
                      onChange={handleChange} disabled={!editing}
                      placeholder="Your address" style={inp()} />
                  </div>
                </div>
              </>
            )}

            {/* MEDICAL */}
            {tab === 'medical' && (
              <>
                <h6 style={{ margin:'0 0 22px', display:'flex', alignItems:'center', gap:8, color:'#1f2937', fontSize:15 }}>
                  <i className="bi bi-heart-pulse-fill" style={{ color:'#ef4444' }} /> Medical Information
                </h6>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:18, marginBottom:20 }}>
                  <div>
                    <label style={lbl}>Blood Group</label>
                    <select name="bloodGroup" value={form.bloodGroup} onChange={handleChange}
                      disabled={!editing} style={inp()}>
                      <option value="">— Select —</option>
                      {BLOOD_GROUPS.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={lbl}>Weight (kg)</label>
                    <input className="pf-input" type="number" name="weight" value={form.weight}
                      onChange={handleChange} disabled={!editing}
                      placeholder="e.g. 70" min={20} max={300} style={inp()} />
                  </div>
                  <div>
                    <label style={lbl}>Height (cm)</label>
                    <input className="pf-input" type="number" name="height" value={form.height}
                      onChange={handleChange} disabled={!editing}
                      placeholder="e.g. 170" min={50} max={250} style={inp()} />
                  </div>
                  <div>
                    <label style={lbl}>Known Allergies</label>
                    <input className="pf-input" type="text" name="allergies" value={form.allergies}
                      onChange={handleChange} disabled={!editing}
                      placeholder="Penicillin, Peanuts, Dust…" style={inp()} />
                    <small style={{ color:'#9ca3af', fontSize:11 }}>Comma-separated</small>
                  </div>
                </div>
                <div>
                  <label style={{ ...lbl, marginBottom:10 }}>Chronic Conditions</label>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                    {CHRONIC.map(c => (
                      <span key={c} className="pf-chip" onClick={() => editing && toggleChronic(c)}
                        style={{
                          padding:'7px 16px', borderRadius:20, fontSize:12, fontWeight:600,
                          border:`1.5px solid ${form.chronic.includes(c) ? '#667eea' : '#e5e7eb'}`,
                          background: form.chronic.includes(c) ? 'rgba(102,126,234,.1)' : '#f9fafb',
                          color: form.chronic.includes(c) ? '#667eea' : '#6b7280',
                          opacity: !editing ? .65 : 1,
                        }}>
                        {form.chronic.includes(c) && '✓ '}{c}
                      </span>
                    ))}
                  </div>
                </div>
                {bmi && (
                  <div style={{ marginTop:20, padding:'14px 18px', background:`${bmi.color}0d`,
                    borderRadius:12, border:`1px solid ${bmi.color}30`, display:'flex', alignItems:'center', gap:12 }}>
                    <i className="bi bi-graph-up-arrow" style={{ color:bmi.color, fontSize:22 }} />
                    <div>
                      <div style={{ fontWeight:700, color:'#1f2937', fontSize:14 }}>BMI: {bmi.bmi} — {bmi.cat}</div>
                      <div style={{ fontSize:12, color:'#6b7280' }}>{form.weight}kg · {form.height}cm</div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* EMERGENCY */}
            {tab === 'emergency' && (
              <>
                <h6 style={{ margin:'0 0 22px', display:'flex', alignItems:'center', gap:8, color:'#1f2937', fontSize:15 }}>
                  <i className="bi bi-shield-exclamation-fill" style={{ color:'#ef4444' }} /> Emergency Contact
                </h6>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:18 }}>
                  <div>
                    <label style={lbl}>Contact Name</label>
                    <input className="pf-input" type="text" name="emergencyContact"
                      value={form.emergencyContact} onChange={handleChange}
                      disabled={!editing} placeholder="Full name" style={inp()} />
                  </div>
                  <div>
                    <label style={lbl}>Contact Phone</label>
                    <input className="pf-input" type="tel" name="emergencyPhone"
                      value={form.emergencyPhone} onChange={handleChange}
                      disabled={!editing} placeholder="+91 XXXXX XXXXX" style={inp()} />
                  </div>
                  <div style={{ gridColumn:'span 2' }}>
                    <label style={lbl}>Relationship</label>
                    <input className="pf-input" type="text" name="emergencyRelation"
                      value={form.emergencyRelation} onChange={handleChange}
                      disabled={!editing} placeholder="e.g. Spouse, Parent, Sibling" style={inp()} />
                  </div>
                </div>
                <div style={{ marginTop:20, padding:'14px 18px', background:'#fef9c3', borderRadius:12,
                  borderLeft:'4px solid #f59e0b', display:'flex', gap:10 }}>
                  <i className="bi bi-info-circle-fill" style={{ color:'#d97706', marginTop:2, flexShrink:0 }} />
                  <div style={{ fontSize:13, color:'#92400e' }}>
                    <strong>In case of a medical emergency,</strong> this person will be contacted immediately.
                  </div>
                </div>
                <div style={{ marginTop:22 }}>
                  <label style={lbl}>Quick Emergency Helplines</label>
                  <div style={{ display:'flex', gap:10, flexWrap:'wrap', marginTop:10 }}>
                    {[['108','Ambulance','#ef4444'],['112','Police/Fire','#3b82f6'],['1800-180-1104','Poison Control','#f59e0b']].map(([num,name,color]) => (
                      <a key={num} href={`tel:${num}`} style={{
                        padding:'10px 18px', borderRadius:12, border:`2px solid ${color}`,
                        color, fontWeight:700, textDecoration:'none', fontSize:13,
                        display:'flex', alignItems:'center', gap:6, background:`${color}0d`,
                      }}>
                        <i className="bi bi-telephone-fill" /> {num} — {name}
                      </a>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* PAYMENTS */}
            {tab === 'payments' && (
              <div>
                <h6 style={{ margin:'0 0 22px', display:'flex', alignItems:'center', gap:8, color:'#1f2937', fontSize:15 }}>
                  <i className="bi bi-credit-card-fill" style={{ color:'#667eea' }} /> Payment & Wallet
                </h6>

                {/* Wallet card */}
                <div style={{
                  background:'linear-gradient(135deg,#667eea,#764ba2)',
                  borderRadius:18, padding:'24px 28px', marginBottom:24, color:'#fff',
                  position:'relative', overflow:'hidden',
                }}>
                  <div style={{ position:'absolute', top:-20, right:-20, width:120, height:120, borderRadius:'50%', background:'rgba(255,255,255,.08)', pointerEvents:'none' }} />
                  <div style={{ fontSize:11, opacity:.75, fontWeight:700, textTransform:'uppercase', letterSpacing:1 }}>SymptoCare Wallet</div>
                  <div style={{ fontSize:38, fontWeight:900, margin:'8px 0 4px', letterSpacing:'-1px' }}>
                    ₹{(balance || 0).toLocaleString('en-IN')}
                  </div>
                  <div style={{ fontSize:13, opacity:.8 }}>{form.name || 'Account Holder'}</div>
                  <button type="button" onClick={() => setView?.('wallet')} style={{
                    marginTop:16, padding:'9px 20px', borderRadius:10,
                    border:'2px solid rgba(255,255,255,.4)',
                    background:'rgba(255,255,255,.15)', color:'#fff',
                    fontWeight:700, cursor:'pointer', fontSize:13,
                  }}>
                    <i className="bi bi-plus-circle" /> Add Money
                  </button>
                </div>

                {/* Recent orders */}
                <div style={{ marginBottom:24 }}>
                  <div style={{ fontWeight:700, fontSize:14, color:'#374151', marginBottom:12,
                    display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    Recent Orders
                    <button type="button" onClick={() => setView?.('store')} style={{
                      fontSize:12, color:'#667eea', background:'none', border:'none', cursor:'pointer', fontWeight:600,
                    }}>Shop →</button>
                  </div>
                  {orders.length === 0 ? (
                    <div style={{ textAlign:'center', padding:'28px 0', color:'#9ca3af' }}>
                      <i className="bi bi-bag-x" style={{ fontSize:32, display:'block', marginBottom:8 }} />
                      <p style={{ margin:0, fontSize:13 }}>No orders yet. Start shopping!</p>
                    </div>
                  ) : (
                    orders.map(o => (
                      <div key={o.id} style={{
                        display:'flex', justifyContent:'space-between', alignItems:'center',
                        padding:'12px 14px', background:'#f9fafb', borderRadius:12,
                        marginBottom:8, border:'1px solid #f1f5f9',
                      }}>
                        <div>
                          <div style={{ fontWeight:600, fontSize:13 }}>{o.id}</div>
                          <div style={{ fontSize:11, color:'#9ca3af' }}>{o.date}</div>
                        </div>
                        <div style={{ textAlign:'right' }}>
                          <div style={{ fontWeight:700, color:'#667eea' }}>₹{o.amount?.toLocaleString()}</div>
                          <span style={{ fontSize:10, padding:'2px 8px', borderRadius:20,
                            background:'rgba(16,185,129,.1)', color:'#10b981', fontWeight:600 }}>
                            {o.status || 'Delivered'}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Saved payment methods */}
                <div>
                  <div style={{ fontWeight:700, fontSize:14, color:'#374151', marginBottom:12 }}>Saved Payment Methods</div>
                  {[
                    { icon:'bi-phone-fill',           label:'UPI — GPay',        sub:'username@okicici', color:'#667eea' },
                    { icon:'bi-credit-card-2-back-fill',label:'Visa •••• 4242',  sub:'Expires 06/27',    color:'#10b981' },
                  ].map(m => (
                    <div key={m.label} style={{
                      display:'flex', alignItems:'center', gap:14, padding:'12px 16px',
                      background:'#f9fafb', borderRadius:12, marginBottom:8, border:'1px solid #f1f5f9',
                    }}>
                      <div style={{ width:40, height:40, borderRadius:10, background:`${m.color}15`,
                        display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                        <i className={`bi ${m.icon}`} style={{ color:m.color, fontSize:18 }} />
                      </div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontWeight:600, fontSize:13 }}>{m.label}</div>
                        <div style={{ fontSize:11, color:'#9ca3af' }}>{m.sub}</div>
                      </div>
                      <span style={{ fontSize:10, padding:'3px 9px', borderRadius:20,
                        background:'rgba(16,185,129,.1)', color:'#10b981', fontWeight:600 }}>Active</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SETTINGS */}
            {tab === 'settings' && (
              <>
                <h6 style={{ margin:'0 0 22px', display:'flex', alignItems:'center', gap:8, color:'#1f2937', fontSize:15 }}>
                  <i className="bi bi-gear-fill" style={{ color:'#667eea' }} /> App Settings
                </h6>
                <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                  {[
                    { name:'notifications', label:'Health reminders & alerts', sub:'Email & push notifications',     icon:'bi-bell-fill',      color:'#3b82f6' },
                    { name:'smsAlerts',     label:'SMS order & consult alerts', sub:'Text messages to your phone',   icon:'bi-chat-dots-fill', color:'#10b981' },
                  ].map(s => (
                    <label key={s.name} style={{
                      display:'flex', alignItems:'center', gap:14, padding:'14px 16px',
                      background:'#f9fafb', borderRadius:14, cursor: editing ? 'pointer' : 'default',
                      border:'1px solid #f1f5f9',
                    }}>
                      <div style={{ width:40, height:40, borderRadius:10, background:`${s.color}15`,
                        display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                        <i className={`bi ${s.icon}`} style={{ color:s.color, fontSize:18 }} />
                      </div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontWeight:600, fontSize:13, color:'#1f2937' }}>{s.label}</div>
                        <div style={{ fontSize:11, color:'#9ca3af' }}>{s.sub}</div>
                      </div>
                      {/* Toggle switch */}
                      <div
                        style={{
                          width:44, height:24, borderRadius:12, position:'relative', flexShrink:0,
                          background: form[s.name] ? '#667eea' : '#d1d5db', transition:'background .2s',
                          cursor: editing ? 'pointer' : 'not-allowed',
                        }}
                        onClick={() => editing && set(s.name, !form[s.name])}
                      >
                        <div style={{
                          position:'absolute', top:2, left: form[s.name] ? 22 : 2,
                          width:20, height:20, borderRadius:'50%', background:'#fff',
                          transition:'left .2s', boxShadow:'0 1px 4px rgba(0,0,0,.2)',
                        }} />
                        <input type="checkbox" name={s.name} checked={form[s.name]}
                          onChange={handleChange} style={{ display:'none' }} />
                      </div>
                    </label>
                  ))}

                  <div style={{ padding:'14px 16px', background:'#f9fafb', borderRadius:14, border:'1px solid #f1f5f9' }}>
                    <label style={lbl}>Language Preference</label>
                    <select name="language" value={form.language} onChange={handleChange}
                      disabled={!editing} style={inp()}>
                      <option value="en">English</option>
                      <option value="hi">हिंदी (Hindi)</option>
                      <option value="te">తెలుగు (Telugu)</option>
                      <option value="ta">தமிழ் (Tamil)</option>
                    </select>
                  </div>
                </div>

                {/* Danger zone */}
                <div style={{ marginTop:28, padding:'20px', background:'rgba(239,68,68,.04)',
                  borderRadius:14, border:'1px solid rgba(239,68,68,.15)' }}>
                  <div style={{ fontWeight:700, color:'#dc2626', marginBottom:6, fontSize:14 }}>⚠ Danger Zone</div>
                  <p style={{ fontSize:13, color:'#6b7280', margin:'0 0 14px' }}>
                    Clearing your profile removes all locally stored personal health data.
                  </p>
                  <button type="button" onClick={handleReset} style={{
                    padding:'9px 20px', borderRadius:10, border:'2px solid rgba(239,68,68,.4)',
                    background:'transparent', color:'#ef4444', fontWeight:700, cursor:'pointer', fontSize:13,
                  }}>
                    <i className="bi bi-trash3" /> Clear All Profile Data
                  </button>
                </div>
              </>
            )}
          </div>
        </form>

        {/* Footer strip */}
        <div style={{ marginTop:18, padding:'13px 20px', background:'#fff', borderRadius:12,
          border:'1px solid #f1f5f9', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:10 }}>
          <span style={{ fontSize:12, color:'#9ca3af' }}>
            <i className="bi bi-calendar-check" style={{ marginRight:6 }} />
            Member since {new Date().toLocaleDateString('en-IN', { month:'long', year:'numeric' })}
          </span>
          <div style={{ display:'flex', gap:8 }}>
            {[['bi-shield-check','HIPAA Compliant','#e0e7ff','#667eea'],['bi-lock-fill','Encrypted','#d1fae5','#10b981']].map(([icon,label,bg,color]) => (
              <span key={label} style={{ fontSize:11, padding:'4px 12px', borderRadius:20, background:bg, color, fontWeight:600, display:'flex', alignItems:'center', gap:4 }}>
                <i className={`bi ${icon}`} /> {label}
              </span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}