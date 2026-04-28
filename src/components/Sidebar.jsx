// src/components/Sidebar.jsx (CORRECTED - with auth handling)
import { useState } from 'react';

const SIDEBAR_ITEMS = [
  { id: 'store', label: 'Medicine Store', icon: 'bi-shop', category: 'Medical Services', requiresAuth: true },
  { id: 'pharmacy', label: 'Pharmacy', icon: 'bi-capsule', category: 'Medical Services', requiresAuth: true },
  { id: 'vision', label: 'Vision AI', icon: 'bi-eye', category: 'AI Services', requiresAuth: true },
  { id: 'lab', label: 'Diagnostics', icon: 'bi-clipboard2-pulse', category: 'Medical Services', requiresAuth: true },
  { id: 'health', label: 'Health Tracker', icon: 'bi-activity', category: 'Wellness', requiresAuth: true },
  { id: 'appointments', label: 'Appointments', icon: 'bi-calendar-check', category: 'Management', requiresAuth: true },
  { id: 'profile', label: 'My Profile', icon: 'bi-person', category: 'Account', requiresAuth: true },
  { id: 'wallet', label: 'My Wallet', icon: 'bi-wallet2', category: 'Account', requiresAuth: true },
  { id: 'orders', label: 'My Orders', icon: 'bi-truck', category: 'Account', requiresAuth: true },
];

export default function Sidebar({ isOpen, onClose, view, setView, onLogout, user, isAuthenticated }) {
  const handleNav = (item) => {
    if (item.requiresAuth && !isAuthenticated) {
      setView('login', true);
      onClose();
      return;
    }
    setView(item.id);
    onClose();
  };

  if (!isOpen) return null;

  const userName = user?.name || 'Guest User';
  const userEmail = user?.email || 'guest@example.com';
  const userAvatar = user?.avatar || null;
  
  const getInitials = (name) => {
    if (!name || name === 'Guest User') return 'GU';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const groupedItems = SIDEBAR_ITEMS.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <>
      <div className="sidebar-overlay" onClick={onClose} />
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <i className="bi bi-heart-pulse-fill" />
            <span>SymptoCare</span>
          </div>
          <button className="sidebar-close" onClick={onClose}>✕</button>
        </div>

        <div className="sidebar-user">
          <div className="sidebar-avatar">
            {userAvatar ? <img src={userAvatar} alt={userName} /> : <span>{getInitials(userName)}</span>}
          </div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{userName}</div>
            <div className="sidebar-user-email">{userEmail}</div>
          </div>
        </div>

        <div className="sidebar-nav">
          {Object.entries(groupedItems).map(([category, items]) => (
            <div key={category} className="sidebar-category">
              <div className="sidebar-category-title">{category}</div>
              {items.map(item => (
                <button
                  key={item.id}
                  className={`sidebar-nav-item ${view === item.id ? 'active' : ''}`}
                  onClick={() => handleNav(item)}
                >
                  <i className={`bi ${item.icon}`} />
                  <span>{item.label}</span>
                  {!isAuthenticated && item.requiresAuth && <i className="bi bi-lock-fill sidebar-lock-icon" />}
                  {view === item.id && <i className="bi bi-check-circle-fill sidebar-active-icon" />}
                </button>
              ))}
            </div>
          ))}
        </div>

        <div className="sidebar-footer">
          {isAuthenticated ? (
            <button className="sidebar-logout" onClick={onLogout}>
              <i className="bi bi-box-arrow-right" /> Sign Out
            </button>
          ) : (
            <button className="sidebar-login" onClick={() => setView('login')}>
              <i className="bi bi-box-arrow-in-right" /> Sign In / Register
            </button>
          )}
        </div>
      </div>

      <style>{`
        .sidebar-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          z-index: 1001;
          animation: fadeIn 0.2s ease;
        }
        
        .sidebar {
          position: fixed;
          top: 0;
          left: 0;
          width: 300px;
          height: 100vh;
          background: #fff;
          z-index: 1002;
          display: flex;
          flex-direction: column;
          animation: slideInLeft 0.3s ease;
          box-shadow: 2px 0 20px rgba(0,0,0,0.1);
        }
        
        @keyframes slideInLeft {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .sidebar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .sidebar-brand {
          font-size: 1.3rem;
          font-weight: 800;
          color: var(--blue);
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .sidebar-brand i { font-size: 1.5rem; }
        
        .sidebar-close {
          background: none;
          border: none;
          font-size: 18px;
          cursor: pointer;
          color: #94a3b8;
          transition: color 0.2s;
        }
        
        .sidebar-close:hover { color: #ef4444; }
        
        .sidebar-user {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 20px;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .sidebar-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea, #764ba2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 16px;
          overflow: hidden;
          flex-shrink: 0;
        }
        
        .sidebar-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .sidebar-user-info {
          flex: 1;
          min-width: 0;
        }
        
        .sidebar-user-name {
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 2px;
          font-size: 14px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        .sidebar-user-email {
          font-size: 11px;
          color: #64748b;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        .sidebar-nav {
          flex: 1;
          padding: 16px 12px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          overflow-y: auto;
        }
        
        .sidebar-category {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        
        .sidebar-category-title {
          font-size: 11px;
          font-weight: 700;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          padding: 0 14px;
          margin-bottom: 8px;
        }
        
        .sidebar-nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          border-radius: 10px;
          border: none;
          background: none;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          color: #475569;
          transition: all 0.2s;
          width: 100%;
          text-align: left;
          position: relative;
        }
        
        .sidebar-nav-item i { font-size: 1.1rem; width: 22px; }
        
        .sidebar-nav-item:hover {
          background: #f1f5f9;
          color: var(--blue);
        }
        
        .sidebar-nav-item.active {
          background: rgba(14,165,233,0.1);
          color: var(--blue);
          font-weight: 600;
        }
        
        .sidebar-active-icon {
          margin-left: auto;
          font-size: 14px;
          color: var(--blue);
        }
        
        .sidebar-lock-icon {
          margin-left: auto;
          font-size: 12px;
          color: #94a3b8;
        }
        
        .sidebar-footer {
          padding: 16px;
          border-top: 1px solid #e2e8f0;
        }
        
        .sidebar-logout {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 10px 14px;
          border-radius: 10px;
          border: none;
          background: none;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          color: #ef4444;
          transition: all 0.2s;
        }
        
        .sidebar-logout:hover {
          background: rgba(239,68,68,0.1);
        }
        
        .sidebar-login {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 10px 14px;
          border-radius: 10px;
          border: none;
          background: linear-gradient(135deg, #667eea, #764ba2);
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          color: white;
          transition: all 0.2s;
          justify-content: center;
        }
        
        .sidebar-login:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102,126,234,0.3);
        }
        
        body.dark-mode .sidebar {
          background: #1e293b;
        }
        
        body.dark-mode .sidebar-header {
          border-bottom-color: #334155;
        }
        
        body.dark-mode .sidebar-user {
          background: #0f172a;
          border-bottom-color: #334155;
        }
        
        body.dark-mode .sidebar-user-name {
          color: #f1f5f9;
        }
        
        body.dark-mode .sidebar-category-title {
          color: #64748b;
        }
        
        body.dark-mode .sidebar-nav-item {
          color: #94a3b8;
        }
        
        body.dark-mode .sidebar-nav-item:hover {
          background: #334155;
        }
        
        body.dark-mode .sidebar-footer {
          border-top-color: #334155;
        }
      `}</style>
    </>
  );
}