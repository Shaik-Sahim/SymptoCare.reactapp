// src/views/AIViews.jsx
import { useState, useRef, useEffect, useCallback } from 'react';
import { Spinner } from "../components/UI.jsx";
import { DENTAL_CONDITIONS, SKIN_CONDITIONS } from "../data/index.js";

// Toast Component
function Toast({ toasts, removeToast }) {
  return (
    <div style={{position:'fixed', bottom:24, right:24, zIndex:10000, display:'flex', flexDirection:'column', gap:8}}>
      {toasts.map(t => (
        <div key={t.id} style={{
          background: t.type==='success'?'#10b981':t.type==='error'?'#ef4444':'#3b82f6',
          color:'#fff', padding:'10px 18px', borderRadius:10, fontSize:13, fontWeight:600,
          boxShadow:'0 4px 20px rgba(0,0,0,0.3)',
          animation:'slideIn 0.3s ease',
        }}>
          {t.msg}
        </div>
      ))}
      <style>{`@keyframes slideIn{from{opacity:0;transform:translateX(60px)}to{opacity:1;transform:translateX(0)}}`}</style>
    </div>
  );
}

// Mock AI Analysis with Product Recommendations
function analyzeWithLocalData(scanType) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (scanType === 'dental') {
        const conditions = DENTAL_CONDITIONS;
        const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
        resolve({
          condition: randomCondition.name,
          severity: randomCondition.severity,
          confidence: 0.87 + Math.random() * 0.1,
          diagnosis: randomCondition.diag,
          products: randomCondition.prods.map(p => ({ 
            ...p, 
            id: p.id || Date.now() + Math.random(),
            price: p.p,
            originalPrice: Math.round(p.p * 1.2),
            rating: 4.7,
            inStock: true,
            icon: p.icon || '🛒'
          })),
          urgency: randomCondition.urgency,
          specialist: randomCondition.specialist,
          tips: ['Brush twice daily with fluoride toothpaste', 'Floss at least once a day', 'Visit dentist every 6 months', 'Limit sugary foods and drinks']
        });
      } else if (scanType === 'skin') {
        const conditions = SKIN_CONDITIONS;
        const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
        resolve({
          condition: randomCondition.name,
          severity: randomCondition.severity,
          confidence: 0.84 + Math.random() * 0.12,
          diagnosis: randomCondition.diag,
          products: randomCondition.prods.map(p => ({ 
            ...p, 
            id: p.id || Date.now() + Math.random(),
            price: p.p,
            originalPrice: Math.round(p.p * 1.2),
            rating: 4.7,
            inStock: true,
            icon: p.icon || '🧴'
          })),
          urgency: randomCondition.urgency === 'Routine Care' ? 'Low' : 'Medium',
          specialist: randomCondition.specialist,
          tips: ['Use sunscreen daily', 'Keep skin hydrated', 'Gentle cleansing twice daily', 'Consult a dermatologist for persistent issues']
        });
      } else {
        const skinCond = SKIN_CONDITIONS[Math.floor(Math.random() * SKIN_CONDITIONS.length)];
        const dentalCond = DENTAL_CONDITIONS[Math.floor(Math.random() * DENTAL_CONDITIONS.length)];
        resolve({
          overallScore: 65 + Math.floor(Math.random() * 25),
          skin: {
            condition: skinCond.name,
            severity: skinCond.severity,
            confidence: 0.82 + Math.random() * 0.1,
            diagnosis: skinCond.diag,
            products: skinCond.prods.slice(0, 3).map(p => ({ 
              ...p, 
              id: p.id || Date.now() + Math.random(),
              price: p.p,
              originalPrice: Math.round(p.p * 1.2),
              rating: 4.7,
              inStock: true,
              icon: p.icon || '🧴'
            })),
            tips: ['Use SPF 50+ daily', 'Hydrate skin morning and night']
          },
          dental: {
            condition: dentalCond.name,
            severity: dentalCond.severity,
            confidence: 0.84 + Math.random() * 0.1,
            diagnosis: dentalCond.diag,
            products: dentalCond.prods.slice(0, 3).map(p => ({ 
              ...p, 
              id: p.id || Date.now() + Math.random(),
              price: p.p,
              originalPrice: Math.round(p.p * 1.2),
              rating: 4.7,
              inStock: true,
              icon: p.icon || '🦷'
            })),
            tips: ['Brush twice daily', 'Floss once daily', 'Use mouthwash']
          }
        });
      }
    }, 2000);
  });
}

