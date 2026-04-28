// src/components/Sidebars.jsx (COMPLETE - with both CartSidebar and VaultSidebar)
import { useState, useMemo, useCallback, useRef, useEffect } from 'react';

// ─── PRODUCT CATALOG (for recommendations) ───────────────────────────────────
const SUGGESTED_PRODUCTS = [
  { id: 101, name: 'Vitamin C Serum 20%',    price: 799,  icon: '🧴', cat: 'skincare',  rating: 4.9 },
  { id: 102, name: 'Omega-3 Fish Oil',        price: 599,  icon: '🌿', cat: 'wellness',  rating: 4.8 },
  { id: 103, name: 'Paracetamol 650mg',       price: 65,   icon: '💊', cat: 'medicine',  rating: 4.8 },
  { id: 104, name: 'Electric Toothbrush Pro', price: 2499, icon: '🦷', cat: 'dental',    rating: 4.8 },
  { id: 105, name: 'SPF 50+ Sunscreen',       price: 499,  icon: '🧴', cat: 'skincare',  rating: 4.9 },
  { id: 106, name: 'Ashwagandha Extract',     price: 349,  icon: '🌿', cat: 'wellness',  rating: 4.7 },
];

// ─── COUPON CODES ─────────────────────────────────────────────────────────────
const COUPONS = {
  HEALTH10:  { discount: 10, type: 'percent', desc: '10% off on all orders' },
  SAVE50:    { discount: 50, type: 'flat',    desc: '₹50 flat discount' },
  CARE20:    { discount: 20, type: 'percent', desc: '20% off – first order' },
  WELLNESS5: { discount: 5,  type: 'percent', desc: '5% off on wellness items' },
};

