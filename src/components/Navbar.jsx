import React from 'react';
import { ShoppingBag, ShoppingCart, Clock } from 'lucide-react';

export default function Navbar({ cartCount, onOpenCart, onOpenOrders }) {
  return (
    <header className="navbar">
      <div className="nav-wrapper">
        <div className="brand">
          <div className="brand-icon">
            <ShoppingBag size={22} />
          </div>
          <span>ShopSphere</span>
        </div>

        <div className="nav-actions">
          <button 
            className="nav-btn" 
            onClick={onOpenOrders}
            title="View previous orders"
          >
            <Clock size={16} />
            <span>Orders</span>
          </button>

          <button 
            className="cart-nav-btn" 
            onClick={onOpenCart}
            aria-label="View shopping cart"
          >
            <ShoppingCart size={18} />
            <span>Cart</span>
            {cartCount > 0 && (
              <span className="cart-badge">{cartCount}</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
