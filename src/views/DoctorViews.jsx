import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
// Add this import with your other imports
import WalletView from '../views/WalletView.jsx';

// ─── DOCTORS DATA ─────────────────────────────────────────────────────────────
const DOCTORS = [
  {
    id: 1, name: 'Dr. Sarah Johnson', spec: 'General Physician',
    img: 'https://api.dicebear.com/7.x/personas/svg?seed=sarah',
    rating: 4.9, reviews: 312, exp: '8 yrs', lang: 'EN, HI',
    status: 'online', rate: 8, nextAvailable: null,
    skills: ['Diabetes', 'Hypertension', 'Preventive Care'],
    bio: 'Specializes in preventive care and chronic disease management.',
    slots: ['9:00 AM', '10:00 AM', '2:00 PM', '3:00 PM'], taken: ['10:00 AM'],
    waitTime: 2, consultCount: 1840, successRate: 98,
    reviewsList: [
      { author: 'Asha R.', rating: 5, text: 'Very thorough and attentive.', date: '2 days ago' },
      { author: 'Raj M.', rating: 5, text: 'Quick to respond, great advice.', date: '1 week ago' },
    ],
  },
  {
    id: 2, name: 'Dr. Michael Chen', spec: 'Cardiologist',
    img: 'https://api.dicebear.com/7.x/personas/svg?seed=michael',
    rating: 4.8, reviews: 189, exp: '12 yrs', lang: 'EN',
    status: 'busy', rate: 13, nextAvailable: '3:00 PM',
    skills: ['ECG', 'Arrhythmia', 'Heart Failure'],
    bio: 'Board-certified cardiologist with expertise in interventional cardiology.',
    slots: ['11:00 AM', '1:00 PM', '4:00 PM'], taken: ['1:00 PM'],
    waitTime: 18, consultCount: 2100, successRate: 97,
    reviewsList: [{ author: 'Priya K.', rating: 5, text: 'Outstanding cardiologist.', date: '3 days ago' }],
  },
  {
    id: 3, name: 'Dr. Emily Parker', spec: 'Dermatologist',
    img: 'https://api.dicebear.com/7.x/personas/svg?seed=emily',
    rating: 4.7, reviews: 245, exp: '6 yrs', lang: 'EN',
    status: 'online', rate: 10, nextAvailable: null,
    skills: ['Acne', 'Eczema', 'Skin Cancer Screening'],
    bio: 'Expert in medical and cosmetic dermatology.',
    slots: ['9:30 AM', '11:30 AM', '3:30 PM'], taken: [],
    waitTime: 5, consultCount: 980, successRate: 96,
    reviewsList: [{ author: 'Meena J.', rating: 5, text: 'Wonderful doctor.', date: '5 days ago' }],
  },
  {
    id: 4, name: 'Dr. Robert Kumar', spec: 'Neurologist',
    img: 'https://api.dicebear.com/7.x/personas/svg?seed=robert',
    rating: 4.6, reviews: 134, exp: '15 yrs', lang: 'EN, TE',
    status: 'offline', rate: 15, nextAvailable: 'Tomorrow 10 AM',
    skills: ['Migraine', 'Epilepsy', 'Stroke'],
    bio: 'Senior neurologist with extensive experience in complex neurological conditions.',
    slots: ['10:30 AM', '2:30 PM'], taken: ['2:30 PM'],
    waitTime: null, consultCount: 3200, successRate: 99,
    reviewsList: [{ author: 'Vikram S.', rating: 5, text: 'Very detailed and patient.', date: '1 week ago' }],
  },
  {
    id: 5, name: 'Dr. Priya Nair', spec: 'Pediatrician',
    img: 'https://api.dicebear.com/7.x/personas/svg?seed=priya',
    rating: 4.9, reviews: 401, exp: '10 yrs', lang: 'EN, TA, ML',
    status: 'online', rate: 9, nextAvailable: null,
    skills: ['Vaccination', 'Growth', 'Nutrition'],
    bio: 'Compassionate pediatrician with a special interest in child nutrition.',
    slots: ['8:00 AM', '9:00 AM', '11:00 AM', '3:00 PM'], taken: ['8:00 AM'],
    waitTime: 0, consultCount: 4500, successRate: 99,
    reviewsList: [{ author: 'Divya P.', rating: 5, text: 'My kids love her!', date: '1 day ago' }],
  },
  {
    id: 6, name: 'Dr. Arjun Mehta', spec: 'Orthopedist',
    img: 'https://api.dicebear.com/7.x/personas/svg?seed=arjun',
    rating: 4.7, reviews: 178, exp: '9 yrs', lang: 'EN, HI, GU',
    status: 'busy', rate: 12, nextAvailable: '2:00 PM',
    skills: ['Joint Replacement', 'Sports Injury', 'Fractures'],
    bio: 'Orthopedic surgeon specializing in minimally invasive procedures.',
    slots: ['10:00 AM', '1:00 PM', '4:00 PM'], taken: ['10:00 AM', '4:00 PM'],
    waitTime: 25, consultCount: 1560, successRate: 97,
    reviewsList: [{ author: 'Anil B.', rating: 5, text: 'Fixed my knee perfectly.', date: '4 days ago' }],
  },
  {
    id: 7, name: 'Dr. Lakshmi Rao', spec: 'Psychiatrist',
    img: 'https://api.dicebear.com/7.x/personas/svg?seed=lakshmi',
    rating: 4.8, reviews: 203, exp: '11 yrs', lang: 'EN, TE, KA',
    status: 'online', rate: 14, nextAvailable: null,
    skills: ['Anxiety', 'Depression', 'CBT'],
    bio: 'Licensed psychiatrist offering evidence-based therapy.',
    slots: ['9:00 AM', '12:00 PM', '3:00 PM', '5:00 PM'], taken: ['9:00 AM'],
    waitTime: 8, consultCount: 2800, successRate: 98,
    reviewsList: [{ author: 'Sana K.', rating: 5, text: 'Changed my life.', date: '3 days ago' }],
  },
  {
    id: 8, name: 'Dr. Omar Sheikh', spec: 'Cardiologist',
    img: 'https://api.dicebear.com/7.x/personas/svg?seed=omar',
    rating: 4.5, reviews: 99, exp: '7 yrs', lang: 'EN, UR',
    status: 'online', rate: 11, nextAvailable: null,
    skills: ['Echocardiography', 'Chest Pain', 'Hypertension'],
    bio: 'Cardiologist focusing on non-invasive cardiac diagnostics.',
    slots: ['10:00 AM', '2:00 PM', '4:30 PM'], taken: [],
    waitTime: 3, consultCount: 720, successRate: 95,
    reviewsList: [{ author: 'Farida M.', rating: 5, text: 'Very professional and thorough.', date: '6 days ago' }],
  },
];

const NEARBY_HOSPITALS_DB = {
  default: [
    {
      id: 'h1', name: 'Apollo Hospitals', address: '6-3-898, Somajiguda', distance: 1.2,
      rating: 4.6, beds: 720, emergency: true, type: 'Multi-specialty',
      phone: '040-23607777', openNow: true,
      facilities: ['ICU', 'MRI', 'CT Scan', 'Dialysis', 'Blood Bank'],
      departments: ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'General Medicine', 'Dermatology', 'Psychiatry'],
      doctors: [
        { name: 'Dr. Ravi Sharma', spec: 'Cardiologist', slots: ['10:00 AM', '11:30 AM', '3:00 PM', '4:30 PM'], taken: ['11:30 AM'], rating: 4.8, fee: 800 },
        { name: 'Dr. Ananya Reddy', spec: 'Neurologist', slots: ['9:30 AM', '11:00 AM', '2:30 PM'], taken: [], rating: 4.7, fee: 900 },
        { name: 'Dr. Suresh Babu', spec: 'General Medicine', slots: ['9:00 AM', '10:30 AM', '12:00 PM', '3:30 PM'], taken: ['9:00 AM'], rating: 4.5, fee: 500 },
        { name: 'Dr. Preethi Nair', spec: 'Pediatrics', slots: ['10:00 AM', '11:00 AM', '2:00 PM'], taken: ['10:00 AM'], rating: 4.9, fee: 600 },
      ],
    },
    {
      id: 'h2', name: 'KIMS Hospital', address: '1-8-31/1, Minister Road', distance: 2.1,
      rating: 4.4, beds: 550, emergency: true, type: 'Multi-specialty',
      phone: '040-44885000', openNow: true,
      facilities: ['ICU', 'MRI', 'Operation Theatre', 'Pharmacy', 'Lab'],
      departments: ['Orthopedics', 'Cardiology', 'Oncology', 'General Surgery', 'ENT'],
      doctors: [
        { name: 'Dr. Kiran Kumar', spec: 'Orthopedics', slots: ['9:00 AM', '10:30 AM', '2:00 PM', '4:00 PM'], taken: ['2:00 PM'], rating: 4.6, fee: 700 },
        { name: 'Dr. Swathi Rao', spec: 'Cardiology', slots: ['10:00 AM', '12:00 PM', '3:00 PM'], taken: [], rating: 4.7, fee: 850 },
        { name: 'Dr. Mohan Das', spec: 'General Surgery', slots: ['9:30 AM', '11:00 AM', '3:30 PM'], taken: ['9:30 AM'], rating: 4.4, fee: 600 },
      ],
    },
    {
      id: 'h3', name: 'Yashoda Hospitals', address: 'Raj Bhavan Road, Somajiguda', distance: 3.0,
      rating: 4.5, beds: 450, emergency: true, type: 'Multi-specialty',
      phone: '040-45674567', openNow: true,
      facilities: ['ICU', 'CT Scan', 'NICU', 'Cath Lab', 'Blood Bank'],
      departments: ['Gynecology', 'Cardiology', 'Neurology', 'Pediatrics', 'Urology'],
      doctors: [
        { name: 'Dr. Meena Iyer', spec: 'Gynecology', slots: ['9:00 AM', '11:00 AM', '2:00 PM', '4:00 PM'], taken: ['11:00 AM'], rating: 4.8, fee: 650 },
        { name: 'Dr. Rahul Verma', spec: 'Cardiology', slots: ['10:30 AM', '1:00 PM', '3:30 PM'], taken: [], rating: 4.5, fee: 800 },
        { name: 'Dr. Sunita Singh', spec: 'Pediatrics', slots: ['9:30 AM', '11:30 AM', '2:30 PM'], taken: ['2:30 PM'], rating: 4.6, fee: 550 },
      ],
    },
    {
      id: 'h4', name: 'Care Hospitals', address: 'Exhibition Road, Nampally', distance: 4.5,
      rating: 4.3, beds: 320, emergency: false, type: 'General Hospital',
      phone: '040-30419999', openNow: true,
      facilities: ['X-Ray', 'Lab', 'Pharmacy', 'ECG', 'Ultrasound'],
      departments: ['General Medicine', 'ENT', 'Ophthalmology', 'Dermatology'],
      doctors: [
        { name: 'Dr. Vijay Kumar', spec: 'General Medicine', slots: ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM'], taken: [], rating: 4.3, fee: 400 },
        { name: 'Dr. Rekha Pillai', spec: 'Dermatology', slots: ['10:30 AM', '12:00 PM', '3:00 PM'], taken: ['12:00 PM'], rating: 4.4, fee: 550 },
        { name: 'Dr. Ashok Jain', spec: 'ENT', slots: ['9:30 AM', '11:30 AM', '2:30 PM', '4:30 PM'], taken: [], rating: 4.2, fee: 500 },
      ],
    },
    {
      id: 'h5', name: 'Medicover Hospitals', address: 'HITEC City, Madhapur', distance: 6.8,
      rating: 4.5, beds: 400, emergency: true, type: 'Multi-specialty',
      phone: '040-68100100', openNow: false,
      facilities: ['ICU', 'MRI', 'PET CT', 'Robotic Surgery', 'IVF'],
      departments: ['Oncology', 'Cardiology', 'Orthopedics', 'Fertility', 'Neurology'],
      doctors: [
        { name: 'Dr. Arun Gupta', spec: 'Oncology', slots: ['10:00 AM', '1:00 PM', '4:00 PM'], taken: ['10:00 AM'], rating: 4.7, fee: 1200 },
        { name: 'Dr. Neha Sharma', spec: 'Fertility', slots: ['9:00 AM', '11:00 AM', '3:00 PM'], taken: [], rating: 4.6, fee: 900 },
      ],
    },
  ],
};

const PURPOSE_OPTIONS = [
  { value: 'general', label: 'General Check-up', icon: '🩺', specs: ['General Medicine', 'General Physician'] },
  { value: 'heart', label: 'Heart / Chest Issue', icon: '❤️', specs: ['Cardiology', 'Cardiologist'] },
  { value: 'child', label: 'Child / Pediatric Care', icon: '👶', specs: ['Pediatrics', 'Pediatrician'] },
  { value: 'bone', label: 'Bone / Joint Pain', icon: '🦴', specs: ['Orthopedics', 'Orthopedist'] },
  { value: 'skin', label: 'Skin / Hair Issue', icon: '🧴', specs: ['Dermatology', 'Dermatologist'] },
  { value: 'brain', label: 'Brain / Nerve Issue', icon: '🧠', specs: ['Neurology', 'Neurologist'] },
  { value: 'mental', label: 'Mental Health', icon: '🧘', specs: ['Psychiatry', 'Psychiatrist'] },
  { value: 'women', label: "Women's Health", icon: '👩', specs: ['Gynecology'] },
  { value: 'ent', label: 'Ear / Nose / Throat', icon: '👂', specs: ['ENT'] },
  { value: 'eye', label: 'Eye Care', icon: '👁️', specs: ['Ophthalmology'] },
  { value: 'emergency', label: 'Emergency / Urgent', icon: '🚨', specs: [] },
  { value: 'other', label: 'Other / Not Sure', icon: '❓', specs: ['General Medicine', 'General Physician'] },
];

const SPECIALTIES = [
  'All Specialties', 'Cardiologist', 'Dermatologist', 'General Physician',
  'Neurologist', 'Pediatrician', 'Orthopedist', 'Psychiatrist',
];

const SYMPTOM_MAP = {
  'chest pain': { spec: 'Cardiologist', urgency: 'high', advice: 'Seek immediate care. Could indicate cardiac event.' },
  'headache': { spec: 'Neurologist', urgency: 'medium', advice: 'Could be tension, migraine, or other. Monitor frequency.' },
  'skin rash': { spec: 'Dermatologist', urgency: 'low', advice: 'Avoid scratching. Note any new products or allergens.' },
  'fever': { spec: 'General Physician', urgency: 'medium', advice: 'Stay hydrated. Monitor temperature. Seek care if above 103°F.' },
  'anxiety': { spec: 'Psychiatrist', urgency: 'medium', advice: 'Practice deep breathing. Consider speaking to a mental health professional.' },
  'joint pain': { spec: 'Orthopedist', urgency: 'medium', advice: 'Rest the joint. Apply ice. Avoid strenuous activity.' },
  'child fever': { spec: 'Pediatrician', urgency: 'high', advice: 'Monitor closely in children. Seek immediate care if under 3 months old.' },
  'palpitations': { spec: 'Cardiologist', urgency: 'high', advice: 'Note frequency and duration. Avoid caffeine and stimulants.' },
  'acne': { spec: 'Dermatologist', urgency: 'low', advice: 'Gentle cleansing twice daily. Avoid touching face.' },
  'depression': { spec: 'Psychiatrist', urgency: 'medium', advice: 'Reach out to a mental health professional. You are not alone.' },
};

const PRESCRIPTIONS = [
  { id: 1, doc: 'Dr. Sarah Johnson', date: 'Jan 20, 2026', medications: ['Metformin 500mg', 'Lisinopril 10mg'], refillable: true, expiry: 'Mar 20, 2026' },
  { id: 2, doc: 'Dr. Michael Chen', date: 'Dec 15, 2025', medications: ['Atorvastatin 20mg'], refillable: false, expiry: 'Expired' },
];

const HEALTH_METRICS = [
  { label: 'BP', value: '120/80', unit: 'mmHg', icon: 'bi-heart-pulse', trend: 'stable', color: 'var(--success)' },
  { label: 'Heart Rate', value: '72', unit: 'bpm', icon: 'bi-activity', trend: 'up', color: 'var(--blue)' },
  { label: 'Blood Sugar', value: '95', unit: 'mg/dL', icon: 'bi-droplet', trend: 'down', color: 'var(--warning)' },
  { label: 'SpO2', value: '98', unit: '%', icon: 'bi-lungs', trend: 'stable', color: 'var(--success)' },
];

// Global wallet state
let userWallet = {
  balance: 2500,
  currency: '₹',
  transactions: []
};

// ─── SHARED STYLES ────────────────────────────────────────────────────────────
const S = {
  card: { background: '#fff', border: '1px solid rgba(0,0,0,.08)', borderRadius: 14, padding: '1rem' },
  label: { fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '.06em', display: 'block', marginBottom: 6 },
  input: { width: '100%', borderRadius: 8, border: '1px solid rgba(0,0,0,.12)', padding: '8px 12px', fontSize: 13, boxSizing: 'border-box', fontFamily: 'inherit', outline: 'none', transition: 'border-color .15s' },
  btnPrimary: { padding: '9px 20px', borderRadius: 8, border: 'none', cursor: 'pointer', background: 'var(--blue)', color: '#fff', fontSize: 13, fontWeight: 600, transition: 'opacity .15s, transform .1s' },
  btnOutline: { padding: '8px 16px', borderRadius: 8, border: '1px solid rgba(0,0,0,.15)', background: '#fff', cursor: 'pointer', fontSize: 13, transition: 'background .15s' },
  btnDanger: { padding: '9px 20px', borderRadius: 8, border: 'none', cursor: 'pointer', background: 'var(--danger)', color: '#fff', fontSize: 13, fontWeight: 600 },
};

// ─── MODAL ────────────────────────────────────────────────────────────────────
function Modal({ show, onClose, title, children, footer, wide, noPad }) {
  useEffect(() => {
    const h = e => { if (e.key === 'Escape') onClose(); };
    if (show) document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [show, onClose]);
  if (!show) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
      backdropFilter: 'blur(4px)', animation: 'fadeIn .15s ease' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: '#fff', borderRadius: 18, maxWidth: wide ? 820 : 520, width: '100%',
        maxHeight: '94vh', overflowY: 'auto', boxShadow: '0 24px 80px rgba(0,0,0,.25)',
        animation: 'slideUp .2s ease' }}>
        {title && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '1rem 1.25rem', borderBottom: '1px solid rgba(0,0,0,.08)', position: 'sticky', top: 0, background: '#fff', zIndex: 1, borderRadius: '18px 18px 0 0' }}>
            <div style={{ fontWeight: 700, fontSize: 15 }} dangerouslySetInnerHTML={{ __html: title }} />
            <button onClick={onClose} style={{ background: 'rgba(0,0,0,.06)', border: 'none', cursor: 'pointer', fontSize: 16, color: '#9CA3AF', width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background .15s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,.1)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,.06)'}>✕</button>
          </div>
        )}
        <div style={{ padding: noPad ? 0 : '1rem 1.25rem' }}>{children}</div>
        {footer && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '1rem 1.25rem',
            borderTop: '1px solid rgba(0,0,0,.08)', position: 'sticky', bottom: 0, background: '#fff', borderRadius: '0 0 18px 18px' }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── TOAST ────────────────────────────────────────────────────────────────────
function ToastContainer({ toasts }) {
  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 2000, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          background: t.type === 'error' ? '#7f1d1d' : t.type === 'success' ? '#064e3b' : '#1e293b',
          color: '#fff', padding: '12px 18px', borderRadius: 12, fontSize: 13, maxWidth: 340,
          boxShadow: '0 8px 24px rgba(0,0,0,.25)', animation: 'slideIn .25s cubic-bezier(.34,1.56,.64,1)',
          display: 'flex', alignItems: 'center', gap: 10, borderLeft: `3px solid ${t.type === 'error' ? '#ef4444' : t.type === 'success' ? '#10b981' : '#60a5fa'}`,
        }}>
          <span>{t.type === 'error' ? '⚠' : t.type === 'success' ? '✓' : 'ℹ'}</span>
          <span>{t.msg}</span>
        </div>
      ))}
    </div>
  );
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const stars = r => '★'.repeat(Math.floor(r)) + '☆'.repeat(5 - Math.floor(r));
const statusMeta = s => ({
  online: { label: 'Available', dot: '#10b981', badge: { background: 'rgba(16,185,129,.12)', color: '#059669' } },
  busy: { label: 'In Session', dot: '#f59e0b', badge: { background: 'rgba(245,158,11,.12)', color: '#d97706' } },
  offline: { label: 'Offline', dot: '#9CA3AF', badge: { background: 'rgba(156,163,175,.12)', color: '#6B7280' } },
}[s]);

function Avatar({ src, name, size = 52, pulse }) {
  const initials = name.split(' ').filter(Boolean).map(w => w[0]).join('').slice(0, 2);
  return (
    <div style={{ position: 'relative', flexShrink: 0, width: size, height: size }}>
      <div style={{ width: size, height: size, borderRadius: '50%', background: 'rgba(14,165,233,.12)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.3,
        fontWeight: 600, color: 'var(--blue)', overflow: 'hidden',
        border: pulse ? '2.5px solid #10b981' : '2px solid rgba(0,0,0,.08)',
        boxShadow: pulse ? '0 0 0 4px rgba(16,185,129,.15)' : 'none',
        transition: 'box-shadow .3s' }}>
        <img src={src} alt={name} width={size} height={size} style={{ borderRadius: '50%', objectFit: 'cover' }}
          onError={e => { e.target.style.display = 'none'; e.target.insertAdjacentHTML('afterend', `<span style="font-size:${size*0.3}px;font-weight:600;color:var(--blue)">${initials}</span>`); }} />
      </div>
      {pulse && <span style={{ position: 'absolute', bottom: 1, right: 1, width: 11, height: 11, borderRadius: '50%',
        background: '#10b981', border: '2px solid #fff', animation: 'pulse 2s infinite' }} />}
    </div>
  );
}

function SkillTag({ label }) {
  return <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, background: 'rgba(14,165,233,.08)',
    color: 'var(--blue)', border: '1px solid rgba(14,165,233,.2)', fontWeight: 500 }}>{label}</span>;
}

function StatusBadge({ status }) {
  const m = statusMeta(status);
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11,
      padding: '3px 9px', borderRadius: 20, fontWeight: 600, ...m.badge }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: m.dot, flexShrink: 0, animation: status === 'online' ? 'pulse 2s infinite' : 'none' }} />
      {m.label}
    </span>
  );
}

function WaitBadge({ wait }) {
  if (wait === null || wait === undefined) return null;
  const color = wait === 0 ? '#059669' : wait < 10 ? 'var(--blue)' : '#d97706';
  return <span style={{ fontSize: 10, color, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 3 }}>
    {wait === 0 ? '⚡ Now' : `~${wait}m wait`}
  </span>;
}

function UrgencyBadge({ level }) {
  const map = {
    high: { bg: 'rgba(239,68,68,.1)', color: '#dc2626', label: '⚠ High Urgency' },
    medium: { bg: 'rgba(245,158,11,.1)', color: '#d97706', label: '● Medium' },
    low: { bg: 'rgba(16,185,129,.1)', color: '#059669', label: '✓ Low' },
  };
  const m = map[level];
  return <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: m.bg, color: m.color, fontWeight: 700 }}>{m.label}</span>;
}