// ─── VAULT CATEGORY CONFIG ────────────────────────────────────────────────────
const VAULT_CATS = [
  { key: 'all',         label: 'All',          icon: '📋', color: '#6B7280' },
  { key: 'scan',        label: 'AI Scans',     icon: '🔬', color: '#0ea5e9' },
  { key: 'lab',         label: 'Lab Tests',    icon: '🧪', color: '#7c3aed' },
  { key: 'consult',     label: 'Consults',     icon: '👨‍⚕️', color: '#059669' },
  { key: 'appointment', label: 'Appointments', icon: '📅', color: '#d97706' },
  { key: 'general',     label: 'General',      icon: '📌', color: '#374151' },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const fmtPrice = n => `₹${Number(n).toLocaleString('en-IN')}`;
const catColor = key => VAULT_CATS.find(c => c.key === key)?.color || '#6B7280';
const catIcon = key => VAULT_CATS.find(c => c.key === key)?.icon || '📌';

// ─── CART SIDEBAR ─────────────────────────────────────────────────────────────
export function CartSidebar({ cart, open, onClose, onRemove, onQty, onCheckout, addToast }) {
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [sortMode, setSortMode] = useState('added');
  const [searchQ, setSearchQ] = useState('');
  const [savedItems, setSavedItems] = useState([]);
  const [showSaved, setShowSaved] = useState(false);
  const [removedItem, setRemovedItem] = useState(null);
  const [undoTimer, setUndoTimer] = useState(null);
  const [deliveryMode, setDeliveryMode] = useState('standard');
  const [showOrderSummary, setShowOrderSummary] = useState(false);

  const subtotal = cart.reduce((a, i) => a + i.price * i.qty, 0);
  const itemCount = cart.reduce((a, i) => a + i.qty, 0);

  const discount = useMemo(() => {
    if (!appliedCoupon) return 0;
    const c = COUPONS[appliedCoupon];
    return c.type === 'percent' ? Math.round(subtotal * c.discount / 100) : c.discount;
  }, [appliedCoupon, subtotal]);

  const deliveryFee = deliveryMode === 'express' ? 99 : subtotal >= 499 ? 0 : 49;
  const total = Math.max(0, subtotal - discount + deliveryFee);
  const savings = discount + (deliveryMode !== 'express' && subtotal >= 499 ? 49 : 0);

  const displayCart = useMemo(() => {
    let list = [...cart];
    if (searchQ) list = list.filter(i => i.name.toLowerCase().includes(searchQ.toLowerCase()));
    if (sortMode === 'price') list.sort((a, b) => b.price - a.price);
    if (sortMode === 'name') list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [cart, searchQ, sortMode]);

  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    setCouponError('');
    setCouponSuccess('');
    if (!code) { setCouponError('Enter a coupon code.'); return; }
    if (COUPONS[code]) {
      setAppliedCoupon(code);
      setCouponSuccess(`✓ "${code}" applied — ${COUPONS[code].desc}`);
      setCouponInput('');
    } else {
      setCouponError('Invalid coupon code. Try HEALTH10 or SAVE50.');
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError('');
    setCouponSuccess('');
  };

  const saveForLater = useCallback((item) => {
    setSavedItems(prev => {
      if (prev.find(s => s.id === item.id)) return prev;
      return [...prev, { ...item, savedAt: Date.now() }];
    });
    onRemove(item.id);
    if (addToast) addToast(`${item.name} saved for later`, 'info');
  }, [onRemove, addToast]);

  const moveToCart = useCallback((item) => {
    setSavedItems(prev => prev.filter(s => s.id !== item.id));
    window.dispatchEvent(new CustomEvent('sc:addToCart', { detail: { ...item, qty: 1 } }));
    if (addToast) addToast(`${item.name} moved to cart`, 'success');
  }, [addToast]);

  const removeWithUndo = useCallback((item) => {
    setRemovedItem(item);
    onRemove(item.id);
    const t = setTimeout(() => setRemovedItem(null), 6000);
    setUndoTimer(t);
  }, [onRemove]);

  const undoRemove = () => {
    if (!removedItem) return;
    clearTimeout(undoTimer);
    window.dispatchEvent(new CustomEvent('sc:addToCart', { detail: removedItem }));
    setRemovedItem(null);
    if (addToast) addToast(`${removedItem.name} restored`, 'success');
  };

  const handleQty = (id, delta) => {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    if (item.qty + delta < 1) { removeWithUndo(item); return; }
    if (item.qty + delta > 10) return;
    onQty(id, delta);
  };

  const handleCheckout = () => {
    if (!cart.length) return;
    onCheckout();
  };

  if (!open) return null;

  return (
    <div className="cart-sidebar">
      <div className="cart-sidebar-header">
        <div>
          <h5 style={{ margin: 0 }}><i className="bi bi-cart3 me-2" />Shopping Cart</h5>
          <small style={{ opacity: 0.8 }}>{itemCount} item{itemCount !== 1 ? 's' : ''} · {fmtPrice(subtotal)}</small>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {cart.length > 0 && (
            <button onClick={() => setShowOrderSummary(s => !s)} className="cart-summary-btn">
              {showOrderSummary ? '← Cart' : '📋 Summary'}
            </button>
          )}
          <button onClick={onClose} className="cart-close-btn">✕</button>
        </div>
      </div>

      <div className="cart-sidebar-content">
        {showOrderSummary && cart.length > 0 && (
          <div className="cart-summary">
            <div className="cart-summary-title">📋 Order Summary</div>
            {cart.map(item => (
              <div key={item.id} className="cart-summary-item">
                <span>{item.icon || '📦'} {item.name} <span style={{ color: '#9CA3AF' }}>×{item.qty}</span></span>
                <span style={{ fontWeight: 600 }}>{fmtPrice(item.price * item.qty)}</span>
              </div>
            ))}
            <div className="cart-summary-total">
              <div className="flex-between"><span>Subtotal</span><span>{fmtPrice(subtotal)}</span></div>
              {discount > 0 && <div className="flex-between"><span>Discount</span><span style={{ color: '#059669' }}>- {fmtPrice(discount)}</span></div>}
              <div className="flex-between"><span>Delivery</span><span>{deliveryFee === 0 ? '🎉 Free' : fmtPrice(deliveryFee)}</span></div>
              <div className="flex-between cart-total"><span>Total</span><span>{fmtPrice(total)}</span></div>
              {savings > 0 && <div className="cart-savings">🎉 You save {fmtPrice(savings)} on this order!</div>}
            </div>
          </div>
        )}

        {!showOrderSummary && (
          <>
            {cart.length > 2 && (
              <div className="cart-filters">
                <input className="cart-search" placeholder="Search items…" value={searchQ} onChange={e => setSearchQ(e.target.value)} />
                <select className="cart-sort" value={sortMode} onChange={e => setSortMode(e.target.value)}>
                  <option value="added">Order added</option>
                  <option value="price">Price ↓</option>
                  <option value="name">Name A-Z</option>
                </select>
              </div>
            )}

            {cart.length > 0 && (
              <div className="cart-delivery">
                <button onClick={() => setDeliveryMode('standard')} className={`delivery-option ${deliveryMode === 'standard' ? 'active' : ''}`}>
                  🚚 Standard {subtotal >= 499 ? 'Free' : '₹49'}
                </button>
                <button onClick={() => setDeliveryMode('express')} className={`delivery-option ${deliveryMode === 'express' ? 'active' : ''}`}>
                  ⚡ Express ₹99
                </button>
              </div>
            )}

            <div className="cart-items-list">
              {removedItem && (
                <div className="cart-undo-bar">
                  <span>🗑 "{removedItem.name}" removed</span>
                  <button onClick={undoRemove} className="cart-undo-btn">Undo</button>
                </div>
              )}

              {cart.length === 0 ? (
                <div className="cart-empty">
                  <i className="bi bi-cart-x" />
                  <p>Your cart is empty</p>
                  <p className="cart-empty-sub">Add products from the store to get started</p>
                  <button onClick={onClose} className="cart-start-shopping">Start Shopping →</button>
                </div>
              ) : (
                <>
                  {displayCart.map(item => (
                    <div key={item.id} className="cart-item">
                      <div className="cart-item-info">
                        <div className="cart-item-icon">{item.icon || '📦'}</div>
                        <div className="cart-item-details">
                          <p className="cart-item-name">{item.name}</p>
                          <div className="cart-item-price">
                            <span className="cart-item-current">{fmtPrice(item.price)}</span>
                            {item.qty >= 3 && <span className="cart-item-bulk">Bulk</span>}
                          </div>
                        </div>
                      </div>
                      <div className="cart-item-actions">
                        <div className="cart-qty-controls">
                          <button onClick={() => handleQty(item.id, -1)} className={`cart-qty-btn ${item.qty === 1 ? 'danger' : ''}`}>
                            {item.qty === 1 ? '🗑' : '−'}
                          </button>
                          <span className="cart-qty">{item.qty}</span>
                          <button onClick={() => handleQty(item.id, +1)} disabled={item.qty >= 10} className="cart-qty-btn plus">
                            +
                          </button>
                        </div>
                        <div className="cart-item-total">{fmtPrice(item.price * item.qty)}</div>
                      </div>
                      <div className="cart-item-footer">
                        <button onClick={() => saveForLater(item)} className="cart-save-btn">🔖 Save for later</button>
                        <button onClick={() => removeWithUndo(item)} className="cart-remove-btn">✕ Remove</button>
                      </div>
                    </div>
                  ))}

                  {savedItems.length > 0 && (
                    <div className="cart-saved">
                      <button onClick={() => setShowSaved(s => !s)} className="cart-saved-toggle">
                        🔖 Saved for Later ({savedItems.length}) <span>{showSaved ? '▲' : '▼'}</span>
                      </button>
                      {showSaved && savedItems.map(item => (
                        <div key={item.id} className="cart-saved-item">
                          <div><strong>{item.icon} {item.name}</strong><div className="cart-saved-price">{fmtPrice(item.price)}</div></div>
                          <button onClick={() => moveToCart(item)} className="cart-move-btn">+ Cart</button>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </>
        )}
      </div>

      {cart.length > 0 && !showOrderSummary && (
        <div className="cart-sidebar-footer">
          <div className="cart-coupon">
            {appliedCoupon ? (
              <div className="cart-coupon-applied">
                <span>🎟 {appliedCoupon} — saving {fmtPrice(discount)}</span>
                <button onClick={removeCoupon} className="cart-coupon-remove">Remove</button>
              </div>
            ) : (
              <>
                <div className="cart-coupon-input">
                  <input placeholder="Enter coupon code…" value={couponInput} onChange={e => setCouponInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && applyCoupon()} />
                  <button onClick={applyCoupon}>Apply</button>
                </div>
                {couponError && <p className="cart-coupon-error">⚠ {couponError}</p>}
                {couponSuccess && <p className="cart-coupon-success">{couponSuccess}</p>}
              </>
            )}
          </div>

          <div className="cart-price-breakdown">
            <div className="flex-between"><span>Subtotal</span><span>{fmtPrice(subtotal)}</span></div>
            {discount > 0 && <div className="flex-between"><span>Coupon discount</span><span style={{ color: '#059669' }}>− {fmtPrice(discount)}</span></div>}
            <div className="flex-between"><span>Delivery</span><span>{deliveryFee === 0 ? '🎉 Free' : fmtPrice(deliveryFee)}</span></div>
            <div className="flex-between cart-total"><span>Total</span><span>{fmtPrice(total)}</span></div>
          </div>

          {deliveryMode === 'standard' && subtotal < 499 && (
            <div className="cart-free-delivery-msg">
              🚚 Add {fmtPrice(499 - subtotal)} more for FREE delivery!
            </div>
          )}

          <button className="cart-checkout-btn" onClick={handleCheckout}>
            <i className="bi bi-bag-check" /> Checkout · {fmtPrice(total)}
          </button>
        </div>
      )}

      <style>{`
        .cart-sidebar {
          position: fixed;
          top: 0;
          right: 0;
          width: 420px;
          max-width: 100vw;
          height: 100vh;
          background: #fff;
          box-shadow: -8px 0 40px rgba(0,0,0,0.15);
          z-index: 2000;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        
        .cart-sidebar-header {
          background: linear-gradient(135deg, #0ea5e9, #22d3ee);
          color: #fff;
          padding: 18px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-shrink: 0;
        }
        
        .cart-summary-btn, .cart-close-btn {
          background: rgba(255,255,255,0.2);
          border: none;
          border-radius: 8px;
          padding: 4px 10px;
          cursor: pointer;
          color: #fff;
          font-size: 11px;
          font-weight: 600;
        }
        
        .cart-close-btn {
          border-radius: 50%;
          width: 34px;
          height: 34px;
          padding: 0;
          font-size: 15px;
        }
        
        .cart-sidebar-content {
          flex: 1;
          overflow-y: auto;
        }
        
        .cart-summary {
          padding: 16px;
        }
        
        .cart-summary-title {
          font-weight: 700;
          font-size: 14px;
          margin-bottom: 12px;
        }
        
        .cart-summary-item {
          display: flex;
          justify-content: space-between;
          padding: 6px 0;
          border-bottom: 1px solid #f1f5f9;
          font-size: 13px;
        }
        
        .cart-summary-total {
          margin-top: 12px;
          padding: 12px 0;
          border-top: 2px solid #e2e8f0;
        }
        
        .cart-total {
          font-size: 16px;
          font-weight: 800;
          padding-top: 8px;
          border-top: 1px solid #e2e8f0;
          color: #0ea5e9;
        }
        
        .cart-savings {
          margin-top: 8px;
          padding: 6px 10px;
          background: rgba(16,185,129,0.08);
          border-radius: 8px;
          font-size: 12px;
          color: #059669;
          font-weight: 600;
          text-align: center;
        }
        
        .cart-filters {
          padding: 10px 16px;
          border-bottom: 1px solid #f1f5f9;
          display: flex;
          gap: 8px;
        }
        
        .cart-search {
          flex: 1;
          padding: 6px 10px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          font-size: 12px;
          outline: none;
        }
        
        .cart-sort {
          font-size: 11px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          padding: 4px 6px;
          cursor: pointer;
        }
        
        .cart-delivery {
          padding: 10px 16px;
          border-bottom: 1px solid #f1f5f9;
          display: flex;
          gap: 8px;
        }
        
        .delivery-option {
          flex: 1;
          padding: 6px 8px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          border: 1px solid #e2e8f0;
          background: #fff;
          color: #6B7280;
        }
        
        .delivery-option.active {
          border: 2px solid #0ea5e9;
          background: rgba(14,165,233,0.08);
          color: #0ea5e9;
        }
        
        .cart-items-list {
          padding: 14px 16px;
        }
        
        .cart-undo-bar {
          padding: 10px 14px;
          background: #1e293b;
          border-radius: 10px;
          margin-bottom: 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          animation: slideIn 0.2s ease;
        }
        
        .cart-undo-bar span {
          font-size: 12px;
          color: #fff;
        }
        
        .cart-undo-btn {
          font-size: 11px;
          padding: 3px 10px;
          border-radius: 6px;
          border: none;
          background: #0ea5e9;
          color: #fff;
          cursor: pointer;
          font-weight: 700;
        }
        
        .cart-empty {
          text-align: center;
          padding: 60px 0;
          color: #64748b;
        }
        
        .cart-empty i {
          display: block;
          font-size: 3rem;
          margin-bottom: 12px;
        }
        
        .cart-empty p {
          font-weight: 600;
          margin-bottom: 8px;
        }
        
        .cart-empty-sub {
          font-size: 12px;
          color: #9CA3AF;
        }
        
        .cart-start-shopping {
          margin-top: 16px;
          padding: 8px 20px;
          border-radius: 20px;
          border: none;
          background: #0ea5e9;
          color: #fff;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
        }
        
        .cart-item {
          background: #fff;
          border-radius: 12px;
          margin-bottom: 10px;
          border: 1px solid #f1f5f9;
          overflow: hidden;
        }
        
        .cart-item-info {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 12px 8px;
        }
        
        .cart-item-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: linear-gradient(135deg, #f8fafc, #f1f5f9);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          border: 1px solid #e2e8f0;
          flex-shrink: 0;
        }
        
        .cart-item-details {
          flex: 1;
        }
        
        .cart-item-name {
          margin: 0;
          font-weight: 600;
          font-size: 14px;
          color: #1f2937;
        }
        
        .cart-item-price {
          display: flex;
          gap: 8px;
          margin-top: 4px;
        }
        
        .cart-item-current {
          font-size: 12px;
          color: #0ea5e9;
          font-weight: 600;
        }
        
        .cart-item-bulk {
          font-size: 10px;
          color: #059669;
          background: rgba(16,185,129,0.1);
          padding: 2px 6px;
          border-radius: 4px;
        }
        
        .cart-item-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 12px 8px;
        }
        
        .cart-qty-controls {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        
        .cart-qty-btn {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          color: #374151;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .cart-qty-btn.danger {
          background: #fef2f2;
          color: #ef4444;
        }
        
        .cart-qty-btn.plus {
          color: #0ea5e9;
        }
        
        .cart-qty-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .cart-qty {
          font-weight: 700;
          min-width: 28px;
          text-align: center;
          font-size: 14px;
        }
        
        .cart-item-total {
          text-align: right;
          min-width: 70px;
          font-weight: 800;
          font-size: 15px;
          color: #0ea5e9;
        }
        
        .cart-item-footer {
          padding: 6px 12px 8px;
          border-top: 1px solid #f8fafc;
          display: flex;
          gap: 12px;
        }
        
        .cart-save-btn, .cart-remove-btn {
          font-size: 11px;
          background: none;
          border: none;
          cursor: pointer;
          font-weight: 600;
        }
        
        .cart-save-btn {
          color: #0ea5e9;
        }
        
        .cart-remove-btn {
          color: #ef4444;
          margin-left: auto;
        }
        
        .cart-saved {
          margin-top: 8px;
        }
        
        .cart-saved-toggle {
          width: 100%;
          padding: 8px;
          border: none;
          background: #f8fafc;
          border-radius: 10px;
          cursor: pointer;
          font-size: 12px;
          font-weight: 600;
          display: flex;
          justify-content: space-between;
        }
        
        .cart-saved-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 12px;
          background: #fff;
          border-radius: 10px;
          border: 1px solid #f1f5f9;
          margin-bottom: 6px;
        }
        
        .cart-saved-price {
          font-size: 11px;
          color: #0ea5e9;
        }
        
        .cart-move-btn {
          font-size: 11px;
          padding: 4px 10px;
          border-radius: 8px;
          border: none;
          background: #0ea5e9;
          color: #fff;
          cursor: pointer;
        }
        
        .cart-sidebar-footer {
          border-top: 1px solid #f1f5f9;
          padding: 14px 16px;
          background: #fff;
          flex-shrink: 0;
        }
        
        .cart-coupon {
          margin-bottom: 14px;
        }
        
        .cart-coupon-input {
          display: flex;
          gap: 8px;
        }
        
        .cart-coupon-input input {
          flex: 1;
          padding: 7px 12px;
          border-radius: 10px;
          border: 1.5px solid #e2e8f0;
          font-size: 12px;
          outline: none;
        }
        
        .cart-coupon-input button {
          padding: 7px 14px;
          border-radius: 10px;
          border: none;
          background: #0ea5e9;
          color: #fff;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
        }
        
        .cart-coupon-applied {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 12px;
          background: rgba(16,185,129,0.08);
          border-radius: 10px;
        }
        
        .cart-coupon-applied span {
          font-size: 12px;
          color: #059669;
          font-weight: 600;
        }
        
        .cart-coupon-remove {
          font-size: 11px;
          color: #ef4444;
          background: none;
          border: none;
          cursor: pointer;
          font-weight: 700;
        }
        
        .cart-coupon-error {
          font-size: 11px;
          color: #ef4444;
          margin-top: 4px;
        }
        
        .cart-coupon-success {
          font-size: 11px;
          color: #059669;
          margin-top: 4px;
        }
        
        .cart-price-breakdown {
          background: #f8fafc;
          border-radius: 10px;
          padding: 10px 14px;
          margin-bottom: 14px;
        }
        
        .cart-price-breakdown .flex-between {
          font-size: 12px;
          margin-bottom: 6px;
          color: #6B7280;
        }
        
        .cart-price-breakdown .cart-total {
          font-size: 1.1rem;
          margin-top: 4px;
          padding-top: 8px;
        }
        
        .cart-free-delivery-msg {
          font-size: 11px;
          color: #d97706;
          background: rgba(245,158,11,0.08);
          padding: 7px 12px;
          border-radius: 8px;
          margin-bottom: 12px;
          text-align: center;
          font-weight: 600;
        }
        
        .cart-checkout-btn {
          width: 100%;
          padding: 12px;
          border-radius: 10px;
          border: none;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: #fff;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        body.dark-mode .cart-sidebar {
          background: #1e293b;
        }
        
        body.dark-mode .cart-item {
          background: #1e293b;
          border-color: #334155;
        }
        
        body.dark-mode .cart-item-name {
          color: #f1f5f9;
        }
        
        body.dark-mode .cart-price-breakdown {
          background: #0f172a;
        }
        
        body.dark-mode .cart-saved-toggle {
          background: #0f172a;
          color: #94a3b8;
        }
        
        body.dark-mode .cart-saved-item {
          background: #1e293b;
          border-color: #334155;
        }
      `}</style>
    </div>
  );
}

// ─── VAULT SIDEBAR ────────────────────────────────────────────────────────────
export function VaultSidebar({ open, onToggle, entries, counts }) {
  const [activeCat, setActiveCat] = useState('all');
  const [searchQ, setSearchQ] = useState('');
  const [sortMode, setSortMode] = useState('newest');
  const [expandedId, setExpandedId] = useState(null);
  const [starred, setStarred] = useState(new Set());
  const [showStarred, setShowStarred] = useState(false);
  const [exportMsg, setExportMsg] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [localEntries, setLocalEntries] = useState([]);
  const [showAddNote, setShowAddNote] = useState(false);
  const [newNote, setNewNote] = useState({ title: '', result: '', cat: 'general' });

  useEffect(() => {
    if (entries && entries.length) {
      setLocalEntries(entries.map((e, i) => ({ ...e, _id: e._id || `e-${i}-${Date.now()}` })));
    }
  }, [entries]);

  const allEntries = showStarred ? localEntries.filter(e => starred.has(e._id)) : localEntries;

  const filtered = useMemo(() => {
    let list = [...allEntries];
    if (activeCat !== 'all') list = list.filter(e => (e.cat || 'general') === activeCat);
    if (searchQ) list = list.filter(e => e.title?.toLowerCase().includes(searchQ.toLowerCase()) || e.result?.toLowerCase().includes(searchQ.toLowerCase()));
    if (sortMode === 'oldest') list = list.reverse();
    if (sortMode === 'alpha') list = [...list].sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    return list;
  }, [allEntries, activeCat, searchQ, sortMode]);

  const localCounts = useMemo(() => ({
    total: localEntries.length, 
    scans: localEntries.filter(e => e.cat === 'scan').length,
    tests: localEntries.filter(e => e.cat === 'lab').length, 
    consults: localEntries.filter(e => e.cat === 'consult').length,
  }), [localEntries]);

  const catCount = (key) => key === 'all' ? localEntries.length : localEntries.filter(e => (e.cat || 'general') === key).length;

  const toggleStar = (id) => setStarred(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const confirmDelete = (id) => setDeleteId(id);
  const doDelete = () => { setLocalEntries(prev => prev.filter(e => e._id !== deleteId)); setDeleteId(null); if (expandedId === deleteId) setExpandedId(null); };

  const exportVault = () => {
    try {
      const data = JSON.stringify(localEntries, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `symptocare-vault-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(blob);
      setExportMsg('✓ Vault exported!');
      setTimeout(() => setExportMsg(''), 3000);
    } catch { setExportMsg('Export failed.'); }
  };

  const addManualNote = () => {
    if (!newNote.title.trim()) return;
    const entry = {
      _id: `manual-${Date.now()}`, title: newNote.title, result: newNote.result, cat: newNote.cat,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      color: catColor(newNote.cat),
    };
    setLocalEntries(prev => [entry, ...prev]);
    setNewNote({ title: '', result: '', cat: 'general' });
    setShowAddNote(false);
  };

  // Toggle button that appears on the right side when vault is closed
  if (!open) {
    return (
      <div className="vault-tab" onClick={onToggle}>
        <i className="bi bi-folder2-open" style={{ fontSize: '1.2rem' }} />
        <span>VAULT</span>
        <style>{`
          .vault-tab {
            position: fixed;
            top: 50%;
            right: 0;
            transform: translateY(-50%);
            background: linear-gradient(135deg, #0ea5e9, #22d3ee);
            color: #fff;
            padding: 14px 8px;
            border-radius: 12px 0 0 12px;
            cursor: pointer;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 6px;
            z-index: 1998;
            font-weight: 700;
            letter-spacing: 1px;
            box-shadow: -3px 0 16px rgba(14,165,233,0.3);
            transition: all 0.3s;
          }
          
          .vault-tab:hover {
            transform: translateY(-50%) scale(1.02);
            background: linear-gradient(135deg, #0284c7, #06b6d4);
          }
          
          body.dark-mode .vault-tab {
            background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="vault-sidebar">
      <div className="vault-sidebar-header">
        <div className="vault-header-content">
          <div className="vault-icon"><i className="bi bi-shield-lock-fill" /></div>
          <div><h5 style={{ margin: 0 }}>Medical Vault</h5><small className="text-muted">Secure Health Records</small></div>
        </div>
        <button onClick={onToggle} className="vault-close-btn">✕</button>
      </div>

      <div className="vault-stats">
        <div className="vault-stat">
          <div className="vault-stat-value" style={{ color: '#0ea5e9' }}>{localCounts.total}</div>
          <div className="vault-stat-label">Records</div>
        </div>
        <div className="vault-stat">
          <div className="vault-stat-value" style={{ color: '#7c3aed' }}>{localCounts.scans}</div>
          <div className="vault-stat-label">Scans</div>
        </div>
        <div className="vault-stat">
          <div className="vault-stat-value" style={{ color: '#059669' }}>{localCounts.tests}</div>
          <div className="vault-stat-label">Labs</div>
        </div>
        <div className="vault-stat">
          <div className="vault-stat-value" style={{ color: '#d97706' }}>{starred.size}</div>
          <div className="vault-stat-label">⭐ Starred</div>
        </div>
      </div>

      <div className="vault-search">
        <input placeholder="🔍 Search records…" value={searchQ} onChange={e => setSearchQ(e.target.value)} />
        <select value={sortMode} onChange={e => setSortMode(e.target.value)}>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="alpha">A–Z</option>
        </select>
      </div>

      <div className="vault-actions">
        <button onClick={() => setShowStarred(s => !s)} className={`vault-action-btn ${showStarred ? 'active' : ''}`}>
          ⭐ Starred {starred.size > 0 && `(${starred.size})`}
        </button>
        <button onClick={() => setShowAddNote(s => !s)} className="vault-action-btn">+ Add Note</button>
        <button onClick={exportVault} className="vault-action-btn">⬇ Export</button>
      </div>

      {exportMsg && <div className="vault-export-msg">{exportMsg}</div>}

      {showAddNote && (
        <div className="vault-add-note">
          <div className="vault-add-note-title">📝 Add Health Note</div>
          <input placeholder="Title" value={newNote.title} onChange={e => setNewNote(p => ({ ...p, title: e.target.value }))} />
          <textarea placeholder="Details" value={newNote.result} onChange={e => setNewNote(p => ({ ...p, result: e.target.value }))} rows={3} />
          <select value={newNote.cat} onChange={e => setNewNote(p => ({ ...p, cat: e.target.value }))}>
            {VAULT_CATS.filter(c => c.key !== 'all').map(c => <option key={c.key} value={c.key}>{c.icon} {c.label}</option>)}
          </select>
          <div className="vault-note-actions">
            <button onClick={addManualNote} className="vault-save-note">✓ Save</button>
            <button onClick={() => setShowAddNote(false)} className="vault-cancel-note">Cancel</button>
          </div>
        </div>
      )}

      <div className="vault-categories">
        {VAULT_CATS.map(c => {
          const cnt = catCount(c.key);
          const active = activeCat === c.key;
          return (
            <button 
              key={c.key} 
              onClick={() => setActiveCat(c.key)} 
              className={`vault-cat-btn ${active ? 'active' : ''}`} 
              style={{ '--cat-color': c.color }}
            >
              {c.icon} {c.label} {cnt > 0 && <span className="vault-cat-count">{cnt}</span>}
            </button>
          );
        })}
      </div>

      {deleteId && (
        <div className="vault-delete-confirm">
          <div className="vault-delete-title">⚠ Delete this record?</div>
          <div className="vault-delete-actions">
            <button onClick={doDelete} className="vault-delete-yes">Yes, Delete</button>
            <button onClick={() => setDeleteId(null)} className="vault-delete-no">Cancel</button>
          </div>
        </div>
      )}

      <div className="vault-records-header">
        <p className="vault-records-title">{showStarred ? '⭐ Starred Records' : activeCat === 'all' ? 'Recent Activity' : VAULT_CATS.find(c => c.key === activeCat)?.label}</p>
        <small>{filtered.length} records</small>
      </div>

      {filtered.length === 0 ? (
        <div className="vault-empty">
          <i className="bi bi-inbox-fill" />
          <small>{showStarred ? 'No starred records yet' : searchQ ? 'No records match your search' : 'No records yet'}</small>
        </div>
      ) : (
        <div className="vault-records-list">
          {filtered.map((e, i) => {
            const cat = e.cat || 'general';
            const color = e.color || catColor(cat);
            const icon = catIcon(cat);
            const isStarred = starred.has(e._id);
            const isExpanded = expandedId === e._id;

            return (
              <div key={e._id || i} className={`vault-record ${isExpanded ? 'expanded' : ''}`} style={{ borderLeftColor: color }} onClick={() => setExpandedId(isExpanded ? null : e._id)}>
                <div className="vault-record-header">
                  <div className="vault-record-title">
                    <span style={{ fontSize: 14 }}>{icon}</span>
                    <strong>{e.title}</strong>
                  </div>
                  <div className="vault-record-meta">
                    <small className="text-muted">{e.time}</small>
                    <button onClick={ev => { ev.stopPropagation(); toggleStar(e._id); }} className="vault-star-btn" style={{ color: isStarred ? '#d97706' : '#D1D5DB' }}>★</button>
                  </div>
                </div>
                <p className="vault-record-result" style={{ color }}>{e.result}</p>
                {!isExpanded && <small className="vault-record-date">{e.date}</small>}
                {isExpanded && (
                  <div className="vault-record-expanded" onClick={ev => ev.stopPropagation()}>
                    <div className="vault-record-tags">
                      <span className="vault-tag" style={{ background: `${color}12`, color }}>{icon} {VAULT_CATS.find(c => c.key === cat)?.label || 'General'}</span>
                      <span className="vault-tag">📅 {e.date}</span>
                    </div>
                    {e.result && <div className="vault-record-details">{e.result}</div>}
                    <div className="vault-record-actions">
                      <button onClick={() => navigator.clipboard?.writeText(`${e.title}\n${e.result}\n${e.date}`)}>📋 Copy</button>
                      <button onClick={() => confirmDelete(e._id)}>🗑 Delete</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {localEntries.length > 0 && (
        <div className="vault-footer-actions">
          <button onClick={exportVault} className="vault-footer-btn">⬇ Export All</button>
          <button onClick={() => { if (window.confirm('Clear all vault records?')) { setLocalEntries([]); setStarred(new Set()); } }} className="vault-footer-btn danger">🗑 Clear All</button>
        </div>
      )}

      <style>{`
        .vault-sidebar {
          position: fixed;
          top: 0;
          right: 0;
          width: 400px;
          max-width: 100vw;
          height: 100vh;
          background: #fff;
          box-shadow: -8px 0 40px rgba(0,0,0,0.15);
          z-index: 1999;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          padding: 20px 18px 24px;
          animation: slideInRight 0.3s ease;
        }
        
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        
        .vault-sidebar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        
        .vault-header-content {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .vault-icon {
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .vault-icon i {
          color: #fff;
          font-size: 20px;
        }
        
        .vault-close-btn {
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          cursor: pointer;
          font-size: 14px;
        }
        
        .vault-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
          margin-bottom: 16px;
        }
        
        .vault-stat {
          text-align: center;
          padding: 8px 4px;
          border-radius: 8px;
          background: rgba(0,0,0,0.02);
        }
        
        .vault-stat-value {
          font-weight: 800;
          font-size: 1.1rem;
        }
        
        .vault-stat-label {
          font-size: 10px;
          color: #9CA3AF;
        }
        
        .vault-search {
          display: flex;
          gap: 6px;
          margin-bottom: 10px;
        }
        
        .vault-search input {
          flex: 1;
          padding: 6px 10px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          font-size: 12px;
          outline: none;
        }
        
        .vault-search select {
          font-size: 11px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          padding: 4px 6px;
          cursor: pointer;
        }
        
        .vault-actions {
          display: flex;
          gap: 6px;
          margin-bottom: 12px;
          flex-wrap: wrap;
        }
        
        .vault-action-btn {
          font-size: 11px;
          padding: 4px 10px;
          border-radius: 20px;
          border: 1px solid #e2e8f0;
          background: #fff;
          color: #374151;
          cursor: pointer;
          font-weight: 600;
        }
        
        .vault-action-btn.active {
          border-color: #d97706;
          background: rgba(217,119,6,0.08);
          color: #d97706;
        }
        
        .vault-export-msg {
          font-size: 11px;
          color: #059669;
          font-weight: 600;
          margin-bottom: 8px;
          text-align: center;
        }
        
        .vault-add-note {
          background: #f8fafc;
          border-radius: 12px;
          padding: 12px;
          margin-bottom: 12px;
          border: 1px solid #e2e8f0;
        }
        
        .vault-add-note-title {
          font-size: 12px;
          font-weight: 700;
          margin-bottom: 8px;
        }
        
        .vault-add-note input, .vault-add-note textarea, .vault-add-note select {
          width: 100%;
          padding: 6px 10px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          font-size: 12px;
          margin-bottom: 6px;
          box-sizing: border-box;
        }
        
        .vault-note-actions {
          display: flex;
          gap: 6px;
        }
        
        .vault-save-note, .vault-cancel-note {
          flex: 1;
          padding: 7px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }
        
        .vault-save-note {
          border: none;
          background: #0ea5e9;
          color: #fff;
        }
        
        .vault-cancel-note {
          border: 1px solid #e2e8f0;
          background: #fff;
        }
        
        .vault-categories {
          display: flex;
          gap: 5px;
          overflow-x: auto;
          margin-bottom: 12px;
          padding-bottom: 4px;
        }
        
        .vault-cat-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 10px;
          border-radius: 20px;
          border: 1.5px solid #e2e8f0;
          background: #fff;
          color: #9CA3AF;
          font-size: 11px;
          cursor: pointer;
          white-space: nowrap;
          flex-shrink: 0;
        }
        
        .vault-cat-btn.active {
          border-color: var(--cat-color);
          background: color-mix(in srgb, var(--cat-color) 7%, transparent);
          color: var(--cat-color);
          font-weight: 700;
        }
        
        .vault-cat-count {
          background: #e2e8f0;
          color: #9CA3AF;
          border-radius: 20px;
          padding: 1px 5px;
          font-size: 9px;
        }
        
        .vault-delete-confirm {
          background: rgba(239,68,68,0.06);
          border: 1px solid rgba(239,68,68,0.2);
          border-radius: 10px;
          padding: 12px;
          margin-bottom: 10px;
        }
        
        .vault-delete-title {
          font-size: 13px;
          font-weight: 600;
          color: #dc2626;
          margin-bottom: 8px;
        }
        
        .vault-delete-actions {
          display: flex;
          gap: 6px;
        }
        
        .vault-delete-yes, .vault-delete-no {
          flex: 1;
          padding: 6px;
          border-radius: 8px;
          cursor: pointer;
        }
        
        .vault-delete-yes {
          border: none;
          background: #dc2626;
          color: #fff;
        }
        
        .vault-delete-no {
          border: 1px solid #e2e8f0;
          background: #fff;
        }
        
        .vault-records-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }
        
        .vault-records-title {
          font-size: 0.8rem;
          font-weight: 700;
          color: #64748b;
          margin: 0;
        }
        
        .vault-empty {
          text-align: center;
          padding: 32px 0;
          color: #64748b;
        }
        
        .vault-empty i {
          display: block;
          font-size: 2rem;
          margin-bottom: 8px;
        }
        
        .vault-records-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .vault-record {
          padding: 10px 12px;
          border-radius: 10px;
          border: 1px solid #e2e8f0;
          border-left-width: 4px;
          background: #fff;
          transition: all 0.15s;
          cursor: pointer;
        }
        
        .vault-record.expanded {
          background: #f8fafc;
          border-color: color-mix(in srgb, var(--border) 50%, transparent);
        }
        
        .vault-record-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 4px;
        }
        
        .vault-record-title {
          display: flex;
          align-items: center;
          gap: 6px;
          flex: 1;
        }
        
        .vault-record-title strong {
          font-size: 0.82rem;
          color: #1f2937;
        }
        
        .vault-record-meta {
          display: flex;
          gap: 6px;
          align-items: center;
        }
        
        .vault-star-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 13px;
        }
        
        .vault-record-result {
          margin: 2px 0;
          font-size: 0.78rem;
          font-weight: 600;
        }
        
        .vault-record-date {
          font-size: 0.72rem;
          display: block;
          margin-top: 2px;
          color: #64748b;
        }
        
        .vault-record-expanded {
          margin-top: 8px;
          padding-top: 8px;
          border-top: 1px dashed #e2e8f0;
        }
        
        .vault-record-tags {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
          margin-bottom: 8px;
        }
        
        .vault-tag {
          font-size: 10px;
          padding: 2px 8px;
          border-radius: 20px;
          font-weight: 600;
        }
        
        .vault-record-details {
          font-size: 12px;
          color: #374151;
          line-height: 1.6;
          margin-bottom: 8px;
          padding: 8px 10px;
          background: #f8fafc;
          border-radius: 8px;
        }
        
        .vault-record-actions {
          display: flex;
          gap: 6px;
        }
        
        .vault-record-actions button {
          font-size: 10px;
          padding: 4px 10px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          background: #fff;
          cursor: pointer;
        }
        
        .vault-footer-actions {
          margin-top: 16px;
          padding-top: 12px;
          border-top: 1px solid #e2e8f0;
          display: flex;
          gap: 8px;
        }
        
        .vault-footer-btn {
          flex: 1;
          padding: 8px;
          border-radius: 10px;
          border: 1px solid #e2e8f0;
          background: #fff;
          cursor: pointer;
          font-size: 12px;
          font-weight: 600;
        }
        
        .vault-footer-btn.danger {
          border-color: rgba(239,68,68,0.2);
          background: rgba(239,68,68,0.04);
          color: #ef4444;
        }
        
        body.dark-mode .vault-sidebar {
          background: #1e293b;
        }
        
        body.dark-mode .vault-record {
          background: #0f172a;
          border-color: #334155;
        }
        
        body.dark-mode .vault-record-title strong {
          color: #f1f5f9;
        }
        
        body.dark-mode .vault-record.expanded {
          background: #1e293b;
        }
        
        body.dark-mode .vault-add-note {
          background: #0f172a;
          border-color: #334155;
        }
        
        body.dark-mode .vault-close-btn {
          background: #0f172a;
          border-color: #334155;
          color: #94a3b8;
        }
        
        body.dark-mode .vault-action-btn {
          background: #1e293b;
          border-color: #334155;
          color: #94a3b8;
        }
      `}</style>
    </div>
  );
}