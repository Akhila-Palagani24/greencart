import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FiSearch, FiShoppingCart, FiHeart, FiUser,
  FiMenu, FiX, FiChevronDown, FiPackage,
} from "react-icons/fi";
import { useApp } from "../../context/AppContext";
import { CATEGORIES } from "../../data/products";

const Navbar = () => {
  const { cartCount, wishlist, setSearchQuery, setIsCartOpen, user, orders } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const categoryRef = useRef(null);

  useEffect(() => {
    setMobileOpen(false);
    setCategoryOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target)) {
        setCategoryOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput);
    navigate(`/shop${searchInput ? `?search=${encodeURIComponent(searchInput)}` : ""}`);
    setMobileOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className={`sticky top-0 z-40 bg-white transition-all duration-200 ${scrolled ? "shadow-md" : "border-b border-gray-100"}`}>
      {/* Top announcement bar */}
      <div className="bg-primary-600 text-white text-center text-xs py-2 font-medium tracking-wide">
        🌿 Free delivery on orders above ₹500 &nbsp;·&nbsp; Fresh produce delivered within 2 hours
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3 lg:gap-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0 group">
            <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center shadow-sm group-hover:bg-primary-700 transition-colors">
              <span className="text-white text-lg">🛒</span>
            </div>
            <span className="text-xl font-extrabold text-gray-900 hidden sm:block">
              Green<span className="text-primary-600">Cart</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden lg:flex items-center gap-1 flex-shrink-0">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive("/") ? "bg-primary-50 text-primary-700" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"}`}
            >
              Home
            </Link>
            <Link
              to="/shop"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive("/shop") ? "bg-primary-50 text-primary-700" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"}`}
            >
              Shop
            </Link>

            {/* Categories dropdown */}
            <div className="relative" ref={categoryRef}>
              <button
                onClick={() => setCategoryOpen((o) => !o)}
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              >
                Categories
                <FiChevronDown size={14} className={`transition-transform duration-200 ${categoryOpen ? "rotate-180" : ""}`} />
              </button>
              {categoryOpen && (
                <div className="absolute top-full left-0 mt-1.5 w-60 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50 animate-fade-in">
                  {CATEGORIES.map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/shop?category=${cat.id}`}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-primary-50 text-sm text-gray-700 hover:text-primary-700 transition-colors"
                      onClick={() => setCategoryOpen(false)}
                    >
                      <span className="text-xl w-7 text-center">{cat.icon}</span>
                      <span className="font-medium">{cat.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Search bar (desktop) */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg">
            <div className={`relative w-full transition-all duration-200 ${searchFocused ? "scale-[1.02]" : ""}`}>
              <FiSearch
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                placeholder="Search fresh produce, dairy, snacks..."
                className="w-full bg-gray-50 border border-gray-200 rounded-full pl-10 pr-12 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent focus:bg-white transition-all"
              />
              {searchInput && (
                <button
                  type="submit"
                  className="absolute right-1 top-1/2 -translate-y-1/2 bg-primary-600 hover:bg-primary-700 text-white p-1.5 rounded-full transition-colors"
                >
                  <FiSearch size={14} />
                </button>
              )}
            </div>
          </form>

          {/* Right icons */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <Link
              to="/wishlist"
              className="relative p-2.5 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-colors hidden sm:flex items-center"
              aria-label="Wishlist"
            >
              <FiHeart size={20} />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {wishlist.length > 9 ? "9+" : wishlist.length}
                </span>
              )}
            </Link>

            <Link
              to="/account"
              className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-colors"
              aria-label="Account"
            >
              {user ? (
                <>
                  <div className="w-7 h-7 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs font-bold">
                    {user.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-xs text-gray-400 leading-none">Hello,</p>
                    <p className="text-sm font-semibold text-gray-800 leading-tight max-w-[80px] truncate">{user.name}</p>
                  </div>
                </>
              ) : (
                <>
                  <FiUser size={20} />
                  <span className="text-sm font-medium hidden lg:block">Login</span>
                </>
              )}
            </Link>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-colors shadow-sm"
              aria-label="Cart"
            >
              <FiShoppingCart size={18} />
              {cartCount > 0 && (
                <span className="text-sm font-bold hidden sm:block">{cartCount}</span>
              )}
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-accent text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center sm:hidden">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              className="lg:hidden p-2.5 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Menu"
            >
              {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        <form onSubmit={handleSearch} className="md:hidden pb-3">
          <div className="relative w-full">
            <FiSearch size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search products..."
              className="w-full bg-gray-50 border border-gray-200 rounded-full pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:bg-white"
            />
          </div>
        </form>
      </div>

      {/* Mobile menu panel */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-1">
            <Link to="/" className="px-3 py-3 rounded-xl hover:bg-gray-50 text-sm font-medium text-gray-700 flex items-center gap-2">
              🏠 Home
            </Link>
            <Link to="/shop" className="px-3 py-3 rounded-xl hover:bg-gray-50 text-sm font-medium text-gray-700 flex items-center gap-2">
              🛍️ Shop All
            </Link>
            <Link to="/wishlist" className="px-3 py-3 rounded-xl hover:bg-gray-50 text-sm font-medium text-gray-700 flex items-center justify-between">
              <span className="flex items-center gap-2">❤️ Wishlist</span>
              {wishlist.length > 0 && (
                <span className="bg-red-100 text-red-600 text-xs font-bold rounded-full px-2 py-0.5">
                  {wishlist.length}
                </span>
              )}
            </Link>
            {user && (
              <Link to="/account" className="px-3 py-3 rounded-xl hover:bg-gray-50 text-sm font-medium text-gray-700 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <FiPackage size={16} /> My Orders
                </span>
                {orders.length > 0 && (
                  <span className="bg-primary-100 text-primary-700 text-xs font-bold rounded-full px-2 py-0.5">
                    {orders.length}
                  </span>
                )}
              </Link>
            )}
            <Link to="/account" className="px-3 py-3 rounded-xl hover:bg-gray-50 text-sm font-medium text-gray-700 flex items-center gap-2">
              <FiUser size={16} /> {user ? `Hi, ${user.name}` : "Login / Sign Up"}
            </Link>
            <div className="border-t border-gray-100 my-2" />
            <p className="px-3 py-1 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              Categories
            </p>
            <div className="grid grid-cols-2 gap-1">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/shop?category=${cat.id}`}
                  className="px-3 py-2.5 rounded-xl hover:bg-primary-50 text-sm text-gray-700 hover:text-primary-700 flex items-center gap-2"
                >
                  <span className="text-base">{cat.icon}</span> {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
