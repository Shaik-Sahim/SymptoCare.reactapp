// src/components/UI.jsx

// ─── TOAST ─────────────────────────────────────────────────────────────────────
export function Toast({ toasts, removeToast }) {
  return (
    <div className="toast-wrap">
      {toasts.map(t => (
        <div key={t.id} className={`toast-item${t.type === 'error' ? ' err' : ''}`}>
          <div className="flex-start">
            <i className={`bi bi-${t.type === 'success' ? 'check-circle-fill text-success' : 'exclamation-circle-fill text-danger'}`} style={{ fontSize: '1.1rem' }} />
            <div style={{ flex: 1 }}>
              <strong>{t.type === 'success' ? 'Success' : 'Notice'}</strong>
              <p className="small text-muted" style={{ margin: 0 }}>{t.msg}</p>
            </div>
            <button onClick={() => removeToast(t.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem' }}>✕</button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── SPINNER ───────────────────────────────────────────────────────────────────
export function Spinner({ show, text = 'Processing...' }) {
  if (!show) return null;
  return (
    <div className="spin-overlay">
      <div className="spinner-ring" />
      <p style={{ color: '#fff', fontWeight: 600, marginTop: 12 }}>{text}</p>
    </div>
  );
}

// ─── MODAL ─────────────────────────────────────────────────────────────────────
export function Modal({ show, onClose, title, children, footer, size = '' }) {
  if (!show) return null;
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={size === 'lg' ? { maxWidth: 820 } : size === 'sm' ? { maxWidth: 460 } : {}}>
        <div className="modal-header">
          <h5 style={{ margin: 0 }} dangerouslySetInnerHTML={{ __html: title }} />
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}

// ─── EMPTY STATE ───────────────────────────────────────────────────────────────
export function EmptyState({ icon, title, desc, action, actionLabel }) {
  return (
    <div className="text-center" style={{ padding: '60px 20px' }}>
      <i className={`bi ${icon}`} style={{ fontSize: '3rem', color: 'var(--muted)', display: 'block', marginBottom: 12 }} />
      <h5 style={{ marginBottom: 6 }}>{title}</h5>
      {desc && <p className="text-muted">{desc}</p>}
      {action && (
        <button className="btn-primary" style={{ marginTop: 16 }} onClick={action}>{actionLabel}</button>
      )}
    </div>
  );
}

// ─── PROGRESS BAR ──────────────────────────────────────────────────────────────
export function ProgressBar({ value, max = 100, color = 'var(--grad)', height = 8 }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="prog-bar-wrap" style={{ height }}>
      <div className="prog-bar-fill" style={{ width: pct + '%', background: color }} />
    </div>
  );
}

// ─── BADGE ─────────────────────────────────────────────────────────────────────
export function Badge({ label, color = 'blue' }) {
  const map = {
    blue: 'badge-blue', red: 'badge-red', success: 'badge-success',
    warning: 'background:rgba(245,158,11,.1);color:var(--warning)',
  };
  return <span className={`badge-custom ${map[color] || 'badge-blue'}`}>{label}</span>;
}