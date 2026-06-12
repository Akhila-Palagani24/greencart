import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { FiChevronLeft, FiChevronRight, FiStar, FiArrowRight } from "react-icons/fi";
import { useApp } from "../../context/AppContext";
import { CATEGORIES, BANNERS, FEATURES, TESTIMONIALS } from "../../data/products";
import ProductCard from "../product/ProductCard";

const HomePage = () => {
  const { products } = useApp();
  const [slide, setSlide] = useState(0);

  // Auto-rotate hero
  useEffect(() => {
    const timer = setInterval(() => {
      setSlide((s) => (s + 1) % BANNERS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = useCallback((idx) => setSlide(idx), []);
  const prevSlide = () => setSlide((s) => (s - 1 + BANNERS.length) % BANNERS.length);
  const nextSlide = () => setSlide((s) => (s + 1) % BANNERS.length);

  // Product sections
  const featured = products.filter((p) => p.badge).slice(0, 8);
  const organic = products.filter((p) => p.category === "organic" || p.tags?.includes("organic")).slice(0, 4);
  const freshPicks = [...products].sort((a, b) => b.rating - a.rating).slice(0, 8);

  return (
    <div>
      {/* ── HERO CAROUSEL ─────────────────────────────────── */}
      <section className="relative">
        <div className="relative h-[320px] sm:h-[420px] lg:h-[480px] overflow-hidden">
          {BANNERS.map((banner, idx) => (
            <div
              key={banner.id}
              className={`absolute inset-0 transition-opacity duration-700 ${
                idx === slide ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={banner.image}
                alt={banner.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
              <div className="absolute inset-0 flex items-center">
                <div className="container-px">
                  <div className="max-w-md text-white animate-slide-up">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-3 leading-tight">
                      {banner.title}
                    </h1>
                    <p className="text-sm sm:text-base text-gray-200 mb-6">{banner.subtitle}</p>
                    <Link
                      to={banner.link}
                      className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-3 rounded-full transition-colors shadow-lg"
                    >
                      {banner.cta} <FiArrowRight />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Arrows */}
          <button
            onClick={prevSlide}
            aria-label="Previous slide"
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur text-white p-2 rounded-full transition-colors"
          >
            <FiChevronLeft size={22} />
          </button>
          <button
            onClick={nextSlide}
            aria-label="Next slide"
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur text-white p-2 rounded-full transition-colors"
          >
            <FiChevronRight size={22} />
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {BANNERS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all ${
                  idx === slide ? "w-6 bg-white" : "w-2 bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES STRIP ────────────────────────────────── */}
      <section className="container-px -mt-px relative z-10">
        <div className="bg-white rounded-2xl shadow-sm grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-gray-100 -mt-6 sm:-mt-8 mb-8 sm:mb-12">
          {FEATURES.map((f) => (
            <div key={f.id} className="flex flex-col items-center text-center p-4 sm:p-6">
              <span className="text-3xl mb-2">{f.icon}</span>
              <h3 className="font-semibold text-sm sm:text-base text-gray-900">{f.title}</h3>
              <p className="text-xs text-gray-500 mt-1">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SHOP BY CATEGORY ──────────────────────────────── */}
      <section className="container-px mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="section-title">Shop by Category</h2>
          <Link to="/shop" className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1">
            View All <FiArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              to={`/shop?category=${cat.id}`}
              className="card flex flex-col items-center text-center p-4 group"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden bg-primary-50 mb-2 flex items-center justify-center group-hover:scale-105 transition-transform">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-gray-800">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ─────────────────────────────── */}
      <section className="container-px mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="section-title">Featured Deals</h2>
          <Link to="/shop" className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1">
            View All <FiArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-5">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* ── ORGANIC BANNER + PRODUCTS ─────────────────────── */}
      <section className="container-px mb-12">
        <div className="grid lg:grid-cols-3 gap-5">
          {/* Banner */}
          <div className="lg:col-span-1 relative rounded-2xl overflow-hidden min-h-[260px] flex items-end">
            <img
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80"
              alt="Organic produce"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="relative p-6 text-white">
              <span className="inline-block bg-primary-600 text-xs font-bold px-3 py-1 rounded-full mb-2">
                100% ORGANIC
              </span>
              <h3 className="text-2xl font-bold mb-2">Pure & Natural Picks</h3>
              <p className="text-sm text-gray-200 mb-4">No pesticides, no shortcuts — just real food.</p>
              <Link
                to="/shop?category=organic"
                className="inline-flex items-center gap-2 bg-white text-primary-700 font-semibold px-4 py-2 rounded-full text-sm hover:bg-primary-50 transition-colors"
              >
                Shop Organic <FiArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Organic products */}
          <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
            {organic.length > 0
              ? organic.map((p) => <ProductCard key={p.id} product={p} />)
              : products.slice(0, 4).map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* ── FRESH PICKS (TOP RATED) ───────────────────────── */}
      <section className="container-px mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="section-title">Fresh Picks for You</h2>
          <Link to="/shop?sort=rating" className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1">
            View All <FiArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-5">
          {freshPicks.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────── */}
      <section className="bg-primary-50 py-12 mb-0">
        <div className="container-px">
          <h2 className="section-title text-center mb-8">What Our Customers Say</h2>
          <div className="grid sm:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t) => (
              <div key={t.id} className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FiStar
                      key={i}
                      size={14}
                      className={i < t.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER CTA ────────────────────────────────── */}
      <section className="container-px py-12">
        <div className="bg-primary-600 rounded-2xl p-8 sm:p-12 text-center text-white relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-500 rounded-full opacity-50" />
          <div className="absolute -bottom-16 -left-10 w-52 h-52 bg-primary-700 rounded-full opacity-40" />
          <div className="relative">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">Get 10% Off Your First Order</h2>
            <p className="text-primary-100 mb-6 max-w-md mx-auto">
              Sign up for our newsletter and receive exclusive deals, fresh recipes, and more.
            </p>
            <Link
              to="/account"
              className="inline-flex items-center gap-2 bg-white text-primary-700 font-bold px-6 py-3 rounded-full hover:bg-primary-50 transition-colors"
            >
              Sign Up Now <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
