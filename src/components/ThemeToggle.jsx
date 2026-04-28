// src/components/ThemeToggle.jsx
import { useState, useEffect } from 'react';

export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('symptocare_theme');
    return saved === 'dark';
  });

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('symptocare_theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('symptocare_theme', 'light');
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(prev => !prev);

  return (
    <button className="theme-toggle" onClick={toggleTheme} title={darkMode ? 'Light Mode' : 'Dark Mode'}>
      <i className={`bi ${darkMode ? 'bi-sun-fill' : 'bi-moon-stars-fill'}`} />
      <style>{`
        .theme-toggle {
          background: ${darkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.06)'};
          border: none;
          border-radius: 40px;
          padding: 8px 14px;
          cursor: pointer;
          color: ${darkMode ? '#fbbf24' : '#6366f1'};
          font-size: 1rem;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 500;
        }
        
        .theme-toggle:hover {
          transform: scale(1.05);
          background: ${darkMode ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.1)'};
        }
        
        body.dark-mode {
          --bg: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
          --card: linear-gradient(135deg, #1e293b 0%, #2d2a5e 100%);
          --border: #334155;
          --dark: #f1f5f9;
          --muted: #94a3b8;
          --blue: #60a5fa;
          --cyan: #22d3ee;
          --purple: #a78bfa;
          --success: #34d399;
          --warning: #fbbf24;
          --danger: #f87171;
        }
        
        body.dark-mode .navbar-sc {
          background: rgba(15,23,42,0.95);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(96,165,250,0.2);
        }
        
        body.dark-mode .brand span:first-of-type {
          color: #f1f5f9;
        }
        
        body.dark-mode .nav-link {
          color: #cbd5e1;
        }
        
        body.dark-mode .nav-link:hover {
          color: #60a5fa;
          background: rgba(96,165,250,0.1);
        }
        
        body.dark-mode .nav-link.active {
          color: #60a5fa;
          background: rgba(96,165,250,0.15);
        }
        
        body.dark-mode .user-menu-btn {
          background: rgba(96,165,250,0.1);
          border-color: rgba(96,165,250,0.3);
        }
        
        body.dark-mode .user-name {
          color: #f1f5f9;
        }
        
        body.dark-mode .user-dropdown {
          background: #1e293b;
          border: 1px solid #334155;
        }
        
        body.dark-mode .user-dropdown-header {
          background: #0f172a;
        }
        
        body.dark-mode .user-dropdown-name {
          color: #f1f5f9;
        }
        
        body.dark-mode .user-dropdown button {
          color: #cbd5e1;
        }
        
        body.dark-mode .user-dropdown button:hover {
          background: #334155;
        }
        
        body.dark-mode .card-base,
        body.dark-mode .product-card,
        body.dark-mode .metric-card,
        body.dark-mode .cart-side,
        body.dark-mode .vault,
        body.dark-mode .sidebar,
        body.dark-mode .modal-box,
        body.dark-mode .chat-panel {
          background: linear-gradient(135deg, #1e293b 0%, #2d2a5e 100%);
          border: 1px solid rgba(96,165,250,0.15);
        }
        
        body.dark-mode .cart-head {
          background: linear-gradient(135deg, #60a5fa, #a78bfa);
        }
        
        body.dark-mode .vault-tab {
          background: linear-gradient(135deg, #60a5fa, #a78bfa);
        }
        
        body.dark-mode .form-control,
        body.dark-mode .form-group input,
        body.dark-mode .form-group select,
        body.dark-mode .form-group textarea {
          background: #0f172a;
          border-color: #334155;
          color: #f1f5f9;
        }
        
        body.dark-mode .form-control:focus,
        body.dark-mode .form-group input:focus {
          border-color: #60a5fa;
          box-shadow: 0 0 0 3px rgba(96,165,250,0.2);
        }
        
        body.dark-mode .input-group-text {
          background: #0f172a;
          border-color: #334155;
          color: #94a3b8;
        }
        
        body.dark-mode .bg-grad-soft {
          background: linear-gradient(135deg, #1e293b, #2d2a5e);
        }
        
        body.dark-mode .stag {
          background: #334155;
          color: #f1f5f9;
          border: 1px solid rgba(96,165,250,0.2);
        }
        
        body.dark-mode .stag.sel {
          background: linear-gradient(135deg, #60a5fa, #a78bfa);
          color: white;
        }
        
        body.dark-mode .vault-item {
          background: #0f172a;
          border-color: #334155;
        }
        
        body.dark-mode .chat-msgs {
          background: #0f172a;
        }
        
        body.dark-mode .bubble.bot {
          background: #1e293b;
          border-color: #334155;
          color: #f1f5f9;
        }
        
        body.dark-mode .bubble.user {
          background: linear-gradient(135deg, #60a5fa, #a78bfa);
        }
        
        body.dark-mode .chat-foot {
          background: #1e293b;
          border-color: #334155;
        }
        
        body.dark-mode .btn-outline {
          border-color: #60a5fa;
          color: #60a5fa;
        }
        
        body.dark-mode .btn-outline:hover {
          background: #60a5fa;
          color: white;
        }
        
        body.dark-mode .btn-primary {
          background: linear-gradient(135deg, #60a5fa, #a78bfa);
        }
        
        body.dark-mode .hero-section {
          background: linear-gradient(135deg, #1e1b4b, #0f172a);
        }
        
        body.dark-mode .modal-header,
        body.dark-mode .modal-footer {
          border-color: #334155;
        }
        
        body.dark-mode .text-muted {
          color: #94a3b8;
        }
        
        body.dark-mode .section-head h2 {
          background: linear-gradient(135deg, #60a5fa, #a78bfa);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        body.dark-mode .nav-cart-btn {
          border-color: #60a5fa;
          color: #60a5fa;
        }
        
        body.dark-mode .login-btn {
          background: linear-gradient(135deg, #60a5fa, #a78bfa);
        }
        
        body.dark-mode .rating-stars {
          color: #fbbf24;
        }
        
        body.dark-mode .badge-blue {
          background: rgba(96,165,250,0.15);
          color: #60a5fa;
        }
        
        body.dark-mode .badge-success {
          background: rgba(52,211,153,0.15);
          color: #34d399;
        }
        
        body.dark-mode .badge-danger {
          background: rgba(248,113,113,0.15);
          color: #f87171;
        }
        
        body.dark-mode .cat-btn {
          background: #1e293b;
          border-color: #334155;
          color: #94a3b8;
        }
        
        body.dark-mode .cat-btn.active {
          background: linear-gradient(135deg, #60a5fa, #a78bfa);
          border-color: transparent;
          color: white;
        }
        
        body.dark-mode .scrollbar-thumb {
          background: #334155;
        }
        
        /* Scrollbar for dark mode */
        body.dark-mode ::-webkit-scrollbar-track {
          background: #0f172a;
        }
        
        body.dark-mode ::-webkit-scrollbar-thumb {
          background: #334155;
        }
        
        body.dark-mode ::-webkit-scrollbar-thumb:hover {
          background: #475569;
        }
      `}</style>
    </button>
  );
}