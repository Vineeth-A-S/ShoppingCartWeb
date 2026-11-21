import React from 'react';
import ProductCard from './ProductCard';
import { Search, X, PackageX } from 'lucide-react';

export default function ProductGrid({
  products,
  cartItems,
  categories,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onAddToCart,
  onUpdateQuantity,
  isLoading
}) {
  const cartMap = (cartItems || []).reduce((acc, item) => {
    acc[item.productId] = item;
    return acc;
  }, {});

  return (
    <div>
      {/* Search and Category Filter Toolbar */}
      <div className="filter-toolbar">
        <div className="search-wrapper">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            className="search-input"
            placeholder="Search products by name or details..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button
              className="clear-search-btn"
              onClick={() => onSearchChange('')}
              title="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="category-pills">
          <button
            className={`pill-btn ${selectedCategory === 'All' ? 'active' : ''}`}
            onClick={() => onSelectCategory('All')}
          >
            All Products
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`pill-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => onSelectCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid or Empty State */}
      {isLoading ? (
        <div className="empty-state">
          <p className="empty-desc">Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="empty-state">
          <PackageX className="empty-icon" />
          <h3 className="empty-title">No products found</h3>
          <p className="empty-desc">
            {searchQuery
              ? `No matches for "${searchQuery}". Try a different keyword.`
              : 'No products available in this category.'}
          </p>
          {(searchQuery || selectedCategory !== 'All') && (
            <button
              className="pill-btn active"
              onClick={() => {
                onSearchChange('');
                onSelectCategory('All');
              }}
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              cartItem={cartMap[product.id]}
              onAddToCart={onAddToCart}
              onUpdateQuantity={onUpdateQuantity}
            />
          ))}
        </div>
      )}
    </div>
  );
}
