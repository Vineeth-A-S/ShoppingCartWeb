import React, { useState } from 'react';
import { X, CreditCard, DollarSign, Wallet, ShieldCheck, Loader2 } from 'lucide-react';

export default function CheckoutModal({ isOpen, onClose, cartSummary, onPlaceOrder, isSubmitting }) {
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    shippingAddress: '',
    paymentMethod: 'Credit Card'
  });

  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.customerName.trim()) newErrors.customerName = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.shippingAddress.trim()) newErrors.shippingAddress = 'Shipping address is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onPlaceOrder({
      ...formData,
      couponCode: cartSummary?.couponCode || ''
    });
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            <ShieldCheck size={22} color="#3b82f6" />
            <span>Secure Checkout</span>
          </h2>
          <button className="drawer-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Contact Details */}
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="customerName"
              placeholder="e.g. Alex Johnson"
              value={formData.customerName}
              onChange={handleChange}
            />
            {errors.customerName && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{errors.customerName}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="alex@example.com"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{errors.email}</span>}
          </div>

          {/* Shipping Address */}
          <div className="form-group">
            <label className="form-label">Shipping Address</label>
            <textarea
              name="shippingAddress"
              rows="2"
              placeholder="123 Innovation Way, Apt 4B, San Francisco, CA"
              value={formData.shippingAddress}
              onChange={handleChange}
            />
            {errors.shippingAddress && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{errors.shippingAddress}</span>}
          </div>

          {/* Payment Method Selection */}
          <div className="form-group">
            <label className="form-label">Payment Method</label>
            <div className="payment-options">
              <button
                type="button"
                className={`payment-btn ${formData.paymentMethod === 'Credit Card' ? 'selected' : ''}`}
                onClick={() => setFormData((prev) => ({ ...prev, paymentMethod: 'Credit Card' }))}
              >
                <CreditCard size={18} />
                <span>Credit Card</span>
              </button>
              <button
                type="button"
                className={`payment-btn ${formData.paymentMethod === 'PayPal' ? 'selected' : ''}`}
                onClick={() => setFormData((prev) => ({ ...prev, paymentMethod: 'PayPal' }))}
              >
                <Wallet size={18} />
                <span>PayPal</span>
              </button>
              <button
                type="button"
                className={`payment-btn ${formData.paymentMethod === 'Cash on Delivery' ? 'selected' : ''}`}
                onClick={() => setFormData((prev) => ({ ...prev, paymentMethod: 'Cash on Delivery' }))}
              >
                <DollarSign size={18} />
                <span>Cash on Delivery</span>
              </button>
            </div>
          </div>

          {/* Mini Cost Summary */}
          <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', margin: '20px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '6px' }}>
              <span style={{ color: '#64748b' }}>Total Items:</span>
              <span style={{ fontWeight: 600 }}>{cartSummary?.totalItems || 0}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 800 }}>
              <span>Payable Amount:</span>
              <span style={{ color: '#2563eb' }}>${cartSummary?.grandTotal?.toFixed(2) || '0.00'}</span>
            </div>
          </div>

          <button type="submit" className="checkout-btn" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Processing Order...</span>
              </>
            ) : (
              <span>Place Order (${cartSummary?.grandTotal?.toFixed(2) || '0.00'})</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
