import React from 'react';
import { ShoppingCart, Star, Plus, Minus, Check } from 'lucide-react';

export default function ProductCard({ product, cartItem, onAddToCart, onUpdateQuantity }) {
  const isOutOfStock = product.stockQuantity <= 0;
  const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= 5;
  const inCartQty = cartItem ? cartItem.quantity : 0;

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="product-image"
          loading="lazy"
          onError={(e) => {
            // fallback placeholder if remote image is unreachable
            e.target.src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80';
          }}
        />
        <span className="category-badge">{product.category}</span>
        {product.rating && (
          <span className="rating-badge">
            <Star size={12} fill="#fbbf24" stroke="#fbbf24" />
            {product.rating.toFixed(1)}
          </span>
        )}
      </div>

      <div className="product-body">
        <h3 className="product-name" title={product.name}>{product.name}</h3>
        <p className="product-desc" title={product.description}>{product.description}</p>

        <div className="product-footer">
          <div className="price-stock-row">
            <span className="product-price">${product.price.toFixed(2)}</span>
            
            {isOutOfStock ? (
              <span className="stock-tag stock-out">Out of Stock</span>
            ) : isLowStock ? (
              <span className="stock-tag stock-low">Only {product.stockQuantity} left</span>
            ) : (
              <span className="stock-tag stock-in">In Stock ({product.stockQuantity})</span>
            )}
          </div>

          {inCartQty > 0 ? (
            <div className="in-cart-indicator">
              <span className="in-cart-text">
                <Check size={14} /> In Cart ({inCartQty})
              </span>
              <div className="in-cart-controls">
                <button
                  className="stepper-btn"
                  onClick={() => cartItem?.id && onUpdateQuantity(cartItem.id, inCartQty - 1)}
                  title="Decrease quantity"
                  aria-label="Decrease quantity"
                >
                  <Minus size={12} />
                </button>
                <span className="stepper-count">{inCartQty}</span>
                <button
                  className="stepper-btn"
                  disabled={inCartQty >= product.stockQuantity}
                  onClick={() => cartItem?.id && onUpdateQuantity(cartItem.id, inCartQty + 1)}
                  title={inCartQty >= product.stockQuantity ? "Maximum stock reached" : "Increase quantity"}
                  aria-label="Increase quantity"
                >
                  <Plus size={12} />
                </button>
              </div>
            </div>
          ) : (
            <button
              className="add-to-cart-btn"
              disabled={isOutOfStock}
              onClick={() => onAddToCart(product.id, 1)}
            >
              <ShoppingCart size={16} />
              <span>{isOutOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
