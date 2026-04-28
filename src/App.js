// src/App.js (UPDATED - fixed toggleVault usage)
import { useState, useEffect, useCallback } from 'react';
import './index.css';

// ── Hooks ────────────────────────────────────────────────────────────────────
import { useToast, useVault, useCart, useProfile, useWallet } from './hooks/index.js';

// ── Layout components ────────────────────────────────────────────────────────
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ChatWidget from './components/ChatWidget.jsx';
import { CartSidebar, VaultSidebar } from './components/Sidebars.jsx';
import { ConsultModal, PaymentModal } from './components/Modals.jsx';
import { Toast } from './components/UI.jsx';

// ── Views ────────────────────────────────────────────────────────────────────
import HomeView from './views/HomeView.jsx';
import { StoreView, PharmacyView } from './views/StoreViews.jsx';
import { VisionView } from './views/AIViews.jsx';
import { LabView, HealthView } from './views/MedicalViews.jsx';
import { AppointmentsView, TelemedicineView, EmergencyView } from './views/DoctorViews.jsx';
import ProfileView from './views/ProfileView.jsx';
import WalletView from './views/WalletView.jsx';
import LoginView from './views/LoginView.jsx';
import OrdersView from './views/OrdersView.jsx';

// Protected Route Component
function ProtectedRoute({ children, isAuthenticated, setView, addToast }) {
  if (!isAuthenticated) {
    addToast('Please login or register to access this feature', 'error');
    setTimeout(() => setView('login'), 100);
    return null;
  }
  return children;
}

