import { useState } from 'react';
import { Spinner, Modal } from "../components/UI.jsx";

// ─── LAB VIEW ─────────────────────────────────────────────────────────────────
const STATUS_COLORS = {
  success: ['rgba(16,185,129,.1)', 'var(--success)'],
  danger:  ['rgba(239,68,68,.1)',   'var(--danger)'],
  warning: ['rgba(245,158,11,.1)',  'var(--warning)'],
};

function LabField({ id, label, ph, vals, onChange }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label className="form-label">{label}</label>
      <input
        type="number" step="0.1" className="form-control"
        placeholder={ph}
        value={vals[id] || ''}
        onChange={e => onChange(id, e.target.value)}
      />
    </div>
  );
}

export function LabView({ addToast, logVault }) {
  const [vals,    setVals]    = useState({});
  const [results, setResults] = useState(null);
  const [spinning, setSpinning] = useState(false);

  const set = (k, v) => setVals(prev => ({ ...prev, [k]: v }));
  const g   = k => vals[k] || '';

  const processLab = () => {
    setSpinning(true);
    setTimeout(() => {
      const cards = [];
      let score = 100, issues = 0;

      const f = +g('f'), pp = +g('pp'), hba = +g('hba1c');
      if (f || pp || hba) {
        let s = 'NORMAL', c = 'success', r = 'Maintain healthy diet & regular exercise';
        if      (f > 126 || pp > 200 || hba > 6.5) { s = 'DIABETIC';     c = 'danger';  r = 'Consult endocrinologist immediately'; score -= 25; issues++; }
        else if (f > 100 || pp > 140 || hba > 5.7) { s = 'PRE-DIABETIC'; c = 'warning'; r = 'Diet changes & lifestyle modification needed'; score -= 15; issues++; }
        cards.push({ title: 'Metabolic Panel (Diabetes)', s, c, r, vals: `Fasting: ${f||'N/A'} mg/dL | Post-meal: ${pp||'N/A'} mg/dL | HbA1c: ${hba||'N/A'}%` });
        logVault('Lab: Metabolic Panel', s, 'test');
      }

      const sys = +g('sys'), dia = +g('dia'), hr = +g('hr');
      if (sys || dia || hr) {
        let s = 'NORMAL', c = 'success', r = 'Blood pressure is in healthy range';
        if      (sys > 140 || dia > 90) { s = 'HYPERTENSION'; c = 'danger';  r = 'Consult cardiologist, medication required'; score -= 20; issues++; }
        else if (sys > 130 || dia > 80) { s = 'ELEVATED BP';  c = 'warning'; r = 'Monitor BP daily, reduce sodium intake'; score -= 10; issues++; }
        if (hr > 100) r += ' | Heart rate elevated'; if (hr < 60) r += ' | Heart rate low — bradycardia possible';
        cards.push({ title: 'Cardiac Panel (BP & HR)', s, c, r, vals: `BP: ${sys||'N/A'}/${dia||'N/A'} mmHg | HR: ${hr||'N/A'} bpm` });
        logVault('Lab: Cardiac Panel', s, 'test');
      }

      const cre = +g('cre'), alt = +g('alt'), bil = +g('bili');
      if (cre || alt || bil) {
        let s = 'NORMAL', c = 'success', r = 'Kidney & liver function is healthy';
        if      (cre > 1.3 || alt > 56 || bil > 1.2) { s = 'IMPAIRED';   c = 'danger';  r = 'Nephrology/Hepatology consultation required'; score -= 20; issues++; }
        else if (cre > 1.1 || alt > 40)              { s = 'BORDERLINE'; c = 'warning'; r = 'Retest in 2 weeks, increase water intake'; score -= 10; issues++; }
        cards.push({ title: 'Renal & Hepatic Function', s, c, r, vals: `Creatinine: ${cre||'N/A'} | ALT: ${alt||'N/A'} U/L | Bilirubin: ${bil||'N/A'} mg/dL` });
        logVault('Lab: Renal & Hepatic', s, 'test');
      }

      const tc = +g('tc'), ldl = +g('ldl'), hdl = +g('hdl');
      if (tc || ldl || hdl) {
        let s = 'NORMAL', c = 'success', r = 'Cholesterol levels are optimal';
        if      (tc > 240 || ldl > 160) { s = 'HIGH CHOLESTEROL'; c = 'danger';  r = 'Statin therapy & dietary changes recommended'; score -= 20; issues++; }
        else if (tc > 200 || ldl > 130) { s = 'BORDERLINE HIGH';  c = 'warning'; r = 'Mediterranean diet & increased exercise'; score -= 10; issues++; }
        if (hdl < 40) { r += ' | Low HDL — increase aerobic exercise'; score -= 5; }
        cards.push({ title: 'Lipid Profile (Cholesterol)', s, c, r, vals: `Total: ${tc||'N/A'} | LDL: ${ldl||'N/A'} | HDL: ${hdl||'N/A'} mg/dL` });
        logVault('Lab: Lipid Profile', s, 'test');
      }

      score = Math.max(0, score);
      if (cards.length === 0) { addToast('Please enter at least one lab value', 'error'); }
      else if (issues) addToast(`Analysis complete! ${issues} area(s) need attention.`, 'error');
      else addToast('Analysis complete! All checked values look healthy.');

      setResults({ cards, score });
      setSpinning(false);
    }, 2000);
  };

  return (
    <div className="view">
      <Spinner show={spinning} />
      <div className="container-sc py4">
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div className="card-base card-hover-none">
            <div className="section-head">
              <h2><i className="bi bi-clipboard2-pulse me-2 text-blue" />Advanced Diagnostic Lab</h2>
              <p>Enter your lab values for comprehensive AI health analysis</p>
            </div>

            <div className="grid grid-2 mb4">
              <div className="lab-panel">
                <h6 className="mb3"><i className="bi bi-activity me-2 text-danger" />Metabolic Panel (Diabetes)</h6>
                <LabField id="f"     label="Fasting Glucose (mg/dL)"    ph="Normal: 70–100" vals={vals} onChange={set} />
                <LabField id="pp"    label="Post-Meal Glucose (mg/dL)"  ph="Normal: <140"   vals={vals} onChange={set} />
                <LabField id="hba1c" label="HbA1c (%)"                  ph="Normal: <5.7"   vals={vals} onChange={set} />
              </div>
              <div className="lab-panel">
                <h6 className="mb3"><i className="bi bi-heart-pulse me-2 text-blue" />Cardiac Panel</h6>
                <LabField id="sys" label="Systolic BP (mmHg)"  ph="Normal: 90–120"  vals={vals} onChange={set} />
                <LabField id="dia" label="Diastolic BP (mmHg)" ph="Normal: 60–80"   vals={vals} onChange={set} />
                <LabField id="hr"  label="Heart Rate (bpm)"    ph="Normal: 60–100"  vals={vals} onChange={set} />
              </div>
              <div className="lab-panel">
                <h6 className="mb3"><i className="bi bi-droplet-half me-2" style={{ color: 'var(--cyan)' }} />Renal &amp; Hepatic Function</h6>
                <LabField id="cre"  label="Creatinine (mg/dL)" ph="Normal: 0.7–1.3"  vals={vals} onChange={set} />
                <LabField id="alt"  label="ALT (U/L)"           ph="Normal: 7–56"     vals={vals} onChange={set} />
                <LabField id="bili" label="Bilirubin (mg/dL)"   ph="Normal: 0.3–1.2"  vals={vals} onChange={set} />
              </div>
              <div className="lab-panel">
                <h6 className="mb3"><i className="bi bi-pie-chart me-2" style={{ color: 'var(--warning)' }} />Lipid Profile</h6>
                <LabField id="tc"  label="Total Cholesterol (mg/dL)" ph="Normal: <200"  vals={vals} onChange={set} />
                <LabField id="ldl" label="LDL – Bad (mg/dL)"         ph="Normal: <100"  vals={vals} onChange={set} />
                <LabField id="hdl" label="HDL – Good (mg/dL)"        ph="Normal: >40"   vals={vals} onChange={set} />
              </div>
            </div>

            <div className="text-center">
              <button className="btn-primary" onClick={processLab}>
                <i className="bi bi-clipboard2-pulse" />Generate Complete Health Report
              </button>
            </div>

            {results && results.cards.length > 0 && (
              <div className="mt5">
                <div className="divider mb4" />
                <h5 className="mb3">Comprehensive Health Report</h5>
                <div className="grid grid-2">
                  {results.cards.map((card, i) => {
                    const [bg, color] = STATUS_COLORS[card.c] || STATUS_COLORS.success;
                    return (
                      <div key={i} className="card-base card-hover-none" style={{ borderColor: color }}>
                        <div className="flex-between mb3 flex-wrap gap-2">
                          <h6 style={{ margin: 0 }}>{card.title}</h6>
                          <span style={{ background: bg, color, padding: '4px 12px', borderRadius: 8, fontWeight: 700, fontSize: '.78rem' }}>{card.s}</span>
                        </div>
                        <p className="small text-muted mb2">{card.vals}</p>
                        <p className="small text-muted" style={{ margin: 0 }}>
                          <i className="bi bi-lightbulb me-1" style={{ color: 'var(--warning)' }} />
                          <strong>Recommendation:</strong> {card.r}
                        </p>
                      </div>
                    );
                  })}
                </div>
                <div className="bg-grad-soft rounded-custom mt4" style={{ padding: 20 }}>
                  <h6 className="text-blue mb2"><i className="bi bi-activity me-2" />Overall Health Score</h6>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div className="prog-bar-wrap" style={{ flex: 1 }}>
                      <div className="prog-bar-fill" style={{
                        width: `${results.score}%`,
                        background: results.score < 60 ? 'linear-gradient(90deg,var(--danger),var(--warning))'
                          : results.score < 80 ? 'linear-gradient(90deg,var(--warning),#eab308)' : 'var(--grad)',
                      }} />
                    </div>
                    <span style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'Space Grotesk', color: 'var(--blue)' }}>{results.score}%</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── HEALTH TRACKER VIEW ──────────────────────────────────────────────────────
const METRIC_CONFIG = [
  { key:'water', icon:'bi-droplet-fill',    color:'var(--cyan)',    label:'Glasses of Water', isInc: true },
  { key:'cal',   icon:'bi-fire',            color:'var(--warning)', label:'Calories',         prompt:'Calories consumed:'  },
  { key:'steps', icon:'bi-bicycle',         color:'var(--success)', label:'Steps',            prompt:'Steps walked:'       },
  { key:'sleep', icon:'bi-moon-stars-fill', color:'var(--purple)',  label:'Hrs Sleep',        prompt:'Hours slept:'        },
];

const WEEKLY_GOALS = [
  ['Exercise (150 min/week)', '60%'],
  ['Water (56 glasses/week)', '75%'],
  ['Sleep (49 hrs/week)',      '85%'],
  ['Steps (70,000/week)',      '40%'],
];

export function HealthView({ addToast, logVault }) {
  const [metrics,    setMetrics]    = useState({ water: 0, cal: 0, steps: 0, sleep: 0 });
  const [reminders,  setReminders]  = useState([]);
  const [showModal,  setShowModal]  = useState(false);
  const [newMed,     setNewMed]     = useState({ name: '', time: '' });

  const inc = key => {
    setMetrics(prev => ({ ...prev, [key]: prev[key] + 1 }));
    addToast(key.charAt(0).toUpperCase() + key.slice(1) + ' updated!');
  };
  const logMetric = (key, promptLabel) => {
    const v = window.prompt(promptLabel);
    if (!v || isNaN(v)) return;
    setMetrics(prev => ({ ...prev, [key]: parseFloat((prev[key] + parseFloat(v)).toFixed(1)) }));
    addToast('Logged successfully!');
  };

  const addReminder = () => {
    if (!newMed.name) return;
    setReminders(prev => [...prev, { name: newMed.name, time: newMed.time || '9:00 AM' }]);
    setNewMed({ name: '', time: '' });
    setShowModal(false);
    addToast('Medication reminder added!');
  };

  return (
    <div className="view">
      <div className="container-sc py4">
        <div className="section-head">
          <h2><i className="bi bi-graph-up-arrow me-2 text-blue" />Personal Health Tracker</h2>
          <p>Monitor your daily vitals, medications &amp; wellness goals</p>
        </div>

        {/* Metric cards */}
        <div className="grid grid-4 mb5">
          {METRIC_CONFIG.map(m => {
            const val = metrics[m.key];
            const display = Number.isInteger(val) ? val : val.toFixed(1);
            return (
              <div key={m.key} className="metric-card">
                <i className={`bi ${m.icon}`} style={{ fontSize: '2rem', color: m.color, display: 'block', marginBottom: 8 }} />
                <div className="metric-num">{display}</div>
                <p className="small text-muted mb2">{m.label}</p>
                <button className="btn-sm-blue"
                  onClick={() => m.isInc ? inc(m.key) : logMetric(m.key, m.prompt)}>
                  {m.isInc ? '+ Add' : 'Log'}
                </button>
              </div>
            );
          })}
        </div>

        <div className="grid grid-2">
          {/* Reminders */}
          <div className="card-base card-hover-none">
            <h5 className="mb4"><i className="bi bi-alarm me-2 text-blue" />Medication Reminders</h5>
            {reminders.length === 0 ? (
              <p className="text-muted text-center" style={{ padding: '20px 0' }}>
                <i className="bi bi-capsule" style={{ display: 'block', fontSize: '2rem', marginBottom: 8 }} />
                No medications scheduled
              </p>
            ) : reminders.map((r, i) => (
              <div key={i} className="apt-card flex-start">
                <i className="bi bi-capsule text-blue" style={{ fontSize: '1.4rem' }} />
                <div style={{ flex: 1 }}>
                  <strong>{r.name}</strong>
                  <p className="small text-muted" style={{ margin: 0 }}>Daily at {r.time}</p>
                </div>
                <i className="bi bi-bell-fill text-blue" />
              </div>
            ))}
            <button className="btn-outline btn-full mt3" style={{ borderRadius: 20 }} onClick={() => setShowModal(true)}>
              <i className="bi bi-plus-circle" />Add Medication
            </button>
          </div>

          {/* Weekly goals */}
          <div className="card-base card-hover-none">
            <h5 className="mb4"><i className="bi bi-trophy-fill me-2" style={{ color: 'var(--warning)' }} />Weekly Health Goals</h5>
            {WEEKLY_GOALS.map(([label, pct]) => (
              <div key={label} style={{ marginBottom: 14 }}>
                <div className="flex-between mb1">
                  <span className="small fw-600">{label}</span>
                  <span className="small fw-bold text-blue">{pct}</span>
                </div>
                <div className="prog-bar-wrap"><div className="prog-bar-fill" style={{ width: pct }} /></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add medication modal */}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        title='<i class="bi bi-capsule me-2 text-blue"></i>Add Medication'
        footer={
          <>
            <button className="btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
            <button className="btn-primary" onClick={addReminder}><i className="bi bi-plus-circle" />Add</button>
          </>
        }
      >
        <div style={{ marginBottom: 14 }}>
          <label className="form-label">Medication Name</label>
          <input type="text" className="form-control" placeholder="e.g. Metformin 500mg"
            value={newMed.name} onChange={e => setNewMed(p => ({ ...p, name: e.target.value }))} />
        </div>
        <div>
          <label className="form-label">Time</label>
          <input type="text" className="form-control" placeholder="e.g. 9:00 AM"
            value={newMed.time} onChange={e => setNewMed(p => ({ ...p, time: e.target.value }))} />
        </div>
      </Modal>
    </div>
  );
}