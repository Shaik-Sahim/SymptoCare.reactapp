// src/hooks/index.js (CORRECTED - fixed useWallet)
import { useState, useCallback, useEffect } from 'react';

const VAULT_COLORS = {
  scan: '#0ea5e9',
  lab: '#8b5cf6',
  pharmacy: '#10b981',
  general: '#6B7280',
  consult: '#8b5cf6',
  appointment: '#f59e0b',
};

// ─── useToast ──────────────────────────────────────────────────────────────────
export function useToast() {
  const [toasts, setToasts] = useState([]);
  const addToast = useCallback((msg, type = 'success') => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4000);
  }, []);
  const removeToast = useCallback((id) => setToasts(t => t.filter(x => x.id !== id)), []);
  return { toasts, addToast, removeToast };
}

// ─── useVault ──────────────────────────────────────────────────────────────────
export function useVault() {
  const [entries, setEntries] = useState([]);
  const [counts, setCounts] = useState({ total: 0, scans: 0, tests: 0 });
  const [vaultOpen, setVaultOpen] = useState(false);

  const logVault = useCallback((title, result, cat = 'general') => {
    const newEntry = {
      title, result, cat,
      _id: Date.now().toString(),
      color: VAULT_COLORS[cat] || VAULT_COLORS.general,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toLocaleDateString(),
    };
    setEntries(prev => [newEntry, ...prev]);
    setCounts(prev => ({
      total: prev.total + 1,
      scans: prev.scans + (cat === 'scan' ? 1 : 0),
      tests: prev.tests + (cat === 'lab' ? 1 : 0),
    }));
  }, []);

  const toggleVault = useCallback(() => setVaultOpen(v => !v), []);
  return { entries, counts, vaultOpen, logVault, toggleVault };
}

// ─── useCart ───────────────────────────────────────────────────────────────────
export function useCart(logVault) {
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  const addToCart = useCallback((p) => {
    setCart(prev => {
      const ex = prev.find(i => i.id === p.id);
      if (ex) return prev.map(i => i.id === p.id ? { ...i, qty: i.qty + (p.qty || 1) } : i);
      return [...prev, { ...p, qty: p.qty || 1 }];
    });
    if (logVault) logVault('Cart: ' + p.name, '₹' + p.price + ' added to cart', 'pharmacy');
  }, [logVault]);

  const removeFromCart = useCallback((id) => setCart(prev => prev.filter(i => i.id !== id)), []);
  const changeQty = useCallback((id, delta) =>
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i)), []);
  const clearCart = useCallback(() => setCart([]), []);
  const toggleCart = useCallback(() => setCartOpen(v => !v), []);

  const cartCount = cart.reduce((a, i) => a + i.qty, 0);
  const cartTotal = cart.reduce((a, i) => a + i.price * i.qty, 0);
  return { cart, cartOpen, cartCount, cartTotal, addToCart, removeFromCart, changeQty, clearCart, toggleCart };
}

// ─── useProfile ────────────────────────────────────────────────────────────────
export function useProfile(addToast, logVault) {
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('symptocare_profile');
      return saved ? JSON.parse(saved) : defaultProfile();
    } catch { return defaultProfile(); }
  });

  function defaultProfile() {
    return { 
      name: 'Guest User', 
      email: 'guest@example.com', 
      phone: '', 
      avatar: null, 
      dob: '', 
      bloodGroup: '', 
      allergies: [], 
      notifications: true,
      gender: '',
      address: '',
      weight: '',
      height: '',
      emergencyContact: '',
      emergencyPhone: '',
      chronic: []
    };
  }

  const updateProfile = useCallback((updates) => {
    setProfile(prev => {
      const next = { ...prev, ...updates };
      localStorage.setItem('symptocare_profile', JSON.stringify(next));
      return next;
    });
    if (addToast) addToast('Profile updated successfully');
    if (logVault) logVault('Profile updated', 'User data saved', 'general');
  }, [addToast, logVault]);

  const clearProfile = useCallback(() => {
    setProfile(defaultProfile());
    localStorage.removeItem('symptocare_profile');
  }, []);

  return { profile, updateProfile, clearProfile };
}

// ─── useWallet ───────────────────────────────────────────────────────────────── (FIXED)
export function useWallet(addToast, logVault) {
  const [balance, setBalance] = useState(() => {
    const s = localStorage.getItem('symptocare_wallet_balance');
    return s ? parseFloat(s) : 2500;
  });
  const [transactions, setTransactions] = useState(() => {
    try { 
      const saved = localStorage.getItem('symptocare_transactions');
      if (saved) return JSON.parse(saved);
      const defaultTx = [{ id: Date.now(), amount: 2500, type: 'credit', description: 'Welcome bonus', date: new Date().toLocaleString() }];
      localStorage.setItem('symptocare_transactions', JSON.stringify(defaultTx));
      return defaultTx;
    } catch { 
      return [{ id: Date.now(), amount: 2500, type: 'credit', description: 'Welcome bonus', date: new Date().toLocaleString() }];
    }
  });

  const saveToLocal = useCallback((newBalance, newTransactions) => {
    localStorage.setItem('symptocare_wallet_balance', newBalance.toString());
    localStorage.setItem('symptocare_transactions', JSON.stringify(newTransactions));
  }, []);

  const addTransaction = useCallback((amount, type, description = '') => {
    const newTx = { 
      id: Date.now(), 
      amount: Math.abs(amount), 
      type, 
      description, 
      date: new Date().toLocaleString() 
    };
    setTransactions(prev => {
      const updated = [newTx, ...prev];
      return updated;
    });
    setBalance(prev => {
      const newBalance = type === 'credit' ? prev + amount : prev - amount;
      return newBalance;
    });
    if (addToast) addToast(`${type === 'credit' ? 'Added' : 'Deducted'} ₹${amount} ${description}`, type === 'credit' ? 'success' : 'info');
    if (logVault) logVault('Wallet', `${type.toUpperCase()} ₹${amount} – ${description}`, 'pharmacy');
  }, [addToast, logVault]);

  const addFunds = useCallback((amount) => {
    if (amount <= 0) { 
      if (addToast) addToast('Amount must be positive', 'error'); 
      return false; 
    }
    addTransaction(amount, 'credit', 'Wallet top-up');
    return true;
  }, [addTransaction, addToast]);

  const deductFunds = useCallback((amount, description = 'Purchase') => {
    if (amount <= 0) { 
      if (addToast) addToast('Amount must be positive', 'error'); 
      return false; 
    }
    if (balance < amount) { 
      if (addToast) addToast('Insufficient wallet balance', 'error'); 
      return false; 
    }
    addTransaction(amount, 'debit', description);
    return true;
  }, [addTransaction, addToast, balance]);

  const resetWallet = useCallback(() => {
    setBalance(2500);
    const newTx = [{ id: Date.now(), amount: 2500, type: 'credit', description: 'Reset to default', date: new Date().toLocaleString() }];
    setTransactions(newTx);
    localStorage.setItem('symptocare_wallet_balance', '2500');
    localStorage.setItem('symptocare_transactions', JSON.stringify(newTx));
    if (addToast) addToast('Wallet reset to ₹2500', 'info');
  }, [addToast]);

  // Fixed: useEffect for saving to localStorage (was incorrectly inside useState)
  useEffect(() => {
    saveToLocal(balance, transactions);
  }, [balance, transactions, saveToLocal]);

  return { balance, transactions, addFunds, deductFunds, resetWallet };
}