export default function App() {
  // ── Authentication State ───────────────────────────────────────────────────
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [pendingView, setPendingView] = useState(null);

  // ── Hooks must be called first before any other logic ──────────────────────
  const { toasts, addToast, removeToast } = useToast();
  const { entries, counts, vaultOpen, logVault, toggleVault } = useVault();
  const { cart, cartOpen, cartCount, cartTotal, addToCart,
    removeFromCart, changeQty, clearCart, toggleCart } = useCart(logVault);
  const { profile, updateProfile, clearProfile } = useProfile(addToast, logVault);
  const { balance, transactions, addFunds, deductFunds, resetWallet } = useWallet(addToast, logVault);

  // ── Navigation - Now addToast is defined ✅ ─────────────────────────────────
  const setView = useCallback((id, requireAuth = false) => {
    // Check if the view requires authentication
    const protectedViews = [
      'profile', 'wallet', 'store', 'pharmacy', 'vision', 'lab', 
      'health', 'appointments', 'telemedicine', 'orders'
    ];
    
    const needsAuth = protectedViews.includes(id);
    
    if (needsAuth && !isAuthenticated) {
      setShowLoginPrompt(true);
      setPendingView(id);
      addToast('Please login or register to access this feature', 'error');
      return;
    }
    
    setViewState(id);
    setShowLoginPrompt(false);
    setPendingView(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [isAuthenticated, addToast]);

  // ── Navigation state after hooks ───────────────────────────────────────────
  const [view, setViewState] = useState('home');

  // ── Consult modal ──────────────────────────────────────────────────────────
  const [consultModal, setConsultModal] = useState({ show: false, doc: null });

  // ── Payment modal ──────────────────────────────────────────────────────────
  const [payModal, setPayModal] = useState({ show: false, total: 0 });
  const startCheckout = useCallback(() => {
    if (!cart.length) { addToast('Your cart is empty!', 'error'); return; }
    toggleCart();
    setTimeout(() => setPayModal({ show: true, total: cartTotal }), 300);
  }, [cart.length, cartTotal, toggleCart, addToast]);
  
  const startConsultPay = useCallback((total) => setPayModal({ show: true, total }), []);

  // ── Check for existing session on load ─────────────────────────────────────
  useEffect(() => {
    const savedUser = localStorage.getItem('symptocare_current_user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
        setIsAuthenticated(true);
        setViewState('home');
        addToast(`Welcome back, ${user.name}! 👋`, 'success');
      } catch (e) {
        console.error('Failed to parse user data');
      }
    }
    setAuthLoading(false);
  }, [addToast]);

  // ── CartBridge: listens for sc:addToCart events ────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      const product = e.detail;
      if (product && product.id) {
        if (!isAuthenticated) {
          setShowLoginPrompt(true);
          addToast('Please login to add items to cart', 'error');
          return;
        }
        addToCart(product);
        addToast(`${product.name} added to cart!`, 'success');
      }
    };
    window.addEventListener('sc:addToCart', handler);
    return () => window.removeEventListener('sc:addToCart', handler);
  }, [addToCart, addToast, isAuthenticated]);

  // ── NavigateBridge: listens for sc:navigate events ─────────────────────────
  useEffect(() => {
    const handler = (e) => setView(e.detail, true);
    window.addEventListener('sc:navigate', handler);
    return () => window.removeEventListener('sc:navigate', handler);
  }, [setView]);

  // ── Handle Login ───────────────────────────────────────────────────────────
  const handleLogin = useCallback((user) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    
    // If there was a pending view, navigate to it
    if (pendingView) {
      setViewState(pendingView);
      setPendingView(null);
      addToast(`Welcome! Redirecting to ${pendingView}...`, 'success');
    } else {
      setViewState('home');
      addToast(`Welcome to SymptoCare, ${user.name}! 🎉`, 'success');
    }
    
    setShowLoginPrompt(false);
    if (user.profile) updateProfile(user.profile);
  }, [updateProfile, addToast, pendingView]);

  // ── Handle Logout ──────────────────────────────────────────────────────────
  const handleLogout = useCallback(() => {
    localStorage.removeItem('symptocare_current_user');
    setCurrentUser(null);
    setIsAuthenticated(false);
    setViewState('home');
    setPendingView(null);
    setShowLoginPrompt(false);
    addToast('You have been logged out. See you soon! 👋', 'info');
  }, [addToast]);

  // ── Body scroll lock when a sidebar is open ────────────────────────────────
  useEffect(() => {
    if (cartOpen || vaultOpen) {
      document.body.classList.add('sidebar-open');
    } else {
      document.body.classList.remove('sidebar-open');
    }
    return () => document.body.classList.remove('sidebar-open');
  }, [cartOpen, vaultOpen]);

  // ── Props bundles ──────────────────────────────────────────────────────────
  const shared = { addToast, logVault, isAuthenticated, currentUser };

  // Function to render protected views
  const renderProtectedView = (Component, props = {}) => (
    <ProtectedRoute isAuthenticated={isAuthenticated} setView={setView} addToast={addToast}>
      <Component {...props} {...shared} />
    </ProtectedRoute>
  );

  const VIEW_MAP = {
    login: <LoginView onLogin={handleLogin} setView={setView} />,
    home: <HomeView setView={setView} toggleVault={toggleVault} {...shared} />,
    profile: renderProtectedView(ProfileView, { profile, updateProfile, clearProfile, setView, balance }),
    wallet: renderProtectedView(WalletView, { balance, transactions, addFunds, deductFunds, resetWallet }),
    store: renderProtectedView(StoreView, { addToCart }),
    pharmacy: renderProtectedView(PharmacyView, { addToCart }),
    vision: renderProtectedView(VisionView, { addToCart }),
    lab: renderProtectedView(LabView),
    health: renderProtectedView(HealthView),
    appointments: renderProtectedView(AppointmentsView),
    telemedicine: renderProtectedView(TelemedicineView, { 
      walletBalance: balance,
      walletTransactions: transactions,
      onAddFunds: addFunds,
      onDeductFunds: deductFunds,
      onResetWallet: resetWallet
    }),
    emergency: <EmergencyView {...shared} />,
    orders: renderProtectedView(OrdersView),
  };

  // ── Loading screen ─────────────────────────────────────────────────────────
  if (authLoading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 60, height: 60,
            border: '4px solid rgba(255,255,255,0.2)',
            borderTop: '4px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }} />
          <p style={{ color: 'white', fontSize: 14 }}>Loading SymptoCare...</p>
        </div>
        <style>{`@keyframes spin { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }`}</style>
      </div>
    );
  }

  return (
    <div className="sc-app">
      {/* Show Navbar only for authenticated users or on public pages */}
      {(isAuthenticated || view === 'home' || view === 'login' || view === 'emergency') && (
        <Navbar
          view={view}
          setView={setView}
          cartCount={cartCount}
          toggleCart={toggleCart}
          toggleVault={toggleVault}  // ← This is used to toggle vault from navbar
          isAuthenticated={isAuthenticated}
          user={currentUser}
          onLogout={handleLogout}
        />
      )}

      {/* Login Prompt Modal */}
      {showLoginPrompt && !isAuthenticated && (
        <div className="login-prompt-overlay">
          <div className="login-prompt-card">
            <div className="login-prompt-icon">
              <i className="bi bi-shield-lock-fill" />
            </div>
            <h3>Login Required</h3>
            <p>Please login or create an account to access this feature.</p>
            <div className="login-prompt-buttons">
              <button className="btn-outline" onClick={() => setShowLoginPrompt(false)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={() => setView('login')}>
                <i className="bi bi-box-arrow-in-right" /> Login / Register
              </button>
            </div>
          </div>
        </div>
      )}

      {VIEW_MAP[view] ?? <HomeView setView={setView} toggleVault={toggleVault} {...shared} />}

      {/* Footer - only show for authenticated users or public pages */}
      {(isAuthenticated || view === 'home' || view === 'emergency') && view !== 'login' && (
        <Footer setView={setView} />
      )}

      {/* Sidebars and modals - only for authenticated users */}
      {isAuthenticated && (
        <>
          {/* Backdrop overlay when sidebar is open */}
          {(cartOpen || vaultOpen) && (
            <div
              onClick={() => { 
                if (cartOpen) toggleCart(); 
                if (vaultOpen) toggleVault(); 
              }}
              style={{ 
                position: 'fixed', 
                inset: 0, 
                background: 'rgba(0,0,0,0.4)', 
                zIndex: 1997, 
                cursor: 'pointer' 
              }}
            />
          )}

          <CartSidebar
            cart={cart}
            open={cartOpen}
            onClose={toggleCart}
            onRemove={removeFromCart}
            onQty={changeQty}
            onCheckout={startCheckout}
            addToast={addToast}
          />

          <VaultSidebar
            open={vaultOpen}
            onToggle={toggleVault}
            entries={entries}
            counts={counts}
          />

          <ChatWidget addToast={addToast} logVault={logVault} />

          <ConsultModal
            show={consultModal.show}
            onClose={() => setConsultModal(p => ({ ...p, show: false }))}
            doc={consultModal.doc}
            addToast={addToast}
            logVault={logVault}
            onPay={startConsultPay}
          />

          <PaymentModal
            show={payModal.show}
            onClose={() => setPayModal(p => ({ ...p, show: false }))}
            total={payModal.total}
            addToast={addToast}
            logVault={logVault}
            onSuccess={clearCart}
          />
        </>
      )}

      <Toast toasts={toasts} removeToast={removeToast} />

      <style>{`
        .login-prompt-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(8px);
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeIn 0.3s ease;
        }
        
        .login-prompt-card {
          background: white;
          border-radius: 28px;
          padding: 32px;
          max-width: 400px;
          width: 90%;
          text-align: center;
          animation: slideUp 0.3s ease;
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
        }
        
        .login-prompt-icon {
          width: 70px;
          height: 70px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
        }
        
        .login-prompt-icon i {
          font-size: 32px;
          color: white;
        }
        
        .login-prompt-card h3 {
          font-size: 1.5rem;
          margin-bottom: 12px;
          color: #1e293b;
        }
        
        .login-prompt-card p {
          color: #64748b;
          margin-bottom: 24px;
          line-height: 1.5;
        }
        
        .login-prompt-buttons {
          display: flex;
          gap: 12px;
          justify-content: center;
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        body.dark-mode .login-prompt-card {
          background: linear-gradient(135deg, #1e293b, #2d2a5e);
        }
        
        body.dark-mode .login-prompt-card h3 {
          color: #f1f5f9;
        }
      `}</style>
    </div>
  );
}