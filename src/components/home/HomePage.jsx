import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { FiChevronLeft, FiChevronRight, FiArrowRight, FiStar, FiTruck, FiShield, FiRefreshCw, FiHeadphones } from "react-icons/fi";
import { useApp } from "../../context/AppContext";
import { CATEGORIES, BANNERS, TESTIMONIALS } from "../../data/products";
import ProductCard from "../product/ProductCard";

const FEATURES = [
  { icon: FiTruck, title: "Free Delivery", desc: "On orders above ₹500", color: "bg-green-50 text-green-600" },
  { icon: FiShield, title: "100% Fresh", desc: "Farm to doorstep guarantee", color: "bg-blue-50 text-blue-600" },
  { icon: FiRefreshCw, title: "Easy Returns", desc: "Hassle-free within 24h", color: "bg-purple-50 text-purple-600" },
  { icon: FiHeadphones, title: "24/7 Support", desc: "Always here to help", color: "bg-orange-50 text-orange-600" },
];

const HomePage = () => {
  const { products } = useApp();
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setSlide((s) => (s + 1) % BANNERS.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = useCallback((idx) => setSlide(idx), []);
  const prevSlide = () => setSlide((s) => (s - 1 + BANNERS.length) % BANNERS.length);
  const nextSlide = () => setSlide((s) => (s + 1) % BANNERS.length);

  const featured = products.filter((p) => p.badge).slice(0, 8);
  const topRated = [...products].sort((a, b) => b.rating - a.rating).slice(0, 4);
  const organic = products.filter((p) => p.category === "organic" || p.tags?.includes("organic")).slice(0, 4);

  return (
    <div className="bg-gray-50">
      {/* ── HERO CAROUSEL ─────────────────────────────────── */}
      <section className="relative">
        <div className="relative h-[280px] sm:h-[400px] lg:h-[520px] overflow-hidden">
          {BANNERS.map((banner, idx) => (
            <div
              key={banner.id}
              className={`absolute inset-0 transition-all duration-700 ${idx === slide ? "opacity-100 scale-100" : "opacity-0 scale-105"}`}
            >
              <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
              <div className="absolute inset-0 flex items-center">
                <div className="max-w-7xl mx-auto px-6 sm:px-8 w-full">
                  <div className={`max-w-lg text-white transition-all duration-700 ${idx === slide ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
                    <span className="inline-block bg-primary-500/80 backdrop-blur text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-4">
                      {banner.tag || "New Arrivals"}
                    </span>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-3 leading-tight drop-shadow">
                      {banner.title}
                    </h1>
                    <p className="text-sm sm:text-base text-gray-200 mb-6 leading-relaxed">{banner.subtitle}</p>
                    <div className="flex flex-wrap gap-3">
                      <Link
                        to={banner.link}
                        className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white font-bold px-6 py-3 rounded-full transition-all shadow-lg hover:shadow-primary-500/30 hover:scale-105"
                      >
                        {banner.cta} <FiArrowRight />
                      </Link>
                      <Link
                        to="/shop"
                        className="inline-flex items-center gap-2 bg-white/20 backdrop-blur hover:bg-white/30 text-white font-semibold px-6 py-3 rounded-full transition-all border border-white/30"
                      >
                        Browse All
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <button onClick={prevSlide} aria-label="Previous" className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur text-white p-2.5 rounded-full transition-all hover:scale-110">
            <FiChevronLeft size={20} />
          </button>
          <button onClick={nextSlide} aria-label="Next" className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur text-white p-2.5 rounded-full transition-all hover:scale-110">
            <FiChevronRight size={20} />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {BANNERS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                className={`rounded-full transition-all duration-300 ${idx === slide ? "w-8 h-2.5 bg-white" : "w-2.5 h-2.5 bg-white/50 hover:bg-white/75"}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES STRIP ────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10 mb-10">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 grid grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div
                key={idx}
                className={`flex items-center gap-4 p-5 sm:p-6 ${idx < FEATURES.length - 1 ? "border-b lg:border-b-0 border-r-0 lg:border-r border-gray-100 even:border-r-0 lg:even:border-r" : ""}`}
              >
                <div className={`w-11 h-11 rounded-xl ${f.color} flex items-center justify-center flex-shrink-0`}>
                  <Icon size={20} />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{f.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{f.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── SHOP BY CATEGORY ──────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs font-bold text-primary-600 uppercase tracking-widest mb-1">Browse</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Shop by Category</h2>
          </div>
          <Link to="/shop" className="flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors">
            All categories <FiArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              to={`/shop?category=${cat.id}`}
              className="group flex flex-col items-center gap-2.5 p-3 sm:p-4 bg-white rounded-2xl border border-gray-100 hover:border-primary-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              <span className="text-2xl sm:text-3xl group-hover:scale-110 transition-transform duration-200">{cat.icon}</span>
              <span className="text-xs sm:text-sm font-semibold text-gray-700 group-hover:text-primary-700 text-center transition-colors leading-tight">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ──────────────────────────────── */}
      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs font-bold text-primary-600 uppercase tracking-widest mb-1">Handpicked</p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Featured Products</h2>
            </div>
            <Link to="/shop" className="flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700">
              View all <FiArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {featured.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {/* ── PROMOTIONAL BANNER ──────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="relative overflow-hidden bg-gradient-to-r from-primary-700 via-primary-600 to-emerald-500 rounded-3xl p-8 sm:p-12 text-white">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-1/3 w-40 h-40 bg-white/5 rounded-full translate-y-1/2" />
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <span className="inline-block bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-3">Limited Time</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold mb-2 leading-tight">Fresh Organic Box</h2>
              <p className="text-primary-100 text-sm sm:text-base max-w-xs">Curated selection of 12 organic seasonal vegetables. Farm-fresh, zero chemicals.</p>
              <div className="flex items-baseline gap-3 mt-4">
                <span className="text-3xl font-black">₹449</span>
                <span className="text-lg line-through text-primary-200">₹699</span>
                <span className="bg-accent text-white text-xs font-bold px-2 py-0.5 rounded-full">36% OFF</span>
              </div>
            </div>
            <Link
              to="/shop?category=organic"
              className="flex-shrink-0 inline-flex items-center gap-2 bg-white text-primary-700 font-bold px-8 py-4 rounded-2xl hover:bg-primary-50 transition-all shadow-lg hover:scale-105"
            >
              Shop Now <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* ── TOP RATED ──────────────────────────────── */}
      {topRated.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs font-bold text-yellow-500 uppercase tracking-widest mb-1">★ Customer Favourites</p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Top Rated</h2>
            </div>
            <Link to="/shop?sort=rating" className="flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700">
              See all <FiArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {topRated.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {/* ── TESTIMONIALS ──────────────────────────────── */}
      {TESTIMONIALS && TESTIMONIALS.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="text-center mb-8">
            <p className="text-xs font-bold text-primary-600 uppercase tracking-widest mb-2">Reviews</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">What Our Customers Say</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {TESTIMONIALS.slice(0, 3).map((t, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FiStar key={i} size={14} className={i < (t.rating || 5) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold text-sm">
                    {t.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.location || "Verified buyer"}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── CTA SECTION ──────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="bg-gray-900 rounded-3xl p-8 sm:p-14 text-center">
          <p className="text-xs font-bold text-primary-400 uppercase tracking-widest mb-3">Start Fresh</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Ready to eat healthier?</h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">Discover 500+ fresh products sourced directly from local farmers. No middlemen, just freshness.</p>
          <Link to="/shop" className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white font-bold px-8 py-4 rounded-2xl transition-all hover:scale-105 shadow-lg hover:shadow-primary-500/20">
            Explore the Store <FiArrowRight />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
