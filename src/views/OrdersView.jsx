// src/views/OrdersView.jsx
import { useState, useEffect } from 'react';

export default function OrdersView({ addToast }) {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadOrders();
    
    // Listen for new orders
    const handleStorageChange = () => loadOrders();
    window.addEventListener('storage', handleStorageChange);
    
    // Custom event for orders updated
    window.addEventListener('sc:ordersUpdated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('sc:ordersUpdated', handleStorageChange);
    };
  }, []);

  const loadOrders = () => {
    try {
      const savedOrders = JSON.parse(localStorage.getItem('symptocare_orders') || '[]');
      setOrders(savedOrders);
    } catch (e) {
      console.error('Error loading orders', e);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Processing': return { bg: 'rgba(245,158,11,0.1)', color: '#f59e0b', icon: '⏳' };
      case 'Confirmed': return { bg: 'rgba(14,165,233,0.1)', color: '#0ea5e9', icon: '✓' };
      case 'Shipped': return { bg: 'rgba(99,102,241,0.1)', color: '#6366f1', icon: '🚚' };
      case 'Out for Delivery': return { bg: 'rgba(16,185,129,0.1)', color: '#10b981', icon: '📦' };
      case 'Delivered': return { bg: 'rgba(16,185,129,0.15)', color: '#059669', icon: '✅' };
      case 'Cancelled': return { bg: 'rgba(239,68,68,0.1)', color: '#ef4444', icon: '❌' };
      default: return { bg: 'rgba(0,0,0,0.05)', color: '#6b7280', icon: '📋' };
    }
  };

  const getTrackingSteps = (status) => {
    const allSteps = [
      { label: 'Order Placed', icon: '📋', completed: true, time: 'Order confirmed' },
      { label: 'Processing', icon: '⚙️', completed: ['Processing', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered'].includes(status), time: status === 'Processing' ? 'Being prepared' : '✓ Completed' },
      { label: 'Shipped', icon: '🚚', completed: ['Shipped', 'Out for Delivery', 'Delivered'].includes(status), time: status === 'Shipped' ? 'On the way' : status === 'Out for Delivery' ? 'Out for delivery' : status === 'Delivered' ? '✓ Delivered' : '' },
      { label: 'Out for Delivery', icon: '📦', completed: ['Out for Delivery', 'Delivered'].includes(status), time: status === 'Out for Delivery' ? 'Driver on the way' : status === 'Delivered' ? '✓ Delivered' : '' },
      { label: 'Delivered', icon: '✅', completed: status === 'Delivered', time: status === 'Delivered' ? 'Delivered to you' : '' }
    ];
    return allSteps;
  };

  const getEstimatedDelivery = (status, orderDate) => {
    if (status === 'Delivered') return 'Delivered';
    if (status === 'Cancelled') return 'Cancelled';
    const date = new Date(orderDate);
    const deliveryDate = new Date(date.setDate(date.getDate() + 3));
    return `Est. ${deliveryDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`;
  };

  const cancelOrder = (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      const updatedOrders = orders.map(o => 
        o.id === orderId ? { ...o, status: 'Cancelled' } : o
      );
      localStorage.setItem('symptocare_orders', JSON.stringify(updatedOrders));
      setOrders(updatedOrders);
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: 'Cancelled' });
      }
      addToast('Order cancelled successfully!', 'info');
      window.dispatchEvent(new Event('sc:ordersUpdated'));
    }
  };

  const reorder = (order) => {
    // Get products from order items
    if (order.items && order.items.length) {
      order.items.forEach(item => {
        window.dispatchEvent(new CustomEvent('sc:addToCart', { 
          detail: { id: item.id, name: item.name, price: item.price, icon: item.icon, qty: 1 } 
        }));
      });
      addToast('Items added to cart!', 'success');
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter !== 'all' && order.status !== filter) return false;
    if (searchTerm) {
      return order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
             (order.items && order.items.some(i => i.name.toLowerCase().includes(searchTerm.toLowerCase())));
    }
    return true;
  });

  const statusFilters = ['all', 'Processing', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];

  return (
    <div className="view">
      <div className="container-sc py4">
        <div className="section-head">
          <h2><i className="bi bi-truck me-2 text-blue" />My Orders</h2>
          <p>Track and manage your orders in real-time</p>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {statusFilters.map(s => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                style={{
                  padding: '6px 16px',
                  borderRadius: 20,
                  border: filter === s ? '2px solid var(--blue)' : '1px solid #e2e8f0',
                  background: filter === s ? 'rgba(14,165,233,0.1)' : 'white',
                  color: filter === s ? 'var(--blue)' : '#64748b',
                  fontWeight: filter === s ? 600 : 400,
                  fontSize: 12,
                  cursor: 'pointer'
                }}
              >
                {s === 'all' ? 'All Orders' : s}
              </button>
            ))}
          </div>
          
          <div style={{ position: 'relative' }}>
            <i className="bi bi-search" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            <input
              type="text"
              placeholder="Search by order ID or product..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{
                padding: '8px 12px 8px 36px',
                borderRadius: 20,
                border: '1px solid #e2e8f0',
                fontSize: 13,
                width: 220
              }}
            />
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="text-center" style={{ padding: '60px 0', color: 'var(--muted)' }}>
            <i className="bi bi-inbox" style={{ fontSize: '3rem', display: 'block', marginBottom: 12 }} />
            <h5>No orders found</h5>
            <p style={{ marginBottom: 16 }}>You haven't placed any orders yet.</p>
            <button className="btn-primary" onClick={() => window.dispatchEvent(new CustomEvent('sc:navigate', { detail: 'store' }))}>
              Start Shopping →
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {/* Orders List Column */}
            <div>
              {filteredOrders.map(order => {
                const statusStyle = getStatusColor(order.status);
                const estDelivery = getEstimatedDelivery(order.status, order.date);
                
                return (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    style={{
                      background: selectedOrder?.id === order.id ? 'rgba(14,165,233,0.05)' : 'white',
                      border: selectedOrder?.id === order.id ? '2px solid var(--blue)' : '1px solid #e2e8f0',
                      borderRadius: 16,
                      padding: 16,
                      marginBottom: 12,
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div className="flex-between" style={{ marginBottom: 12 }}>
                      <div>
                        <span style={{ fontWeight: 700, fontSize: 14 }}>{order.id}</span>
                        <div style={{ fontSize: 11, color: '#9ca3af' }}>{order.date}</div>
                      </div>
                      <span style={{
                        background: statusStyle.bg,
                        color: statusStyle.color,
                        padding: '3px 10px',
                        borderRadius: 20,
                        fontSize: 11,
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4
                      }}>
                        <span>{statusStyle.icon}</span> {order.status}
                      </span>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <i className="bi bi-cart3" style={{ color: '#9ca3af' }} />
                      <span style={{ fontSize: 12, color: '#6b7280' }}>
                        {order.items?.length || 1} item(s)
                      </span>
                      <i className="bi bi-currency-rupee" style={{ color: '#9ca3af', marginLeft: 8 }} />
                      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--blue)' }}>
                        ₹{order.amount?.toLocaleString()}
                      </span>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <i className="bi bi-truck" style={{ color: '#9ca3af', fontSize: 12 }} />
                      <span style={{ fontSize: 11, color: estDelivery === 'Delivered' ? '#10b981' : '#f59e0b' }}>
                        {estDelivery === 'Delivered' ? '✓ Delivered' : estDelivery === 'Cancelled' ? '✕ Cancelled' : `🚚 ${estDelivery}`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Details Column */}
            {selectedOrder && (
              <div style={{
                background: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: 16,
                padding: 20,
                position: 'sticky',
                top: 100
              }}>
                <div className="flex-between" style={{ marginBottom: 16 }}>
                  <h5 style={{ margin: 0 }}>Order Details</h5>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#9ca3af' }}
                  >
                    ✕
                  </button>
                </div>

                {/* Order Info */}
                <div style={{ marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid #e2e8f0' }}>
                  <div className="flex-between" style={{ marginBottom: 8 }}>
                    <span style={{ color: '#6b7280', fontSize: 12 }}>Order ID</span>
                    <span style={{ fontWeight: 600, fontSize: 12 }}>{selectedOrder.id}</span>
                  </div>
                  <div className="flex-between" style={{ marginBottom: 8 }}>
                    <span style={{ color: '#6b7280', fontSize: 12 }}>Date</span>
                    <span style={{ fontWeight: 600, fontSize: 12 }}>{selectedOrder.date}</span>
                  </div>
                  <div className="flex-between" style={{ marginBottom: 8 }}>
                    <span style={{ color: '#6b7280', fontSize: 12 }}>Payment Method</span>
                    <span style={{ fontWeight: 600, fontSize: 12 }}>{selectedOrder.method || 'Wallet'}</span>
                  </div>
                  <div className="flex-between">
                    <span style={{ color: '#6b7280', fontSize: 12 }}>Total Amount</span>
                    <span style={{ fontWeight: 800, fontSize: 18, color: 'var(--blue)' }}>₹{selectedOrder.amount?.toLocaleString()}</span>
                  </div>
                </div>

                {/* Tracking Timeline */}
                <div style={{ marginBottom: 20 }}>
                  <h6 style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <i className="bi bi-truck" /> Tracking Status
                  </h6>
                  <div style={{ position: 'relative' }}>
                    {getTrackingSteps(selectedOrder.status).map((step, idx) => (
                      <div key={step.label} style={{ display: 'flex', marginBottom: 16, position: 'relative' }}>
                        {idx < getTrackingSteps(selectedOrder.status).length - 1 && (
                          <div style={{
                            position: 'absolute',
                            left: 10,
                            top: 28,
                            width: 2,
                            height: 40,
                            background: step.completed ? '#10b981' : '#e2e8f0'
                          }} />
                        )}
                        <div style={{
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          background: step.completed ? '#10b981' : '#f3f4f6',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: 12,
                          flexShrink: 0,
                          zIndex: 1
                        }}>
                          <span style={{ fontSize: 12, color: step.completed ? 'white' : '#9ca3af' }}>{step.icon}</span>
                        </div>
                        <div>
                          <div style={{ fontWeight: step.completed ? 700 : 500, fontSize: 13 }}>{step.label}</div>
                          {step.time && <div style={{ fontSize: 11, color: '#9ca3af' }}>{step.time}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Items List */}
                {selectedOrder.items && selectedOrder.items.length > 0 && (
                  <div style={{ marginBottom: 20 }}>
                    <h6 style={{ marginBottom: 12 }}>Items</h6>
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex-between" style={{ marginBottom: 8, padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                        <div>
                          <span style={{ fontSize: 13 }}>{item.icon || '📦'} {item.name}</span>
                          <div style={{ fontSize: 11, color: '#9ca3af' }}>Qty: {item.qty || 1}</div>
                        </div>
                        <span style={{ fontWeight: 600, fontSize: 13 }}>₹{(item.price * (item.qty || 1)).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: 12 }}>
                  {(selectedOrder.status === 'Processing' || selectedOrder.status === 'Confirmed') && (
                    <button
                      onClick={() => cancelOrder(selectedOrder.id)}
                      style={{
                        flex: 1,
                        padding: '10px',
                        borderRadius: 10,
                        border: '1px solid #ef4444',
                        background: 'white',
                        color: '#ef4444',
                        fontWeight: 600,
                        fontSize: 13,
                        cursor: 'pointer'
                      }}
                    >
                      ❌ Cancel Order
                    </button>
                  )}
                  
                  {(selectedOrder.status === 'Delivered' || selectedOrder.status === 'Cancelled') && (
                    <button
                      onClick={() => reorder(selectedOrder)}
                      style={{
                        flex: 1,
                        padding: '10px',
                        borderRadius: 10,
                        border: 'none',
                        background: 'linear-gradient(135deg, #667eea, #764ba2)',
                        color: 'white',
                        fontWeight: 600,
                        fontSize: 13,
                        cursor: 'pointer'
                      }}
                    >
                      🔄 Reorder
                    </button>
                  )}
                  
                  <button
                    onClick={() => {
                      // Share tracking link
                      const trackingLink = `https://symptocare.com/track/${selectedOrder.id}`;
                      navigator.clipboard?.writeText(trackingLink);
                      addToast('Tracking link copied!', 'success');
                    }}
                    style={{
                      padding: '10px 16px',
                      borderRadius: 10,
                      border: '1px solid #e2e8f0',
                      background: 'white',
                      color: '#64748b',
                      cursor: 'pointer'
                    }}
                  >
                    <i className="bi bi-share" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}