// Score Circle Component
function ScoreCircle({ score }) {
  const pct = Math.min(100, Math.max(0, score));
  const c = 2 * Math.PI * 45;
  const dash = (pct / 100) * c;
  const color = pct >= 75 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#ef4444';
  return (
    <div style={{position:'relative', width:110, height:110}}>
      <svg viewBox="0 0 100 100" style={{width:'100%', height:'100%', transform:'rotate(-90deg)'}}>
        <circle cx="50" cy="50" r="45" fill="none" stroke="#1e293b" strokeWidth="8"/>
        <circle cx="50" cy="50" r="45" fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={`${dash} ${c}`} strokeLinecap="round"/>
      </svg>
      <div style={{position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
        <span style={{color, fontWeight:800, fontSize:26, lineHeight:1}}>{pct}</span>
        <span style={{color:'#94a3b8', fontSize:10}}>/100</span>
      </div>
    </div>
  );
}

// Product Card with Add to Cart
function ProductCard({ product, onAddToCart, onViewDetails }) {
  const [added, setAdded] = useState(false);
  
  const handleAddToCart = () => {
    onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };
  
  const stars = Array.from({length:5}, (_,i) => (
    <span key={i} style={{color: i < Math.floor(product.rating || 4.5) ? '#fbbf24' : '#334155', fontSize:12}}>★</span>
  ));

  return (
    <div style={{
      background: 'linear-gradient(135deg, #1e293b, #0f172a)',
      borderRadius: 16,
      overflow: 'hidden',
      border: '1px solid #334155',
      transition: 'transform 0.2s, box-shadow 0.2s'
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.4)'; }}
    onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>
      <div style={{
        background: 'linear-gradient(135deg, #1d4ed8, #6d28d9)',
        padding: 16,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 48,
        position: 'relative'
      }}>
        <span style={{ fontSize: 48 }}>{product.icon || '🛒'}</span>
        <div style={{
          position: 'absolute',
          top: 8,
          right: 8,
          background: 'rgba(16,185,129,0.9)',
          color: '#fff',
          fontSize: 10,
          fontWeight: 700,
          padding: '3px 8px',
          borderRadius: 20
        }}>
          ★ {product.rating || 4.8}
        </div>
      </div>
      <div style={{ padding: '14px 16px' }}>
        <h5 style={{ color: '#f1f5f9', fontSize: 14, fontWeight: 700, margin: '0 0 4px' }}>{product.n || product.name}</h5>
        <p style={{ color: '#94a3b8', fontSize: 11, margin: '0 0 8px' }}>{product.d || 'Recommended product'}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>{stars}</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ color: '#10b981', fontWeight: 800, fontSize: 18 }}>₹{product.price}</span>
            {product.originalPrice && (
              <span style={{ color: '#64748b', fontSize: 11, textDecoration: 'line-through', marginLeft: 6 }}>₹{product.originalPrice}</span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            style={{
              background: added ? '#10b981' : 'linear-gradient(90deg, #0ea5e9, #0284c7)',
              color: '#fff',
              border: 'none',
              borderRadius: 10,
              padding: '8px 16px',
              fontWeight: 600,
              fontSize: 12,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {added ? '✓ Added to Cart' : '🛒 Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Camera Component
function CameraCapture({ onCapture, scanType }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [cameraError, setCameraError] = useState('');

  const startCamera = useCallback(async () => {
    setCameraError('');
    try {
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraOn(true);
    } catch (e) {
      setCameraError('Camera access denied. Please allow camera permission.');
      setCameraOn(false);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraOn(false);
  }, []);

  useEffect(() => { return () => stopCamera(); }, [stopCamera]);

  const capture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const v = videoRef.current;
    const c = canvasRef.current;
    c.width = v.videoWidth || 640;
    c.height = v.videoHeight || 480;
    c.getContext('2d').drawImage(v, 0, 0);
    const dataUrl = c.toDataURL('image/jpeg', 0.92);
    stopCamera();
    onCapture(dataUrl);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: 520,
        borderRadius: 20,
        overflow: 'hidden',
        background: '#0f172a',
        border: cameraOn ? '2px solid #38bdf8' : '2px solid #334155',
        minHeight: cameraOn ? 320 : 200
      }}>
        <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', display: cameraOn ? 'block' : 'none', borderRadius: 20 }} />
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        {!cameraOn && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, gap: 12, minHeight: 200 }}>
            <div style={{ fontSize: 48 }}>{scanType === 'dental' ? '😬' : scanType === 'skin' ? '🧴' : '📸'}</div>
            <p style={{ color: '#94a3b8', textAlign: 'center', fontSize: 14 }}>{cameraError || 'Camera is off. Click Start Camera to begin.'}</p>
          </div>
        )}
      </div>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        {!cameraOn ? (
          <button onClick={startCamera} style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 12, padding: '12px 24px', fontWeight: 700, cursor: 'pointer' }}>
            📷 Start Camera
          </button>
        ) : (
          <>
            <button onClick={capture} style={{ background: '#10b981', color: '#fff', border: 'none', borderRadius: 12, padding: '12px 32px', fontWeight: 700, cursor: 'pointer', fontSize: 16 }}>
              📸 Capture & Analyze
            </button>
            <button onClick={stopCamera} style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 12, padding: '12px 24px', fontWeight: 700, cursor: 'pointer' }}>
              ✕ Stop
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// Image Upload Component
function ImageUpload({ onCapture }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = e => onCapture(e.target.result);
    reader.readAsDataURL(file);
  };

  return (
    <div
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
      onClick={() => inputRef.current?.click()}
      style={{
        border: `2px dashed ${dragging ? '#38bdf8' : '#334155'}`,
        borderRadius: 16,
        padding: '32px 24px',
        textAlign: 'center',
        cursor: 'pointer',
        background: dragging ? 'rgba(56,189,248,0.05)' : 'rgba(255,255,255,0.02)',
        transition: 'all 0.2s ease'
      }}
    >
      <div style={{ fontSize: 36, marginBottom: 8 }}>🖼️</div>
      <p style={{ color: '#94a3b8', fontSize: 13 }}>
        Drop an image here or <span style={{ color: '#38bdf8', fontWeight: 600 }}>click to browse</span>
      </p>
      <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleFile(e.target.files[0])} />
    </div>
  );
}

// Single Result Panel with Products
function SingleResultPanel({ results, scanType, capturedImage, onReset, onDownload, addToCart, addToast }) {
  const products = results.products || results.prods || [];
  const color = results.severity === 'Mild' ? '#10b981' : results.severity === 'Moderate' ? '#f59e0b' : '#ef4444';
  
  const handleAddToCart = (product) => {
    const cartProduct = {
      id: product.id,
      name: product.n || product.name,
      price: product.price,
      icon: product.icon || '🛒',
      qty: 1
    };
    addToCart(cartProduct);
    addToast(`${cartProduct.name} added to cart!`, 'success');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 24 }}>
      {/* Result Header */}
      <div style={{
        background: 'linear-gradient(135deg,#1e293b,#0f172a)',
        border: `1px solid ${color}40`,
        borderRadius: 20,
        padding: 24,
        display: 'flex',
        flexWrap: 'wrap',
        gap: 20,
        alignItems: 'center'
      }}>
        <ScoreCircle score={Math.round((results.confidence || 0.85) * 100)} />
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ display: 'inline-block', background: `${color}20`, border: `1px solid ${color}`, color, borderRadius: 20, padding: '3px 12px', fontSize: 12, fontWeight: 700, marginBottom: 8 }}>
            {results.severity}
          </div>
          <h2 style={{ color: '#f1f5f9', margin: '0 0 6px', fontSize: 22 }}>{results.condition || results.name}</h2>
          <p style={{ color: '#94a3b8', margin: 0, fontSize: 13 }}>
            AI Confidence: <strong style={{ color: '#38bdf8' }}>{Math.round((results.confidence||0.85)*100)}%</strong>
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={onDownload} style={{ background: '#6366f1', color: '#fff', border: 'none', borderRadius: 10, padding: '8px 16px', fontWeight: 600, cursor: 'pointer' }}>⬇ Report</button>
          <button onClick={onReset} style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 10, padding: '8px 16px', fontWeight: 600, cursor: 'pointer' }}>↺ New Scan</button>
        </div>
      </div>

      {/* AI Diagnosis */}
      <div style={{ background: 'rgba(56,189,248,0.05)', border: '1px solid rgba(56,189,248,0.2)', borderRadius: 16, padding: 20 }}>
        <h4 style={{ color: '#38bdf8', fontSize: 14, fontWeight: 700, margin: '0 0 12px' }}>🤖 AI Diagnosis</h4>
        <div style={{ color: '#cbd5e1', fontSize: 14, lineHeight: 1.7 }}>{results.diagnosis}</div>
      </div>

      {/* Tips */}
      {results.tips?.length > 0 && (
        <div style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 16, padding: 20 }}>
          <h4 style={{ color: '#10b981', fontSize: 14, fontWeight: 700, margin: '0 0 12px' }}>💡 Care Tips</h4>
          <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {results.tips.map((t,i) => <li key={i} style={{ color: '#94a3b8', fontSize: 13 }}>{t}</li>)}
          </ul>
        </div>
      )}

      {/* Recommended Products */}
      {products.length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <h4 style={{ color: '#f1f5f9', fontSize: 15, fontWeight: 700, margin: 0 }}>
              🛒 Recommended Products for You
            </h4>
            <span style={{ fontSize: 11, color: '#64748b' }}>{products.length} products</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
            {products.map((p, i) => (
              <ProductCard key={i} product={p} onAddToCart={handleAddToCart} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Dual Result Panel with Products
function DualResultPanel({ results, capturedImage, onReset, onDownload, addToCart, addToast }) {
  const [tab, setTab] = useState('skin');
  const current = tab === 'skin' ? results.skin : results.dental;
  const products = current?.products || [];
  
  const handleAddToCart = (product) => {
    const cartProduct = {
      id: product.id,
      name: product.n || product.name,
      price: product.price,
      icon: product.icon || '🛒',
      qty: 1
    };
    addToCart(cartProduct);
    addToast(`${cartProduct.name} added to cart!`, 'success');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 24 }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg,#1e293b,#0f172a)', border: '1px solid #334155', borderRadius: 20, padding: 24, display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'center' }}>
        <ScoreCircle score={results.overallScore || 78} />
        <div style={{ flex: 1 }}>
          <h3 style={{ color: '#f1f5f9', margin: '0 0 4px', fontSize: 18 }}>Overall Health Score</h3>
          <p style={{ color: '#94a3b8', margin: '0 0 8px', fontSize: 13 }}>Combined dental + skin analysis</p>
          <div style={{ display: 'flex', gap: 16 }}>
            <div><span style={{ color: '#64748b', fontSize: 11 }}>SKIN</span><div style={{ color: '#10b981', fontWeight: 700 }}>{results.skin?.condition || '—'}</div></div>
            <div><span style={{ color: '#64748b', fontSize: 11 }}>DENTAL</span><div style={{ color: '#f59e0b', fontWeight: 700 }}>{results.dental?.condition || '—'}</div></div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={onDownload} style={{ background: '#6366f1', color: '#fff', border: 'none', borderRadius: 10, padding: '8px 16px', fontWeight: 600, cursor: 'pointer' }}>⬇ Report</button>
          <button onClick={onReset} style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 10, padding: '8px 16px', fontWeight: 600, cursor: 'pointer' }}>↺ New Scan</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, borderRadius: 12, overflow: 'hidden', border: '1px solid #334155' }}>
        {['skin', 'dental'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1, padding: '12px 0', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 14,
            background: tab === t ? (t === 'skin' ? '#3b82f6' : '#10b981') : '#1e293b',
            color: tab === t ? '#fff' : '#64748b'
          }}>
            {t === 'skin' ? '🧴 Skin Analysis' : '🦷 Dental Analysis'}
          </button>
        ))}
      </div>

      {/* Current Tab Content */}
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid #334155', borderRadius: 16, padding: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 style={{ color: '#f1f5f9', margin: 0, fontSize: 18 }}>{current?.condition}</h3>
          <span style={{ padding: '3px 12px', borderRadius: 20, background: current?.severity === 'High' ? 'rgba(239,68,68,0.2)' : current?.severity === 'Medium' ? 'rgba(245,158,11,0.2)' : 'rgba(16,185,129,0.2)', color: current?.severity === 'High' ? '#ef4444' : current?.severity === 'Medium' ? '#f59e0b' : '#10b981', fontSize: 12, fontWeight: 700 }}>{current?.severity} Severity</span>
        </div>
        <p style={{ color: '#cbd5e1', fontSize: 14, lineHeight: 1.6 }}>{current?.diagnosis}</p>
        
        {current?.tips?.length > 0 && (
          <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #334155' }}>
            <strong style={{ color: '#10b981', fontSize: 12 }}>💡 Tips:</strong>
            <ul style={{ margin: '8px 0 0', paddingLeft: 20 }}>
              {current.tips.map((t,i) => <li key={i} style={{ color: '#94a3b8', fontSize: 12 }}>{t}</li>)}
            </ul>
          </div>
        )}
      </div>

      {/* Products */}
      {products.length > 0 && (
        <div>
          <h4 style={{ color: '#f1f5f9', fontSize: 15, fontWeight: 700, marginBottom: 14 }}>
            🛒 Recommended {tab === 'skin' ? 'Skincare' : 'Dental'} Products
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
            {products.map((p, i) => (
              <ProductCard key={i} product={p} onAddToCart={handleAddToCart} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Main Vision View Component
export function VisionView({ addToast: externalAddToast, logVault, addToCart, defaultScanType = 'all' }) {
  const [scanType, setScanType] = useState(defaultScanType);
  const [results, setResults] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [inputMode, setInputMode] = useState('camera');
  const [toasts, setToasts] = useState([]);
  const [progressStep, setProgressStep] = useState(0);

  const pushToast = (msg, type = 'info') => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4000);
    if (externalAddToast) externalAddToast(msg, type);
  };

  const handleAnalyze = async (imageData) => {
    setSpinning(true);
    setCapturedImage(imageData);
    setResults(null);
    setProgressStep(0);

    const steps = ['Detecting facial landmarks…', 'Analyzing regions…', 'Generating recommendations…'];
    let step = 0;
    const iv = setInterval(() => {
      step = Math.min(step + 1, steps.length - 1);
      setProgressStep(step);
    }, 600);

    try {
      const result = await analyzeWithLocalData(scanType);
      clearInterval(iv);
      setResults(result);
      pushToast(`✅ Analysis complete!`, 'success');
      if (logVault) logVault('Vision AI Scan', result.condition || 'Analysis Complete', 'scan');
    } catch (e) {
      clearInterval(iv);
      pushToast('Analysis failed. Please try again.', 'error');
    }
    setSpinning(false);
  };

  const downloadReport = () => {
    if (!results) return;
    const blob = new Blob([JSON.stringify({ scanType, timestamp: new Date().toLocaleString(), results }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `health_scan_${Date.now()}.json`; a.click();
    URL.revokeObjectURL(url);
    pushToast('Report downloaded!', 'success');
  };

  const reset = () => { setResults(null); setCapturedImage(null); setProgressStep(0); };

  const progressLabels = ['Detecting landmarks…', 'Analyzing…', 'Generating results…'];

  return (
    <div className="view" style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Toast toasts={toasts} />
      <Spinner show={spinning} />
      
      <div className="container-sc py4">
        <div className="section-head">
          <div className="hero-badge" style={{ display: 'inline-flex', background: 'rgba(14,165,233,0.1)', color: 'var(--blue)', padding: '8px 20px', borderRadius: 50, marginBottom: 16 }}>
            <span style={{ fontSize: 20, marginRight: 8 }}>🔬</span>
            OMNIVISION AI SCANNER
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, background: 'linear-gradient(135deg, #667eea, #764ba2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 16 }}>
            One Photo → Complete Health Analysis
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '1.1rem' }}>AI-powered dental + skin analysis with product recommendations</p>
        </div>

        {!results && (
          <div className="card-base" style={{ maxWidth: 700, margin: '0 auto', background: 'white' }}>
            {/* Scan type selector */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
              {[
                { k: 'all', label: '✨ Full Face Scan', sub: 'Dental + Skin' },
                { k: 'dental', label: '🦷 Dental Only', sub: 'Cavities, gums' },
                { k: 'skin', label: '🧴 Skin Only', sub: 'Texture, tone' },
              ].map(opt => (
                <button key={opt.k} onClick={() => setScanType(opt.k)} style={{
                  flex: 1, padding: '12px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                  background: scanType === opt.k ? 'var(--blue)' : 'white',
                  color: scanType === opt.k ? 'white' : 'var(--dark)',
                  border: `2px solid ${scanType === opt.k ? 'var(--blue)' : 'var(--border)'}`,
                  borderRadius: 12,
                  cursor: 'pointer',
                  fontWeight: 600
                }}>
                  <span style={{ fontWeight: 700, fontSize: 14 }}>{opt.label}</span>
                  <span style={{ fontSize: 11, opacity: 0.7 }}>{opt.sub}</span>
                </button>
              ))}
            </div>

            {/* Input mode toggle */}
            <div style={{ display: 'flex', gap: 0, borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)', marginBottom: 24 }}>
              {[['camera', '📷 Camera'], ['upload', '🖼️ Upload']].map(([m, l]) => (
                <button key={m} onClick={() => setInputMode(m)} style={{
                  flex: 1, padding: '12px 0', border: 'none', cursor: 'pointer',
                  background: inputMode === m ? 'var(--blue)' : 'white',
                  color: inputMode === m ? 'white' : 'var(--muted)',
                  fontWeight: 700, fontSize: 13
                }}>{l}</button>
              ))}
            </div>

            {inputMode === 'camera'
              ? <CameraCapture onCapture={handleAnalyze} scanType={scanType} />
              : <ImageUpload onCapture={handleAnalyze} />
            }
          </div>
        )}

        {/* Processing overlay */}
        {spinning && capturedImage && (
          <div className="card-base" style={{ maxWidth: 500, margin: '24px auto 0', textAlign: 'center' }}>
            <img src={capturedImage} alt="Processing" style={{ width: '100%', maxWidth: 280, borderRadius: 16, marginBottom: 16 }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {progressLabels.map((l, i) => (
                <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center', opacity: i <= progressStep ? 1 : 0.3 }}>
                  <span style={{ color: i < progressStep ? 'var(--success)' : i === progressStep ? 'var(--blue)' : 'var(--border)' }}>
                    {i < progressStep ? '✓' : i === progressStep ? '⟳' : '○'}
                  </span>
                  <span style={{ color: i < progressStep ? 'var(--success)' : 'var(--muted)' }}>{l}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {results && !spinning && (
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            {scanType === 'all'
              ? <DualResultPanel results={results} capturedImage={capturedImage} onReset={reset} onDownload={downloadReport} addToCart={addToCart} addToast={pushToast} />
              : <SingleResultPanel results={results} scanType={scanType} capturedImage={capturedImage} onReset={reset} onDownload={downloadReport} addToCart={addToCart} addToast={pushToast} />
            }
          </div>
        )}

        <div style={{ marginTop: 40, textAlign: 'center', color: 'var(--muted)', fontSize: 11 }}>
          ⚠️ AI analysis is for informational purposes only. Consult a healthcare professional for medical advice.
        </div>
      </div>
    </div>
  );
}

export default VisionView;