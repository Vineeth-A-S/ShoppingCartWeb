import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, Tag, ArrowRight, ShoppingBag, CheckCircle, AlertCircle } from 'lucide-react';

export default function CartDrawer({
  isOpen,
  onClose,
  cartSummary,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onApplyCoupon,
  onProceedCheckout
}) {
  const [couponInput, setCouponInput] = useState('');

  if (!isOpen) return null;

  const items = cartSummary?.items || [];
  const totalItems = cartSummary?.totalItems || 0;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponInput.trim()) {
      onApplyCoupon(couponInput.trim());
    }
  };

  const handleQuickCoupon = (code) => {
    setCouponInput(code);
    onApplyCoupon(code);
  };

  return (
    <div className="overlay" onClick={onClose}>
      <aside className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="drawer-header">
          <div className="drawer-title-group">
            <h2 className="drawer-title">Shopping Cart</h2>
            <span className="drawer-badge">{totalItems} {totalItems === 1 ? 'item' : 'items'}</span>
          </div>
          <button className="drawer-close-btn" onClick={onClose} aria-label="Close cart">
            <X size={20} />
          </button>
        </div>

        {/* Items List */}
        {items.length === 0 ? (
          <div className="empty-state" style={{ margin: 'auto 20px', border: 'none' }}>
            <ShoppingBag className="empty-icon" />
            <h3 className="empty-title">Your cart is empty</h3>
            <p className="empty-desc">Explore our catalog and add items you love to get started.</p>
            <button className="pill-btn active" onClick={onClose}>
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="cart-items-list">
            {items.map((item) => (
              <div key={item.id} className="cart-item-card">
                <img
                  src={item.productImageUrl}
                  alt={item.productName}
                  className="cart-item-thumb"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80';
                  }}
                />

                <div className="cart-item-details">
                  <h4 className="cart-item-title" title={item.productName}>
                    {item.productName}
                  </h4>
                  <span className="cart-item-unit-price">${item.unitPrice.toFixed(2)} each</span>

                  <div className="cart-item-bottom">
                    <div className="cart-qty-stepper">
                      <button
                        className="cart-stepper-btn"
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        title="Decrease"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="cart-stepper-value">{item.quantity}</span>
                      <button
                        className="cart-stepper-btn"
                        disabled={item.quantity >= item.stockQuantity}
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        title={item.quantity >= item.stockQuantity ? "Stock limit reached" : "Increase"}
                      >
                        <Plus size={13} />
                      </button>
                    </div>

                    <span className="cart-item-total">${item.lineTotal.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  className="cart-item-delete-btn"
                  onClick={() => onRemoveItem(item.id)}
                  title="Remove from cart"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Summary Footer */}
        {items.length > 0 && (
          <div className="drawer-footer">
            {/* Promo / Coupon Code */}
            <div className="coupon-section">
              <form className="coupon-form" onSubmit={handleApplyCoupon}>
                <input
                  type="text"
                  placeholder="PROMO CODE"
                  className="coupon-input"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                />
                <button type="submit" className="apply-coupon-btn">
                  Apply
                </button>
              </form>

              <div className="coupon-chips">
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Try:</span>
                <span className="coupon-chip" onClick={() => handleQuickCoupon('SAVE10')}>SAVE10 (10% off)</span>
                <span className="coupon-chip" onClick={() => handleQuickCoupon('SAVE20')}>SAVE20 (20% off)</span>
                <span className="coupon-chip" onClick={() => handleQuickCoupon('FREESHIP')}>FREESHIP</span>
              </div>

              {cartSummary?.couponMessage && (
                <div className={`coupon-feedback ${cartSummary.couponApplied ? 'success' : 'error'}`}>
                  {cartSummary.couponApplied ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                  <span>{cartSummary.couponMessage}</span>
                </div>
              )}
            </div>

            {/* Price Calculations */}
            <div className="cost-breakdown">
              <div className="cost-row">
                <span>Subtotal</span>
                <span>${cartSummary.subtotal.toFixed(2)}</span>
              </div>

              {cartSummary.discount > 0 && (
                <div className="cost-row discount">
                  <span>Discount ({cartSummary.couponCode})</span>
                  <span>-${cartSummary.discount.toFixed(2)}</span>
                </div>
              )}

              <div className="cost-row">
                <span>Shipping</span>
                <span>
                  {cartSummary.shippingCost === 0 ? (
                    <span style={{ color: '#10b981', fontWeight: 600 }}>FREE</span>
                  ) : (
                    `$${cartSummary.shippingCost.toFixed(2)}`
                  )}
                </span>
              </div>

              <div className="cost-row">
                <span>Estimated Tax (8%)</span>
                <span>${cartSummary.tax.toFixed(2)}</span>
              </div>

              <div className="cost-row total">
                <span>Total</span>
                <span>${cartSummary.grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Actions */}
            <button className="checkout-btn" onClick={onProceedCheckout}>
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </button>

            <button className="clear-cart-text-btn" onClick={onClearCart}>
              Clear entire cart
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
