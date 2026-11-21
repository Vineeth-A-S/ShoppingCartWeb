import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import ProductGrid from './components/ProductGrid';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import OrderConfirmationModal from './components/OrderConfirmationModal';
import OrdersModal from './components/OrdersModal';
import Toast from './components/Toast';
import { api } from './api';
import { Sparkles } from 'lucide-react';

export default function App() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [cartSummary, setCartSummary] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  const [orders, setOrders] = useState([]);

  // Modals & Drawers state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  // Loading states
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Fetch Products
  const loadProducts = useCallback(async (cat, search) => {
    setIsLoadingProducts(true);
    try {
      const data = await api.getProducts(cat, search);
      setProducts(data);
    } catch (err) {
      addToast(err.message || 'Error loading products', 'error');
    } finally {
      setIsLoadingProducts(false);
    }
  }, []);

  // Fetch Categories
  const loadCategories = async () => {
    try {
      const cats = await api.getCategories();
      setCategories(cats);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch Cart
  const loadCart = useCallback(async (coupon) => {
    try {
      const summary = await api.getCart(coupon);
      setCartSummary(summary);
    } catch (err) {
      console.error('Failed to load cart', err);
    }
  }, []);

  // Fetch Orders
  const loadOrders = async () => {
    setIsLoadingOrders(true);
    try {
      const data = await api.getOrders();
      setOrders(data);
    } catch (err) {
      addToast('Failed to load order history', 'error');
    } finally {
      setIsLoadingOrders(false);
    }
  };

  useEffect(() => {
    loadCategories();
    loadCart(couponCode);
  }, []);

  useEffect(() => {
    loadProducts(selectedCategory, searchQuery);
  }, [selectedCategory, searchQuery, loadProducts]);

  // Cart Handlers
  const handleAddToCart = async (productId, qty = 1) => {
    try {
      await api.addToCart(productId, qty);
      await loadCart(couponCode);
      addToast('Added to cart!', 'success');
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleUpdateQuantity = async (cartItemId, qty) => {
    try {
      await api.updateQuantity(cartItemId, qty);
      await loadCart(couponCode);
      if (qty === 0) {
        addToast('Item removed from cart', 'info');
      }
    } catch (err) {
      await loadCart(couponCode);
      addToast(err.message, 'error');
    }
  };

  const handleRemoveItem = async (cartItemId) => {
    try {
      await api.removeItem(cartItemId);
      await loadCart(couponCode);
      addToast('Item removed', 'info');
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      try {
        await api.clearCart();
        await loadCart(couponCode);
        addToast('Cart cleared', 'info');
      } catch (err) {
        addToast(err.message, 'error');
      }
    }
  };

  const handleApplyCoupon = (code) => {
    setCouponCode(code);
    loadCart(code);
  };

  // Checkout Handler
  const handleProceedCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handlePlaceOrder = async (orderPayload) => {
    setIsSubmittingOrder(true);
    try {
      const order = await api.checkout(orderPayload);
      setIsCheckoutOpen(false);
      setConfirmedOrder(order);
      setCouponCode('');
      await loadCart('');
      await loadProducts(selectedCategory, searchQuery); // refresh stock numbers
      addToast('Order placed successfully!', 'success');
    } catch (err) {
      addToast(err.message || 'Checkout failed', 'error');
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  const handleOpenOrders = () => {
    setIsOrdersOpen(true);
    loadOrders();
  };

  return (
    <div className="app-container">
      <Navbar
        cartCount={cartSummary?.totalItems || 0}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenOrders={handleOpenOrders}
      />

      <main className="main-content">
        {/* Hero Section */}
        <div className="hero-section">
          <div className="hero-tag">
            <Sparkles size={14} /> Full-Stack Shopping Experience
          </div>
          <h1 className="hero-title">Discover Premium Tech & Gear</h1>
          <p className="hero-subtitle">
            Browse our curated collection with real-time stock availability, instant cart calculations, and flexible checkout.
          </p>
        </div>

        {/* Product Grid & Search */}
        <ProductGrid
          products={products}
          cartItems={cartSummary?.items || []}
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onAddToCart={handleAddToCart}
          onUpdateQuantity={handleUpdateQuantity}
          isLoading={isLoadingProducts}
        />
      </main>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartSummary={cartSummary}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onApplyCoupon={handleApplyCoupon}
        onProceedCheckout={handleProceedCheckout}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartSummary={cartSummary}
        onPlaceOrder={handlePlaceOrder}
        isSubmitting={isSubmittingOrder}
      />

      {/* Order Confirmation */}
      <OrderConfirmationModal
        order={confirmedOrder}
        onClose={() => setConfirmedOrder(null)}
        onOpenOrders={handleOpenOrders}
      />

      {/* Order History */}
      <OrdersModal
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
        orders={orders}
        isLoading={isLoadingOrders}
      />

      {/* Toast Notifications */}
      <Toast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
