// src/views/WalletView.jsx
import { useState, useEffect } from 'react';
import { Modal } from "../components/UI.jsx";

export default function WalletView({ balance, transactions, addFunds, deductFunds, resetWallet, isModal = false, onClose }) {
  const [activeTab, setActiveTab] = useState('transactions');
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStep, setPaymentStep] = useState(1);
  const [upiId, setUpiId] = useState('');
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '', name: '' });
  const [processing, setProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [filterType, setFilterType] = useState('all');
  
  // Local state to track real-time balance and transactions
  const [localBalance, setLocalBalance] = useState(balance);
  const [localTransactions, setLocalTransactions] = useState(transactions);

  // Sync with props when they change
  useEffect(() => {
    setLocalBalance(balance);
    setLocalTransactions([...transactions]);
  }, [balance, transactions]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  // Get date for display
  const getRelativeTime = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  // Filter transactions
  const filteredTransactions = localTransactions.filter(tx => {
    if (filterType === 'all') return true;
    return tx.type === filterType;
  });

  // Stats
  const totalAdded = localTransactions.filter(t => t.type === 'credit').reduce((a, t) => a + t.amount, 0);
  const totalSpent = localTransactions.filter(t => t.type === 'debit').reduce((a, t) => a + t.amount, 0);
  const totalTransactions = localTransactions.length;

  // Handle Add Money
  const handleAddMoney = () => {
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    setPaymentStep(1);
    setShowPaymentModal(true);
  };

  // Process Payment
  const processPayment = () => {
    setProcessing(true);
    setTimeout(() => {
      const amt = parseFloat(amount);
      addFunds(amt);
      setProcessing(false);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setShowPaymentModal(false);
        setAmount('');
        setUpiId('');
        setCardDetails({ number: '', expiry: '', cvv: '', name: '' });
        setPaymentStep(1);
      }, 2000);
    }, 2000);
  };

  // Handle Withdraw
  const handleWithdraw = () => {
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    if (amt < 100) {
      alert('Minimum withdrawal amount is ₹100');
      return;
    }
    if (amt > localBalance) {
      alert('Insufficient balance');
      return;
    }
    if (window.confirm(`Withdraw ${formatCurrency(amt)} to your bank account?`)) {
      deductFunds(amt, 'Withdrawal to bank');
      setAmount('');
    }
  };

  // Quick amount buttons
  const quickAmounts = [100, 200, 500, 1000, 2000, 5000];

  // Payment methods
  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: '💳', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
    { id: 'upi', name: 'UPI', icon: '📱', color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
    { id: 'netbanking', name: 'Net Banking', icon: '🏦', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' }
  ];

  const content = (
    <div style={{ maxWidth: 500, margin: '0 auto' }}>
      {/* Balance Card */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: 28,
        padding: 28,
        marginBottom: 24,
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 20px 35px -10px rgba(0,0,0,0.2)'
      }}>
        <div style={{ position: 'absolute', top: -20, right: -20, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
        <div style={{ position: 'absolute', bottom: -30, left: -30, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 12, opacity: 0.8, letterSpacing: 1, marginBottom: 4 }}>TOTAL BALANCE</div>
              <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: -1 }}>{formatCurrency(localBalance)}</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 12, padding: 8 }}>
              <i className="bi bi-wallet2" style={{ fontSize: 28 }} />
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
            <button
              onClick={() => setActiveTab('add')}
              style={{
                flex: 1,
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                borderRadius: 12,
                padding: '10px',
                color: 'white',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
            >
              <i className="bi bi-plus-circle" /> Add Money
            </button>
            <button
              onClick={() => setActiveTab('withdraw')}
              style={{
                flex: 1,
                background: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: 12,
                padding: '10px',
                color: 'white',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
            >
              <i className="bi bi-cash-stack" /> Withdraw
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: 14, textAlign: 'center', border: '1px solid rgba(0,0,0,0.08)' }}>
          <div style={{ fontSize: 24, marginBottom: 4 }}>💰</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#10b981' }}>{formatCurrency(totalAdded)}</div>
          <div style={{ fontSize: 11, color: '#6b7280' }}>Total Added</div>
        </div>
        <div style={{ background: '#fff', borderRadius: 16, padding: 14, textAlign: 'center', border: '1px solid rgba(0,0,0,0.08)' }}>
          <div style={{ fontSize: 24, marginBottom: 4 }}>💸</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#ef4444' }}>{formatCurrency(totalSpent)}</div>
          <div style={{ fontSize: 11, color: '#6b7280' }}>Total Spent</div>
        </div>
        <div style={{ background: '#fff', borderRadius: 16, padding: 14, textAlign: 'center', border: '1px solid rgba(0,0,0,0.08)' }}>
          <div style={{ fontSize: 24, marginBottom: 4 }}>📊</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#3b82f6' }}>{totalTransactions}</div>
          <div style={{ fontSize: 11, color: '#6b7280' }}>Transactions</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, borderBottom: '2px solid #f0f0f0' }}>
        {[
          { id: 'transactions', label: 'Transactions', icon: '📋' },
          { id: 'add', label: 'Add Money', icon: '➕' },
          { id: 'withdraw', label: 'Withdraw', icon: '💸' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              padding: '10px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: activeTab === tab.id ? 700 : 500,
              color: activeTab === tab.id ? '#667eea' : '#6b7280',
              borderBottom: activeTab === tab.id ? '2px solid #667eea' : '2px solid transparent',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6
            }}
          >
            <span>{tab.icon}</span> {tab.label}
          </button>
        ))}
      </div>

      {/* Add Money Tab */}
      {activeTab === 'add' && (
        <div style={{ animation: 'fadeIn 0.3s ease' }}>
          <div style={{ background: '#fff', borderRadius: 20, padding: 20, border: '1px solid rgba(0,0,0,0.08)' }}>
            <h5 style={{ marginBottom: 16, fontWeight: 700 }}>Select Amount</h5>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 20 }}>
              {quickAmounts.map(amt => (
                <button
                  key={amt}
                  onClick={() => setAmount(amt.toString())}
                  style={{
                    padding: '10px',
                    borderRadius: 12,
                    border: parseFloat(amount) === amt ? '2px solid #667eea' : '1px solid rgba(0,0,0,0.1)',
                    background: parseFloat(amount) === amt ? 'rgba(102,126,234,0.1)' : '#fff',
                    cursor: 'pointer',
                    fontWeight: parseFloat(amount) === amt ? 700 : 500,
                    color: parseFloat(amount) === amt ? '#667eea' : '#374151',
                    transition: 'all 0.2s'
                  }}
                >
                  {formatCurrency(amt)}
                </button>
              ))}
            </div>
            
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, color: '#6b7280', marginBottom: 6, display: 'block' }}>Custom Amount</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#6b7280', fontWeight: 700 }}>₹</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 32px',
                    borderRadius: 12,
                    border: '1px solid rgba(0,0,0,0.1)',
                    fontSize: 14,
                    outline: 'none',
                    transition: 'all 0.2s'
                  }}
                  onFocus={e => e.target.style.borderColor = '#667eea'}
                  onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.1)'}
                />
              </div>
            </div>

            <button
              onClick={handleAddMoney}
              disabled={!amount || parseFloat(amount) <= 0}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: 12,
                border: 'none',
                background: (!amount || parseFloat(amount) <= 0) ? '#d1d5db' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                fontWeight: 700,
                cursor: (!amount || parseFloat(amount) <= 0) ? 'not-allowed' : 'pointer',
                fontSize: 14,
                transition: 'all 0.2s'
              }}
            >
              Add {formatCurrency(parseFloat(amount) || 0)}
            </button>
          </div>
        </div>
      )}

      {/* Withdraw Tab */}
      {activeTab === 'withdraw' && (
        <div style={{ animation: 'fadeIn 0.3s ease' }}>
          <div style={{ background: '#fff', borderRadius: 20, padding: 20, border: '1px solid rgba(0,0,0,0.08)' }}>
            <div style={{ marginBottom: 16, padding: 12, background: '#fef3c7', borderRadius: 12, borderLeft: '3px solid #f59e0b' }}>
              <div style={{ fontSize: 12, color: '#92400e', display: 'flex', alignItems: 'center', gap: 8 }}>
                <i className="bi bi-info-circle" /> Minimum withdrawal: ₹100. Funds credited in 2-3 business days.
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, color: '#6b7280', marginBottom: 6, display: 'block' }}>Withdrawal Amount</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#6b7280', fontWeight: 700 }}>₹</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount (min ₹100)"
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 32px',
                    borderRadius: 12,
                    border: '1px solid rgba(0,0,0,0.1)',
                    fontSize: 14,
                    outline: 'none'
                  }}
                  onFocus={e => e.target.style.borderColor = '#667eea'}
                  onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.1)'}
                />
              </div>
            </div>

            <div style={{ marginBottom: 20, padding: 12, background: '#f0fdf4', borderRadius: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: '#6b7280' }}>Available Balance</span>
                <span style={{ fontWeight: 700, color: '#10b981' }}>{formatCurrency(localBalance)}</span>
              </div>
            </div>

            <button
              onClick={handleWithdraw}
              disabled={!amount || parseFloat(amount) < 100 || parseFloat(amount) > localBalance}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: 12,
                border: 'none',
                background: (!amount || parseFloat(amount) < 100 || parseFloat(amount) > localBalance) ? '#d1d5db' : '#ef4444',
                color: 'white',
                fontWeight: 700,
                cursor: (!amount || parseFloat(amount) < 100 || parseFloat(amount) > localBalance) ? 'not-allowed' : 'pointer',
                fontSize: 14,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8
              }}
            >
              <i className="bi bi-cash-stack" /> Withdraw {formatCurrency(parseFloat(amount) || 0)}
            </button>
          </div>
        </div>
      )}

      {/* Transactions Tab */}
      {activeTab === 'transactions' && (
        <div style={{ animation: 'fadeIn 0.3s ease' }}>
          {/* Filter Buttons */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            {[
              { id: 'all', label: 'All', icon: '📋' },
              { id: 'credit', label: 'Added', icon: '➕', color: '#10b981' },
              { id: 'debit', label: 'Spent', icon: '💸', color: '#ef4444' }
            ].map(filter => (
              <button
                key={filter.id}
                onClick={() => setFilterType(filter.id)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 20,
                  border: filterType === filter.id ? `2px solid ${filter.color || '#667eea'}` : '1px solid rgba(0,0,0,0.1)',
                  background: filterType === filter.id ? `rgba(${filter.id === 'credit' ? '16,185,129' : filter.id === 'debit' ? '239,68,68' : '102,126,234'},0.1)` : '#fff',
                  cursor: 'pointer',
                  fontSize: 12,
                  fontWeight: filterType === filter.id ? 600 : 400,
                  color: filterType === filter.id ? (filter.color || '#667eea') : '#6b7280',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}
              >
                <span>{filter.icon}</span> {filter.label}
              </button>
            ))}
          </div>

          {/* Transaction List */}
          {filteredTransactions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px 20px', background: '#fff', borderRadius: 20, border: '1px solid rgba(0,0,0,0.08)' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>💳</div>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>No transactions yet</div>
              <div style={{ fontSize: 12, color: '#6b7280' }}>Add money to get started</div>
            </div>
          ) : (
            <div style={{ maxHeight: 400, overflowY: 'auto' }}>
              {filteredTransactions.map((tx, index) => (
                <div
                  key={tx.id}
                  style={{
                    background: '#fff',
                    borderRadius: 14,
                    padding: 14,
                    marginBottom: 8,
                    border: '1px solid rgba(0,0,0,0.06)',
                    transition: 'all 0.2s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 44,
                      height: 44,
                      borderRadius: '50%',
                      background: tx.type === 'credit' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 20
                    }}>
                      {tx.type === 'credit' ? '💰' : '💸'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>
                        {tx.type === 'credit' ? 'Money Added' : 'Payment Made'}
                      </div>
                      <div style={{ fontSize: 11, color: '#6b7280', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span>{getRelativeTime(tx.date)}</span>
                        {tx.description && <span>• {tx.description}</span>}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 16, fontWeight: 700, color: tx.type === 'credit' ? '#10b981' : '#ef4444' }}>
                        {tx.type === 'credit' ? '+' : '-'} {formatCurrency(tx.amount)}
                      </div>
                      <div style={{ fontSize: 10, color: '#6b7280' }}>
                        Balance: {formatCurrency(tx.balanceAfter)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Payment Modal */}
      <Modal show={showPaymentModal} onClose={() => setShowPaymentModal(false)} title="Add Money" size="lg">
        {showSuccess ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ fontSize: 64, marginBottom: 16, animation: 'bounceIn 0.5s' }}>✅</div>
            <h4 style={{ color: '#10b981', marginBottom: 8 }}>Payment Successful!</h4>
            <p>{formatCurrency(parseFloat(amount))} has been added to your wallet.</p>
          </div>
        ) : processing ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div className="spinner-ring" style={{ margin: '0 auto 20px' }} />
            <h5>Processing Payment...</h5>
            <p style={{ fontSize: 13, color: '#6b7280' }}>Please wait, do not close this window</p>
          </div>
        ) : (
          <div>
            {/* Step Indicator */}
            <div style={{ display: 'flex', marginBottom: 24, position: 'relative' }}>
              {[
                { step: 1, label: 'Amount', icon: '💰' },
                { step: 2, label: 'Method', icon: '💳' },
                { step: 3, label: 'Pay', icon: '✅' }
              ].map((item, idx) => (
                <div key={item.step} style={{ flex: 1, textAlign: 'center', position: 'relative' }}>
                  {idx < 2 && (
                    <div style={{
                      position: 'absolute',
                      top: 20,
                      left: '50%',
                      width: '100%',
                      height: 2,
                      background: paymentStep > item.step ? '#10b981' : '#e5e7eb',
                      zIndex: 0
                    }} />
                  )}
                  <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: paymentStep >= item.step ? '#667eea' : '#f3f4f6',
                    color: paymentStep >= item.step ? '#fff' : '#9ca3af',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 8px',
                    position: 'relative',
                    zIndex: 1,
                    fontSize: 18
                  }}>
                    {paymentStep > item.step ? '✓' : item.icon}
                  </div>
                  <div style={{ fontSize: 11, color: paymentStep >= item.step ? '#667eea' : '#9ca3af', fontWeight: 500 }}>
                    {item.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Step 1: Confirm Amount */}
            {paymentStep === 1 && (
              <div>
                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                  <div style={{ fontSize: 14, color: '#6b7280', marginBottom: 8 }}>Amount to add</div>
                  <div style={{ fontSize: 48, fontWeight: 800, color: '#667eea' }}>{formatCurrency(parseFloat(amount))}</div>
                </div>
                <button
                  onClick={() => setPaymentStep(2)}
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: 12,
                    border: 'none',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: '#fff',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Continue
                </button>
              </div>
            )}

            {/* Step 2: Select Payment Method */}
            {paymentStep === 2 && (
              <div>
                <div style={{ marginBottom: 16 }}>
                  {paymentMethods.map(method => (
                    <div
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id)}
                      style={{
                        padding: 16,
                        borderRadius: 12,
                        border: selectedMethod === method.id ? `2px solid ${method.color}` : '1px solid rgba(0,0,0,0.1)',
                        background: selectedMethod === method.id ? method.bg : '#fff',
                        marginBottom: 12,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ fontSize: 28 }}>{method.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600 }}>{method.name}</div>
                        <div style={{ fontSize: 11, color: '#6b7280' }}>Secure & Instant</div>
                      </div>
                      {selectedMethod === method.id && <div style={{ color: method.color, fontSize: 20 }}>✓</div>}
                    </div>
                  ))}
                </div>

                {/* UPI Details */}
                {selectedMethod === 'upi' && (
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ fontSize: 12, color: '#6b7280', marginBottom: 6, display: 'block' }}>UPI ID</label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="username@upi"
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: 12,
                        border: '1px solid rgba(0,0,0,0.1)',
                        fontSize: 14
                      }}
                    />
                  </div>
                )}

                {/* Card Details */}
                {selectedMethod === 'card' && (
                  <div style={{ marginBottom: 16 }}>
                    <input
                      type="text"
                      placeholder="Card Number"
                      value={cardDetails.number}
                      onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                      style={{ width: '100%', padding: '12px', borderRadius: 12, border: '1px solid rgba(0,0,0,0.1)', marginBottom: 10, fontSize: 14 }}
                    />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={cardDetails.expiry}
                        onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                        style={{ padding: '12px', borderRadius: 12, border: '1px solid rgba(0,0,0,0.1)', fontSize: 14 }}
                      />
                      <input
                        type="password"
                        placeholder="CVV"
                        maxLength={3}
                        value={cardDetails.cvv}
                        onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                        style={{ padding: '12px', borderRadius: 12, border: '1px solid rgba(0,0,0,0.1)', fontSize: 14 }}
                      />
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', gap: 12 }}>
                  <button
                    onClick={() => setPaymentStep(1)}
                    style={{
                      flex: 1,
                      padding: '14px',
                      borderRadius: 12,
                      border: '1px solid rgba(0,0,0,0.1)',
                      background: '#fff',
                      cursor: 'pointer',
                      fontWeight: 600
                    }}
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setPaymentStep(3)}
                    style={{
                      flex: 1,
                      padding: '14px',
                      borderRadius: 12,
                      border: 'none',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: '#fff',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Confirm & Pay */}
            {paymentStep === 3 && (
              <div>
                <div style={{ background: '#f9fafb', borderRadius: 16, padding: 20, marginBottom: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <span style={{ color: '#6b7280' }}>Amount</span>
                    <span style={{ fontWeight: 700 }}>{formatCurrency(parseFloat(amount))}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <span style={{ color: '#6b7280' }}>Payment Method</span>
                    <span style={{ fontWeight: 700 }}>{paymentMethods.find(m => m.id === selectedMethod)?.name}</span>
                  </div>
                  <div style={{ borderTop: '1px solid #e5e7eb', margin: '12px 0', paddingTop: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 700 }}>Total</span>
                      <span style={{ fontSize: 20, fontWeight: 800, color: '#667eea' }}>{formatCurrency(parseFloat(amount))}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 12 }}>
                  <button
                    onClick={() => setPaymentStep(2)}
                    style={{
                      flex: 1,
                      padding: '14px',
                      borderRadius: 12,
                      border: '1px solid rgba(0,0,0,0.1)',
                      background: '#fff',
                      cursor: 'pointer',
                      fontWeight: 600
                    }}
                  >
                    Back
                  </button>
                  <button
                    onClick={processPayment}
                    style={{
                      flex: 1,
                      padding: '14px',
                      borderRadius: 12,
                      border: 'none',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: '#fff',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8
                    }}
                  >
                    <i className="bi bi-lock-fill" /> Pay Now
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );

  // Add animation styles
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes bounceIn {
      0% { transform: scale(0); opacity: 0; }
      50% { transform: scale(1.2); }
      100% { transform: scale(1); opacity: 1; }
    }
    .spinner-ring {
      width: 40px;
      height: 40px;
      border: 3px solid #f3f4f6;
      border-top: 3px solid #667eea;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);

  if (isModal) {
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#6b7280' }}>✕</button>
        </div>
        {content}
      </div>
    );
  }

  return (
    <div className="view">
      <div className="container-sc py4">
        <div className="section-head">
          <h2><i className="bi bi-wallet2 me-2" style={{ color: '#667eea' }} />Digital Wallet</h2>
          <p>Manage funds, view transactions, and pay for services instantly</p>
        </div>
        {content}
      </div>
    </div>
  );
}