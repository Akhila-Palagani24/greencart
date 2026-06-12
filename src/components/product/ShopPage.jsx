import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { FiFilter, FiX, FiChevronDown, FiSearch } from "react-icons/fi";
import { useApp } from "../../context/AppContext";
import { CATEGORIES } from "../../data/products";
import ProductCard from "./ProductCard";

const SORT_OPTIONS = [
  { value: "default", label: "Default" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "name", label: "Name (A-Z)" },
];

const ShopPage = () => {
  const { getFilteredProducts, setSearchQuery } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();

  const category = searchParams.get("category") || "all";
  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "default";

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(search);
  const [priceRange, setPriceRange] = useState(500);

  useEffect(() => {
    setSearchQuery(search);
    setLocalSearch(search);
  }, [search, setSearchQuery]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value === "all" || value === "default" || !value) {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setSearchParams(next);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParam("search", localSearch);
  };

  const products = useMemo(() => {
    let result = getFilteredProducts({ category, search, sort });
    result = result.filter((p) => p.price <= priceRange);
    return result;
  }, [getFilteredProducts, category, search, sort, priceRange]);

  const activeCategory = CATEGORIES.find((c) => c.id === category);

  return (
    <div className="container-px py-6 sm:py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
          {search ? `Search results for "${search}"` : activeCategory ? activeCategory.name : "All Products"}
        </h1>
        <p className="text-sm text-gray-500">{products.length} products found</p>
      </div>

      <div className="flex gap-6">
        {/* ── Sidebar (desktop) ──────────────────────────── */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="card p-5 sticky top-20">
            <h3 className="font-bold text-gray-900 mb-3">Search</h3>
            <form onSubmit={handleSearchSubmit} className="mb-6 relative">
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search products..."
                className="input-field pr-9 text-sm"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-600">
                <FiSearch size={16} />
              </button>
            </form>

            <h3 className="font-bold text-gray-900 mb-3">Categories</h3>
            <div className="space-y-1 mb-6">
              <button
                onClick={() => updateParam("category", "all")}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  category === "all" ? "bg-primary-100 text-primary-700 font-semibold" : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                All Products
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => updateParam("category", cat.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                    category === cat.id ? "bg-primary-100 text-primary-700 font-semibold" : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span>{cat.icon}</span> {cat.name}
                </button>
              ))}
            </div>

            <h3 className="font-bold text-gray-900 mb-3">Max Price: ₹{priceRange}</h3>
            <input
              type="range"
              min="0"
              max="500"
              step="10"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full accent-primary-600"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>₹0</span>
              <span>₹500+</span>
            </div>
          </div>
        </aside>

        {/* ── Main content ───────────────────────────────── */}
        <div className="flex-1 min-w-0">
          {/* Mobile category tabs */}
          <div className="lg:hidden flex gap-2 overflow-x-auto no-scrollbar pb-3 mb-2 -mx-1 px-1">
            <button
              onClick={() => updateParam("category", "all")}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                category === "all" ? "bg-primary-600 text-white" : "bg-white border border-gray-200 text-gray-600"
              }`}
            >
              All
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => updateParam("category", cat.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  category === cat.id ? "bg-primary-600 text-white" : "bg-white border border-gray-200 text-gray-600"
                }`}
              >
                <span>{cat.icon}</span> {cat.name}
              </button>
            ))}
          </div>

          {/* Toolbar */}
          <div className="flex items-center justify-between mb-4 gap-3">
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 text-sm font-medium border border-gray-200 bg-white rounded-full px-4 py-2"
            >
              <FiFilter size={14} /> Filters
            </button>

            <div className="relative ml-auto">
              <select
                value={sort}
                onChange={(e) => updateParam("sort", e.target.value)}
                className="appearance-none border border-gray-200 bg-white rounded-full pl-4 pr-9 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    Sort: {opt.label}
                  </option>
                ))}
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
            </div>
          </div>

          {/* Product grid */}
          {products.length === 0 ? (
            <div className="text-center py-20">
              <span className="text-5xl block mb-4">🔍</span>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No products found</h3>
              <p className="text-sm text-gray-500 mb-4">Try adjusting your filters or search term.</p>
              <button
                onClick={() => {
                  setSearchParams({});
                  setPriceRange(500);
                }}
                className="btn-outline"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-5">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Mobile filter drawer ─────────────────────────── */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileFiltersOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-5 max-h-[80vh] overflow-y-auto animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Filters</h3>
              <button onClick={() => setMobileFiltersOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <FiX size={20} />
              </button>
            </div>

            <h4 className="font-semibold text-sm text-gray-700 mb-2">Categories</h4>
            <div className="grid grid-cols-2 gap-2 mb-5">
              <button
                onClick={() => updateParam("category", "all")}
                className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                  category === "all" ? "bg-primary-100 text-primary-700 font-semibold" : "bg-gray-50 text-gray-600"
                }`}
              >
                All Products
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => updateParam("category", cat.id)}
                  className={`px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                    category === cat.id ? "bg-primary-100 text-primary-700 font-semibold" : "bg-gray-50 text-gray-600"
                  }`}
                >
                  <span>{cat.icon}</span> {cat.name}
                </button>
              ))}
            </div>

            <h4 className="font-semibold text-sm text-gray-700 mb-2">Max Price: ₹{priceRange}</h4>
            <input
              type="range"
              min="0"
              max="500"
              step="10"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full accent-primary-600 mb-5"
            />

            <button onClick={() => setMobileFiltersOpen(false)} className="btn-primary w-full">
              Show {products.length} Results
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopPage;
