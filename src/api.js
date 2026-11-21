const API_BASE = '/api';

export const api = {
  // Products
  async getProducts(category, search) {
    const params = new URLSearchParams();
    if (category && category !== 'All') params.append('category', category);
    if (search && search.trim()) params.append('search', search.trim());
    
    const query = params.toString() ? `?${params.toString()}` : '';
    const res = await fetch(`${API_BASE}/products${query}`);
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
  },

  async getCategories() {
    const res = await fetch(`${API_BASE}/products/categories`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
  },

  // Cart
  async getCart(couponCode) {
    const query = couponCode ? `?coupon=${encodeURIComponent(couponCode)}` : '';
    const res = await fetch(`${API_BASE}/cart${query}`);
    if (!res.ok) throw new Error('Failed to fetch cart');
    return res.json();
  },

  async addToCart(productId, quantity = 1) {
    const res = await fetch(`${API_BASE}/cart/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to add item to cart');
    }
    return res.json();
  },

  async updateQuantity(cartItemId, quantity) {
    const res = await fetch(`${API_BASE}/cart/items/${cartItemId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to update item quantity');
    }
    if (res.status === 204) return null;
    const text = await res.text();
    return text ? JSON.parse(text) : null;
  },

  async removeItem(cartItemId) {
    const res = await fetch(`${API_BASE}/cart/items/${cartItemId}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to remove item');
    return true;
  },

  async clearCart() {
    const res = await fetch(`${API_BASE}/cart`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to clear cart');
    return true;
  },

  // Orders
  async checkout(payload) {
    const res = await fetch(`${API_BASE}/orders/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Checkout failed');
    }
    return res.json();
  },

  async getOrders() {
    const res = await fetch(`${API_BASE}/orders`);
    if (!res.ok) throw new Error('Failed to fetch orders');
    return res.json();
  }
};
