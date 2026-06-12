import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FiSearch,
  FiShoppingCart,
  FiHeart,
  FiUser,
  FiMenu,
  FiX,
  FiChevronDown,
} from "react-icons/fi";
import { useApp } from "../../context/AppContext";
import { CATEGORIES } from "../../data/products";

const Navbar = () => {
  const { cartCount, wishlist, setSearchQuery, setIsCartOpen, user } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const categoryRef = useRef(null);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setCategoryOpen(false);
  }, [location.pathname]);

  // Navbar shadow on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close category dropdown on outside click
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

  const navLinkClass = (path) =>
    `text-sm font-medium transition-colors hover:text-primary-600 ${
      location.pathname === path ? "text-primary-600" : "text-gray-700"
    }`;

  return (
    <header
      className={`sticky top-0 z-40 bg-white transition-shadow ${
        scrolled ? "shadow-md" : "shadow-sm"
      }`}
    >
      <div className="container-px">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <span className="text-2xl">🛒</span>
            <span className="text-xl font-extrabold text-gray-900">
              Green<span className="text-primary-600">Cart</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden lg:flex items-center gap-6 flex-shrink-0">
            <Link to="/" className={navLinkClass("/")}>
              Home
            </Link>
            <Link to="/shop" className={navLinkClass("/shop")}>
              Shop
            </Link>

            {/* Categories dropdown */}
            <div className="relative" ref={categoryRef}>
              <button
                onClick={() => setCategoryOpen((o) => !o)}
                className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
              >
                Categories <FiChevronDown className={`transition-transform ${categoryOpen ? "rotate-180" : ""}`} />
              </button>
              {categoryOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 p-2 animate-fade-in z-50">
                  {CATEGORIES.map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/shop?category=${cat.id}`}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary-50 text-sm text-gray-700 hover:text-primary-700 transition-colors"
                      onClick={() => setCategoryOpen(false)}
                    >
                      <span className="text-lg">{cat.icon}</span>
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Search bar (desktop) */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md">
            <div className="relative w-full">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search for products..."
                className="w-full border border-gray-200 bg-gray-50 rounded-full pl-4 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
              />
              <button
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-gray-500 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                aria-label="Search"
              >
                <FiSearch size={18} />
              </button>
            </div>
          </form>

          {/* Right icons */}
          <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
            <Link
              to="/wishlist"
              className="relative p-2 text-gray-700 hover:text-primary-600 transition-colors hidden sm:block"
              aria-label="Wishlist"
            >
              <FiHeart size={20} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <Link
              to="/account"
              className="p-2 text-gray-700 hover:text-primary-600 transition-colors hidden sm:block"
              aria-label="Account"
            >
              <div className="flex items-center gap-1.5">
                <FiUser size={20} />
                {user && <span className="text-xs font-medium max-w-[80px] truncate">{user.name}</span>}
              </div>
            </Link>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-gray-700 hover:text-primary-600 transition-colors"
              aria-label="Cart"
            >
              <FiShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              className="lg:hidden p-2 text-gray-700"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Menu"
            >
              {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        <form onSubmit={handleSearch} className="md:hidden pb-3">
          <div className="relative w-full">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search for products..."
              className="w-full border border-gray-200 bg-gray-50 rounded-full pl-4 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-gray-500"
              aria-label="Search"
            >
              <FiSearch size={18} />
            </button>
          </div>
        </form>
      </div>

      {/* Mobile menu panel */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white animate-slide-up">
          <div className="container-px py-3 flex flex-col gap-1">
            <Link to="/" className="px-2 py-2.5 rounded-lg hover:bg-primary-50 text-sm font-medium text-gray-700">
              Home
            </Link>
            <Link to="/shop" className="px-2 py-2.5 rounded-lg hover:bg-primary-50 text-sm font-medium text-gray-700">
              Shop All
            </Link>
            <Link to="/wishlist" className="px-2 py-2.5 rounded-lg hover:bg-primary-50 text-sm font-medium text-gray-700 flex items-center justify-between">
              Wishlist
              {wishlist.length > 0 && (
                <span className="bg-accent text-white text-xs font-bold rounded-full px-2 py-0.5">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <Link to="/account" className="px-2 py-2.5 rounded-lg hover:bg-primary-50 text-sm font-medium text-gray-700">
              {user ? `Hi, ${user.name}` : "Login / Sign Up"}
            </Link>
            <div className="border-t border-gray-100 my-1" />
            <p className="px-2 pt-1 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wide">
              Categories
            </p>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                to={`/shop?category=${cat.id}`}
                className="px-2 py-2 rounded-lg hover:bg-primary-50 text-sm text-gray-700 flex items-center gap-2"
              >
                <span>{cat.icon}</span> {cat.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