function StepIndicator({ steps, current }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
      {steps.map((s, i) => (
        <div key={s} style={{ display: 'flex', alignItems: 'center', flex: i < steps.length - 1 ? 1 : 0 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{
              width: 30, height: 30, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700, flexShrink: 0, transition: 'all .3s',
              background: i < current ? '#10b981' : i === current ? 'var(--blue)' : 'rgba(0,0,0,.06)',
              color: i <= current ? '#fff' : '#9CA3AF',
              boxShadow: i === current ? '0 0 0 4px rgba(14,165,233,.2)' : 'none',
            }}>
              {i < current ? '✓' : i + 1}
            </div>
            <span style={{ fontSize: 9, color: i === current ? 'var(--blue)' : i < current ? '#10b981' : '#9CA3AF', fontWeight: 600,
              textTransform: 'uppercase', letterSpacing: '.04em', whiteSpace: 'nowrap' }}>{s}</span>
          </div>
          {i < steps.length - 1 && (
            <div style={{ flex: 1, height: 2, borderRadius: 2,
              background: i < current ? '#10b981' : 'rgba(0,0,0,.08)',
              margin: '0 6px', marginBottom: 16, transition: 'background .4s' }} />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── ENHANCED VIDEO CALL ──────────────────────────────────────────────────────
function VideoCall({ doctor, patientName, onEndCall }) {
  const [localStream, setLocalStream] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'doctor', text: `Hello ${patientName}! I can see you clearly. How are you feeling today?`, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isPipMode, setIsPipMode] = useState(false);
  const [networkQuality, setNetworkQuality] = useState('good');
  const [isRecording, setIsRecording] = useState(false);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [notes, setNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);
  const localVideoRef = useRef(null);
  const durationIntervalRef = useRef(null);

  useEffect(() => {
    durationIntervalRef.current = setInterval(() => setCallDuration(prev => prev + 1), 1000);
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        setLocalStream(stream);
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      })
      .catch(() => {});
    // Simulate network quality changes
    const netInterval = setInterval(() => {
      const q = ['good', 'good', 'good', 'fair', 'good'][Math.floor(Math.random() * 5)];
      setNetworkQuality(q);
    }, 8000);
    return () => {
      clearInterval(durationIntervalRef.current);
      clearInterval(netInterval);
      if (localStream) localStream.getTracks().forEach(t => t.stop());
    };
  }, []);

  const toggleMute = () => {
    if (localStream) {
      const track = localStream.getAudioTracks()[0];
      if (track) { track.enabled = isMuted; setIsMuted(!isMuted); }
    }
  };
  const toggleVideo = () => {
    if (localStream) {
      const track = localStream.getVideoTracks()[0];
      if (track) { track.enabled = isVideoOff; setIsVideoOff(!isVideoOff); }
    }
  };
  const sendChatMsg = () => {
    if (!chatInput.trim()) return;
    const msg = { id: Date.now(), sender: 'patient', text: chatInput, time: new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}) };
    setChatMessages(prev => [...prev, msg]);
    setChatInput('');
    setTimeout(() => {
      setChatMessages(prev => [...prev, { id: Date.now(), sender: 'doctor', text: 'I understand. Let me check that for you.', time: new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}) }]);
    }, 1800);
  };

  const fmt = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  const cost = ((callDuration / 60) * doctor.rate).toFixed(2);
  const netColor = networkQuality === 'good' ? '#10b981' : '#f59e0b';

  return (
    <div style={{ background: '#0d1117', borderRadius: 18, overflow: 'hidden', position: 'relative' }}>
      {/* Top bar */}
      <div style={{ padding: '12px 16px', background: 'rgba(255,255,255,.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backdropFilter: 'blur(8px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', animation: 'pulse 1.5s infinite' }} />
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>LIVE · {fmt(callDuration)}</span>
          <span style={{ color: '#6b7280', fontSize: 12 }}>₹{cost}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Network quality */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 16 }}>
            {[4, 8, 12, 16].map((h, i) => (
              <div key={i} style={{ width: 4, borderRadius: 2, height: h,
                background: i < (networkQuality === 'good' ? 4 : 2) ? netColor : 'rgba(255,255,255,.2)' }} />
            ))}
          </div>
          <span style={{ color: netColor, fontSize: 10, fontWeight: 600 }}>
            {networkQuality === 'good' ? 'HD' : 'SD'}
          </span>
          {isRecording && (
            <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: 'rgba(239,68,68,.2)', color: '#ef4444', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444', animation: 'pulse 1s infinite' }} />REC
            </span>
          )}
        </div>
      </div>

      {/* Video area */}
      <div style={{ position: 'relative', minHeight: 400, background: '#161b22' }}>
        {/* Doctor feed (main) */}
        <div style={{ width: '100%', minHeight: 400, background: 'linear-gradient(135deg, #1c2333, #21262d)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(14,165,233,.2)', border: '3px solid rgba(14,165,233,.4)', margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>👨‍⚕️</div>
            <div style={{ color: '#fff', fontWeight: 600, fontSize: 16 }}>{doctor.name}</div>
            <div style={{ color: '#9CA3AF', fontSize: 13, marginTop: 4 }}>{doctor.spec}</div>
            <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', animation: 'pulse 2s infinite' }} />
              <span style={{ color: '#10b981', fontSize: 12, fontWeight: 600 }}>Connected</span>
            </div>
          </div>
        </div>

        {/* Patient PiP */}
        <div style={{ position: 'absolute', bottom: 16, right: 16, width: isPipMode ? 80 : 140, height: isPipMode ? 60 : 100,
          borderRadius: 10, overflow: 'hidden', border: '2px solid rgba(255,255,255,.2)',
          background: '#0d1117', cursor: 'pointer', transition: 'all .3s', boxShadow: '0 4px 20px rgba(0,0,0,.4)' }}
          onClick={() => setIsPipMode(!isPipMode)}>
          {!isVideoOff ? (
            <video ref={localVideoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', fontSize: 20 }}>🎥</div>
          )}
          <div style={{ position: 'absolute', bottom: 4, left: 4, fontSize: 9, color: 'rgba(255,255,255,.7)', background: 'rgba(0,0,0,.4)', padding: '1px 5px', borderRadius: 4 }}>You</div>
        </div>

        {/* Sidebar chat */}
        {showChat && (
          <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: 260,
            background: 'rgba(13,17,23,.95)', backdropFilter: 'blur(8px)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,.08)', color: '#fff', fontWeight: 600, fontSize: 13 }}>Chat</div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {chatMessages.map(m => (
                <div key={m.id} style={{ display: 'flex', flexDirection: 'column', alignItems: m.sender === 'patient' ? 'flex-end' : 'flex-start' }}>
                  <div style={{ maxWidth: '80%', padding: '7px 10px', borderRadius: m.sender === 'patient' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                    background: m.sender === 'patient' ? 'var(--blue)' : 'rgba(255,255,255,.1)',
                    color: '#fff', fontSize: 12, lineHeight: 1.5 }}>{m.text}</div>
                  <div style={{ fontSize: 9, color: '#6b7280', marginTop: 2 }}>{m.time}</div>
                </div>
              ))}
            </div>
            <div style={{ padding: '10px 12px', borderTop: '1px solid rgba(255,255,255,.08)', display: 'flex', gap: 6 }}>
              <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendChatMsg()}
                placeholder="Message..." style={{ flex: 1, background: 'rgba(255,255,255,.08)', border: 'none', borderRadius: 20, padding: '6px 12px', color: '#fff', fontSize: 12, outline: 'none' }} />
              <button onClick={sendChatMsg} style={{ width: 30, height: 30, borderRadius: '50%', border: 'none', background: 'var(--blue)', color: '#fff', cursor: 'pointer', fontSize: 14 }}>→</button>
            </div>
          </div>
        )}

        {/* Notes panel */}
        {showNotes && (
          <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 220,
            background: 'rgba(13,17,23,.95)', backdropFilter: 'blur(8px)', padding: 12, display: 'flex', flexDirection: 'column' }}>
            <div style={{ color: '#fff', fontWeight: 600, fontSize: 13, marginBottom: 8 }}>Session Notes</div>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Type your notes here..."
              style={{ flex: 1, background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 8, padding: 10, color: '#fff', fontSize: 12, resize: 'none', outline: 'none', fontFamily: 'inherit', lineHeight: 1.6 }} />
          </div>
        )}
      </div>

      {/* Controls */}
      <div style={{ padding: '14px 20px', background: '#161b22', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Left controls */}
        <div style={{ display: 'flex', gap: 8 }}>
          <ControlBtn active={!isMuted} icon={isMuted ? '🎙️✕' : '🎙️'} label="Mic" onClick={toggleMute} />
          <ControlBtn active={!isVideoOff} icon={isVideoOff ? '📷✕' : '📷'} label="Cam" onClick={toggleVideo} />
          <ControlBtn active={isRecording} icon="⏺" label="Rec" onClick={() => setIsRecording(!isRecording)} highlight={isRecording} />
        </div>
        {/* Center - End call */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          {showEndConfirm ? (
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <span style={{ color: '#9CA3AF', fontSize: 11 }}>End call?</span>
              <button onClick={() => onEndCall(callDuration)} style={{ padding: '6px 14px', borderRadius: 20, border: 'none', background: '#ef4444', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Yes, end</button>
              <button onClick={() => setShowEndConfirm(false)} style={{ padding: '6px 10px', borderRadius: 20, border: '1px solid rgba(255,255,255,.2)', background: 'none', color: '#fff', fontSize: 12, cursor: 'pointer' }}>Cancel</button>
            </div>
          ) : (
            <button onClick={() => setShowEndConfirm(true)} style={{ width: 56, height: 56, borderRadius: '50%', border: 'none', cursor: 'pointer',
              background: 'linear-gradient(135deg, #ef4444, #dc2626)', color: '#fff', fontSize: 22,
              boxShadow: '0 4px 16px rgba(239,68,68,.4)', transition: 'transform .15s',
              display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📞</button>
          )}
        </div>
        {/* Right controls */}
        <div style={{ display: 'flex', gap: 8 }}>
          <ControlBtn active={showChat} icon="💬" label="Chat" onClick={() => { setShowChat(!showChat); setShowNotes(false); }} />
          <ControlBtn active={showNotes} icon="📝" label="Notes" onClick={() => { setShowNotes(!showNotes); setShowChat(false); }} />
          <ControlBtn active={false} icon="⛶" label="Full" onClick={() => setIsFullscreen(!isFullscreen)} />
        </div>
      </div>
    </div>
  );
}

function ControlBtn({ icon, label, onClick, active, highlight }) {
  return (
    <button onClick={onClick} style={{ width: 44, height: 44, borderRadius: 10, border: 'none', cursor: 'pointer',
      background: highlight ? 'rgba(239,68,68,.2)' : active ? 'rgba(255,255,255,.1)' : 'rgba(255,255,255,.05)',
      color: highlight ? '#ef4444' : active ? '#fff' : '#9CA3AF',
      fontSize: 16, transition: 'all .15s', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}
      title={label}>
      <span style={{ fontSize: 16, lineHeight: 1 }}>{icon}</span>
      <span style={{ fontSize: 8, color: active ? '#9CA3AF' : '#4b5563' }}>{label}</span>
    </button>
  );
}

// ─── ENHANCED PHONE CALL ──────────────────────────────────────────────────────
function PhoneCall({ doctor, patientName, patientPhone, onEndCall }) {
  const [callStatus, setCallStatus] = useState('dialing');
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isOnHold, setIsOnHold] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);
  const [showDialpad, setShowDialpad] = useState(false);
  const [dialpadInput, setDialpadInput] = useState('');
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [callQuality, setCallQuality] = useState('HD');
  const durationIntervalRef = useRef(null);

  useEffect(() => {
    const t1 = setTimeout(() => {
      setCallStatus('ringing');
      const t2 = setTimeout(() => {
        setCallStatus('connected');
        durationIntervalRef.current = setInterval(() => setCallDuration(p => p + 1), 1000);
      }, 2500);
      return () => clearTimeout(t2);
    }, 1200);
    return () => {
      clearTimeout(t1);
      clearInterval(durationIntervalRef.current);
    };
  }, []);

  const fmt = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  const cost = ((callDuration / 60) * doctor.rate).toFixed(2);

  const pressDialpad = digit => {
    setDialpadInput(prev => prev + digit);
  };

  const statusColors = {
    dialing: { bg: '#1e3a5f', accent: '#3b82f6', text: 'Dialing...' },
    ringing: { bg: '#1a3a2a', accent: '#10b981', text: 'Ringing...' },
    connected: { bg: '#0f1f0f', accent: '#10b981', text: 'Connected' },
  };
  const sc = statusColors[callStatus];

  return (
    <div style={{ background: `linear-gradient(160deg, ${sc.bg} 0%, #0d1117 100%)`, borderRadius: 18, overflow: 'hidden', minHeight: 520 }}>
      {/* Header */}
      <div style={{ padding: '24px 20px 16px', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: '#6b7280', fontWeight: 600, background: 'rgba(255,255,255,.06)', padding: '4px 10px', borderRadius: 20 }}>
            ₹{doctor.rate}/min
          </div>
          {callStatus === 'connected' && (
            <div style={{ fontSize: 11, color: '#10b981', fontWeight: 600, background: 'rgba(16,185,129,.1)', padding: '4px 10px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#10b981', animation: 'pulse 2s infinite' }} />
              {callQuality}
            </div>
          )}
          <div style={{ fontSize: 11, color: '#9CA3AF' }}>₹{cost} spent</div>
        </div>

        {/* Avatar with animated ring */}
        <div style={{ position: 'relative', width: 100, height: 100, margin: '0 auto 16px' }}>
          {callStatus !== 'dialing' && (
            <>
              <div style={{ position: 'absolute', inset: -8, borderRadius: '50%', border: '2px solid rgba(16,185,129,.3)', animation: 'pingLarge 2s infinite' }} />
              <div style={{ position: 'absolute', inset: -16, borderRadius: '50%', border: '2px solid rgba(16,185,129,.15)', animation: 'pingLarge 2s infinite .5s' }} />
            </>
          )}
          <div style={{ width: 100, height: 100, borderRadius: '50%', background: `rgba(14,165,233,.15)`, border: `3px solid ${sc.accent}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>
            👨‍⚕️
          </div>
          {callStatus === 'connected' && (
            <div style={{ position: 'absolute', bottom: 4, right: 4, width: 16, height: 16, borderRadius: '50%',
              background: '#10b981', border: '2px solid #0d1117', animation: 'pulse 2s infinite' }} />
          )}
        </div>

        <div style={{ color: '#fff', fontWeight: 700, fontSize: 20, marginBottom: 4 }}>{doctor.name}</div>
        <div style={{ color: '#9CA3AF', fontSize: 14, marginBottom: 8 }}>{doctor.spec}</div>
        <div style={{ color: '#6b7280', fontSize: 13, marginBottom: 16 }}>{patientPhone || '+91 XXXXX XXXXX'}</div>

        {callStatus === 'dialing' && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, color: '#3b82f6', fontWeight: 600 }}>
            <span style={{ animation: 'pulse 0.8s infinite' }}>●</span>
            <span style={{ animation: 'pulse 0.8s infinite .2s' }}>●</span>
            <span style={{ animation: 'pulse 0.8s infinite .4s' }}>●</span>
            <span style={{ marginLeft: 8, fontSize: 14 }}>Dialing</span>
          </div>
        )}
        {callStatus === 'ringing' && (
          <div style={{ color: '#10b981', fontWeight: 600, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            📳 Ringing...
          </div>
        )}
        {callStatus === 'connected' && (
          <div style={{ fontSize: 40, fontWeight: 800, color: '#10b981', letterSpacing: 3, fontVariantNumeric: 'tabular-nums' }}>
            {fmt(callDuration)}
          </div>
        )}

        {isOnHold && (
          <div style={{ marginTop: 8, padding: '6px 16px', background: 'rgba(245,158,11,.15)', borderRadius: 20, color: '#f59e0b', fontSize: 12, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            ⏸ On Hold – Playing music
          </div>
        )}
      </div>

      {/* Dialpad */}
      {showDialpad && (
        <div style={{ padding: '12px 20px', borderTop: '1px solid rgba(255,255,255,.06)' }}>
          <div style={{ color: '#fff', fontSize: 20, fontWeight: 600, textAlign: 'center', marginBottom: 12, minHeight: 30, letterSpacing: 4 }}>{dialpadInput || ' '}</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {['1','2','3','4','5','6','7','8','9','*','0','#'].map(d => (
              <button key={d} onClick={() => pressDialpad(d)} style={{ padding: '12px', borderRadius: 10, border: 'none',
                background: 'rgba(255,255,255,.08)', color: '#fff', fontSize: 18, fontWeight: 600, cursor: 'pointer',
                transition: 'background .1s', fontFamily: 'monospace' }}>
                {d}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Controls */}
      <div style={{ padding: '16px 24px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 20 }}>
          {callStatus === 'connected' && (
            <>
              <PhoneControlBtn icon={isMuted ? '🎙️✕' : '🎙️'} label={isMuted ? 'Unmute' : 'Mute'} active={isMuted} onClick={() => setIsMuted(!isMuted)} danger={isMuted} />
              <PhoneControlBtn icon={isSpeaker ? '🔊' : '🔈'} label="Speaker" active={isSpeaker} onClick={() => setIsSpeaker(!isSpeaker)} />
              <PhoneControlBtn icon="⏸" label={isOnHold ? 'Resume' : 'Hold'} active={isOnHold} onClick={() => setIsOnHold(!isOnHold)} />
              <PhoneControlBtn icon="⌨" label="Pad" active={showDialpad} onClick={() => setShowDialpad(!showDialpad)} />
            </>
          )}
        </div>

        {/* End call */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {showEndConfirm ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
              <div style={{ color: '#9CA3AF', fontSize: 13 }}>End this call?</div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => onEndCall(callDuration)} style={{ padding: '10px 24px', borderRadius: 25, border: 'none', background: '#ef4444', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>End Call</button>
                <button onClick={() => setShowEndConfirm(false)} style={{ padding: '10px 24px', borderRadius: 25, border: '1px solid rgba(255,255,255,.2)', background: 'none', color: '#fff', cursor: 'pointer', fontSize: 14 }}>Cancel</button>
              </div>
            </div>
          ) : (
            <button onClick={() => setShowEndConfirm(true)} style={{ width: 64, height: 64, borderRadius: '50%', border: 'none', cursor: 'pointer',
              background: 'linear-gradient(135deg, #ef4444, #b91c1c)', color: '#fff', fontSize: 26,
              boxShadow: '0 6px 24px rgba(239,68,68,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'transform .15s' }}>📞</button>
          )}
        </div>
      </div>
    </div>
  );
}

function PhoneControlBtn({ icon, label, active, onClick, danger }) {
  return (
    <button onClick={onClick} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
      padding: '12px 6px', borderRadius: 12, border: 'none', cursor: 'pointer',
      background: active ? (danger ? 'rgba(239,68,68,.2)' : 'rgba(255,255,255,.15)') : 'rgba(255,255,255,.06)',
      color: active ? (danger ? '#ef4444' : '#fff') : '#9CA3AF', transition: 'all .15s' }}>
      <span style={{ fontSize: 20 }}>{icon}</span>
      <span style={{ fontSize: 10, fontWeight: 600 }}>{label}</span>
    </button>
  );
}

// ─── ENHANCED CHAT ────────────────────────────────────────────────────────────
function ChatInterface({ doctor, patientName, onEndChat }) {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'system', text: 'Consultation started. Your messages are private and secure.', time: new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}) },
    { id: 2, sender: 'doctor', text: `Hello ${patientName}! I'm ${doctor.name}. How can I help you today?`, time: new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}), status: 'read' },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [consultDuration, setConsultDuration] = useState(0);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [quickReplies] = useState(['I have a fever', 'I need a prescription', 'Follow-up question', 'Thank you doctor']);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [reactionMsg, setReactionMsg] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const durationIntervalRef = useRef(null);

  useEffect(() => {
    durationIntervalRef.current = setInterval(() => setConsultDuration(p => p + 1), 1000);
    return () => clearInterval(durationIntervalRef.current);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const fmt = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  const cost = ((consultDuration / 60) * doctor.rate).toFixed(2);

  const DOCTOR_RESPONSES = [
    "I understand. Can you tell me more about when this started?",
    "Thank you for sharing that. Based on what you've described, I'd recommend...",
    "That's a common concern. Let me explain what might be causing this.",
    "I'll note that in your file. Do you have any allergies I should know about?",
    "Based on your symptoms, I'm going to recommend some tests. Please proceed to the nearest lab.",
    "You're doing the right thing by consulting early. Here's what I suggest...",
  ];

  const sendMessage = (text = newMessage) => {
    if (!text.trim()) return;
    const msg = { id: Date.now(), sender: 'patient', text: text.trim(), time: new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}), status: 'sent' };
    setMessages(prev => [...prev, msg]);
    setNewMessage('');
    setShowAttachMenu(false);
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === msg.id ? {...m, status: 'delivered'} : m));
    }, 500);
    const delay = 1500 + Math.random() * 1500;
    setTimeout(() => {
      setIsTyping(false);
      const response = DOCTOR_RESPONSES[Math.floor(Math.random() * DOCTOR_RESPONSES.length)];
      setMessages(prev => [...prev, { id: Date.now(), sender: 'doctor', text: response, time: new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}), status: 'read' }]);
    }, delay);
  };

  const addAttachment = type => {
    const attachments = {
      photo: '📸 Photo attached',
      document: '📄 Document attached',
      report: '🔬 Lab report attached',
    };
    const msg = { id: Date.now(), sender: 'patient', text: attachments[type], time: new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}), status: 'sent', isAttachment: true };
    setMessages(prev => [...prev, msg]);
    setShowAttachMenu(false);
    setTimeout(() => {
      setMessages(prev => [...prev, { id: Date.now(), sender: 'doctor', text: 'I can see the attachment. Reviewing it now...', time: new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}), status: 'read' }]);
    }, 2000);
  };

  return (
    <div style={{ background: '#fff', borderRadius: 18, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '80vh', maxHeight: 680 }}>
      {/* Header */}
      <div style={{ padding: '12px 16px', background: 'linear-gradient(135deg, #0ea5e9, #0284c7)', color: '#fff', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Avatar src={doctor.img} name={doctor.name} size={40} pulse />
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{doctor.name}</div>
              <div style={{ fontSize: 11, opacity: 0.85, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', animation: 'pulse 2s infinite' }} />
                Online · {doctor.spec}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 13, fontWeight: 700, background: 'rgba(255,255,255,.2)', padding: '3px 10px', borderRadius: 20 }}>{fmt(consultDuration)}</div>
              <div style={{ fontSize: 10, opacity: 0.7 }}>₹{cost}</div>
            </div>
            <button onClick={() => setShowEndConfirm(true)} style={{ width: 32, height: 32, borderRadius: '50%', border: 'none', cursor: 'pointer', background: 'rgba(255,255,255,.2)', color: '#fff', fontSize: 14 }}>✕</button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', background: '#f0f4f8', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {messages.map(msg => (
          <div key={msg.id}>
            {msg.sender === 'system' ? (
              <div style={{ textAlign: 'center', margin: '8px 0' }}>
                <span style={{ fontSize: 11, color: '#9CA3AF', background: 'rgba(255,255,255,.7)', padding: '3px 12px', borderRadius: 20, display: 'inline-block' }}>
                  🔒 {msg.text}
                </span>
              </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: msg.sender === 'patient' ? 'flex-end' : 'flex-start', marginBottom: 10 }}
                onMouseEnter={() => setReactionMsg(msg.id)} onMouseLeave={() => setReactionMsg(null)}>
                {msg.sender === 'doctor' && (
                  <div style={{ marginRight: 8, alignSelf: 'flex-end' }}>
                    <Avatar src={doctor.img} name={doctor.name} size={28} />
                  </div>
                )}
                <div style={{ maxWidth: '72%', position: 'relative' }}>
                  <div style={{
                    background: msg.sender === 'patient' ? 'linear-gradient(135deg, #0ea5e9, #0284c7)' : '#fff',
                    color: msg.sender === 'patient' ? '#fff' : '#1f2937',
                    padding: '10px 14px',
                    borderRadius: msg.sender === 'patient' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    boxShadow: '0 1px 4px rgba(0,0,0,.08)',
                    fontSize: 13, lineHeight: 1.6,
                    border: msg.isAttachment ? '2px dashed rgba(255,255,255,.4)' : 'none',
                  }}>{msg.text}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 3, justifyContent: msg.sender === 'patient' ? 'flex-end' : 'flex-start' }}>
                    <span style={{ fontSize: 10, color: '#9CA3AF' }}>{msg.time}</span>
                    {msg.sender === 'patient' && (
                      <span style={{ fontSize: 11, color: msg.status === 'read' ? '#0ea5e9' : '#9CA3AF' }}>
                        {msg.status === 'sent' ? '✓' : msg.status === 'delivered' ? '✓✓' : '✓✓'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, marginBottom: 10 }}>
            <Avatar src={doctor.img} name={doctor.name} size={28} />
            <div style={{ background: '#fff', padding: '10px 14px', borderRadius: '18px 18px 18px 4px', boxShadow: '0 1px 4px rgba(0,0,0,.08)' }}>
              <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                {[0, 0.2, 0.4].map((d, i) => (
                  <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: '#9CA3AF', animation: `pulse 1.2s infinite ${d}s` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick replies */}
      <div style={{ padding: '8px 16px 4px', background: '#fff', display: 'flex', gap: 6, overflowX: 'auto', flexShrink: 0 }}>
        {quickReplies.map(qr => (
          <button key={qr} onClick={() => sendMessage(qr)} style={{ fontSize: 11, padding: '5px 12px', borderRadius: 20, border: '1px solid rgba(14,165,233,.3)', background: 'rgba(14,165,233,.06)', color: 'var(--blue)', cursor: 'pointer', whiteSpace: 'nowrap', fontWeight: 500 }}>{qr}</button>
        ))}
      </div>

      {/* Input */}
      <div style={{ padding: '10px 16px 14px', background: '#fff', borderTop: '1px solid rgba(0,0,0,.06)', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
          {/* Attach */}
          <div style={{ position: 'relative' }}>
            <button onClick={() => setShowAttachMenu(!showAttachMenu)} style={{ width: 38, height: 38, borderRadius: '50%', border: '1px solid rgba(0,0,0,.1)', background: '#fff', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📎</button>
            {showAttachMenu && (
              <div style={{ position: 'absolute', bottom: 48, left: 0, background: '#fff', borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,.15)', border: '1px solid rgba(0,0,0,.08)', padding: '6px', minWidth: 160 }}>
                {[['photo', '📸', 'Upload Photo'], ['document', '📄', 'Document'], ['report', '🔬', 'Lab Report']].map(([type, icon, label]) => (
                  <button key={type} onClick={() => addAttachment(type)} style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '8px 10px', border: 'none', background: 'none', cursor: 'pointer', borderRadius: 8, fontSize: 12, color: '#374151', transition: 'background .1s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f3f4f6'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                    <span>{icon}</span><span>{label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <textarea
            ref={inputRef}
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder="Type a message..."
            style={{ flex: 1, padding: '10px 14px', borderRadius: 22, border: '1px solid rgba(0,0,0,.12)', resize: 'none', fontFamily: 'inherit', fontSize: 13, minHeight: 40, maxHeight: 100, outline: 'none', lineHeight: 1.5, transition: 'border-color .15s' }}
            rows={1}
            onFocus={e => e.target.style.borderColor = 'var(--blue)'}
            onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,.12)'}
          />

          <button onClick={() => sendMessage()} style={{ width: 38, height: 38, borderRadius: '50%', border: 'none', cursor: 'pointer',
            background: newMessage.trim() ? 'linear-gradient(135deg, #0ea5e9, #0284c7)' : '#e5e7eb',
            color: newMessage.trim() ? '#fff' : '#9CA3AF', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .2s' }}>→</button>
        </div>
        <div style={{ fontSize: 10, color: '#9CA3AF', textAlign: 'center', marginTop: 6 }}>Enter to send · Shift+Enter for new line</div>
      </div>

      {/* End confirm */}
      {showEndConfirm && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 18, backdropFilter: 'blur(4px)' }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: '24px', textAlign: 'center', maxWidth: 280 }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>💬</div>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>End Consultation?</div>
            <div style={{ color: '#6B7280', fontSize: 13, marginBottom: 20, lineHeight: 1.6 }}>Duration: {fmt(consultDuration)} · Cost: ₹{cost}</div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
              <button onClick={() => onEndChat(consultDuration)} style={{ ...S.btnDanger, fontSize: 13 }}>End Chat</button>
              <button onClick={() => setShowEndConfirm(false)} style={{ ...S.btnOutline }}>Continue</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── ENHANCED WALLET PANEL ────────────────────────────────────────────────────
function WalletPanel({ addToast }) {
  const [balance, setBalance] = useState(userWallet.balance);
  const [transactions, setTransactions] = useState(userWallet.transactions);
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [addAmount, setAddAmount] = useState(500);
  const [activeTab, setActiveTab] = useState('all');
  const [showUPI, setShowUPI] = useState(false);
  const [upiId, setUpiId] = useState('');
  const [processing, setProcessing] = useState(false);

  const refreshWallet = useCallback(() => {
    setBalance(userWallet.balance);
    setTransactions([...userWallet.transactions]);
  }, []);

  useEffect(() => {
    refreshWallet();
    const interval = setInterval(refreshWallet, 800);
    return () => clearInterval(interval);
  }, [refreshWallet]);

  const filteredTxns = useMemo(() => {
    if (activeTab === 'all') return transactions;
    return transactions.filter(t => t.type === activeTab);
  }, [transactions, activeTab]);

  const totalSpent = transactions.filter(t => t.type === 'debit').reduce((a, t) => a + t.amount, 0);
  const totalAdded = transactions.filter(t => t.type === 'credit').reduce((a, t) => a + t.amount, 0);

  const addMoney = () => {
    if (addAmount <= 0) return;
    setProcessing(true);
    setTimeout(() => {
      userWallet.balance += addAmount;
      userWallet.transactions.unshift({
        id: Date.now(), type: 'credit', amount: addAmount,
        description: showUPI ? `UPI - ${upiId}` : 'Wallet recharge',
        date: new Date().toLocaleString(), icon: '💳'
      });
      refreshWallet();
      setShowAddMoney(false);
      setProcessing(false);
      addToast(`₹${addAmount} added to your wallet!`, 'success');
      setAddAmount(500);
      setUpiId('');
    }, 1500);
  };

  const getIcon = t => {
    if (t.description?.includes('Video') || t.description?.includes('video')) return '📹';
    if (t.description?.includes('Phone') || t.description?.includes('phone')) return '📞';
    if (t.description?.includes('Chat') || t.description?.includes('chat')) return '💬';
    if (t.type === 'credit') return '💳';
    return '🩺';
  };

  return (
    <div style={{ ...S.card, position: 'sticky', top: 20, overflow: 'hidden' }}>
      {/* Balance card */}
      <div style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 50%, #075985 100%)', borderRadius: 12, padding: '16px', marginBottom: 14, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,.08)' }} />
        <div style={{ position: 'absolute', bottom: -30, left: -10, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,.05)' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative' }}>
          <div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,.7)', fontWeight: 600, marginBottom: 4 }}>WALLET BALANCE</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: '#fff', letterSpacing: -1 }}>₹{balance.toLocaleString()}</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,.15)', borderRadius: 8, padding: '6px 10px', backdropFilter: 'blur(4px)' }}>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,.7)' }}>Spent</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>₹{totalSpent}</div>
          </div>
        </div>
        <button onClick={() => setShowAddMoney(true)} style={{ marginTop: 12, width: '100%', padding: '8px', borderRadius: 8, border: '1px solid rgba(255,255,255,.3)', background: 'rgba(255,255,255,.15)', color: '#fff', fontWeight: 600, fontSize: 13, cursor: 'pointer', backdropFilter: 'blur(4px)', transition: 'background .15s' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,.25)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,.15)'}>
          + Add Money
        </button>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
        {[{ label: 'Added', value: `₹${totalAdded}`, color: '#059669', bg: 'rgba(16,185,129,.08)' }, { label: 'Consults', value: transactions.filter(t => t.type === 'debit').length, color: 'var(--blue)', bg: 'rgba(14,165,233,.08)' }].map(s => (
          <div key={s.label} style={{ background: s.bg, borderRadius: 10, padding: '10px 12px', textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Transactions */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 10 }}>
        {[['all', 'All'], ['debit', 'Spent'], ['credit', 'Added']].map(([key, label]) => (
          <button key={key} onClick={() => setActiveTab(key)} style={{ flex: 1, padding: '5px 0', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: activeTab === key ? 600 : 400,
            background: activeTab === key ? 'var(--blue)' : 'rgba(0,0,0,.04)', color: activeTab === key ? '#fff' : '#6B7280', transition: 'all .15s' }}>{label}</button>
        ))}
      </div>

      <div style={{ maxHeight: 200, overflowY: 'auto' }}>
        {filteredTxns.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px', color: '#9CA3AF', fontSize: 12 }}>No transactions yet</div>
        ) : filteredTxns.slice(0, 6).map(t => (
          <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid rgba(0,0,0,.04)' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: t.type === 'credit' ? 'rgba(16,185,129,.1)' : 'rgba(239,68,68,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>
              {getIcon(t)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.description}</div>
              <div style={{ fontSize: 10, color: '#9CA3AF' }}>{t.date?.split(',')[0]}</div>
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: t.type === 'credit' ? '#059669' : '#ef4444', flexShrink: 0 }}>
              {t.type === 'credit' ? '+' : '-'}₹{t.amount}
            </div>
          </div>
        ))}
      </div>

      {/* Add Money Modal */}
      <Modal show={showAddMoney} onClose={() => { setShowAddMoney(false); setProcessing(false); }} title='<i class="bi bi-wallet2 me-2 text-blue"></i>Add Money to Wallet'>
        {processing ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ fontSize: 48, marginBottom: 16, animation: 'pulse 1s infinite' }}>💳</div>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>Processing Payment...</div>
            <div style={{ color: '#6B7280', fontSize: 13 }}>Please wait a moment</div>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: 16 }}>
              <label style={S.label}>Quick amounts</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                {[100, 200, 500, 1000, 2000, 5000].map(amt => (
                  <button key={amt} onClick={() => setAddAmount(amt)} style={{ padding: '7px 16px', borderRadius: 20, border: addAmount === amt ? '2px solid var(--blue)' : '1px solid rgba(0,0,0,.1)', background: addAmount === amt ? 'rgba(14,165,233,.1)' : '#fff', cursor: 'pointer', fontSize: 13, fontWeight: addAmount === amt ? 600 : 400, color: addAmount === amt ? 'var(--blue)' : '#374151', transition: 'all .15s' }}>₹{amt}</button>
                ))}
              </div>
              <label style={S.label}>Custom amount</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', fontSize: 15, fontWeight: 700 }}>₹</span>
                <input type="number" style={{ ...S.input, paddingLeft: 28 }} value={addAmount} onChange={e => setAddAmount(parseInt(e.target.value) || 0)} placeholder="Enter amount" />
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={S.label}>Payment method</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <button onClick={() => setShowUPI(false)} style={{ padding: '10px', borderRadius: 8, border: !showUPI ? '2px solid var(--blue)' : '1px solid rgba(0,0,0,.1)', background: !showUPI ? 'rgba(14,165,233,.06)' : '#fff', cursor: 'pointer' }}>
                  <div style={{ fontSize: 20, marginBottom: 4 }}>💳</div>
                  <div style={{ fontSize: 12, fontWeight: !showUPI ? 700 : 400, color: !showUPI ? 'var(--blue)' : '#374151' }}>Card</div>
                </button>
                <button onClick={() => setShowUPI(true)} style={{ padding: '10px', borderRadius: 8, border: showUPI ? '2px solid var(--blue)' : '1px solid rgba(0,0,0,.1)', background: showUPI ? 'rgba(14,165,233,.06)' : '#fff', cursor: 'pointer' }}>
                  <div style={{ fontSize: 20, marginBottom: 4 }}>📱</div>
                  <div style={{ fontSize: 12, fontWeight: showUPI ? 700 : 400, color: showUPI ? 'var(--blue)' : '#374151' }}>UPI</div>
                </button>
              </div>
            </div>

            {showUPI && (
              <div style={{ marginBottom: 16 }}>
                <label style={S.label}>UPI ID</label>
                <input style={S.input} placeholder="yourname@upi" value={upiId} onChange={e => setUpiId(e.target.value)} />
              </div>
            )}

            <div style={{ background: 'rgba(16,185,129,.06)', borderRadius: 10, padding: '12px 14px', marginBottom: 16, border: '1px solid rgba(16,185,129,.12)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: '#6B7280' }}>Amount to add</span>
                <span style={{ fontWeight: 700, color: '#059669', fontSize: 16 }}>₹{addAmount}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#9CA3AF', marginTop: 4 }}>
                <span>New balance after adding</span>
                <span>₹{balance + addAmount}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button onClick={() => setShowAddMoney(false)} style={S.btnOutline}>Cancel</button>
              <button onClick={addMoney} style={{ ...S.btnPrimary, background: '#059669', display: 'flex', alignItems: 'center', gap: 6 }} disabled={addAmount <= 0}>
                ✓ Add ₹{addAmount}
              </button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}

// ─── HOSPITAL PAYMENT STEP ───────────────────────────────────────────────────
function HospitalPaymentStep({ selectedHosp, selectedDoctor, selectedSlot, selectedDate, selectedPurpose, patientName, setPatientName, patientPhone, setPatientPhone, bookingNote, setBookingNote, onBack, onConfirm, addToast }) {
  const [payMethod, setPayMethod] = useState('upi'); // 'upi' | 'card' | 'netbanking' | 'wallet'
  const [upiId, setUpiId] = useState('');
  const [upiApp, setUpiApp] = useState(''); // 'gpay'|'phonepe'|'paytm'|'other'
  const [cardNum, setCardNum] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');
  const [saveCard, setSaveCard] = useState(false);
  const [netBank, setNetBank] = useState('');
  const [processing, setProcessing] = useState(false);
  const [payDone, setPayDone] = useState(false);

  const fee = selectedDoctor?.fee || 0;
  const gst = Math.round(fee * 0.18);
  const convenience = 10;
  const total = fee + gst + convenience;

  const UPI_APPS = [
    { id: 'gpay', label: 'Google Pay', emoji: '🇬', color: '#4285F4' },
    { id: 'phonepe', label: 'PhonePe',  emoji: '💜', color: '#5f259f' },
    { id: 'paytm',  label: 'Paytm',    emoji: '🔵', color: '#00BAF2' },
    { id: 'bhim',   label: 'BHIM UPI', emoji: '🇮', color: '#FF6B00' },
    { id: 'other',  label: 'Other UPI', emoji: '📱', color: '#6B7280' },
  ];

  const BANKS = ['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra', 'Punjab National Bank', 'Bank of Baroda', 'Canara Bank'];

  const fmtCard = val => val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  const fmtExpiry = val => { const d = val.replace(/\D/g, '').slice(0, 4); return d.length > 2 ? d.slice(0,2) + '/' + d.slice(2) : d; };

  const handlePay = () => {
    if (!patientName.trim() || !patientPhone.trim()) { addToast('Please fill in patient details first.', 'error'); return; }
    if (payMethod === 'upi' && !upiApp && !upiId.trim()) { addToast('Please select a UPI app or enter UPI ID.', 'error'); return; }
    if (payMethod === 'card' && (cardNum.replace(/\s/g,'').length < 16 || !cardExpiry || cardCVV.length < 3 || !cardName.trim())) { addToast('Please fill in all card details.', 'error'); return; }
    if (payMethod === 'netbanking' && !netBank) { addToast('Please select your bank.', 'error'); return; }
    setProcessing(true);
    setTimeout(() => { setProcessing(false); setPayDone(true); setTimeout(() => onConfirm(), 900); }, 2200);
  };

  const PAY_METHODS = [
    { id: 'upi',        icon: '📱', label: 'UPI',          sub: 'GPay, PhonePe, Paytm…' },
    { id: 'card',       icon: '💳', label: 'Card',         sub: 'Debit / Credit' },
    { id: 'netbanking', icon: '🏦', label: 'Net Banking',  sub: 'All major banks' },
    { id: 'wallet',     icon: '👛', label: 'Wallet',       sub: `Balance ₹${userWallet.balance}` },
  ];

  if (payDone) return (
    <div style={{ textAlign: 'center', padding: '32px 20px' }}>
      <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(16,185,129,.12)', border: '2px solid #059669', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, margin: '0 auto 16px', animation: 'bounceIn .4s' }}>✓</div>
      <div style={{ fontWeight: 800, fontSize: 18, color: '#059669', marginBottom: 6 }}>Payment Successful!</div>
      <div style={{ color: '#6B7280', fontSize: 13 }}>₹{total} paid · Booking your appointment…</div>
    </div>
  );

  if (processing) return (
    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
      <div style={{ width: 64, height: 64, borderRadius: '50%', border: '3px solid rgba(14,165,233,.2)', borderTop: '3px solid var(--blue)', margin: '0 auto 20px', animation: 'spin 0.8s linear infinite' }} />
      <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>
        {payMethod === 'upi' ? '🔄 Waiting for UPI confirmation…' : payMethod === 'card' ? '🔐 Verifying card…' : '🏦 Redirecting to bank…'}
      </div>
      <div style={{ color: '#9CA3AF', fontSize: 13, marginBottom: 16 }}>Please do not close this window</div>
      {payMethod === 'upi' && upiApp && (
        <div style={{ fontSize: 13, color: '#6B7280' }}>Check your {UPI_APPS.find(a => a.id === upiApp)?.label} app to approve payment</div>
      )}
      <div style={{ marginTop: 20, background: 'rgba(14,165,233,.06)', borderRadius: 10, padding: '12px 16px', border: '1px solid rgba(14,165,233,.1)' }}>
        <div style={{ fontSize: 11, color: '#9CA3AF' }}>Amount</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--blue)' }}>₹{total}</div>
      </div>
    </div>
  );

  return (
    <div>
      {/* ── Booking Summary ── */}
      <div style={{ ...S.card, background: 'rgba(14,165,233,.03)', border: '1px solid rgba(14,165,233,.12)', marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--blue)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 10 }}>Booking Summary</div>
        {[
          ['Hospital', selectedHosp.name],
          ['Address', selectedHosp.address],
          ['Doctor', selectedDoctor.name],
          ['Specialty', selectedDoctor.spec],
          ['Date', selectedDate],
          ['Time', selectedSlot],
        ].map(([label, value]) => (
          <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid rgba(0,0,0,.04)', fontSize: 13 }}>
            <span style={{ color: '#9CA3AF' }}>{label}</span>
            <span style={{ fontWeight: 600 }}>{value}</span>
          </div>
        ))}
        {/* Fee breakdown */}
        <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px dashed rgba(0,0,0,.1)' }}>
          {[['Consultation Fee', `₹${fee}`], ['GST (18%)', `₹${gst}`], ['Convenience Fee', `₹${convenience}`]].map(([l,v]) => (
            <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '3px 0', color: '#6B7280' }}>
              <span>{l}</span><span>{v}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 800, marginTop: 8, padding: '8px 0 0', borderTop: '1px solid rgba(0,0,0,.08)', color: '#1f2937' }}>
            <span>Total Payable</span><span style={{ color: 'var(--blue)' }}>₹{total}</span>
          </div>
        </div>
      </div>

      {/* ── Patient Details ── */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 10 }}>Patient Details</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
          <div><label style={S.label}>Full Name *</label><input style={S.input} placeholder="Full name" value={patientName} onChange={e => setPatientName(e.target.value)} /></div>
          <div><label style={S.label}>Phone *</label><input style={S.input} placeholder="+91 XXXXX XXXXX" type="tel" value={patientPhone} onChange={e => setPatientPhone(e.target.value)} /></div>
        </div>
        <div><label style={S.label}>Notes (optional)</label><textarea style={{ ...S.input, resize: 'vertical', minHeight: 48 }} placeholder="Symptoms, medical history…" value={bookingNote} onChange={e => setBookingNote(e.target.value)} /></div>
      </div>

      {/* ── Payment Method Tabs ── */}
      <div style={{ fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 10 }}>Payment Method</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, marginBottom: 16 }}>
        {PAY_METHODS.map(m => (
          <button key={m.id} onClick={() => setPayMethod(m.id)} style={{
            padding: '10px 6px', borderRadius: 10, cursor: 'pointer', textAlign: 'center', transition: 'all .15s',
            border: payMethod === m.id ? '2px solid var(--blue)' : '1px solid rgba(0,0,0,.1)',
            background: payMethod === m.id ? 'rgba(14,165,233,.07)' : '#fff',
          }}>
            <div style={{ fontSize: 20, marginBottom: 4 }}>{m.icon}</div>
            <div style={{ fontSize: 11, fontWeight: payMethod === m.id ? 700 : 500, color: payMethod === m.id ? 'var(--blue)' : '#374151', lineHeight: 1.3 }}>{m.label}</div>
            <div style={{ fontSize: 9, color: '#9CA3AF', marginTop: 2, lineHeight: 1.3 }}>{m.sub}</div>
          </button>
        ))}
      </div>

      {/* ── UPI Panel ── */}
      {payMethod === 'upi' && (
        <div style={{ ...S.card, marginBottom: 16, border: '1px solid rgba(0,0,0,.08)' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 12 }}>Choose UPI App</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
            {UPI_APPS.map(app => (
              <button key={app.id} onClick={() => { setUpiApp(app.id); setUpiId(''); }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, padding: '10px 14px', borderRadius: 10, cursor: 'pointer', transition: 'all .15s', minWidth: 68,
                  border: upiApp === app.id ? `2px solid ${app.color}` : '1px solid rgba(0,0,0,.1)',
                  background: upiApp === app.id ? `${app.color}10` : '#fff' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: `${app.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, color: app.color, border: `1.5px solid ${app.color}30` }}>
                  {app.id === 'gpay' ? 'G' : app.id === 'phonepe' ? 'P' : app.id === 'paytm' ? 'P' : app.id === 'bhim' ? 'B' : '📱'}
                </div>
                <div style={{ fontSize: 10, fontWeight: upiApp === app.id ? 700 : 500, color: upiApp === app.id ? app.color : '#6B7280', whiteSpace: 'nowrap' }}>{app.label}</div>
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,.08)' }} />
            <span style={{ fontSize: 11, color: '#9CA3AF' }}>or enter UPI ID</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,.08)' }} />
          </div>

          <div style={{ position: 'relative' }}>
            <input style={{ ...S.input, paddingRight: 80 }} placeholder="yourname@upi"
              value={upiId} onChange={e => { setUpiId(e.target.value); setUpiApp(''); }} />
            {upiId && (
              <button style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', fontSize: 11, padding: '3px 10px', borderRadius: 6, border: 'none', background: 'var(--blue)', color: '#fff', cursor: 'pointer', fontWeight: 600 }}>Verify</button>
            )}
          </div>
          <div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 6 }}>e.g. name@okaxis · name@ybl · name@paytm</div>

          {(upiApp || upiId) && (
            <div style={{ marginTop: 12, padding: '10px 12px', background: 'rgba(16,185,129,.06)', borderRadius: 8, border: '1px solid rgba(16,185,129,.15)', fontSize: 12, color: '#059669', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 16 }}>✓</span>
              <span>You'll receive a payment request on {upiApp ? UPI_APPS.find(a => a.id === upiApp)?.label : upiId}</span>
            </div>
          )}
        </div>
      )}

      {/* ── Card Panel ── */}
      {payMethod === 'card' && (
        <div style={{ ...S.card, marginBottom: 16, border: '1px solid rgba(0,0,0,.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>Card Details</div>
            <div style={{ display: 'flex', gap: 6 }}>
              {[{ label: 'VISA', bg: '#1A1F71', color: '#fff' }, { label: 'MC', bg: '#EB001B', color: '#fff' }, { label: 'RUPAY', bg: '#f59e0b', color: '#fff' }].map(c => (
                <span key={c.label} style={{ fontSize: 9, padding: '2px 6px', borderRadius: 4, background: c.bg, color: c.color, fontWeight: 800, letterSpacing: '.04em' }}>{c.label}</span>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={S.label}>Card Number</label>
            <div style={{ position: 'relative' }}>
              <input style={{ ...S.input, letterSpacing: cardNum ? 2 : 0, fontFamily: cardNum ? 'monospace' : 'inherit' }}
                placeholder="1234 5678 9012 3456" maxLength={19}
                value={fmtCard(cardNum)} onChange={e => setCardNum(e.target.value.replace(/\s/g, ''))} />
              <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 18 }}>
                {cardNum.startsWith('4') ? '💳' : cardNum.startsWith('5') ? '💳' : '💳'}
              </span>
            </div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={S.label}>Cardholder Name</label>
            <input style={{ ...S.input, textTransform: 'uppercase', letterSpacing: 1 }} placeholder="AS ON CARD"
              value={cardName} onChange={e => setCardName(e.target.value.toUpperCase())} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
            <div>
              <label style={S.label}>Expiry Date</label>
              <input style={S.input} placeholder="MM/YY" maxLength={5}
                value={cardExpiry} onChange={e => setCardExpiry(fmtExpiry(e.target.value))} />
            </div>
            <div>
              <label style={S.label}>CVV</label>
              <div style={{ position: 'relative' }}>
                <input style={S.input} placeholder="•••" maxLength={4} type="password"
                  value={cardCVV} onChange={e => setCardCVV(e.target.value.replace(/\D/g, '').slice(0,4))} />
              </div>
            </div>
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#374151', cursor: 'pointer' }}>
            <input type="checkbox" checked={saveCard} onChange={e => setSaveCard(e.target.checked)} style={{ accentColor: 'var(--blue)', width: 14, height: 14 }} />
            Save card for future payments
          </label>
          <div style={{ marginTop: 12, padding: '8px 12px', background: 'rgba(0,0,0,.02)', borderRadius: 8, border: '1px solid rgba(0,0,0,.06)', fontSize: 11, color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: 6 }}>
            🔒 Your card details are encrypted with 256-bit SSL
          </div>
        </div>
      )}

      {/* ── Net Banking Panel ── */}
      {payMethod === 'netbanking' && (
        <div style={{ ...S.card, marginBottom: 16, border: '1px solid rgba(0,0,0,.08)' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 12 }}>Select Your Bank</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginBottom: 12 }}>
            {BANKS.slice(0, 6).map(bank => (
              <button key={bank} onClick={() => setNetBank(bank)}
                style={{ padding: '10px 12px', borderRadius: 8, cursor: 'pointer', textAlign: 'left', fontSize: 12, fontWeight: netBank === bank ? 700 : 400, transition: 'all .15s',
                  border: netBank === bank ? '2px solid var(--blue)' : '1px solid rgba(0,0,0,.08)',
                  background: netBank === bank ? 'rgba(14,165,233,.07)' : '#fafafa',
                  color: netBank === bank ? 'var(--blue)' : '#374151', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 18 }}>🏦</span>{bank}
              </button>
            ))}
          </div>
          <div>
            <label style={S.label}>Other Bank</label>
            <select style={{ ...S.input }} value={BANKS.slice(6).includes(netBank) ? netBank : ''} onChange={e => setNetBank(e.target.value)}>
              <option value="">Select other bank…</option>
              {BANKS.slice(6).map(b => <option key={b}>{b}</option>)}
            </select>
          </div>
          {netBank && (
            <div style={{ marginTop: 12, padding: '10px 12px', background: 'rgba(14,165,233,.06)', borderRadius: 8, border: '1px solid rgba(14,165,233,.12)', fontSize: 12, color: 'var(--blue)' }}>
              🏦 You'll be redirected to <strong>{netBank}</strong>'s secure portal to complete payment.
            </div>
          )}
        </div>
      )}

      {/* ── Wallet Panel ── */}
      {payMethod === 'wallet' && (
        <div style={{ ...S.card, marginBottom: 16, border: '1px solid rgba(0,0,0,.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 2 }}>💛 HealthPay Wallet</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: userWallet.balance >= total ? '#059669' : '#dc2626' }}>₹{userWallet.balance}</div>
              <div style={{ fontSize: 11, color: '#9CA3AF' }}>Available balance</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 4 }}>After payment</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: userWallet.balance >= total ? '#374151' : '#dc2626' }}>₹{Math.max(0, userWallet.balance - total)}</div>
            </div>
          </div>
          {userWallet.balance >= total ? (
            <div style={{ padding: '10px 14px', background: 'rgba(16,185,129,.06)', borderRadius: 8, border: '1px solid rgba(16,185,129,.15)', fontSize: 12, color: '#059669', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>✓</span> Sufficient balance. ₹{total} will be deducted from your wallet.
            </div>
          ) : (
            <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,.06)', borderRadius: 8, border: '1px solid rgba(239,68,68,.15)', fontSize: 12, color: '#dc2626' }}>
              ⚠ Insufficient balance. You need ₹{total - userWallet.balance} more.
              <button onClick={() => addToast('Opening add money…')} style={{ marginLeft: 8, fontSize: 11, padding: '2px 8px', borderRadius: 6, border: 'none', background: 'var(--blue)', color: '#fff', cursor: 'pointer', fontWeight: 600 }}>Add Money</button>
            </div>
          )}
        </div>
      )}

      {/* ── Security badges ── */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        {['🔒 256-bit SSL', '✓ RBI Compliant', '🛡️ Zero Fraud'].map(b => (
          <span key={b} style={{ fontSize: 10, color: '#6B7280', display: 'flex', alignItems: 'center', gap: 4 }}>{b}</span>
        ))}
      </div>

      {/* ── Action buttons ── */}
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <button onClick={onBack} style={S.btnOutline}>← Back</button>
        <button onClick={handlePay}
          disabled={payMethod === 'wallet' && userWallet.balance < total}
          style={{ ...S.btnPrimary, background: payMethod === 'wallet' && userWallet.balance < total ? '#9CA3AF' : '#059669',
            cursor: payMethod === 'wallet' && userWallet.balance < total ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', gap: 8, padding: '10px 24px', fontSize: 14 }}>
          🔒 Pay ₹{total}
        </button>
      </div>
    </div>
  );
}

// ─── NEARBY HOSPITALS ─────────────────────────────────────────────────────────
function NearbyHospitalsView({ addToast, onClose }) {
  const [locStep, setLocStep] = useState('idle');
  const [locationName, setLocationName] = useState('');
  const [manualLoc, setManualLoc] = useState('');
  const [hospitals, setHospitals] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortHosp, setSortHosp] = useState('distance');
  const [wizardStep, setWizardStep] = useState(-99);
  const [selectedHosp, setSelectedHosp] = useState(null);
  const [selectedPurpose, setSelectedPurpose] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [bookingNote, setBookingNote] = useState('');
  const [confirmedBookings, setConfirmedBookings] = useState([]);
  const today = new Date().toISOString().split('T')[0];

  const getLocation = () => {
    setLocStep('locating');
    if (!navigator.geolocation) { setLocStep('error'); return; }
    navigator.geolocation.getCurrentPosition(
      () => { setLocationName('Your current location'); setLocStep('found'); loadHospitals('current'); },
      () => { setLocStep('error'); addToast('Could not get location. Please enter manually.', 'error'); },
      { timeout: 8000 }
    );
  };

  const applyManualLocation = () => {
    if (!manualLoc.trim()) { addToast('Please enter a location.', 'error'); return; }
    setLocationName(manualLoc.trim());
    setLocStep('found');
    loadHospitals('manual');
  };

  const loadHospitals = source => {
    setTimeout(() => {
      setHospitals(NEARBY_HOSPITALS_DB.default.map(h => ({ ...h, distance: source === 'manual' ? +(h.distance * 1.1).toFixed(1) : h.distance })));
    }, 600);
  };

  const filteredHosps = useMemo(() => {
    let list = [...hospitals];
    if (filterOpen) list = list.filter(h => h.openNow);
    return list.sort((a, b) => sortHosp === 'distance' ? a.distance - b.distance : b.rating - a.rating);
  }, [hospitals, filterOpen, sortHosp]);

  const availableDoctors = useMemo(() => {
    if (!selectedHosp || !selectedPurpose) return selectedHosp?.doctors || [];
    const purpose = PURPOSE_OPTIONS.find(p => p.value === selectedPurpose);
    if (!purpose || purpose.specs.length === 0) return selectedHosp.doctors;
    return selectedHosp.doctors.filter(d => purpose.specs.some(s => d.spec.toLowerCase().includes(s.toLowerCase())));
  }, [selectedHosp, selectedPurpose]);

  const startBooking = hosp => {
    setSelectedHosp(hosp); setSelectedPurpose(null); setSelectedDoctor(null);
    setSelectedSlot(null); setSelectedDate(today);
    setPatientName(''); setPatientPhone(''); setBookingNote('');
    setWizardStep(0);
  };

  const confirmBooking = () => {
    const booking = {
      id: Date.now(), hospital: selectedHosp.name, hospitalAddr: selectedHosp.address,
      doctor: selectedDoctor.name, spec: selectedDoctor.spec, slot: selectedSlot,
      date: selectedDate, purpose: PURPOSE_OPTIONS.find(p => p.value === selectedPurpose)?.label,
      patient: patientName, fee: selectedDoctor.fee,
      ref: 'APT' + Math.random().toString(36).slice(2, 8).toUpperCase(),
    };
    setConfirmedBookings(prev => [booking, ...prev]);
    setWizardStep(4);
    addToast(`✓ Appointment confirmed at ${selectedHosp.name}!`, 'success');
    try { const ex = JSON.parse(localStorage.getItem('sc_hospital_appointments') || '[]'); ex.unshift(booking); localStorage.setItem('sc_hospital_appointments', JSON.stringify(ex)); } catch {}
  };

  const WIZARD_STEPS = ['Purpose', 'Hospital', 'Doctor & Slot', 'Confirm'];

  if (locStep === 'idle' || locStep === 'locating' || locStep === 'error') {
    return (
      <div>
        <div style={{ textAlign: 'center', padding: '1.5rem 0 1rem' }}>
          <div style={{ fontSize: 52, marginBottom: 12 }}>🏥</div>
          <h3 style={{ fontWeight: 700, fontSize: 20, marginBottom: 8 }}>Find Hospitals Near You</h3>
          <p style={{ color: '#6B7280', fontSize: 14, marginBottom: 24, lineHeight: 1.7 }}>Share your location or enter an area to discover nearby hospitals, check doctor availability, and book appointments instantly.</p>
        </div>
        <button onClick={getLocation} disabled={locStep === 'locating'}
          style={{ ...S.btnPrimary, width: '100%', padding: '12px 0', fontSize: 14, marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: locStep === 'locating' ? '#9CA3AF' : 'var(--blue)' }}>
          {locStep === 'locating' ? (<><span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⟳</span> Locating…</>) : (<>📍 Use My Current Location</>)}
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '12px 0' }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,.08)' }} />
          <span style={{ fontSize: 12, color: '#9CA3AF' }}>or enter manually</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,.08)' }} />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input style={{ ...S.input, flex: 1 }} placeholder="e.g. Somajiguda, Hyderabad…" value={manualLoc} onChange={e => setManualLoc(e.target.value)} onKeyDown={e => e.key === 'Enter' && applyManualLocation()} />
          <button onClick={applyManualLocation} style={S.btnPrimary}>Search</button>
        </div>
        {locStep === 'error' && (<div style={{ marginTop: 12, padding: '10px 14px', background: 'rgba(239,68,68,.06)', border: '1px solid rgba(239,68,68,.15)', borderRadius: 8, fontSize: 13, color: '#dc2626' }}>⚠ Location access denied. Please enter your area manually.</div>)}
        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>Popular areas</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {['Somajiguda', 'Banjara Hills', 'HITEC City', 'Jubilee Hills', 'Gachibowli', 'Secunderabad'].map(area => (
              <button key={area} onClick={() => setManualLoc(area)} style={{ fontSize: 12, padding: '5px 14px', borderRadius: 20, border: '1px solid rgba(0,0,0,.1)', background: '#fff', cursor: 'pointer', color: '#374151', transition: 'all .15s' }}>{area}</button>
            ))}
          </div>
        </div>
        {confirmedBookings.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <div style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 10 }}>Your hospital bookings</div>
            {confirmedBookings.map(b => (
              <div key={b.id} style={{ ...S.card, marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div><div style={{ fontWeight: 600, fontSize: 13 }}>{b.hospital}</div><div style={{ fontSize: 12, color: '#6B7280' }}>{b.doctor} · {b.slot}</div><div style={{ fontSize: 11, color: '#9CA3AF' }}>Ref: {b.ref}</div></div>
                <div style={{ textAlign: 'right' }}><div style={{ fontSize: 11, padding: '3px 8px', borderRadius: 20, background: 'rgba(16,185,129,.1)', color: '#059669', fontWeight: 600 }}>✓ Confirmed</div><div style={{ fontSize: 12, color: 'var(--blue)', fontWeight: 700, marginTop: 4 }}>₹{b.fee}</div></div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (wizardStep >= 0 && selectedHosp && wizardStep < 5) {
    return (
      <div>
        <button onClick={() => { if (wizardStep === 4) { setWizardStep(-1); setSelectedHosp(null); } else if (wizardStep === 0) { setSelectedHosp(null); setWizardStep(-99); } else setWizardStep(w => w - 1); }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--blue)', fontSize: 13, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
          ← {wizardStep === 4 ? 'Back to hospitals' : 'Back'}
        </button>
        {wizardStep < 4 && <StepIndicator steps={WIZARD_STEPS} current={wizardStep} />}

        {wizardStep === 0 && (
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Why are you visiting?</div>
            <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 16 }}>Select the purpose of your visit to <strong>{selectedHosp.name}</strong>.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 8 }}>
              {PURPOSE_OPTIONS.map(p => (
                <button key={p.value} onClick={() => setSelectedPurpose(p.value)}
                  style={{ padding: '12px 10px', borderRadius: 10, cursor: 'pointer', textAlign: 'center',
                    border: selectedPurpose === p.value ? '2px solid var(--blue)' : '1px solid rgba(0,0,0,.1)',
                    background: selectedPurpose === p.value ? 'rgba(14,165,233,.08)' : '#fff', transition: 'all .15s' }}>
                  <div style={{ fontSize: 24, marginBottom: 6 }}>{p.icon}</div>
                  <div style={{ fontSize: 12, fontWeight: selectedPurpose === p.value ? 700 : 500, color: selectedPurpose === p.value ? 'var(--blue)' : '#374151' }}>{p.label}</div>
                </button>
              ))}
            </div>
            <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => selectedPurpose && setWizardStep(2)} style={{ ...S.btnPrimary, opacity: selectedPurpose ? 1 : 0.4 }}>Next →</button>
            </div>
          </div>
        )}

        {wizardStep === 2 && (
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Pick a Doctor & Time</div>
            <div style={{ marginBottom: 16 }}><label style={S.label}>Appointment Date</label><input type="date" min={today} value={selectedDate} onChange={e => setSelectedDate(e.target.value)} style={{ ...S.input, maxWidth: 200 }} /></div>
            {availableDoctors.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '1.5rem', color: '#9CA3AF', fontSize: 13 }}>
                No doctors available for this specialty.<br />
                <button onClick={() => setWizardStep(0)} style={{ ...S.btnOutline, marginTop: 10, fontSize: 12 }}>Change purpose</button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {availableDoctors.map(doc => (
                  <div key={doc.name} style={{ ...S.card, border: selectedDoctor?.name === doc.name ? '2px solid var(--blue)' : '1px solid rgba(0,0,0,.08)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 14 }}>{doc.name}</div>
                        <div style={{ fontSize: 12, color: '#6B7280' }}>{doc.spec}</div>
                        <div style={{ fontSize: 12, color: '#F59E0B' }}>{stars(doc.rating)} {doc.rating}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--blue)' }}>₹{doc.fee}</div>
                        <div style={{ fontSize: 11, color: '#9CA3AF' }}>consultation fee</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {doc.slots.map(slot => {
                        const taken = doc.taken.includes(slot);
                        const isSelected = selectedDoctor?.name === doc.name && selectedSlot === slot;
                        return (
                          <button key={slot} disabled={taken} onClick={() => { setSelectedDoctor(doc); setSelectedSlot(slot); }}
                            style={{ padding: '5px 12px', borderRadius: 7, fontSize: 12, cursor: taken ? 'not-allowed' : 'pointer',
                              border: isSelected ? '2px solid var(--blue)' : taken ? '1px solid rgba(0,0,0,.06)' : '1px solid rgba(0,0,0,.1)',
                              background: taken ? 'rgba(0,0,0,.03)' : isSelected ? 'rgba(14,165,233,.12)' : '#fff',
                              color: taken ? '#C4C4C4' : isSelected ? 'var(--blue)' : '#374151',
                              textDecoration: taken ? 'line-through' : 'none' }}>
                            {slot}{taken && ' ✕'}
                          </button>
                        );
                      })}
                    </div>
                    {selectedDoctor?.name === doc.name && selectedSlot && (
                      <div style={{ marginTop: 10, padding: '8px 10px', background: 'rgba(16,185,129,.06)', borderRadius: 7, fontSize: 12, color: '#059669', fontWeight: 600 }}>✓ Selected: {selectedSlot}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
            {selectedDoctor && selectedSlot && (
              <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={() => setWizardStep(3)} style={S.btnPrimary}>Next: Confirm →</button>
              </div>
            )}
          </div>
        )}

        {wizardStep === 3 && (
          <HospitalPaymentStep
            selectedHosp={selectedHosp}
            selectedDoctor={selectedDoctor}
            selectedSlot={selectedSlot}
            selectedDate={selectedDate}
            selectedPurpose={selectedPurpose}
            patientName={patientName} setPatientName={setPatientName}
            patientPhone={patientPhone} setPatientPhone={setPatientPhone}
            bookingNote={bookingNote} setBookingNote={setBookingNote}
            onBack={() => setWizardStep(2)}
            onConfirm={() => {
              if (!patientName.trim() || !patientPhone.trim()) { addToast('Please fill in patient name and phone.', 'error'); return; }
              confirmBooking();
            }}
            addToast={addToast}
          />
        )}

        {wizardStep === 4 && confirmedBookings[0] && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 60, marginBottom: 12, animation: 'bounceIn .5s' }}>🎉</div>
            <h3 style={{ fontWeight: 700, fontSize: 20, color: '#059669', marginBottom: 8 }}>Appointment Confirmed!</h3>
            <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 20, lineHeight: 1.7 }}>Your appointment has been booked successfully.<br />You'll receive a confirmation on your phone.</p>
            <div style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)', borderRadius: 16, padding: '1.25rem', color: '#fff', textAlign: 'left', marginBottom: 20 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', opacity: .7, marginBottom: 8 }}>Appointment Ticket</div>
              <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>{confirmedBookings[0].doctor}</div>
              <div style={{ fontSize: 13, opacity: .85, marginBottom: 14 }}>{confirmedBookings[0].spec} · {confirmedBookings[0].hospital}</div>
              <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                {[['Date', confirmedBookings[0].date], ['Time', confirmedBookings[0].slot], ['Fee', `₹${confirmedBookings[0].fee}`]].map(([l, v]) => (
                  <div key={l}><div style={{ fontSize: 10, opacity: .7, textTransform: 'uppercase' }}>{l}</div><div style={{ fontSize: 15, fontWeight: 700 }}>{v}</div></div>
                ))}
              </div>
              <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,.2)', fontSize: 11, opacity: .7 }}>Ref: {confirmedBookings[0].ref}</div>
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
              <button onClick={() => addToast('Appointment details sent!')} style={{ ...S.btnPrimary, background: '#059669' }}>📱 Send to Phone</button>
              <button onClick={() => { setSelectedHosp(null); setWizardStep(-99); onClose?.(); }} style={S.btnOutline}>← Close</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, padding: '10px 14px', background: 'rgba(14,165,233,.06)', borderRadius: 10, border: '1px solid rgba(14,165,233,.12)' }}>
        <span style={{ fontSize: 18 }}>📍</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: 14 }}>{locationName}</div>
          <div style={{ fontSize: 11, color: '#9CA3AF' }}>{hospitals.length} hospitals found nearby</div>
        </div>
        <button onClick={() => { setLocStep('idle'); setHospitals([]); setLocationName(''); setManualLoc(''); }}
          style={{ fontSize: 11, padding: '4px 10px', borderRadius: 20, border: '1px solid rgba(14,165,233,.3)', background: '#fff', color: 'var(--blue)', cursor: 'pointer', fontWeight: 600 }}>Change</button>
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap', alignItems: 'center' }}>
        <button onClick={() => setFilterOpen(f => !f)} style={{ fontSize: 12, padding: '5px 12px', borderRadius: 20, cursor: 'pointer', border: filterOpen ? '2px solid #059669' : '1px solid rgba(0,0,0,.1)', background: filterOpen ? 'rgba(16,185,129,.08)' : '#fff', color: filterOpen ? '#059669' : '#6B7280', fontWeight: filterOpen ? 700 : 400 }}>🟢 Open Now</button>
        <select value={sortHosp} onChange={e => setSortHosp(e.target.value)} style={{ fontSize: 12, padding: '5px 10px', borderRadius: 20, border: '1px solid rgba(0,0,0,.1)', background: '#fff' }}>
          <option value="distance">Sort: Distance</option>
          <option value="rating">Sort: Rating</option>
        </select>
        <span style={{ fontSize: 12, color: '#9CA3AF', marginLeft: 'auto' }}>{filteredHosps.length} hospitals</span>
      </div>
      {hospitals.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#9CA3AF', fontSize: 13 }}>⏳ Loading nearby hospitals…</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filteredHosps.map(hosp => (
            <div key={hosp.id} style={{ ...S.card, transition: 'box-shadow .2s' }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,0,0,.1)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                    <h4 style={{ fontWeight: 700, fontSize: 16, margin: 0 }}>{hosp.name}</h4>
                    {hosp.emergency && <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 20, background: 'rgba(239,68,68,.1)', color: '#dc2626', fontWeight: 700 }}>24/7 ER</span>}
                  </div>
                  <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 4 }}>📍 {hosp.address}</div>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 12, color: '#F59E0B' }}>{stars(hosp.rating)} <span style={{ color: '#9CA3AF' }}>{hosp.rating}</span></span>
                    <span style={{ fontSize: 11, color: '#9CA3AF' }}>{hosp.beds} beds</span>
                    <span style={{ fontSize: 11, padding: '2px 7px', borderRadius: 20, fontWeight: 600, background: hosp.openNow ? 'rgba(16,185,129,.1)' : 'rgba(239,68,68,.08)', color: hosp.openNow ? '#059669' : '#dc2626' }}>{hosp.openNow ? '● Open' : '○ Closed'}</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--blue)' }}>{hosp.distance} km</div>
                  <div style={{ fontSize: 10, color: '#9CA3AF' }}>away</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 10 }}>
                {hosp.departments.slice(0, 5).map(d => (<span key={d} style={{ fontSize: 10, padding: '2px 7px', borderRadius: 20, background: 'rgba(0,0,0,.03)', border: '1px solid rgba(0,0,0,.06)', color: '#6B7280' }}>{d}</span>))}
                {hosp.departments.length > 5 && <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 20, background: 'rgba(0,0,0,.03)', color: '#9CA3AF' }}>+{hosp.departments.length - 5} more</span>}
              </div>
              <div style={{ padding: '8px 10px', background: 'rgba(0,0,0,.02)', borderRadius: 8, marginBottom: 12, fontSize: 12, color: '#6B7280' }}>
                👨‍⚕️ <strong>{hosp.doctors.filter(d => d.slots.some(s => !d.taken.includes(s))).length}</strong> doctors available · <strong>{hosp.doctors.reduce((a, d) => a + d.slots.filter(s => !d.taken.includes(s)).length, 0)}</strong> open slots today
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => startBooking(hosp)} style={{ ...S.btnPrimary, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>📅 Book Appointment</button>
                <button onClick={() => addToast(`Calling ${hosp.name}: ${hosp.phone}`)} style={{ ...S.btnOutline, display: 'flex', alignItems: 'center', gap: 6 }}>📞 Call</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── CONSULTATION FLOW MODAL ──────────────────────────────────────────────────
function ConsultationFlowModal({ show, onClose, consultType, onStartConsult, addToast, preselectedDoc, walletBalance, onDeductFunds }) {
  const [step, setStep] = useState(0);
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(preselectedDoc || null);
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [duration, setDuration] = useState(10);
  const [estimatedCost, setEstimatedCost] = useState(0);

  // Add safety - ensure walletBalance is a number
  const safeWalletBalance = typeof walletBalance === 'number' && !isNaN(walletBalance) ? walletBalance : 2500;

  useEffect(() => {
    if (preselectedDoc) { 
      setSelectedDoctor(preselectedDoc); 
      setSelectedSpecialty(preselectedDoc.spec); 
      setStep(2); 
    } else { 
      setStep(0); 
      setSelectedDoctor(null); 
      setSelectedSpecialty(''); 
    }
  }, [preselectedDoc, show]);

  useEffect(() => { 
    if (selectedDoctor && selectedDoctor.rate && duration) {
      const cost = selectedDoctor.rate * duration;
      setEstimatedCost(isNaN(cost) ? 0 : cost);
    } else {
      setEstimatedCost(0);
    }
  }, [selectedDoctor, duration]);

  const steps = ['Specialty', 'Doctor', 'Details', 'Payment'];
  const availableDoctors = useMemo(() => selectedSpecialty ? DOCTORS.filter(d => d.spec === selectedSpecialty && d.status === 'online') : [], [selectedSpecialty]);
  const getSpecialties = () => [...new Set(DOCTORS.filter(d => d.status === 'online').map(d => d.spec))];

  const handlePayment = () => {
    // Add safety checks
    if (isNaN(estimatedCost) || estimatedCost <= 0) {
      addToast('Invalid payment amount', 'error');
      return;
    }
    
    if (safeWalletBalance >= estimatedCost) {
      if (onDeductFunds) {
        onDeductFunds(estimatedCost, `${consultType} consultation with ${selectedDoctor.name}`);
      } else {
        addToast('Payment system error. Please try again.', 'error');
        return;
      }
      addToast(`Payment successful! ₹${estimatedCost} deducted.`, 'success');
      onStartConsult(selectedDoctor, consultType, duration, patientName, symptoms, patientPhone);
      onClose(); 
      setStep(0); 
      setSelectedSpecialty(''); 
      setSelectedDoctor(null); 
      setPatientName(''); 
      setPatientAge(''); 
      setPatientPhone(''); 
      setSymptoms(''); 
      setDuration(10);
    } else {
      const needed = estimatedCost - safeWalletBalance;
      addToast(`Insufficient wallet balance. Need ₹${isNaN(needed) ? estimatedCost : needed} more. Please add funds.`, 'error');
    }
  };

  const typeIcons = { video: '📹', phone: '📞', chat: '💬' };
  const typeLabels = { video: 'Video', phone: 'Phone', chat: 'Chat' };

  return (
    <Modal show={show} onClose={() => { onClose(); setStep(0); }} title={`${typeIcons[consultType] || '🩺'} ${typeLabels[consultType] || ''} Consultation`} wide>
      <StepIndicator steps={steps} current={step} />

      {step === 0 && (
        <div>
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Select Medical Specialty</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
            {getSpecialties().map(spec => (
              <button key={spec} onClick={() => { setSelectedSpecialty(spec); setStep(1); }}
                style={{ padding: '14px 12px', borderRadius: 12, cursor: 'pointer', textAlign: 'center', border: '1px solid rgba(0,0,0,.1)', background: '#fff', fontSize: 14, fontWeight: 500, transition: 'all .15s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--blue)'; e.currentTarget.style.background = 'rgba(14,165,233,.04)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,.1)'; e.currentTarget.style.background = '#fff'; }}>
                {spec}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 1 && (
        <div>
          <button onClick={() => setStep(0)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--blue)', fontSize: 13, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>← Back to Specialties</button>
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Choose a {selectedSpecialty}</div>
          {availableDoctors.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#9CA3AF' }}>No doctors available right now.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {availableDoctors.map(doc => (
                <div key={doc.id} onClick={() => { setSelectedDoctor(doc); setStep(2); }}
                  style={{ ...S.card, cursor: 'pointer', transition: 'all .15s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--blue)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(14,165,233,.1)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,.08)'; e.currentTarget.style.boxShadow = 'none'; }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Avatar src={doc.img} name={doc.name} size={50} pulse={doc.status === 'online'} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 15 }}>{doc.name}</div>
                      <div style={{ fontSize: 12, color: '#6B7280' }}>{doc.spec} · {doc.exp} · {doc.lang}</div>
                      <div style={{ fontSize: 12, color: '#F59E0B' }}>{stars(doc.rating)} {doc.rating}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--blue)' }}>₹{doc.rate}<span style={{ fontSize: 12, fontWeight: 400 }}>/min</span></div>
                      <StatusBadge status={doc.status} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {step === 2 && (
        <div>
          <button onClick={() => preselectedDoc ? onClose() : setStep(1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--blue)', fontSize: 13, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>← Back</button>
          <div style={{ ...S.card, marginBottom: 20, background: 'rgba(14,165,233,.04)', border: '1px solid rgba(14,165,233,.12)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Avatar src={selectedDoctor?.img} name={selectedDoctor?.name || ''} size={48} pulse />
              <div><div style={{ fontWeight: 700 }}>{selectedDoctor?.name}</div><div style={{ fontSize: 12, color: '#6B7280' }}>{selectedDoctor?.spec} · ₹{selectedDoctor?.rate}/min</div><WaitBadge wait={selectedDoctor?.waitTime} /></div>
            </div>
          </div>
          <div style={{ marginBottom: 14 }}><label style={S.label}>Patient Name *</label><input style={S.input} placeholder="Full name" value={patientName} onChange={e => setPatientName(e.target.value)} /></div>
          {consultType === 'phone' && (<div style={{ marginBottom: 14 }}><label style={S.label}>Phone Number *</label><input style={S.input} type="tel" placeholder="+91 XXXXX XXXXX" value={patientPhone} onChange={e => setPatientPhone(e.target.value)} /><div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 4 }}>Doctor will call you on this number</div></div>)}
          <div style={{ marginBottom: 14 }}><label style={S.label}>Patient Age</label><input style={S.input} type="number" placeholder="Age in years" value={patientAge} onChange={e => setPatientAge(e.target.value)} /></div>
          <div style={{ marginBottom: 14 }}><label style={S.label}>Symptoms / Reason</label><textarea style={{ ...S.input, resize: 'vertical', minHeight: 70 }} placeholder="Describe symptoms or reason..." value={symptoms} onChange={e => setSymptoms(e.target.value)} /></div>
          <div style={{ marginBottom: 16 }}>
            <label style={S.label}>Duration: {duration} minutes</label>
            <input type="range" min="5" max="30" step="5" value={duration} onChange={e => setDuration(parseInt(e.target.value))} style={{ width: '100%', accentColor: 'var(--blue)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#9CA3AF' }}><span>5 min</span><span>30 min</span></div>
          </div>
          <div style={{ background: 'rgba(14,165,233,.06)', borderRadius: 10, padding: '14px', marginBottom: 20, border: '1px solid rgba(14,165,233,.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13 }}><span style={{ color: '#6B7280' }}>Rate:</span><span style={{ fontWeight: 600 }}>₹{selectedDoctor?.rate}/min</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13 }}><span style={{ color: '#6B7280' }}>Duration:</span><span style={{ fontWeight: 600 }}>{duration} min</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 8, borderTop: '1px solid rgba(0,0,0,.08)', fontSize: 15 }}><span style={{ fontWeight: 600 }}>Estimated Cost:</span><span style={{ fontSize: 20, fontWeight: 800, color: 'var(--blue)' }}>₹{estimatedCost}</span></div>
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button onClick={onClose} style={S.btnOutline}>Cancel</button>
            <button onClick={() => { if (!patientName.trim()) { addToast('Please enter patient name', 'error'); return; } if (consultType === 'phone' && !patientPhone.trim()) { addToast('Please enter phone number', 'error'); return; } setStep(3); }} style={S.btnPrimary}>Proceed to Payment →</button>
          </div>
        </div>
      )}

      {step === 3 && (
  <div>
    <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Payment Details</div>
    <div style={{ ...S.card, marginBottom: 16 }}>
      <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 10, fontWeight: 600, textTransform: 'uppercase' }}>Order Summary</div>
      {[
        ['Consultation', `${typeLabels[consultType]} with ${selectedDoctor?.name || ''}`],
        ['Duration', `${duration} minutes`],
        ['Rate', `₹${selectedDoctor?.rate || 0}/min`]
      ].map(([l, v]) => (
        <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(0,0,0,.05)', fontSize: 13 }}>
          <span style={{ color: '#6B7280' }}>{l}</span>
          <span style={{ fontWeight: 500 }}>{v}</span>
        </div>
      ))}
      <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 10, fontSize: 16 }}>
        <span style={{ fontWeight: 700 }}>Total</span>
        <span style={{ fontWeight: 800, color: 'var(--blue)' }}>₹{isNaN(estimatedCost) ? 0 : estimatedCost}</span>
      </div>
    </div>
    <div style={{ ...S.card, marginBottom: 16, background: 'rgba(16,185,129,.04)', border: '1px solid rgba(16,185,129,.15)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontWeight: 600, color: '#059669', fontSize: 13 }}>💳 Wallet Balance</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: '#059669' }}>₹{safeWalletBalance}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 4 }}>After payment</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: safeWalletBalance >= estimatedCost ? '#374151' : '#dc2626' }}>
            ₹{Math.max(0, safeWalletBalance - (isNaN(estimatedCost) ? 0 : estimatedCost))}
          </div>
        </div>
      </div>
    </div>
    {safeWalletBalance < estimatedCost && (
      <div style={{ background: 'rgba(239,68,68,.08)', borderRadius: 8, padding: 12, marginBottom: 16, color: '#dc2626', fontSize: 13, textAlign: 'center', border: '1px solid rgba(239,68,68,.2)' }}>
        ⚠ Insufficient balance (need ₹{isNaN(estimatedCost - safeWalletBalance) ? estimatedCost : estimatedCost - safeWalletBalance} more). Add funds to your wallet.
      </div>
    )}
    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
      <button onClick={() => setStep(2)} style={S.btnOutline}>← Back</button>
      <button 
        onClick={handlePayment} 
        disabled={safeWalletBalance < estimatedCost || isNaN(estimatedCost) || estimatedCost <= 0}
        style={{ 
          ...S.btnPrimary, 
          background: (safeWalletBalance >= estimatedCost && !isNaN(estimatedCost) && estimatedCost > 0) ? '#059669' : '#9CA3AF', 
          cursor: (safeWalletBalance >= estimatedCost && !isNaN(estimatedCost) && estimatedCost > 0) ? 'pointer' : 'not-allowed', 
          display: 'flex', 
          alignItems: 'center', 
          gap: 6 
        }}>
        💳 Pay ₹{isNaN(estimatedCost) ? 0 : estimatedCost}
      </button>
    </div>
  </div>
)}
    </Modal>
  );
}

// ─── LIVE CONSULT TIMER / WRAPPER ────────────────────────────────────────────
function ConsultTimer({ doc, rate, onEnd, consultType, patientName, patientPhone, walletBalance, onDeductFunds }) {
  const [seconds, setSeconds] = useState(0);
  const [paused, setPaused] = useState(false);
  const [notes, setNotes] = useState('');
  const [view, setView] = useState('communication');
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!paused) {
      intervalRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [paused]);

const handleEndCall = (duration) => {
  const cost = ((duration / 60) * rate).toFixed(2);
  const costNumber = parseFloat(cost);
  
  // Deduct from wallet using the prop
  if (onDeductFunds) {
    onDeductFunds(costNumber, `${consultType} consultation with ${doc.name} (${Math.floor(duration / 60)}m ${duration % 60}s)`);
  }
  
  onEnd(duration, cost, notes);
};
  if (view === 'communication') {
    if (consultType === 'video') return <VideoCall doctor={doc} patientName={patientName} onEndCall={handleEndCall} />;
    if (consultType === 'phone') return <PhoneCall doctor={doc} patientName={patientName} patientPhone={patientPhone} onEndCall={handleEndCall} />;
    if (consultType === 'chat') return <ChatInterface doctor={doc} patientName={patientName} onEndChat={handleEndCall} />;
  }

  const fmt = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  return (
    <div style={{ background: '#fff', borderRadius: 16, padding: '1.5rem', border: '2px solid var(--blue)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444', animation: 'pulse 1s infinite' }} />
        <span style={{ fontWeight: 700, fontSize: 15, color: '#ef4444' }}>LIVE · {consultType?.toUpperCase()}</span>
        <div style={{ marginLeft: 'auto' }}><StatusBadge status={doc.status} /></div>
      </div>
      <div style={{ display: 'flex', gap: 16, marginBottom: 20, alignItems: 'center' }}>
        <Avatar src={doc.img} name={doc.name} size={56} pulse />
        <div><div style={{ fontWeight: 700, fontSize: 16 }}>{doc.name}</div><div style={{ fontSize: 13, color: '#6B7280' }}>{doc.spec}</div></div>
      </div>
      <div style={{ textAlign: 'center', marginBottom: 20, padding: '1rem', background: 'rgba(14,165,233,.06)', borderRadius: 12 }}>
        <div style={{ fontSize: 48, fontWeight: 800, color: 'var(--blue)', fontVariantNumeric: 'tabular-nums', letterSpacing: 3 }}>{fmt(seconds)}</div>
        <div style={{ fontSize: 13, color: '#9CA3AF', marginTop: 4 }}>Duration</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
        <div style={{ background: 'rgba(16,185,129,.06)', borderRadius: 10, padding: '10px 14px', border: '1px solid rgba(16,185,129,.12)' }}>
          <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 4 }}>Cost so far</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#059669' }}>₹{((seconds / 60) * rate).toFixed(2)}</div>
        </div>
        <div style={{ background: 'rgba(14,165,233,.06)', borderRadius: 10, padding: '10px 14px', border: '1px solid rgba(14,165,233,.12)' }}>
          <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 4 }}>Rate</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--blue)' }}>₹{rate}/min</div>
        </div>
      </div>
      <div style={{ marginBottom: 16 }}><label style={S.label}>Session notes</label><textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Type notes…" style={{ ...S.input, resize: 'vertical', minHeight: 70 }} /></div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => setPaused(p => !p)} style={{ flex: 1, padding: '9px 0', borderRadius: 8, border: 'none', cursor: 'pointer', background: paused ? '#059669' : 'rgba(0,0,0,.06)', color: paused ? '#fff' : '#374151', fontSize: 13, fontWeight: 600 }}>{paused ? '▶ Resume' : '⏸ Pause'}</button>
        <button onClick={() => onEnd(seconds, ((seconds / 60) * rate).toFixed(2), notes)} style={{ flex: 1, padding: '9px 0', borderRadius: 8, border: 'none', cursor: 'pointer', background: '#ef4444', color: '#fff', fontSize: 13, fontWeight: 600 }}>■ End</button>
      </div>
    </div>
  );
}

// ─── SYMPTOM CHECKER ─────────────────────────────────────────────────────────
function SymptomChecker({ onFindDoctor }) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const check = () => {
    if (!input.trim()) return;
    setLoading(true);
    setTimeout(() => {
      const lower = input.toLowerCase();
      let found = null;
      for (const [key, val] of Object.entries(SYMPTOM_MAP)) {
        if (lower.includes(key)) { found = { key, ...val }; break; }
      }
      if (!found) found = { key: input, spec: 'General Physician', urgency: 'low', advice: 'Please consult a General Physician for a comprehensive evaluation.' };
      setResult(found);
      setHistory(prev => [{ input, result: found, time: new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}) }, ...prev.slice(0, 4)]);
      setLoading(false);
    }, 800);
  };

  const matchedDoctors = result ? DOCTORS.filter(d => d.spec === result.spec && d.status !== 'offline') : [];

  return (
    <div>
      <div style={{ background: 'rgba(14,165,233,.04)', borderRadius: 12, padding: '1rem', marginBottom: 16, border: '1px solid rgba(14,165,233,.12)' }}>
        <div style={{ ...S.label, marginBottom: 10 }}>🤖 AI Symptom Analyzer</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && check()} placeholder="Describe your symptom…" style={{ ...S.input, flex: 1 }} />
          <button onClick={check} disabled={loading} style={{ ...S.btnPrimary, whiteSpace: 'nowrap' }}>{loading ? '⟳' : 'Analyze'}</button>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 8 }}>
          {['chest pain', 'headache', 'fever', 'anxiety', 'acne', 'joint pain'].map(s => (
            <button key={s} onClick={() => setInput(s)} style={{ fontSize: 10, padding: '3px 8px', borderRadius: 20, background: '#fff', border: '1px solid rgba(0,0,0,.1)', cursor: 'pointer', color: '#6B7280' }}>{s}</button>
          ))}
        </div>
      </div>
      {result && (
        <div style={{ ...S.card, marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div style={{ fontWeight: 600, fontSize: 14 }}>Analysis Result</div>
            <UrgencyBadge level={result.urgency} />
          </div>
          <div style={{ fontSize: 13, color: '#374151', marginBottom: 8 }}><strong>Recommended:</strong> {result.spec}</div>
          <div style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.6, marginBottom: 12, padding: '8px 12px', background: 'rgba(0,0,0,.03)', borderRadius: 8 }}>💡 {result.advice}</div>
          {matchedDoctors.length > 0 && (
            <>
              <div style={{ ...S.label, marginBottom: 8 }}>Available {result.spec}s</div>
              {matchedDoctors.slice(0, 2).map(doc => (
                <div key={doc.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', background: 'rgba(14,165,233,.04)', borderRadius: 8, marginBottom: 6 }}>
                  <Avatar src={doc.img} name={doc.name} size={36} pulse={doc.status === 'online'} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{doc.name}</div>
                    <div style={{ fontSize: 11, color: '#9CA3AF' }}><WaitBadge wait={doc.waitTime} /> · ₹{doc.rate}/min</div>
                  </div>
                  <button onClick={() => onFindDoctor(doc.id)} style={{ ...S.btnPrimary, padding: '5px 12px', fontSize: 11 }}>View</button>
                </div>
              ))}
            </>
          )}
        </div>
      )}
      {history.length > 0 && (
        <div>
          <div style={{ ...S.label, marginBottom: 8 }}>Recent checks</div>
          {history.map((h, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(0,0,0,.04)', fontSize: 12 }}>
              <span style={{ color: '#374151' }}>{h.input}</span>
              <span style={{ color: '#9CA3AF' }}>{h.result.spec} · {h.time}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── BOOKING MODAL ────────────────────────────────────────────────────────────
// ─── BOOKING MODAL ────────────────────────────────────────────────────────────
function BookingModal({ doc, show, onClose, onBook, addToast, walletBalance, onDeductFunds }) {
  const today = new Date().toISOString().split('T')[0];
  const [slot, setSlot] = useState(null);
  const [date, setDate] = useState(today);
  const [reason, setReason] = useState('');
  const [consultType, setConsultType] = useState('video');
  const [duration, setDuration] = useState(10); // Add duration state
  const [processing, setProcessing] = useState(false);
  
  useEffect(() => { 
    if (doc?.preselectedSlot) setSlot(doc.preselectedSlot); 
  }, [doc]);

  // Calculate cost based on duration and doctor's rate
  const estimatedCost = doc ? doc.rate * duration : 0;
  const hasSufficientBalance = walletBalance >= estimatedCost;

  const confirm = () => { 
    if (!slot) { 
      addToast('Please select a time slot', 'error'); 
      return; 
    }
    if (!duration || duration < 5) {
      addToast('Minimum consultation duration is 5 minutes', 'error');
      return;
    }
    if (!hasSufficientBalance) {
      addToast(`Insufficient wallet balance. Need ₹${estimatedCost - walletBalance} more.`, 'error');
      return;
    }
    
    setProcessing(true);
    
    // Process payment
    setTimeout(() => {
      if (onDeductFunds) {
        onDeductFunds(estimatedCost, `${consultType} consultation with ${doc.name} (${duration} mins) on ${date} at ${slot}`);
      }
      
      // Create appointment with duration info
      const appointmentData = { 
        doc, 
        slot, 
        date, 
        reason, 
        consultType,
        duration,
        cost: estimatedCost,
        status: 'upcoming'
      };
      
      onBook(appointmentData);
      addToast(`✓ Appointment booked with ${doc.name}! ₹${estimatedCost} deducted from wallet.`, 'success');
      setProcessing(false);
      onClose(); 
      setSlot(null); 
      setReason('');
      setDuration(10);
    }, 1500);
  };

  if (!doc) return null;
  const recommended = doc.slots.find(s => !doc.taken.includes(s));

  return (
    <Modal show={show} onClose={onClose} title={`📅 Book – ${doc.name}`} footer={
      <>
        <button style={S.btnOutline} onClick={onClose} disabled={processing}>Cancel</button>
        <button 
          style={{
            ...S.btnPrimary, 
            background: hasSufficientBalance ? '#059669' : '#9CA3AF',
            cursor: hasSufficientBalance ? 'pointer' : 'not-allowed'
          }} 
          onClick={confirm}
          disabled={processing || !hasSufficientBalance}
        >
          {processing ? 'Processing...' : `✓ Confirm & Pay ₹${estimatedCost}`}
        </button>
      </>
    }>
      {/* Consultation Type */}
      <div style={{ marginBottom: 14 }}>
        <label style={S.label}>Consultation type</label>
        <div style={{ display: 'flex', gap: 8 }}>
          {[['video', '📹', 'Video'], ['phone', '📞', 'Phone'], ['chat', '💬', 'Chat']].map(([type, icon, label]) => (
            <button 
              key={type} 
              onClick={() => setConsultType(type)} 
              style={{ 
                flex: 1, 
                padding: '8px 0', 
                borderRadius: 8, 
                cursor: 'pointer', 
                fontSize: 13, 
                border: consultType === type ? '2px solid var(--blue)' : '1px solid rgba(0,0,0,.12)', 
                background: consultType === type ? 'rgba(14,165,233,.08)' : '#fff', 
                color: consultType === type ? 'var(--blue)' : '#374151', 
                fontWeight: consultType === type ? 600 : 400 
              }}
            >
              {icon} {label}
            </button>
          ))}
        </div>
      </div>

      {/* Date */}
      <div style={{ marginBottom: 14 }}>
        <label style={S.label}>Date</label>
        <input type="date" min={today} value={date} onChange={e => setDate(e.target.value)} style={S.input} />
      </div>

      {/* Available Slots */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <label style={{ ...S.label, marginBottom: 0 }}>Available slots</label>
          {recommended && <span style={{ fontSize: 11, color: '#059669', fontWeight: 600 }}>⚡ Earliest: {recommended}</span>}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {doc.slots.map(s => { 
            const taken = doc.taken.includes(s); 
            return (
              <button 
                key={s} 
                disabled={taken} 
                onClick={() => setSlot(s)} 
                style={{ 
                  padding: '6px 14px', 
                  borderRadius: 8, 
                  fontSize: 13, 
                  cursor: taken ? 'not-allowed' : 'pointer',
                  border: slot === s ? '2px solid var(--blue)' : '1px solid rgba(0,0,0,.12)',
                  background: taken ? 'rgba(0,0,0,.04)' : slot === s ? 'rgba(14,165,233,.12)' : '#fff',
                  color: taken ? '#9CA3AF' : slot === s ? 'var(--blue)' : '#374151',
                  textDecoration: taken ? 'line-through' : 'none', 
                  fontWeight: slot === s ? 700 : 400 
                }}
              >
                {s}{taken ? ' ✕' : ''}
              </button>
            );
          })}
        </div>
      </div>

      {/* Duration Selection */}
      <div style={{ marginBottom: 14 }}>
        <label style={S.label}>Consultation Duration</label>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
          {[5, 10, 15, 20, 30].map(min => (
            <button
              key={min}
              onClick={() => setDuration(min)}
              style={{
                padding: '6px 12px',
                borderRadius: 8,
                border: duration === min ? '2px solid var(--blue)' : '1px solid rgba(0,0,0,.12)',
                background: duration === min ? 'rgba(14,165,233,.1)' : '#fff',
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: duration === min ? 700 : 400,
                color: duration === min ? 'var(--blue)' : '#374151'
              }}
            >
              {min} min
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#6B7280' }}>
          <span>Min: 5 min</span>
          <span>Rate: ₹{doc.rate}/min</span>
          <span>Total: ₹{estimatedCost}</span>
        </div>
      </div>

      {/* Cost Preview Card */}
      {slot && (
        <div style={{ 
          background: 'rgba(14,165,233,.06)', 
          borderRadius: 10, 
          padding: '12px', 
          marginBottom: 14,
          border: '1px solid rgba(14,165,233,.12)'
        }}>
          <div style={{ fontWeight: 600, marginBottom: 8, fontSize: 12 }}>💰 Payment Summary</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
            <span style={{ color: '#6B7280' }}>Consultation Fee</span>
            <span>₹{doc.rate} × {duration} min = ₹{estimatedCost}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
            <span style={{ color: '#6B7280' }}>Wallet Balance</span>
            <span style={{ color: walletBalance >= estimatedCost ? '#059669' : '#dc2626' }}>
              ₹{walletBalance}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, paddingTop: 6, borderTop: '1px dashed rgba(0,0,0,.08)' }}>
            <span style={{ fontWeight: 600 }}>Amount to Pay</span>
            <span style={{ fontWeight: 700, color: '#059669' }}>₹{estimatedCost}</span>
          </div>
          {!hasSufficientBalance && (
            <div style={{ background: 'rgba(239,68,68,.1)', borderRadius: 6, padding: '8px', marginTop: 8, fontSize: 11, color: '#dc2626', textAlign: 'center' }}>
              ⚠ Insufficient balance. Need ₹{estimatedCost - walletBalance} more.
            </div>
          )}
        </div>
      )}

      {/* Reason for visit */}
      <div>
        <label style={S.label}>Reason for visit (optional)</label>
        <textarea 
          style={{ ...S.input, resize: 'vertical', minHeight: 60 }} 
          placeholder="Describe your symptoms or reason for visit..." 
          value={reason} 
          onChange={e => setReason(e.target.value)} 
        />
      </div>
    </Modal>
  );
}

// ─── REVIEW MODAL ─────────────────────────────────────────────────────────────
function ReviewModal({ show, onClose, onSubmit, docName }) {
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  return (
    <Modal show={show} onClose={onClose} title={`⭐ Rate – ${docName || ''}`} footer={<><button onClick={onClose} style={S.btnOutline}>Cancel</button><button onClick={() => { onSubmit(rating, text); onClose(); }} style={S.btnPrimary}>Submit Review</button></>}>
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <div style={{ fontSize: 14, color: '#6B7280', marginBottom: 12 }}>How was your experience?</div>
        <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
          {[1, 2, 3, 4, 5].map(i => (<span key={i} onClick={() => setRating(i)} style={{ cursor: 'pointer', color: i <= rating ? '#F59E0B' : '#D1D5DB', fontSize: 38, transition: 'color .15s, transform .1s', display: 'inline-block' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.2)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>★</span>))}
        </div>
        <div style={{ fontSize: 14, color: '#9CA3AF', marginTop: 8, fontWeight: 600 }}>{['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'][rating]}</div>
      </div>
      <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Share your experience (optional)…" style={{ ...S.input, resize: 'vertical', minHeight: 80 }} />
    </Modal>
  );
}

// ─── DOCTOR CARD ──────────────────────────────────────────────────────────────
function DoctorCard({ doc, isFav, onFav, onBook, onCompare, isCompared, onDetail, openConsultFlow }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div style={{ background: '#fff', border: isCompared ? '2px solid var(--blue)' : '1px solid rgba(0,0,0,.08)', borderRadius: 16, padding: '1rem', position: 'relative', transition: 'box-shadow .2s, transform .2s', cursor: 'pointer', boxShadow: hovered ? '0 8px 28px rgba(0,0,0,.12)' : '0 1px 4px rgba(0,0,0,.05)', transform: hovered ? 'translateY(-3px)' : 'none' }} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onClick={() => onDetail(doc.id)}>
      <button onClick={e => { e.stopPropagation(); onFav(doc.id); }} style={{ position: 'absolute', top: 10, right: 10, background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: isFav ? '#F59E0B' : '#D1D5DB', lineHeight: 1, transition: 'color .15s, transform .15s' }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.2)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>★</button>
      <button onClick={e => { e.stopPropagation(); onCompare(doc.id); }} title={isCompared ? 'Remove from compare' : 'Add to compare'} style={{ position: 'absolute', top: 10, right: 34, background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: isCompared ? 'var(--blue)' : '#D1D5DB', lineHeight: 1 }}>⇄</button>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <Avatar src={doc.img} name={doc.name} size={48} pulse={doc.status === 'online'} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 14 }}>{doc.name}</div>
          <div style={{ fontSize: 12, color: '#6B7280' }}>{doc.spec}</div>
          {doc.successRate && <div style={{ fontSize: 10, color: '#059669', fontWeight: 700 }}>✓ {doc.successRate}% success</div>}
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}><StatusBadge status={doc.status} /><WaitBadge wait={doc.waitTime} /></div>
      <div style={{ fontSize: 12, color: '#F59E0B', marginBottom: 4 }}>{stars(doc.rating)} <span style={{ color: '#6B7280' }}>{doc.rating} ({doc.reviews})</span></div>
      <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 8 }}>{doc.exp} · {doc.lang}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>{doc.skills.slice(0, 2).map(s => <SkillTag key={s} label={s} />)}</div>
      {doc.nextAvailable && <div style={{ fontSize: 11, color: '#d97706', marginBottom: 8 }}>🕐 Next: {doc.nextAvailable}</div>}
      <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--blue)', marginBottom: 10 }}>₹{doc.rate}<span style={{ fontSize: 12, fontWeight: 400, color: '#9CA3AF' }}>/min</span></div>
      <div style={{ display: 'flex', gap: 6 }} onClick={e => e.stopPropagation()}>
        {doc.status !== 'offline' ? (
          <>
            <button onClick={() => openConsultFlow('video', doc)} style={{ flex: 1, padding: '6px 0', borderRadius: 8, border: 'none', cursor: 'pointer', background: 'var(--blue)', color: '#fff', fontSize: 11, fontWeight: 600, transition: 'opacity .15s' }}>📹 Video</button>
            <button onClick={() => openConsultFlow('phone', doc)} style={{ flex: 1, padding: '6px 0', borderRadius: 8, border: 'none', cursor: 'pointer', background: '#059669', color: '#fff', fontSize: 11, fontWeight: 600 }}>📞 Call</button>
            <button onClick={() => onBook(doc)} style={{ flex: 1, padding: '6px 0', borderRadius: 8, border: '1px solid rgba(0,0,0,.15)', background: '#fff', cursor: 'pointer', fontSize: 11 }}>📅 Book</button>
          </>
        ) : (
          <button onClick={() => onFav(doc.id)} style={{ width: '100%', padding: '7px 0', borderRadius: 8, border: '1px solid rgba(0,0,0,.15)', background: '#fff', cursor: 'pointer', fontSize: 12 }}>🔔 Notify when online</button>
        )}
      </div>
    </div>
  );
}

// ─── DOCTOR DETAIL ────────────────────────────────────────────────────────────
function DoctorDetail({ doc, isFav, onFav, onBook, onClose, openConsultFlow, consultHistory }) {
  const [selSlot, setSelSlot] = useState(null);
  const [showReview, setShowReview] = useState(false);
  const [localReviews, setLocalReviews] = useState(doc?.reviewsList || []);
  useEffect(() => { setLocalReviews(doc?.reviewsList || []); }, [doc]);
  if (!doc) return null;
  const pastConsult = consultHistory.find(c => c.docId === doc.id);
  return (
    <div style={{ ...S.card }}>
      <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--blue)', fontSize: 13, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>← Back to doctors</button>
      <div style={{ display: 'flex', gap: 16, marginBottom: 16, alignItems: 'flex-start' }}>
        <Avatar src={doc.img} name={doc.name} size={72} pulse={doc.status === 'online'} />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <h4 style={{ margin: 0, fontWeight: 700, fontSize: 18 }}>{doc.name}</h4>
            <button onClick={() => onFav(doc.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: isFav ? '#F59E0B' : '#D1D5DB', lineHeight: 1 }}>★</button>
          </div>
          <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 6 }}>{doc.spec} · {doc.exp} · {doc.lang}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}><StatusBadge status={doc.status} /><WaitBadge wait={doc.waitTime} /></div>
          <div style={{ fontSize: 13, color: '#F59E0B', marginTop: 6 }}>{stars(doc.rating)} <span style={{ color: '#6B7280' }}>{doc.rating} ({doc.reviews} reviews)</span></div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}><div style={{ fontSize: 22, fontWeight: 700, color: 'var(--blue)' }}>₹{doc.rate}<span style={{ fontSize: 13, fontWeight: 400, color: '#9CA3AF' }}>/min</span></div></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 16 }}>
        {[{ label: 'Consultations', value: doc.consultCount?.toLocaleString() || '—' }, { label: 'Success rate', value: `${doc.successRate}%` }, { label: 'Reviews', value: doc.reviews }].map(s => (
          <div key={s.label} style={{ background: 'rgba(0,0,0,.03)', borderRadius: 8, padding: '8px 10px', textAlign: 'center' }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--blue)' }}>{s.value}</div>
            <div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>
      <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.7, marginBottom: 12 }}>{doc.bio}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>{doc.skills.map(s => <SkillTag key={s} label={s} />)}</div>
      {pastConsult && (
        <div style={{ background: 'rgba(16,185,129,.06)', borderRadius: 10, padding: '10px 12px', border: '1px solid rgba(16,185,129,.15)', marginBottom: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#059669', marginBottom: 4 }}>✓ Previous consultation</div>
          <div style={{ fontSize: 12, color: '#6B7280' }}>Duration: {Math.floor(pastConsult.duration / 60)}m {pastConsult.duration % 60}s · Cost: ₹{pastConsult.cost}</div>
          {pastConsult.notes && <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 4 }}>Notes: {pastConsult.notes}</div>}
        </div>
      )}
      {doc.status !== 'offline' && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          <button onClick={() => openConsultFlow('video', doc)} style={{ flex: 1, padding: '10px 0', borderRadius: 8, border: 'none', cursor: 'pointer', background: 'var(--blue)', color: '#fff', fontSize: 13, fontWeight: 600 }}>📹 Start Video</button>
          <button onClick={() => openConsultFlow('phone', doc)} style={{ flex: 1, padding: '10px 0', borderRadius: 8, border: 'none', cursor: 'pointer', background: '#059669', color: '#fff', fontSize: 13, fontWeight: 600 }}>📞 Call Now</button>
          <button onClick={() => openConsultFlow('chat', doc)} style={{ flex: 1, padding: '10px 0', borderRadius: 8, border: 'none', cursor: 'pointer', background: '#7c3aed', color: '#fff', fontSize: 13, fontWeight: 600 }}>💬 Chat</button>
        </div>
      )}
      <div style={{ marginBottom: 20 }}>
        <div style={{ ...S.label, marginBottom: 8 }}>Book a slot</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
          {doc.slots.map(s => { const taken = doc.taken.includes(s); return (
            <button key={s} disabled={taken} onClick={() => setSelSlot(s)} style={{ padding: '7px 14px', borderRadius: 8, fontSize: 12, cursor: taken ? 'not-allowed' : 'pointer', border: selSlot === s ? '2px solid var(--blue)' : '1px solid rgba(0,0,0,.1)', background: taken ? 'rgba(0,0,0,.04)' : selSlot === s ? 'rgba(14,165,233,.12)' : '#fff', color: taken ? '#9CA3AF' : selSlot === s ? 'var(--blue)' : 'inherit', textDecoration: taken ? 'line-through' : 'none', fontWeight: selSlot === s ? 700 : 400 }}>{s}{taken ? ' ✕' : ''}</button>
          ); })}
        </div>
        {selSlot && <button onClick={() => onBook(doc, selSlot)} style={S.btnPrimary}>✓ Book {selSlot}</button>}
      </div>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={S.label}>Patient reviews</div>
          <button onClick={() => setShowReview(true)} style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, border: '1px solid rgba(14,165,233,.3)', background: 'rgba(14,165,233,.06)', color: 'var(--blue)', cursor: 'pointer', fontWeight: 600 }}>+ Write a review</button>
        </div>
        {localReviews.map((r, i) => (
          <div key={i} style={{ paddingBottom: 12, marginBottom: 12, borderBottom: i < localReviews.length - 1 ? '1px solid rgba(0,0,0,.06)' : 'none' }}>
            <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 3 }}>{r.author} <span style={{ color: '#F59E0B', fontSize: 11 }}>{'★'.repeat(r.rating || 5)}</span>{r.date && <span style={{ color: '#9CA3AF', fontWeight: 400, fontSize: 11 }}> · {r.date}</span>}</div>
            <div style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.6 }}>{r.text}</div>
          </div>
        ))}
      </div>
      <ReviewModal show={showReview} onClose={() => setShowReview(false)} docName={doc.name} onSubmit={(rating, text) => { if (text.trim()) setLocalReviews(prev => [{ author: 'You', rating, text, date: 'Just now' }, ...prev]); }} />
    </div>
  );
}

// ─── COMPARE PANEL ────────────────────────────────────────────────────────────
function ComparePanel({ ids, onRemove, onBook, openConsultFlow }) {
  if (ids.length < 2) {
    return (<div style={{ textAlign: 'center', padding: '2rem', color: '#9CA3AF', fontSize: 13 }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>⇄</div>
      Select 2 doctors using the ⇄ button on their cards to compare.
    </div>);
  }
  const [a, b] = ids.map(id => DOCTORS.find(d => d.id === id));
  const metrics = [{ label: 'Rating', va: a.rating, vb: b.rating, higher: true, fmt: v => `${v} ★` }, { label: 'Rate (₹/min)', va: a.rate, vb: b.rate, higher: false, fmt: v => `₹${v}` }, { label: 'Experience', va: parseInt(a.exp), vb: parseInt(b.exp), higher: true, fmt: (v, d) => d.exp }, { label: 'Reviews', va: a.reviews, vb: b.reviews, higher: true, fmt: v => v }, { label: 'Success rate', va: a.successRate, vb: b.successRate, higher: true, fmt: v => `${v}%` }, { label: 'Consults', va: a.consultCount, vb: b.consultCount, higher: true, fmt: v => v?.toLocaleString() }];
  const scoreA = metrics.filter(m => m.higher ? m.va >= m.vb : m.va <= m.vb).length;
  const scoreB = metrics.filter(m => m.higher ? m.vb >= m.va : m.vb <= m.va).length;
  return (
    <div>
      <div style={{ background: 'rgba(14,165,233,.04)', borderRadius: 12, padding: '10px 14px', marginBottom: 16, border: '1px solid rgba(14,165,233,.12)', textAlign: 'center', fontSize: 13 }}>
        <strong>{scoreA > scoreB ? a.name : scoreB > scoreA ? b.name : 'Both doctors'}</strong>{scoreA !== scoreB ? ' leads on most metrics' : ' are evenly matched'} ({scoreA}–{scoreB})
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {[a, b].map((doc, idx) => {
          const score = idx === 0 ? scoreA : scoreB;
          const isWinner = score > (idx === 0 ? scoreB : scoreA);
          return (
            <div key={doc.id} style={{ background: isWinner ? 'rgba(16,185,129,.04)' : '#fff', border: isWinner ? '2px solid #059669' : '1px solid rgba(0,0,0,.08)', borderRadius: 14, padding: '1rem', position: 'relative' }}>
              {isWinner && (<div style={{ position: 'absolute', top: -11, left: '50%', transform: 'translateX(-50%)', background: '#059669', color: '#fff', fontSize: 11, fontWeight: 700, padding: '2px 12px', borderRadius: 20 }}>Better match</div>)}
              <button onClick={() => onRemove(doc.id)} style={{ position: 'absolute', top: 8, right: 8, background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', fontSize: 16 }}>✕</button>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <Avatar src={doc.img} name={doc.name} size={44} pulse={doc.status === 'online'} />
                <div><div style={{ fontWeight: 700, fontSize: 13 }}>{doc.name}</div><div style={{ fontSize: 11, color: '#6B7280' }}>{doc.spec}</div></div>
              </div>
              <StatusBadge status={doc.status} />
              <div style={{ marginTop: 12 }}>
                {metrics.map(m => {
                  const myVal = idx === 0 ? m.va : m.vb;
                  const otherVal = idx === 0 ? m.vb : m.va;
                  const winning = m.higher ? myVal >= otherVal : myVal <= otherVal;
                  return (
                    <div key={m.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0', borderBottom: '1px solid rgba(0,0,0,.04)', fontSize: 12 }}>
                      <span style={{ color: '#9CA3AF' }}>{m.label}</span>
                      <span style={{ fontWeight: 600, color: winning ? '#059669' : 'inherit' }}>{m.fmt(myVal, doc)}{winning && myVal !== otherVal && ' ✓'}</span>
                    </div>
                  );
                })}
              </div>
              <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
                {doc.status !== 'offline' && (<button onClick={() => openConsultFlow('video', doc)} style={{ flex: 1, padding: '6px 0', borderRadius: 8, border: 'none', cursor: 'pointer', background: 'var(--blue)', color: '#fff', fontSize: 11, fontWeight: 600 }}>📹 Video</button>)}
                <button onClick={() => onBook(doc)} style={{ flex: 1, padding: '6px 0', borderRadius: 8, border: '1px solid rgba(0,0,0,.15)', background: '#fff', cursor: 'pointer', fontSize: 11 }}>📅 Book</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── ANALYTICS PANEL ─────────────────────────────────────────────────────────
function AnalyticsPanel() {
  const online = DOCTORS.filter(d => d.status === 'online').length;
  const busy = DOCTORS.filter(d => d.status === 'busy').length;
  const offline = DOCTORS.filter(d => d.status === 'offline').length;
  const specCount = DOCTORS.reduce((acc, d) => ({ ...acc, [d.spec]: (acc[d.spec] || 0) + 1 }), {});
  const maxSpec = Math.max(...Object.values(specCount));
  const sorted = [...DOCTORS].sort((a, b) => a.rate - b.rate);
  const maxRate = Math.max(...sorted.map(d => d.rate));
  const avgWait = Math.round(DOCTORS.filter(d => d.waitTime !== null && d.waitTime !== undefined).reduce((a, d) => a + d.waitTime, 0) / DOCTORS.filter(d => d.waitTime !== null && d.waitTime !== undefined).length);
  const barFill = (pct, color) => (<div style={{ flex: 1, height: 8, background: 'rgba(0,0,0,.06)', borderRadius: 4, overflow: 'hidden' }}><div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 4, transition: 'width .6s ease' }} /></div>);
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 16 }}>
        {[{ label: 'Available', value: online, color: '#059669' }, { label: 'In session', value: busy, color: '#d97706' }, { label: 'Offline', value: offline, color: '#9CA3AF' }, { label: 'Avg wait', value: `${avgWait}m`, color: 'var(--blue)' }].map(s => (
          <div key={s.label} style={{ background: '#fff', border: '1px solid rgba(0,0,0,.08)', borderRadius: 10, padding: '.75rem 1rem', borderLeft: `3px solid ${s.color}` }}>
            <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>
      <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,.08)', borderRadius: 12, padding: '1rem', marginBottom: 12 }}>
        <div style={{ ...S.label, marginBottom: 12 }}>Your health metrics</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
          {HEALTH_METRICS.map(m => (
            <div key={m.label} style={{ padding: '10px 12px', background: 'rgba(0,0,0,.02)', borderRadius: 8, border: '1px solid rgba(0,0,0,.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: 11, color: '#9CA3AF' }}>{m.label}</div>
                <span style={{ fontSize: 11, color: m.trend === 'up' ? '#d97706' : m.trend === 'down' ? 'var(--blue)' : '#059669' }}>{m.trend === 'up' ? '↑' : m.trend === 'down' ? '↓' : '→'}</span>
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: m.color }}>{m.value} <span style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 400 }}>{m.unit}</span></div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,.08)', borderRadius: 12, padding: '1rem', marginBottom: 12 }}>
        <div style={{ ...S.label, marginBottom: 12 }}>Specialty distribution</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {Object.entries(specCount).sort((a, b) => b[1] - a[1]).map(([spec, count]) => (
            <div key={spec} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
              <span style={{ width: 100, color: '#6B7280', fontSize: 11, flexShrink: 0 }}>{spec.split(' ')[0]}</span>
              {barFill(Math.round((count / maxSpec) * 100), 'var(--blue)')}
              <span style={{ width: 14, color: '#9CA3AF', fontSize: 11, textAlign: 'right' }}>{count}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,.08)', borderRadius: 12, padding: '1rem' }}>
        <div style={{ ...S.label, marginBottom: 12 }}>Rate comparison (₹/min)</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {sorted.map(doc => {
            const color = doc.status === 'online' ? '#059669' : doc.status === 'busy' ? '#d97706' : '#9CA3AF';
            return (
              <div key={doc.id} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                <span style={{ width: 80, color: '#6B7280', fontSize: 11, flexShrink: 0 }}>{doc.name.split(' ')[2] || doc.name.split(' ')[1]}</span>
                {barFill(Math.round((doc.rate / maxRate) * 100), color)}
                <span style={{ width: 30, color: '#9CA3AF', fontSize: 11, textAlign: 'right' }}>₹{doc.rate}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── PRESCRIPTIONS ────────────────────────────────────────────────────────────
function PrescriptionsPanel({ addToast }) {
  return (
    <div>
      <div style={{ ...S.label, marginBottom: 12 }}>Digital Prescriptions</div>
      {PRESCRIPTIONS.map(rx => (
        <div key={rx.id} style={{ ...S.card, marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
            <div><div style={{ fontWeight: 700, fontSize: 14 }}>{rx.doc}</div><div style={{ fontSize: 12, color: '#9CA3AF' }}>{rx.date}</div></div>
            <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 20, fontWeight: 700, background: rx.refillable ? 'rgba(16,185,129,.1)' : 'rgba(156,163,175,.1)', color: rx.refillable ? '#059669' : '#6B7280' }}>{rx.refillable ? '✓ Refillable' : 'No refill'}</span>
          </div>
          <div style={{ marginBottom: 10 }}>
            {rx.medications.map(med => (
              <div key={med} style={{ fontSize: 13, color: '#374151', padding: '4px 0', borderBottom: '1px solid rgba(0,0,0,.04)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--blue)', flexShrink: 0 }} />{med}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: rx.expiry === 'Expired' ? '#dc2626' : '#9CA3AF' }}>{rx.expiry === 'Expired' ? '⚠ Expired' : `Valid till: ${rx.expiry}`}</span>
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={() => addToast('Prescription downloaded!')} style={{ fontSize: 11, padding: '4px 10px', borderRadius: 8, border: '1px solid rgba(0,0,0,.12)', background: '#fff', cursor: 'pointer' }}>⬇ Download</button>
              {rx.refillable && (<button onClick={() => addToast('Refill request sent!')} style={{ fontSize: 11, padding: '4px 10px', borderRadius: 8, border: 'none', background: 'var(--blue)', color: '#fff', cursor: 'pointer', fontWeight: 700 }}>↻ Refill</button>)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── MAIN TELEMEDICINE VIEW ───────────────────────────────────────────────────
export function TelemedicineView({ 
  addToast: externalAddToast,
  walletBalance,        // Add this prop
  walletTransactions,   // Add this prop
  onAddFunds,          // Add this prop
  onDeductFunds,       // Add this prop
  onResetWallet        // Add this prop (optional)
}) {
  const [toasts, setToasts] = useState([]);
  const addToast = useCallback((msg, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  const [showHospitalsModal, setShowHospitalsModal] = useState(false);
  const [showConsultFlow, setShowConsultFlow] = useState(false);
  const [consultType, setConsultType] = useState('');
  const [preselectedDocForConsult, setPreselectedDocForConsult] = useState(null);
  const [showWalletModal, setShowWalletModal] = useState(false);

  const [tab, setTab] = useState('browse');
  const [search, setSearch] = useState('');
  const [specFilter, setSpecFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [favorites, setFavorites] = useState(new Set());
  const [compareIds, setCompareIds] = useState([]);
  const [detailId, setDetailId] = useState(null);
  const [bookingDoc, setBookingDoc] = useState(null);
  const [showBooking, setShowBooking] = useState(false);
  const [showConsultModal, setShowConsultModal] = useState(false);
  const [activeConsult, setActiveConsult] = useState(null);
  const [consultHistory, setConsultHistory] = useState([]);
  const [sidePanel, setSidePanel] = useState(null);

  const openConsultFlow = useCallback((type, doc) => {
    setConsultType(type);
    setPreselectedDocForConsult(doc || null);
    setShowConsultFlow(true);
  }, []);
  
  const startConsultation = useCallback((doctor, type, duration, patientName, symptoms, patientPhone) => {
    setShowConsultFlow(false);
    setActiveConsult({ doc: doctor, type, duration, patientName, symptoms, patientPhone });
    setShowConsultModal(true);
    addToast(`Connected with ${doctor.name} for ${type} consultation`, 'success');
  }, [addToast]);

  const toggleFav = id => setFavorites(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleCompare = id => setCompareIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : prev.length >= 2 ? [...prev.slice(1), id] : [...prev, id]);
  const handleBook = (doc, preselectedSlot = null) => { setBookingDoc({ ...doc, preselectedSlot }); setShowBooking(true); };
  const confirmBook = ({ doc, slot, date, reason, consultType, duration, cost }) => {
  // Create appointment object to save
  const newAppointment = {
    id: Date.now(),
    doc: doc.name,
    spec: doc.spec,
    date: date,
    time: slot,
    type: consultType,
    status: 'upcoming',
    fee: cost,
    duration: duration,
    reason: reason,
    patientName: 'Current User', // You can get from profile
  };
  
  // Save to localStorage so AppointmentsView can read it
  try {
    const existing = JSON.parse(localStorage.getItem('sc_doctor_appointments') || '[]');
    existing.unshift(newAppointment);
    localStorage.setItem('sc_doctor_appointments', JSON.stringify(existing));
  } catch(e) {}
  
  addToast(`✓ Booked with ${doc.name} at ${slot}! ₹${cost} deducted from wallet.`, 'success');
};
  const handleEndConsult = (duration, cost, notes) => {
    setShowConsultModal(false);
    if (activeConsult?.doc) {
      setConsultHistory(prev => [...prev, { docId: activeConsult.doc.id, docName: activeConsult.doc.name, type: activeConsult.type, duration, cost, notes, date: new Date().toLocaleString(), patientName: activeConsult.patientName, symptoms: activeConsult.symptoms }]);
      addToast(`Consultation ended · ${Math.floor(duration / 60)}m ${duration % 60}s · ₹${cost}`, 'success');
    }
    setActiveConsult(null);
  };

  const filteredDocs = useMemo(() => {
    const q = search.toLowerCase();
    let docs = DOCTORS.filter(d => {
      const matchQ = !q || d.name.toLowerCase().includes(q) || d.spec.toLowerCase().includes(q) || d.skills.some(s => s.toLowerCase().includes(q));
      const matchSpec = !specFilter || specFilter === 'All Specialties' || d.spec === specFilter;
      const matchSt = !statusFilter || d.status === statusFilter;
      return matchQ && matchSpec && matchSt;
    });
    if (sortBy === 'rating') docs = [...docs].sort((a, b) => b.rating - a.rating);
    if (sortBy === 'rate-asc') docs = [...docs].sort((a, b) => a.rate - b.rate);
    if (sortBy === 'rate-desc') docs = [...docs].sort((a, b) => b.rate - a.rate);
    if (sortBy === 'exp') docs = [...docs].sort((a, b) => parseInt(b.exp) - parseInt(a.exp));
    if (sortBy === 'wait') docs = [...docs].sort((a, b) => (a.waitTime ?? 999) - (b.waitTime ?? 999));
    return docs;
  }, [search, specFilter, statusFilter, sortBy]);

  const onlineCount = DOCTORS.filter(d => d.status === 'online').length;
  const specsCount = new Set(DOCTORS.map(d => d.spec)).size;
  const avgRating = (DOCTORS.reduce((a, d) => a + d.rating, 0) / DOCTORS.length).toFixed(1);
  const avgWait = Math.round(DOCTORS.filter(d => d.waitTime != null).reduce((a, d) => a + d.waitTime, 0) / DOCTORS.filter(d => d.waitTime != null).length);
  const detailDoc = detailId ? DOCTORS.find(d => d.id === detailId) : null;

  const TABS = [
    { key: 'browse', label: 'Browse Doctors', icon: '🩺' },
    { key: 'compare', label: `Compare${compareIds.length ? ` (${compareIds.length})` : ''}`, icon: '⇄' },
    { key: 'saved', label: `Saved${favorites.size ? ` (${favorites.size})` : ''}`, icon: '⭐' },
    { key: 'analytics', label: 'Analytics', icon: '📊' },
    { key: 'rx', label: 'Rx', icon: '💊' },
  ];

  return (
    <div className="view">
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
        @keyframes slideIn { from{transform:translateX(20px);opacity:0} to{transform:none;opacity:1} }
        @keyframes slideUp { from{transform:translateY(20px);opacity:0} to{transform:none;opacity:1} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes bounceIn { 0%{transform:scale(0.5);opacity:0} 80%{transform:scale(1.05)} 100%{transform:scale(1);opacity:1} }
        @keyframes pingLarge { 0%{transform:scale(1);opacity:.5} 100%{transform:scale(1.5);opacity:0} }
        input:focus, textarea:focus, select:focus { border-color: var(--blue) !important; outline: none !important; box-shadow: 0 0 0 3px rgba(14,165,233,.1) !important; }
      `}</style>

      <div className="container-sc py4">
        <div className="section-head">
          <h2><i className="bi bi-camera-video me-2 text-blue" />Telemedicine Consultations</h2>
          <p>Connect with certified doctors instantly — billed per minute, pay only for what you use</p>
        </div>

        {/* 4 Consultation Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
          <div className="card-base text-center">
            <i className="bi bi-hospital-fill" style={{ fontSize: '2.5rem', color: 'var(--danger)', display: 'block', marginBottom: 12 }} />
            <h5>Nearby Hospitals</h5>
            <p className="small text-muted mb3">Find emergency care & facilities near you</p>
            <button className="btn-primary btn-full" style={{ background: 'var(--danger)' }} onClick={() => setShowHospitalsModal(true)}>Find Hospitals</button>
          </div>
          <div className="card-base text-center">
            <i className="bi bi-camera-video-fill" style={{ fontSize: '2.5rem', color: 'var(--blue)', display: 'block', marginBottom: 12 }} />
            <h5>Video Consultation</h5>
            <p className="small text-muted mb3">Face-to-face with specialists</p>
            <button className="btn-primary btn-full" onClick={() => openConsultFlow('video', null)}>Start Video</button>
          </div>
          <div className="card-base text-center">
            <i className="bi bi-chat-dots-fill" style={{ fontSize: '2.5rem', color: 'var(--success)', display: 'block', marginBottom: 12 }} />
            <h5>Chat Consultation</h5>
            <p className="small text-muted mb3">Quick text-based medical advice</p>
            <button className="btn-primary btn-full" style={{ background: 'var(--success)' }} onClick={() => openConsultFlow('chat', null)}>Start Chat</button>
          </div>
          <div className="card-base text-center">
            <i className="bi bi-telephone-fill" style={{ fontSize: '2.5rem', color: 'var(--warning)', display: 'block', marginBottom: 12 }} />
            <h5>Phone Consultation</h5>
            <p className="small text-muted mb3">Talk to a doctor on call</p>
            <button className="btn-primary btn-full" style={{ background: 'var(--warning)' }} onClick={() => openConsultFlow('phone', null)}>Call Now</button>
          </div>
        </div>

        <div className="bg-grad-soft rounded-custom mb5 flex-start" style={{ padding: 20 }}>
          <i className="bi bi-info-circle-fill text-blue" style={{ fontSize: '1.5rem', flexShrink: 0 }} />
          <div><h6 style={{ marginBottom: 4 }}>Transparent Per-Minute Billing</h6><p className="small text-muted" style={{ margin: 0 }}>Only charged for minutes spent with the doctor. No hidden fees. Minimum booking: 5 minutes.</p></div>
        </div>

        {/* Find a Doctor Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
          <h5 className="fw-bold" style={{ margin: 0 }}>👨‍⚕️ Find a Doctor</h5>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setSidePanel(sidePanel === 'symptom' ? null : 'symptom')} style={{ padding: '7px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', border: sidePanel === 'symptom' ? '2px solid var(--blue)' : '1px solid rgba(0,0,0,.12)', background: sidePanel === 'symptom' ? 'rgba(14,165,233,.08)' : '#fff', color: sidePanel === 'symptom' ? 'var(--blue)' : '#374151', transition: 'all .15s' }}>🤖 Symptom Check</button>
            
            <button onClick={() => setShowWalletModal(true)} style={{ padding: '7px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', border: '1px solid rgba(0,0,0,.12)', background: '#fff', color: 'var(--blue)', transition: 'all .15s', display: 'flex', alignItems: 'center', gap: 6 }}>
              💳 Wallet
            </button>
            
            {consultHistory.length > 0 && (<span style={{ fontSize: 11, padding: '4px 10px', borderRadius: 20, background: 'rgba(16,185,129,.1)', color: '#059669', fontWeight: 700 }}>✓ {consultHistory.length} consult{consultHistory.length > 1 ? 's' : ''} done</span>)}
          </div>
        </div>

        {sidePanel === 'symptom' && (<div style={{ marginBottom: 16 }}><SymptomChecker onFindDoctor={id => { setSidePanel(null); setTab('browse'); setDetailId(id); }} /></div>)}

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 24 }}>
          {[
            { label: 'Available now', value: onlineCount, color: '#059669', sub: 'doctors online' },
            { label: 'Avg. wait', value: `~${avgWait}m`, color: 'var(--blue)', sub: 'video consult' },
            { label: 'Specialties', value: specsCount, color: 'var(--blue)', sub: 'available today' },
            { label: 'Avg. rating', value: avgRating, color: '#F59E0B', sub: 'across all doctors' }
          ].map(s => (
            <div key={s.label} style={{ background: '#fff', border: '1px solid rgba(0,0,0,.08)', borderRadius: 10, padding: '.75rem 1rem' }}>
              <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 11, color: '#9CA3AF' }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid rgba(0,0,0,.08)', marginBottom: 16, flexWrap: 'wrap' }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{ padding: '7px 14px', border: 'none', cursor: 'pointer', fontSize: 13, borderRadius: '8px 8px 0 0', background: tab === t.key ? 'rgba(14,165,233,.1)' : 'transparent', color: tab === t.key ? 'var(--blue)' : '#6B7280', fontWeight: tab === t.key ? 700 : 400, borderBottom: tab === t.key ? '2px solid var(--blue)' : '2px solid transparent', whiteSpace: 'nowrap', transition: 'all .15s' }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {tab === 'browse' && !detailId && (
          <>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14, alignItems: 'center' }}>
              <input style={{ flex: 1, minWidth: 140, maxWidth: 240, borderRadius: 8, border: '1px solid rgba(0,0,0,.12)', padding: '7px 12px', fontSize: 13 }} placeholder="Search name, specialty, skill…" value={search} onChange={e => setSearch(e.target.value)} />
              <select style={{ minWidth: 130, borderRadius: 8, border: '1px solid rgba(0,0,0,.12)', padding: '7px 10px', fontSize: 13 }} value={specFilter} onChange={e => setSpecFilter(e.target.value)}>{SPECIALTIES.map(s => <option key={s}>{s}</option>)}</select>
              <select style={{ minWidth: 120, borderRadius: 8, border: '1px solid rgba(0,0,0,.12)', padding: '7px 10px', fontSize: 13 }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                <option value="">Any status</option><option value="online">Available</option><option value="busy">In session</option><option value="offline">Offline</option>
              </select>
              <select style={{ minWidth: 140, borderRadius: 8, border: '1px solid rgba(0,0,0,.12)', padding: '7px 10px', fontSize: 13 }} value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option value="rating">Sort: Rating</option><option value="wait">Sort: Wait time</option><option value="rate-asc">Sort: Rate ↑</option><option value="rate-desc">Sort: Rate ↓</option><option value="exp">Sort: Experience</option>
              </select>
            </div>
            {filteredDocs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#9CA3AF', fontSize: 13 }}>No doctors match your filters.</div>
            ) : (
              <div className="grid grid-4">
                {filteredDocs.map(doc => (
                  <DoctorCard key={doc.id} doc={doc} isFav={favorites.has(doc.id)} isCompared={compareIds.includes(doc.id)} onFav={toggleFav} onBook={handleBook} onCompare={id => { toggleCompare(id); if (!compareIds.includes(id) && compareIds.length === 1) setTab('compare'); }} onDetail={id => setDetailId(id)} openConsultFlow={openConsultFlow} />
                ))}
              </div>
            )}
          </>
        )}

        {tab === 'browse' && detailId && (
          <DoctorDetail doc={detailDoc} isFav={favorites.has(detailId)} onFav={toggleFav} onBook={(doc, slot) => handleBook(doc, slot)} onClose={() => setDetailId(null)} openConsultFlow={openConsultFlow} consultHistory={consultHistory} />
        )}

        {tab === 'compare' && (<ComparePanel ids={compareIds} onRemove={id => setCompareIds(prev => prev.filter(x => x !== id))} onBook={handleBook} openConsultFlow={openConsultFlow} />)}

        {tab === 'saved' && (favorites.size === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#9CA3AF', fontSize: 13 }}>⭐ No saved doctors yet. Tap ★ on any card.</div>
        ) : (
          <div className="grid grid-4">
            {DOCTORS.filter(d => favorites.has(d.id)).map(doc => (
              <DoctorCard key={doc.id} doc={doc} isFav isCompared={compareIds.includes(doc.id)} onFav={toggleFav} onBook={handleBook} onCompare={toggleCompare} onDetail={id => { setTab('browse'); setDetailId(id); }} openConsultFlow={openConsultFlow} />
            ))}
          </div>
        ))}

        {tab === 'analytics' && <AnalyticsPanel />}
        {tab === 'rx' && <PrescriptionsPanel addToast={addToast} />}
      </div>

            {/* Modals */}
      <Modal show={showHospitalsModal} onClose={() => setShowHospitalsModal(false)} title='🏥 Nearby Hospitals' wide>
        <NearbyHospitalsView addToast={addToast} onClose={() => setShowHospitalsModal(false)} />
      </Modal>

     
      <ConsultationFlowModal
  show={showConsultFlow}
  onClose={() => { 
    setShowConsultFlow(false); 
    setPreselectedDocForConsult(null); 
    setConsultType(''); 
  }}
  consultType={consultType}
  onStartConsult={startConsultation}
  addToast={addToast}
  preselectedDoc={preselectedDocForConsult}
  walletBalance={userWallet?.balance || 2500}
  onDeductFunds={onDeductFunds}
/>

<BookingModal 
  doc={bookingDoc} 
  show={showBooking} 
  onClose={() => setShowBooking(false)} 
  onBook={confirmBook} 
  addToast={addToast}
  walletBalance={walletBalance}
  onDeductFunds={onDeductFunds}
/>
      
      <Modal show={showConsultModal} onClose={() => {}} title="" noPad>
        {activeConsult && (
          <ConsultTimer 
            doc={activeConsult.doc} 
            rate={activeConsult.doc.rate} 
            onEnd={handleEndConsult} 
            consultType={activeConsult.type} 
            patientName={activeConsult.patientName} 
            patientPhone={activeConsult.patientPhone}
            walletBalance={walletBalance}
            onDeductFunds={onDeductFunds}
          />
        )}
      </Modal>

      {/* Wallet Modal */}
      <Modal show={showWalletModal} onClose={() => setShowWalletModal(false)} title='💳 My Wallet' wide>
        <WalletView 
          balance={walletBalance}
          transactions={walletTransactions}
          addFunds={onAddFunds}
          deductFunds={onDeductFunds}
          resetWallet={onResetWallet}
        />
      </Modal>

      <ToastContainer toasts={toasts} />
    </div>
  );
}

// ─── APPOINTMENTS VIEW ────────────────────────────────────────────────────────
const DOCTOR_LIST = [
  { label: 'Dr. Sarah Johnson – General Physician', spec: 'General Physician', fee: 500, img: 'https://api.dicebear.com/7.x/personas/svg?seed=sarah', slots: ['09:00 AM','10:00 AM','11:00 AM','02:00 PM','03:00 PM','04:00 PM'] },
  { label: 'Dr. Michael Chen – Cardiologist',       spec: 'Cardiologist',       fee: 800, img: 'https://api.dicebear.com/7.x/personas/svg?seed=michael', slots: ['10:00 AM','11:30 AM','02:30 PM','04:00 PM'] },
  { label: 'Dr. Emily Parker – Dermatologist',      spec: 'Dermatologist',      fee: 600, img: 'https://api.dicebear.com/7.x/personas/svg?seed=emily',   slots: ['09:30 AM','11:00 AM','03:00 PM','05:00 PM'] },
  { label: 'Dr. Robert Kumar – Neurologist',        spec: 'Neurologist',        fee: 900, img: 'https://api.dicebear.com/7.x/personas/svg?seed=robert',  slots: ['10:30 AM','01:00 PM','03:30 PM'] },
  { label: 'Dr. Priya Nair – Pediatrician',         spec: 'Pediatrician',       fee: 550, img: 'https://api.dicebear.com/7.x/personas/svg?seed=priya',   slots: ['08:30 AM','10:00 AM','12:00 PM','02:00 PM'] },
  { label: 'Dr. Lakshmi Rao – Psychiatrist',        spec: 'Psychiatrist',       fee: 700, img: 'https://api.dicebear.com/7.x/personas/svg?seed=lakshmi', slots: ['09:00 AM','11:00 AM','03:00 PM','05:30 PM'] },
];

function RescheduleModal({ show, onClose, apt, onSave, addToast }) {
  const today = new Date().toISOString().split('T')[0];
  const doc = DOCTOR_LIST.find(d => d.label.startsWith(apt?.doc)) || DOCTOR_LIST[0];
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [reason, setReason] = useState('');
  useEffect(() => { if (apt) { setDate(''); setTime(''); setReason(''); } }, [apt]);
  if (!apt) return null;
  const slots = doc?.slots || ['09:00 AM','10:00 AM','11:00 AM','02:00 PM'];
  return (
    <Modal show={show} onClose={onClose} title={`🔄 Reschedule – ${apt.doc}`}
      footer={<>
        <button style={S.btnOutline} onClick={onClose}>Cancel</button>
        <button style={S.btnPrimary} onClick={() => {
          if (!date) { addToast('Please pick a new date', 'error'); return; }
          if (!time) { addToast('Please pick a new time slot', 'error'); return; }
          onSave(apt.id, date, time, reason);
          addToast(`✓ Rescheduled to ${date} at ${time}`, 'success');
          onClose();
        }}>✓ Confirm Reschedule</button>
      </>}>
      {/* current booking */}
      <div style={{ background: 'rgba(245,158,11,.06)', borderRadius: 10, padding: '12px 14px', border: '1px solid rgba(245,158,11,.2)', marginBottom: 18 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#d97706', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>Current Booking</div>
        <div style={{ fontSize: 13, color: '#374151' }}><strong>{apt.doc}</strong> · {apt.spec}</div>
        <div style={{ fontSize: 12, color: '#6B7280', marginTop: 3 }}>📅 {apt.date} &nbsp;·&nbsp; 🕐 {apt.time}</div>
      </div>
      <div style={{ marginBottom: 14 }}>
        <label style={S.label}>New Date</label>
        <input type="date" min={today} value={date} onChange={e => setDate(e.target.value)} style={S.input} />
      </div>
      <div style={{ marginBottom: 14 }}>
        <label style={S.label}>New Time Slot</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {slots.map(s => (
            <button key={s} onClick={() => setTime(s)} style={{ padding: '7px 14px', borderRadius: 8, fontSize: 13, cursor: 'pointer',
              border: time === s ? '2px solid var(--blue)' : '1px solid rgba(0,0,0,.12)',
              background: time === s ? 'rgba(14,165,233,.1)' : '#fff',
              color: time === s ? 'var(--blue)' : '#374151', fontWeight: time === s ? 700 : 400 }}>{s}</button>
          ))}
        </div>
      </div>
      <div>
        <label style={S.label}>Reason for rescheduling (optional)</label>
        <textarea style={{ ...S.input, resize: 'vertical', minHeight: 60 }} placeholder="e.g. schedule conflict, travel…" value={reason} onChange={e => setReason(e.target.value)} />
      </div>
      {date && time && (
        <div style={{ marginTop: 14, padding: '10px 14px', background: 'rgba(16,185,129,.06)', borderRadius: 8, border: '1px solid rgba(16,185,129,.15)', fontSize: 13, color: '#059669', display: 'flex', alignItems: 'center', gap: 8 }}>
          ✓ New slot: <strong>{date} at {time}</strong>
        </div>
      )}
    </Modal>
  );
}

function CancelModal({ show, onClose, apt, onConfirm, addToast }) {
  const [reason, setReason] = useState('');
  const [selected, setSelected] = useState('');
  const REASONS = ['Schedule conflict', 'Feeling better', 'Doctor unavailable', 'Found another doctor', 'Personal emergency', 'Other'];
  useEffect(() => { if (!show) { setReason(''); setSelected(''); } }, [show]);
  if (!apt) return null;
  return (
    <Modal show={show} onClose={onClose} title={`❌ Cancel Appointment`}
      footer={<>
        <button style={S.btnOutline} onClick={onClose}>Keep Appointment</button>
        <button style={{ ...S.btnPrimary, background: '#dc2626' }} onClick={() => {
          onConfirm(apt.id);
          addToast('Appointment cancelled. Refund initiated if applicable.', 'info');
          onClose();
        }}>Yes, Cancel</button>
      </>}>
      <div style={{ background: 'rgba(239,68,68,.05)', borderRadius: 10, padding: '12px 14px', border: '1px solid rgba(239,68,68,.15)', marginBottom: 18 }}>
        <div style={{ fontSize: 13, color: '#374151', fontWeight: 600 }}>{apt.doc}</div>
        <div style={{ fontSize: 12, color: '#6B7280', marginTop: 3 }}>📅 {apt.date} &nbsp;·&nbsp; 🕐 {apt.time}</div>
        {apt.fee && <div style={{ fontSize: 12, color: '#059669', marginTop: 3, fontWeight: 600 }}>💳 Paid: ₹{apt.fee}</div>}
      </div>
      {apt.fee && (
        <div style={{ background: 'rgba(16,185,129,.06)', borderRadius: 8, padding: '10px 14px', border: '1px solid rgba(16,185,129,.15)', marginBottom: 14, fontSize: 12, color: '#059669' }}>
          💰 Refund policy: Full refund if cancelled 24h before. 50% if within 24h.
        </div>
      )}
      <div style={{ marginBottom: 14 }}>
        <label style={S.label}>Reason for cancellation</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
          {REASONS.map(r => (
            <button key={r} onClick={() => setSelected(r)} style={{ fontSize: 12, padding: '5px 12px', borderRadius: 20, cursor: 'pointer',
              border: selected === r ? '2px solid #dc2626' : '1px solid rgba(0,0,0,.1)',
              background: selected === r ? 'rgba(239,68,68,.08)' : '#fff',
              color: selected === r ? '#dc2626' : '#374151', fontWeight: selected === r ? 700 : 400 }}>{r}</button>
          ))}
        </div>
        {selected === 'Other' && (
          <textarea style={{ ...S.input, resize: 'vertical', minHeight: 60 }} placeholder="Tell us more…" value={reason} onChange={e => setReason(e.target.value)} />
        )}
      </div>
      <div style={{ padding: '10px 14px', background: 'rgba(245,158,11,.06)', borderRadius: 8, border: '1px solid rgba(245,158,11,.15)', fontSize: 12, color: '#92400e' }}>
        ⚠ This action cannot be undone. Consider rescheduling instead.
      </div>
    </Modal>
  );
}

function AptDetailModal({ show, onClose, apt, onReschedule, onCancel }) {
  if (!apt) return null;
  const typeIcon = t => ({ video: '📹', phone: '📞', chat: '💬', hospital: '🏥' }[t] || '📅');
  const typeColor = t => ({ video: 'var(--blue)', phone: '#059669', chat: '#7c3aed', hospital: '#dc2626' }[t] || '#6B7280');
  const doc = DOCTOR_LIST.find(d => d.label.startsWith(apt.doc));
  
  // Check if appointment is cancelled
  const isCancelled = apt.status === 'cancelled';
  
  return (
    <Modal show={show} onClose={onClose} title={`📋 Appointment Details`}>
      {/* Doctor card */}
      <div style={{ display: 'flex', gap: 14, alignItems: 'center', padding: '14px', background: 'rgba(14,165,233,.04)', borderRadius: 12, border: '1px solid rgba(14,165,233,.1)', marginBottom: 16 }}>
        <div style={{ width: 52, height: 52, borderRadius: '50%', overflow: 'hidden', border: '2px solid rgba(14,165,233,.2)', flexShrink: 0 }}>
          <img src={doc?.img || `https://api.dicebear.com/7.x/personas/svg?seed=${apt.doc}`} alt={apt.doc} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display='none'} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 15 }}>{apt.doc}</div>
          <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>{apt.spec}</div>
          {doc && <div style={{ fontSize: 11, color: '#059669', marginTop: 2, fontWeight: 600 }}>⭐ Highly rated specialist</div>}
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: `${typeColor(apt.type)}18`, color: typeColor(apt.type), fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
            {typeIcon(apt.type)} {apt.type?.toUpperCase()}
          </span>
        </div>
      </div>
      
      {/* Details grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
        {[
          { icon: '📅', label: 'Date', value: apt.date },
          { icon: '🕐', label: 'Time', value: apt.time },
          { icon: '🏥', label: 'Specialty', value: apt.spec },
          { icon: '💳', label: 'Fee', value: apt.fee ? `₹${apt.fee}` : 'N/A' },
          { icon: '📍', label: 'Location', value: apt.hospitalName || 'Virtual / Online' },
          { icon: '📌', label: 'Status', value: apt.status?.toUpperCase() || 'UPCOMING' },
        ].map(d => (
          <div key={d.label} style={{ background: 'rgba(0,0,0,.02)', borderRadius: 8, padding: '10px 12px', border: '1px solid rgba(0,0,0,.05)' }}>
            <div style={{ fontSize: 10, color: '#9CA3AF', marginBottom: 3 }}>{d.icon} {d.label}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>{d.value}</div>
          </div>
        ))}
      </div>
      
      {apt.reason && (
        <div style={{ padding: '10px 14px', background: 'rgba(0,0,0,.02)', borderRadius: 8, border: '1px solid rgba(0,0,0,.06)', marginBottom: 16, fontSize: 13, color: '#6B7280' }}>
          <div style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 600, marginBottom: 4 }}>REASON FOR VISIT</div>
          {apt.reason}
        </div>
      )}
      
      {/* Reminder info - ONLY show if NOT cancelled */}
      {!isCancelled && (
        <div style={{ padding: '10px 14px', background: 'rgba(14,165,233,.04)', borderRadius: 8, border: '1px solid rgba(14,165,233,.1)', marginBottom: 16, fontSize: 12, color: '#0369a1', display: 'flex', alignItems: 'center', gap: 8 }}>
          🔔 Reminder will be sent 1 hour before your appointment.
        </div>
      )}
      
      {/* Action buttons - ONLY show if NOT cancelled */}
      {!isCancelled && (
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => { onClose(); setTimeout(onReschedule, 100); }} style={{ flex: 1, padding: '10px', borderRadius: 8, border: '1px solid rgba(245,158,11,.3)', background: 'rgba(245,158,11,.06)', color: '#d97706', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>🔄 Reschedule</button>
          <button onClick={() => { onClose(); setTimeout(onCancel, 100); }} style={{ flex: 1, padding: '10px', borderRadius: 8, border: '1px solid rgba(239,68,68,.3)', background: 'rgba(239,68,68,.06)', color: '#dc2626', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>❌ Cancel</button>
        </div>
      )}
    </Modal>
  );
}

export function AppointmentsView({ addToast, logVault }) {
  const today = new Date().toISOString().split('T')[0];

  const INITIAL_APTS = [
    { id: 1, doc: 'Dr. Sarah Johnson', spec: 'General Physician', date: 'May 5, 2026',  time: '10:00 AM', type: 'video',  status: 'upcoming', fee: 500,  reason: 'Routine check-up and BP monitoring' },
    { id: 2, doc: 'Dr. Michael Chen',  spec: 'Cardiologist',       date: 'May 8, 2026',  time: '02:30 PM', type: 'phone',  status: 'upcoming', fee: 800,  reason: 'Follow-up on ECG results' },
    { id: 3, doc: 'Dr. Emily Parker',  spec: 'Dermatologist',       date: 'Apr 15, 2026', time: '11:00 AM', type: 'video',  status: 'completed', fee: 600, reason: 'Acne treatment consultation' },
    { id: 4, doc: 'Dr. Priya Nair',    spec: 'Pediatrician',        date: 'Apr 2, 2026',  time: '09:00 AM', type: 'chat',   status: 'cancelled', fee: 550, reason: "Child's annual vaccination" },
  ];

  const [apts, setApts] = useState(INITIAL_APTS);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchQ, setSearchQ] = useState('');
  const [sortBy, setSortBy] = useState('date');

  // Modals
  const [showBookModal,    setShowBookModal]    = useState(false);
  const [showReschedule,   setShowReschedule]   = useState(false);
  const [showCancel,       setShowCancel]       = useState(false);
  const [showDetail,       setShowDetail]       = useState(false);
  const [activeApt,        setActiveApt]        = useState(null);

  // Book form
  const [form, setForm] = useState({ docIdx: 0, date: '', time: '', reason: '', type: 'video', patientName: '', phone: '' });
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const selectedDoc = DOCTOR_LIST[form.docIdx];

  // Load hospital appointments from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('sc_hospital_appointments');
      if (stored) {
        const h = JSON.parse(stored);
        const mapped = h.map(a => ({ id: a.id, doc: a.doctor, spec: a.spec, date: a.date, time: a.slot, type: 'hospital', status: 'upcoming', hospitalName: a.hospital, fee: a.fee }));
        setApts(prev => {
          const ids = new Set(prev.map(x => x.id));
          return [...prev, ...mapped.filter(x => !ids.has(x.id))];
        });
      }
    } catch {}
  }, []);

  // Add this to AppointmentsView component
useEffect(() => {
  try {
    const stored = localStorage.getItem('sc_doctor_appointments');
    if (stored) {
      const appointments = JSON.parse(stored);
      setApts(prev => {
        const existingIds = new Set(prev.map(a => a.id));
        const newAppointments = appointments.filter(a => !existingIds.has(a.id));
        return [...newAppointments, ...prev];
      });
    }
  } catch(e) {}
}, []);

  const typeIcon  = t => ({ video: '📹', phone: '📞', chat: '💬', hospital: '🏥' }[t] || '📅');
  const typeColor = t => ({ video: 'var(--blue)', phone: '#059669', chat: '#7c3aed', hospital: '#dc2626' }[t] || '#6B7280');
  const statusMeta = s => ({
    upcoming:  { bg: 'rgba(14,165,233,.1)',  color: 'var(--blue)',  label: '⏳ Upcoming' },
    completed: { bg: 'rgba(16,185,129,.1)',  color: '#059669',      label: '✓ Completed' },
    cancelled: { bg: 'rgba(239,68,68,.08)', color: '#dc2626',      label: '✕ Cancelled' },
  }[s] || { bg: 'rgba(0,0,0,.06)', color: '#6B7280', label: s });

  const filtered = useMemo(() => {
    let list = apts.filter(a => activeTab === 'all' || a.status === activeTab);
    if (searchQ) list = list.filter(a => a.doc.toLowerCase().includes(searchQ.toLowerCase()) || a.spec.toLowerCase().includes(searchQ.toLowerCase()));
    if (sortBy === 'date') list = [...list].sort((a, b) => new Date(b.date) - new Date(a.date));
    if (sortBy === 'doc')  list = [...list].sort((a, b) => a.doc.localeCompare(b.doc));
    return list;
  }, [apts, activeTab, searchQ, sortBy]);

  const counts = useMemo(() => ({
    all:       apts.length,
    upcoming:  apts.filter(a => a.status === 'upcoming').length,
    completed: apts.filter(a => a.status === 'completed').length,
    cancelled: apts.filter(a => a.status === 'cancelled').length,
  }), [apts]);

  const openDetail     = apt => { setActiveApt(apt); setShowDetail(true); };
  const openReschedule = apt => { setActiveApt(apt); setShowReschedule(true); };
  const openCancel     = apt => { setActiveApt(apt); setShowCancel(true); };

  const doReschedule = (id, date, time) => {
    setApts(prev => prev.map(a => a.id === id ? { ...a, date, time, status: 'upcoming' } : a));
    if (logVault) logVault('Rescheduled appointment', `${date} at ${time}`, 'general');
  };

  const doCancel = id => {
    setApts(prev => prev.map(a => a.id === id ? { ...a, status: 'cancelled' } : a));
    if (logVault) logVault('Cancelled appointment', id, 'general');
  };

  const doBook = () => {
    if (!form.date)         { addToast('Please select a date', 'error'); return; }
    if (!form.time)         { addToast('Please select a time slot', 'error'); return; }
    if (!form.patientName.trim()) { addToast('Please enter patient name', 'error'); return; }
    const newApt = {
      id: Date.now(), doc: selectedDoc.label.split('–')[0].trim(),
      spec: selectedDoc.spec, date: form.date, time: form.time,
      type: form.type, status: 'upcoming', fee: selectedDoc.fee,
      reason: form.reason, patientName: form.patientName, phone: form.phone,
    };
    setApts(prev => [newApt, ...prev]);
    setShowBookModal(false);
    setForm({ docIdx: 0, date: '', time: '', reason: '', type: 'video', patientName: '', phone: '' });
    addToast(`✓ Appointment booked with ${newApt.doc}!`, 'success');
    if (logVault) logVault('New appointment booked', `${newApt.doc} on ${form.date}`, 'general');
  };

  const TABS = [
    { key: 'upcoming',  label: 'Upcoming',  emoji: '⏳' },
    { key: 'completed', label: 'Completed', emoji: '✓' },
    { key: 'cancelled', label: 'Cancelled', emoji: '✕' },
    { key: 'all',       label: 'All',       emoji: '≡' },
  ];

  return (
    <div className="view">
      <div className="container-sc py4">
        <div className="section-head">
          <h2><i className="bi bi-calendar-check me-2 text-blue" />Appointment Management</h2>
          <p>Schedule, reschedule and manage all your medical appointments in one place</p>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 20 }}>
          {[
            { label: 'Total',     value: counts.all,       color: '#374151',      bg: 'rgba(0,0,0,.04)'      },
            { label: 'Upcoming',  value: counts.upcoming,  color: 'var(--blue)',  bg: 'rgba(14,165,233,.08)' },
            { label: 'Completed', value: counts.completed, color: '#059669',      bg: 'rgba(16,185,129,.08)' },
            { label: 'Cancelled', value: counts.cancelled, color: '#dc2626',      bg: 'rgba(239,68,68,.06)'  },
          ].map(s => (
            <div key={s.label} style={{ background: s.bg, borderRadius: 12, padding: '14px 16px', border: `1px solid ${s.color}20`, cursor: 'pointer', transition: 'transform .15s' }}
              onClick={() => setActiveTab(s.label.toLowerCase())}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
              <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16, alignItems: 'start' }}>
          {/* Left – appointment list */}
          <div>
            {/* Toolbar - REMOVED + Book New button */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 14, alignItems: 'center', flexWrap: 'wrap' }}>
              <input style={{ ...S.input, flex: 1, minWidth: 160 }} placeholder="🔍 Search doctor, specialty…" value={searchQ} onChange={e => setSearchQ(e.target.value)} />
              <select style={{ ...S.input, width: 'auto', minWidth: 130 }} value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option value="date">Sort: Date</option>
                <option value="doc">Sort: Doctor</option>
              </select>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid rgba(0,0,0,.08)', marginBottom: 16 }}>
              {TABS.map(t => (
                <button key={t.key} onClick={() => setActiveTab(t.key)} style={{ padding: '7px 14px', border: 'none', cursor: 'pointer', fontSize: 12, borderRadius: '8px 8px 0 0',
                  background: activeTab === t.key ? 'rgba(14,165,233,.1)' : 'transparent',
                  color: activeTab === t.key ? 'var(--blue)' : '#6B7280',
                  fontWeight: activeTab === t.key ? 700 : 400,
                  borderBottom: activeTab === t.key ? '2px solid var(--blue)' : '2px solid transparent' }}>
                  {t.emoji} {t.label} <span style={{ fontSize: 10, background: 'rgba(0,0,0,.08)', borderRadius: 20, padding: '1px 6px', marginLeft: 4 }}>{counts[t.key]}</span>
                </button>
              ))}
            </div>

            {/* List */}
            {filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 2rem', color: '#9CA3AF' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>No appointments found</div>
                <div style={{ fontSize: 12 }}>Try a different filter</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {filtered.map(a => {
                  const sm = statusMeta(a.status);
                  const docInfo = DOCTOR_LIST.find(d => d.label.startsWith(a.doc));
                  return (
                    <div key={a.id} style={{ background: '#fff', borderRadius: 14, border: '1px solid rgba(0,0,0,.08)', padding: '14px 16px', transition: 'box-shadow .2s, border-color .2s', cursor: 'pointer' }}
                      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,.1)'; e.currentTarget.style.borderColor = 'rgba(14,165,233,.2)'; }}
                      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'rgba(0,0,0,.08)'; }}
                      onClick={() => openDetail(a)}>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        {/* Left info */}
                        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', flex: 1 }}>
                          {/* Avatar */}
                          <div style={{ width: 46, height: 46, borderRadius: '50%', overflow: 'hidden', border: `2px solid ${typeColor(a.type)}30`, flexShrink: 0 }}>
                            <img src={docInfo?.img || `https://api.dicebear.com/7.x/personas/svg?seed=${a.doc}`} alt={a.doc} width={46} height={46} style={{ objectFit: 'cover' }} onError={e => e.target.style.display='none'} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                              <span style={{ fontWeight: 700, fontSize: 14 }}>{a.doc}</span>
                              <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, background: `${typeColor(a.type)}15`, color: typeColor(a.type), fontWeight: 700 }}>{typeIcon(a.type)} {a.type?.toUpperCase()}</span>
                              <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, background: sm.bg, color: sm.color, fontWeight: 700 }}>{sm.label}</span>
                            </div>
                            <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 4 }}>🏥 {a.spec}{a.hospitalName ? ` · ${a.hospitalName}` : ''}</div>
                            <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                              <span style={{ fontSize: 12, color: '#374151', fontWeight: 600 }}>📅 {a.date}</span>
                              <span style={{ fontSize: 12, color: '#374151' }}>🕐 {a.time}</span>
                              {a.fee && <span style={{ fontSize: 12, color: '#059669', fontWeight: 600 }}>💳 ₹{a.fee}</span>}
                            </div>
                            {a.reason && <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 4 }}>📝 {a.reason}</div>}
                          </div>
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginLeft: 12 }} onClick={e => e.stopPropagation()}>
                          {a.status === 'upcoming' && (<>
                            <button onClick={() => openReschedule(a)} title="Reschedule"
                              style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid rgba(245,158,11,.3)', background: 'rgba(245,158,11,.06)', color: '#d97706', fontWeight: 600, cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4, transition: 'all .15s', whiteSpace: 'nowrap' }}
                              onMouseEnter={e => e.currentTarget.style.background = 'rgba(245,158,11,.14)'}
                              onMouseLeave={e => e.currentTarget.style.background = 'rgba(245,158,11,.06)'}>
                              🔄 Reschedule
                            </button>
                            <button onClick={() => openCancel(a)} title="Cancel"
                              style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid rgba(239,68,68,.3)', background: 'rgba(239,68,68,.06)', color: '#dc2626', fontWeight: 600, cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4, transition: 'all .15s', whiteSpace: 'nowrap' }}
                              onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,.14)'}
                              onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,.06)'}>
                              ❌ Cancel
                            </button>
                          </>)}
                          {a.status === 'completed' && (
                            <button onClick={() => addToast('Opening review form…')}
                              style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid rgba(245,158,11,.3)', background: 'rgba(245,158,11,.06)', color: '#d97706', fontWeight: 600, cursor: 'pointer', fontSize: 12, whiteSpace: 'nowrap' }}>
                              ⭐ Review
                            </button>
                          )}
          
                          <button onClick={() => openDetail(a)} title="View details"
                            style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid rgba(0,0,0,.1)', background: '#fff', cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            ›
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right – sidebar - REMOVED Quick Book, Next Appointment, and Find Specialists sections */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Only Tips section remains */}
            <div style={{ background: 'rgba(16,185,129,.05)', borderRadius: 12, border: '1px solid rgba(16,185,129,.15)', padding: '14px 16px' }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: '#059669', marginBottom: 10 }}>💡 Quick Tips</div>
              {['Cancel 24h before for full refund', 'Rescheduling is free anytime', 'Join video calls 5 min early', 'Keep documents ready for consult'].map(t => (
                <div key={t} style={{ fontSize: 11, color: '#6B7280', padding: '4px 0', borderBottom: '1px solid rgba(0,0,0,.04)', display: 'flex', gap: 6 }}>
                  <span>→</span><span>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Book Modal ── */}
      <Modal show={showBookModal} onClose={() => setShowBookModal(false)} title='📅 Book New Appointment' wide
        footer={<><button style={S.btnOutline} onClick={() => setShowBookModal(false)}>Cancel</button><button style={S.btnPrimary} onClick={doBook}>✓ Confirm Booking</button></>}>
        {/* Type */}
        <div style={{ marginBottom: 14 }}>
          <label style={S.label}>Consultation type</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {[['video','📹','Video'],['phone','📞','Phone'],['chat','💬','Chat']].map(([type,icon,label]) => (
              <button key={type} onClick={() => f('type', type)} style={{ flex: 1, padding: '8px 0', borderRadius: 8, cursor: 'pointer', fontSize: 13,
                border: form.type === type ? '2px solid var(--blue)' : '1px solid rgba(0,0,0,.12)',
                background: form.type === type ? 'rgba(14,165,233,.08)' : '#fff',
                color: form.type === type ? 'var(--blue)' : '#374151', fontWeight: form.type === type ? 700 : 400 }}>{icon} {label}</button>
            ))}
          </div>
        </div>
        {/* Doctor */}
        <div style={{ marginBottom: 14 }}>
          <label style={S.label}>Select Doctor</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {DOCTOR_LIST.map((d, i) => (
              <div key={i} onClick={() => f('docIdx', i)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 10, cursor: 'pointer',
                border: form.docIdx === i ? '2px solid var(--blue)' : '1px solid rgba(0,0,0,.08)',
                background: form.docIdx === i ? 'rgba(14,165,233,.04)' : '#fff', transition: 'all .15s' }}>
                <img src={d.img} alt={d.label} width={36} height={36} style={{ borderRadius: '50%', border: '1.5px solid rgba(14,165,233,.2)' }} onError={e => e.target.style.display='none'} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: form.docIdx === i ? 'var(--blue)' : '#374151' }}>{d.label.split('–')[0].trim()}</div>
                  <div style={{ fontSize: 11, color: '#9CA3AF' }}>{d.spec}</div>
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#059669' }}>₹{d.fee}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Date & Slot */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
          <div>
            <label style={S.label}>Date</label>
            <input type="date" min={today} value={form.date} onChange={e => f('date', e.target.value)} style={S.input} />
          </div>
          <div>
            <label style={S.label}>Time Slot</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {selectedDoc.slots.map(s => (
                <button key={s} onClick={() => f('time', s)} style={{ padding: '5px 10px', borderRadius: 7, fontSize: 11, cursor: 'pointer',
                  border: form.time === s ? '2px solid var(--blue)' : '1px solid rgba(0,0,0,.1)',
                  background: form.time === s ? 'rgba(14,165,233,.1)' : '#fff',
                  color: form.time === s ? 'var(--blue)' : '#374151', fontWeight: form.time === s ? 700 : 400 }}>{s}</button>
              ))}
            </div>
          </div>
        </div>
        {/* Patient info */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
          <div><label style={S.label}>Patient Name *</label><input style={S.input} placeholder="Full name" value={form.patientName} onChange={e => f('patientName', e.target.value)} /></div>
          <div><label style={S.label}>Phone</label><input style={S.input} placeholder="+91 XXXXX XXXXX" type="tel" value={form.phone} onChange={e => f('phone', e.target.value)} /></div>
        </div>
        <div><label style={S.label}>Reason for Visit</label><textarea style={{ ...S.input, resize: 'vertical', minHeight: 60 }} placeholder="Describe your symptoms or reason…" value={form.reason} onChange={e => f('reason', e.target.value)} /></div>
        {/* Fee preview */}
        {form.date && form.time && (
          <div style={{ marginTop: 14, padding: '12px 14px', background: 'rgba(16,185,129,.05)', borderRadius: 10, border: '1px solid rgba(16,185,129,.15)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 13, color: '#6B7280' }}>Consultation fee</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#059669' }}>₹{selectedDoc.fee}</div>
          </div>
        )}
      </Modal>

      {/* ── Reschedule Modal ── */}
      <RescheduleModal show={showReschedule} onClose={() => setShowReschedule(false)} apt={activeApt} onSave={doReschedule} addToast={addToast} />

      {/* ── Cancel Modal ── */}
      <CancelModal show={showCancel} onClose={() => setShowCancel(false)} apt={activeApt} onConfirm={doCancel} addToast={addToast} />

      {/* ── Detail Modal ── */}
      <AptDetailModal show={showDetail} onClose={() => setShowDetail(false)} apt={activeApt}
        onReschedule={() => openReschedule(activeApt)}
        onCancel={() => openCancel(activeApt)} />
    </div>
  );
}

// ─── EMERGENCY VIEW ───────────────────────────────────────────────────────────
const FIRST_AID = [
  { c: 'var(--danger)', bg: 'rgba(239,68,68,.07)', border: 'rgba(239,68,68,.15)', icon: 'bi-heart', title: 'Heart Attack', items: ['Call emergency immediately', 'Help person sit/lie down', 'Give aspirin if available', 'Begin CPR if unresponsive'] },
  { c: 'var(--warning)', bg: 'rgba(245,158,11,.07)', border: 'rgba(245,158,11,.15)', icon: 'bi-droplet', title: 'Severe Bleeding', items: ['Apply direct pressure firmly', 'Elevate wound above heart', 'Use clean cloth or bandage', "Don't remove embedded objects"] },
  { c: 'var(--blue)', bg: 'rgba(14,165,233,.07)', border: 'rgba(14,165,233,.15)', icon: 'bi-thermometer', title: 'Choking', items: ['Encourage strong coughing', 'Apply 5 back blows', 'Perform Heimlich maneuver', 'Call emergency if continues'] },
];

export function EmergencyView({ addToast, logVault }) {
  const callEmergency = num => {
    if (window.confirm(`Call emergency number ${num}?`)) {
      addToast('Connecting to emergency services...', 'error');
      if (logVault) logVault('Emergency Call', 'Called: ' + num, 'general');
      setTimeout(() => { window.location.href = 'tel:' + num; }, 400);
    }
  };
  return (
    <div className="view"><div className="container-sc py4">
      <div className="section-head">
        <div className="badge-custom badge-red" style={{ marginBottom: 12 }}><i className="bi bi-exclamation-triangle-fill me-2" />Emergency Services</div>
        <h2 style={{ color: 'var(--danger)' }}>24/7 Emergency Support</h2>
        <p className="text-muted">Immediate medical assistance when you need it most</p>
      </div>
      <div className="grid grid-3 mb5">
        <div className="card-base text-center" style={{ borderColor: 'var(--danger)' }}>
          <i className="bi bi-hospital-fill pulse" style={{ fontSize: '2.5rem', color: 'var(--danger)', display: 'block', marginBottom: 12 }} />
          <h5>Emergency Ambulance</h5>
          <p style={{ fontWeight: 800, fontSize: '2rem', color: 'var(--danger)', margin: '8px 0' }}>108 / 112</p>
          <button className="btn-primary btn-full" style={{ background: 'var(--danger)', justifyContent: 'center' }} onClick={() => callEmergency('108')}><i className="bi bi-telephone-fill me-2" />Call Now</button>
        </div>
        <div className="card-base text-center" style={{ borderColor: 'var(--danger)' }}>
          <i className="bi bi-heart-pulse-fill pulse" style={{ fontSize: '2.5rem', color: 'var(--danger)', display: 'block', marginBottom: 12 }} />
          <h5>Nearest Hospital</h5>
          <p className="text-muted">City General Hospital<br />2.3 km away</p>
          <button className="btn-outline btn-full" style={{ justifyContent: 'center' }} onClick={() => addToast('Opening map...')}><i className="bi bi-geo-alt-fill me-2" />Get Directions</button>
        </div>
        <div className="card-base text-center" style={{ borderColor: 'var(--danger)' }}>
          <i className="bi bi-shield-fill-exclamation pulse" style={{ fontSize: '2.5rem', color: 'var(--danger)', display: 'block', marginBottom: 12 }} />
          <h5>Emergency Doctor</h5>
          <p className="text-muted">On-call specialist<br />Available 24/7</p>
          <button className="btn-outline btn-full" style={{ justifyContent: 'center' }} onClick={() => addToast('Connecting...')}><i className="bi bi-person-video3 me-2" />Connect Now</button>
        </div>
      </div>
      <div className="card-base card-hover-none mb4">
        <h5 className="mb4"><i className="bi bi-bookmark-heart-fill me-2" style={{ color: 'var(--danger)' }} />Quick First Aid Guide</h5>
        <div className="grid grid-3">
          {FIRST_AID.map(g => (
            <div key={g.title} style={{ padding: 16, borderRadius: 14, background: g.bg, border: `1px solid ${g.border}` }}>
              <h6 style={{ color: g.c, marginBottom: 8 }}><i className={`bi ${g.icon} me-2`} />{g.title}</h6>
              <ul className="small text-muted" style={{ paddingLeft: 16, margin: 0 }}>{g.items.map(it => <li key={it} style={{ marginBottom: 4 }}>{it}</li>)}</ul>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-2">
        <div className="card-base card-hover-none" style={{ borderColor: 'rgba(245,158,11,.3)' }}>
          <h5 className="mb3"><i className="bi bi-lightning-charge-fill me-2" style={{ color: 'var(--warning)' }} />When to Call Emergency</h5>
          <ul style={{ color: 'var(--muted)', paddingLeft: 20 }}>{['Difficulty breathing or shortness of breath','Chest pain lasting more than 2 minutes','Sudden severe headache or dizziness','Loss of consciousness or fainting','Severe allergic reaction (anaphylaxis)','Uncontrolled or major bleeding','Signs of stroke: face drooping, arm weakness'].map(i => <li key={i} style={{ marginBottom: 8 }}>{i}</li>)}</ul>
        </div>
        <div className="card-base card-hover-none" style={{ borderColor: 'rgba(16,185,129,.3)' }}>
          <h5 className="mb3"><i className="bi bi-check-circle-fill me-2 text-success" />Emergency Preparation</h5>
          <ul style={{ color: 'var(--muted)', paddingLeft: 20 }}>{['Keep emergency numbers easily accessible','Maintain a first aid kit at home','Know your blood type and allergies','Keep list of current medications','Know location of nearest hospital','Share medical info with family members','Learn basic CPR and first aid techniques'].map(i => <li key={i} style={{ marginBottom: 8 }}>{i}</li>)}</ul>
        </div>
      </div>
    </div></div>
  );
}