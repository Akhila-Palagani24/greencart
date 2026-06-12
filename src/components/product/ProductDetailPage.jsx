import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  FiStar,
  FiHeart,
  FiShoppingCart,
  FiMinus,
  FiPlus,
  FiChevronRight,
  FiTruck,
  FiShield,
  FiRefreshCw,
} from "react-icons/fi";
import { useApp } from "../../context/AppContext";
import ProductCard from "./ProductCard";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    getProductById,
    getRelatedProducts,
    addToCart,
    getCartQty,
    updateQty,
    toggleWishlist,
    isInWishlist,
    setIsCartOpen,
  } = useApp();

  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  const product = getProductById(id);

  // Reset quantity selector + scroll to top when navigating between products
  useEffect(() => {
    setQty(1);
    setActiveTab("description");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  if (!product) {
    return (
      <div className="container-px py-20 text-center">
        <span className="text-5xl block mb-4">😕</span>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Product not found</h2>
        <p className="text-gray-500 mb-6">The product you're looking for doesn't exist.</p>
        <Link to="/shop" className="btn-primary">
          Back to Shop
        </Link>
      </div>
    );
  }

  const inCartQty = getCartQty(product.id);
  const inWishlist = isInWishlist(product.id);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;
  const related = getRelatedProducts(product, 4);

  const handleAddToCart = () => {
    addToCart(product, qty);
  };

  const handleBuyNow = () => {
    addToCart(product, qty);
    navigate("/checkout");
  };

  return (
    <div className="container-px py-6 sm:py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-6 flex-wrap">
        <Link to="/" className="hover:text-primary-600">Home</Link>
        <FiChevronRight size={14} />
        <Link to="/shop" className="hover:text-primary-600">Shop</Link>
        <FiChevronRight size={14} />
        <Link to={`/shop?category=${product.category}`} className="hover:text-primary-600 capitalize">
          {product.category}
        </Link>
        <FiChevronRight size={14} />
        <span className="text-gray-800 font-medium line-clamp-1">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
        {/* Image */}
        <div className="relative">
          <div className="aspect-square rounded-2xl overflow-hidden bg-gray-50 sticky top-20">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            {product.badge && (
              <span className="absolute top-4 left-4 bg-primary-600 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide shadow-sm">
                {product.badge}
              </span>
            )}
            {discount > 0 && !product.badge && (
              <span className="absolute top-4 left-4 bg-accent text-white text-xs font-bold px-3 py-1.5 rounded-full">
                {discount}% OFF
              </span>
            )}
          </div>
        </div>

        {/* Info */}
        <div>
          <span className="text-xs uppercase tracking-wide text-primary-600 font-semibold">
            {product.category}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1 mb-3">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <FiStar
                  key={i}
                  size={16}
                  className={i < Math.round(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}
                />
              ))}
            </div>
            <span className="text-sm font-semibold text-gray-700">{product.rating}</span>
            <span className="text-sm text-gray-400">({product.reviews} reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-1">
            <span className="text-3xl font-bold text-gray-900">₹{product.price}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-lg text-gray-400 line-through">₹{product.originalPrice}</span>
            )}
            {discount > 0 && (
              <span className="text-sm font-semibold text-primary-600">{discount}% off</span>
            )}
          </div>
          <p className="text-sm text-gray-500 mb-5">per {product.unit} • Inclusive of all taxes</p>

          {/* Stock */}
          <div className="mb-5">
            {product.stock > 10 ? (
              <span className="inline-flex items-center gap-1.5 text-sm text-primary-700 bg-primary-50 px-3 py-1 rounded-full font-medium">
                ● In Stock ({product.stock} available)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-sm text-orange-700 bg-orange-50 px-3 py-1 rounded-full font-medium">
                ● Only {product.stock} left — order soon!
              </span>
            )}
          </div>

          {/* Quantity selector */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm font-semibold text-gray-700">Quantity</span>
            <div className="flex items-center gap-3 bg-gray-100 rounded-full">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="p-2.5 hover:bg-gray-200 rounded-full transition-colors"
                aria-label="Decrease quantity"
              >
                <FiMinus size={14} />
              </button>
              <span className="font-semibold w-6 text-center">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                className="p-2.5 hover:bg-gray-200 rounded-full transition-colors"
                aria-label="Increase quantity"
              >
                <FiPlus size={14} />
              </button>
            </div>
            {inCartQty > 0 && (
              <span className="text-xs text-primary-600 font-medium">{inCartQty} in cart</span>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <button
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-2 bg-primary-50 text-primary-700 font-semibold rounded-full py-3 hover:bg-primary-100 transition-colors"
            >
              <FiShoppingCart size={18} /> Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="flex-1 bg-primary-600 text-white font-semibold rounded-full py-3 hover:bg-primary-700 transition-colors"
            >
              Buy Now
            </button>
            <button
              onClick={() => toggleWishlist(product.id, product.name)}
              aria-label="Toggle wishlist"
              className="flex items-center justify-center w-12 h-12 border border-gray-200 rounded-full hover:border-accent transition-colors flex-shrink-0 self-center sm:self-auto"
            >
              <FiHeart size={18} className={inWishlist ? "fill-accent text-accent" : "text-gray-500"} />
            </button>
          </div>

          {inCartQty > 0 && (
            <div className="flex items-center gap-3 mb-6 bg-gray-50 rounded-full p-1.5 w-fit">
              <button
                onClick={() => updateQty(product.id, inCartQty - 1)}
                className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-100"
                aria-label="Decrease cart quantity"
              >
                <FiMinus size={14} />
              </button>
              <span className="text-sm font-semibold px-2">{inCartQty} in cart</span>
              <button
                onClick={() => updateQty(product.id, inCartQty + 1)}
                className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-100"
                aria-label="Increase cart quantity"
              >
                <FiPlus size={14} />
              </button>
              <button
                onClick={() => setIsCartOpen(true)}
                className="text-xs font-semibold text-primary-600 px-2 hover:underline"
              >
                View Cart
              </button>
            </div>
          )}

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3 border-t border-gray-100 pt-5">
            <div className="flex flex-col items-center text-center gap-1">
              <FiTruck className="text-primary-600" size={20} />
              <span className="text-xs text-gray-600">Free delivery over ₹500</span>
            </div>
            <div className="flex flex-col items-center text-center gap-1">
              <FiRefreshCw className="text-primary-600" size={20} />
              <span className="text-xs text-gray-600">Easy 24hr returns</span>
            </div>
            <div className="flex flex-col items-center text-center gap-1">
              <FiShield className="text-primary-600" size={20} />
              <span className="text-xs text-gray-600">Secure checkout</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-12">
        <div className="flex gap-6 border-b border-gray-200 mb-5">
          {["description", "details", "reviews"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-semibold capitalize border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-primary-600 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "description" && (
          <p className="text-gray-600 leading-relaxed max-w-3xl">{product.description}</p>
        )}

        {activeTab === "details" && (
          <div className="max-w-3xl">
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-2.5 font-medium text-gray-500 w-1/3">Category</td>
                  <td className="py-2.5 text-gray-800 capitalize">{product.category}</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2.5 font-medium text-gray-500">Unit</td>
                  <td className="py-2.5 text-gray-800">{product.unit}</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2.5 font-medium text-gray-500">Stock</td>
                  <td className="py-2.5 text-gray-800">{product.stock} units available</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2.5 font-medium text-gray-500">Tags</td>
                  <td className="py-2.5 text-gray-800 capitalize">{product.tags?.join(", ")}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="max-w-3xl">
            <div className="flex items-center gap-4 mb-5 bg-gray-50 rounded-2xl p-5">
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900">{product.rating}</p>
                <div className="flex items-center gap-0.5 justify-center mt-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FiStar key={i} size={12} className={i < Math.round(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} />
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-1">{product.reviews} reviews</p>
              </div>
              <div className="flex-1 text-sm text-gray-500">
                Customers love the quality and freshness of this product. Reviews are aggregated from verified GreenCart purchases.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section>
          <h2 className="section-title mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-5">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetailPage;
