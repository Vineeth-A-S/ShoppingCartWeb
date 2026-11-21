import React from 'react';
import { X, Package, Clock, CheckCircle } from 'lucide-react';

export default function OrdersModal({ isOpen, onClose, orders, isLoading }) {
  if (!isOpen) return null;

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '620px' }}>
        <div className="modal-header">
          <h2 className="modal-title">
            <Clock size={22} color="#3b82f6" />
            <span>Order History</span>
          </h2>
          <button className="drawer-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {isLoading ? (
          <div className="empty-state">
            <p className="empty-desc">Loading order history...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="empty-state" style={{ border: 'none' }}>
            <Package className="empty-icon" />
            <h3 className="empty-title">No orders placed yet</h3>
            <p className="empty-desc">Once you complete a checkout, your receipt will appear here.</p>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.id} className="order-history-card">
                <div className="order-history-header">
                  <div>
                    <span className="order-num">{order.orderNumber}</span>
                    <div className="order-date">
                      {new Date(order.createdAt).toLocaleString(undefined, {
                        dateStyle: 'medium',
                        timeStyle: 'short'
                      })}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '1.05rem', fontWeight: 800 }}>${order.totalAmount?.toFixed(2)}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10b981', fontSize: '0.75rem', fontWeight: 700 }}>
                      <CheckCircle size={12} /> Confirmed
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '8px' }}>
                  <strong>Customer:</strong> {order.customerName} ({order.email}) &bull; <strong>Paid with:</strong> {order.paymentMethod}
                </div>

                {/* Items in order */}
                {order.items && order.items.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', background: 'white', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    {order.items.map((item) => (
                      <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                        <span>{item.quantity}x {item.productName}</span>
                        <span style={{ fontWeight: 600 }}>${item.subtotal?.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
