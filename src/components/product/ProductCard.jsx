import React from "react";
import { Link } from "react-router-dom";
import { FiHeart, FiStar, FiPlus, FiMinus, FiShoppingCart } from "react-icons/fi";
import { useApp } from "../../context/AppContext";

const ProductCard = ({ product }) => {
  const { addToCart, updateQty, getCartQty, toggleWishlist, isInWishlist } = useApp();

  const qty = getCartQty(product.id);
  const inWishlist = isInWishlist(product.id);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAdd = (e) => { e.preventDefault(); e.stopPropagation(); addToCart(product); };
  const handleIncrease = (e) => { e.preventDefault(); e.stopPropagation(); updateQty(product.id, qty + 1); };
  const handleDecrease = (e) => { e.preventDefault(); e.stopPropagation(); updateQty(product.id, qty - 1); };
  const handleWishlist = (e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product.id, product.name); };

  return (
    <Link
      to={`/product/${product.id}`}
      className="group bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
    >
      {/* Image */}
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
          style={{ "--tw-scale-x": "1.08", "--tw-scale-y": "1.08" }}
          onError={(e) => {
            e.target.src = `https://via.placeholder.com/300x300/f0fdf4/16a34a?text=${encodeURIComponent(product.name)}`;
          }}
        />

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Top-left badge */}
        {product.badge ? (
          <span className="absolute top-2.5 left-2.5 bg-primary-600 text-white text-[10px] font-extrabold px-2 py-1 rounded-full uppercase tracking-wide shadow">
            {product.badge}
          </span>
        ) : discount > 0 ? (
          <span className="absolute top-2.5 left-2.5 bg-accent text-white text-[10px] font-extrabold px-2 py-1 rounded-full">
            {discount}% OFF
          </span>
        ) : null}

        {/* Wishlist button */}
        <button
          onClick={handleWishlist}
          aria-label="Toggle wishlist"
          className={`absolute top-2.5 right-2.5 p-2 rounded-full shadow-md transition-all duration-200 hover:scale-110 ${
            inWishlist
              ? "bg-red-50 text-red-500"
              : "bg-white/90 backdrop-blur text-gray-400 hover:text-red-400 hover:bg-red-50"
          }`}
        >
          <FiHeart size={15} className={inWishlist ? "fill-red-500" : ""} />
        </button>

        {/* Low stock */}
        {product.stock > 0 && product.stock <= 10 && (
          <span className="absolute bottom-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            Only {product.stock} left
          </span>
        )}

        {/* Out of stock */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="bg-gray-800 text-white text-xs font-bold px-3 py-1.5 rounded-full">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-3.5">
        <span className="text-[10px] uppercase tracking-widest text-primary-600 font-bold mb-1">
          {product.category}
        </span>
        <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 mb-2 group-hover:text-primary-700 transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <FiStar
                key={i}
                size={11}
                className={i < Math.round(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500 font-medium">{product.rating}</span>
          <span className="text-xs text-gray-300">({product.reviews})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3 mt-auto">
          <span className="text-base sm:text-lg font-extrabold text-gray-900">₹{product.price}</span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-xs text-gray-400 line-through">₹{product.originalPrice}</span>
          )}
          <span className="text-[11px] text-gray-400 ml-auto">/{product.unit}</span>
        </div>

        {/* Cart controls */}
        {product.stock === 0 ? (
          <div className="w-full text-center text-xs font-semibold text-gray-400 py-2 bg-gray-50 rounded-full">
            Out of Stock
          </div>
        ) : qty === 0 ? (
          <button
            onClick={handleAdd}
            className="w-full flex items-center justify-center gap-1.5 bg-primary-50 border border-primary-100 text-primary-700 font-semibold text-sm rounded-full py-2.5 hover:bg-primary-600 hover:text-white hover:border-primary-600 transition-all duration-200"
          >
            <FiShoppingCart size={14} />
            Add to Cart
          </button>
        ) : (
          <div className="flex items-center bg-primary-600 rounded-full overflow-hidden">
            <button
              onClick={handleDecrease}
              aria-label="Decrease"
              className="px-3.5 py-2.5 text-white hover:bg-primary-700 transition-colors"
            >
              <FiMinus size={13} />
            </button>
            <span className="flex-1 text-center text-white font-bold text-sm">{qty}</span>
            <button
              onClick={handleIncrease}
              aria-label="Increase"
              className="px-3.5 py-2.5 text-white hover:bg-primary-700 transition-colors"
            >
              <FiPlus size={13} />
            </button>
          </div>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;
