import React from 'react';
import { CheckCircle2, PackageCheck, ArrowRight, ExternalLink } from 'lucide-react';

export default function OrderConfirmationModal({ order, onClose, onOpenOrders }) {
  if (!order) return null;

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ textAlign: 'center' }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: '#ecfdf5',
          color: '#10b981',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px'
        }}>
          <CheckCircle2 size={36} />
        </div>

        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '6px' }}>Order Confirmed!</h2>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '20px' }}>
          Thank you, <strong>{order.customerName}</strong>. Your order has been placed successfully.
        </p>

        {/* Receipt card */}
        <div style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '16px',
          textAlign: 'left',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Order Number</span>
            <span style={{ fontWeight: 700, color: '#3b82f6' }}>{order.orderNumber}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Payment Method</span>
            <span style={{ fontWeight: 600 }}>{order.paymentMethod}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Delivery Address</span>
            <span style={{ fontWeight: 500, fontSize: '0.85rem', textAlign: 'right', maxWidth: '240px' }}>
              {order.shippingAddress}
            </span>
          </div>

          <div style={{
            borderTop: '1px dashed #cbd5e1',
            paddingTop: '10px',
            marginTop: '10px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ fontWeight: 700 }}>Total Paid</span>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
              ${order.totalAmount?.toFixed(2)}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            className="nav-btn"
            style={{ flex: 1, justifyContent: 'center' }}
            onClick={() => {
              onClose();
              if (onOpenOrders) onOpenOrders();
            }}
          >
            <PackageCheck size={16} />
            <span>View All Orders</span>
          </button>

          <button
            className="checkout-btn"
            style={{ flex: 1 }}
            onClick={onClose}
          >
            <span>Continue Shopping</span>
          </button>
        </div>
      </div>
    </div>
  );
}
