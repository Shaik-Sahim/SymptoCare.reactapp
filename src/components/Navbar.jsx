// src/components/Navbar.jsx (CORRECTED)
import { useState, useEffect } from 'react';
import Sidebar from './Sidebar.jsx';
import ThemeToggle from './ThemeToggle.jsx';

const NAV_LINKS = [
  { id: 'home', label: 'Home', icon: 'bi-house-door' },
  { id: 'telemedicine', label: 'Consult', icon: 'bi-camera-video' },
  { id: 'store', label: 'Med Store', icon: 'bi-shop' },
  { id: 'emergency', label: 'Emergency', icon: 'bi-exclamation-triangle-fill', danger: true },
];

export default function Navbar({ view, setView, cartCount, toggleCart, toggleVault, isAuthenticated, user, onLogout }) {
  const [scrolled, setScrolled] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    try {
      const orders = JSON.parse(localStorage.getItem('symptocare_orders') || '[]');
      setOrderCount(orders.filter(o => o.status === 'Processing' || o.status === 'Shipped').length);
    } catch {}
  }, [view]);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    const fn = (e) => { if (userMenu && !e.target.closest('.user-menu-container')) setUserMenu(false); };
    document.addEventListener('click', fn);
    return () => document.removeEventListener('click', fn);
  }, [userMenu]);

  const initials = (name) => name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U';

  const handleNav = (link) => {
    if (link.id === 'vault') toggleVault();
    else setView(link.id);
    setUserMenu(false);
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <>
      <nav className={`navbar-sc${scrolled ? ' scrolled' : ''}`}>
        <div className="nav-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button className="menu-toggle" onClick={toggleMobileMenu}>
              <i className={`bi ${mobileMenuOpen ? 'bi-x-lg' : 'bi-list'}`} />
            </button>
            <span className="brand" onClick={() => setView('home')}>
              <i className="bi bi-heart-pulse-fill" style={{ marginRight: 6 }} />
              Sympto<span>Care</span><span style={{ color: 'var(--blue)' }}>.</span>
            </span>
          </div>

          <div className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
            {NAV_LINKS.map(link => (
              <button
                key={link.id}
                className={`nav-link${view === link.id ? ' active' : ''}${link.danger ? ' danger' : ''}`}
                onClick={() => handleNav(link)}
              >
                <i className={`bi ${link.icon}`} style={{ marginRight: 4 }} />
                {link.label}
              </button>
            ))}

            <ThemeToggle />

            <div className="user-menu-container">
              {isAuthenticated ? (
                <>
                  <button className={`user-menu-btn${userMenu ? ' active' : ''}`} onClick={() => setUserMenu(!userMenu)}>
                    <div className="user-avatar">
                      {user?.avatar ? <img src={user.avatar} alt={user.name} /> : <span>{initials(user?.name)}</span>}
                    </div>
                    <span className="user-name">{user?.name?.split(' ')[0] || 'User'}</span>
                    <i className={`bi bi-chevron-${userMenu ? 'up' : 'down'}`} />
                  </button>
                  {userMenu && (
                    <div className="user-dropdown">
                      <div className="user-dropdown-header">
                        <div className="user-dropdown-avatar">
                          {user?.avatar ? <img src={user.avatar} alt={user.name} /> : <span>{initials(user?.name)}</span>}
                        </div>
                        <div>
                          <div className="user-dropdown-name">{user?.name}</div>
                          <div className="user-dropdown-email">{user?.email}</div>
                        </div>
                      </div>
                      <div className="user-dropdown-divider" />
                      <button onClick={() => { setView('profile'); setUserMenu(false); setMobileMenuOpen(false); }}>
                        <i className="bi bi-person" /> My Profile
                      </button>
                      <button onClick={() => { setView('wallet'); setUserMenu(false); setMobileMenuOpen(false); }}>
                        <i className="bi bi-wallet2" /> My Wallet
                      </button>
                      <button onClick={() => { setView('appointments'); setUserMenu(false); setMobileMenuOpen(false); }}>
                        <i className="bi bi-calendar-check" /> My Appointments
                      </button>
                      <button onClick={() => { setView('orders'); setUserMenu(false); setMobileMenuOpen(false); }}>
                        <i className="bi bi-truck" /> Track Orders
                        {orderCount > 0 && <span className="order-badge">{orderCount}</span>}
                      </button>
                      <div className="user-dropdown-divider" />
                      <button onClick={() => { toggleVault(); setUserMenu(false); setMobileMenuOpen(false); }}>
                        <i className="bi bi-folder2-open" /> Medical Vault
                      </button>
                      <button className="logout-btn" onClick={() => { onLogout(); setUserMenu(false); setMobileMenuOpen(false); }}>
                        <i className="bi bi-box-arrow-right" /> Sign Out
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <button className="login-btn" onClick={() => setView('login')}>
                  <i className="bi bi-box-arrow-in-right" /> Sign In
                </button>
              )}
            </div>

            <button className="nav-cart-btn" onClick={toggleCart}>
              <i className="bi bi-cart3" />
              {cartCount > 0 && <span className="nav-badge">{cartCount}</span>}
            </button>
          </div>
        </div>

        <style>{`
          .menu-toggle {
            display: none;
            background: none;
            border: none;
            font-size: 22px;
            cursor: pointer;
            color: var(--dark, #1e293b);
            padding: 6px;
            border-radius: 8px;
          }
          
          .menu-toggle:hover {
            background: rgba(0,0,0,0.05);
          }
          
          .order-badge {
            background: #ef4444;
            color: white;
            border-radius: 10px;
            padding: 1px 6px;
            font-size: 9px;
            margin-left: 6px;
          }
          
          @media (max-width: 992px) {
            .menu-toggle {
              display: block;
            }
            
            .nav-links {
              display: none;
              position: absolute;
              top: 100%;
              left: 0;
              right: 0;
              background: white;
              flex-direction: column;
              padding: 16px;
              gap: 8px;
              box-shadow: 0 10px 25px rgba(0,0,0,0.1);
              border-radius: 0 0 16px 16px;
              z-index: 999;
              max-height: calc(100vh - 70px);
              overflow-y: auto;
            }
            
            .nav-links.mobile-open {
              display: flex;
            }
            
            .nav-link {
              width: 100%;
              text-align: left;
              padding: 12px 16px;
            }
            
            .user-menu-container {
              width: 100%;
            }
            
            .user-menu-btn {
              width: 100%;
              justify-content: space-between;
            }
            
            .user-dropdown {
              position: static;
              box-shadow: none;
              margin-top: 8px;
              width: 100%;
            }
            
            .nav-cart-btn {
              width: 100%;
              justify-content: center;
              margin-top: 8px;
            }
          }
        `}</style>
      </nav>

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        view={view}
        setView={setView}
        onLogout={onLogout}
        user={user}
        isAuthenticated={isAuthenticated}
      />
    </>
  );
}