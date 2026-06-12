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

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const handleIncrease = (e) => {
    e.preventDefault();
    e.stopPropagation();
    updateQty(product.id, qty + 1);
  };

  const handleDecrease = (e) => {
    e.preventDefault();
    e.stopPropagation();
    updateQty(product.id, qty - 1);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id, product.name);
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className="card group flex flex-col h-full overflow-hidden animate-fade-in"
    >
      {/* Image */}
      <div className="relative aspect-square bg-gray-50 overflow-hidden rounded-t-2xl">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Badge */}
        {product.badge && (
          <span className="absolute top-2 left-2 bg-primary-600 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide shadow-sm">
            {product.badge}
          </span>
        )}

        {/* Discount badge */}
        {discount > 0 && !product.badge && (
          <span className="absolute top-2 left-2 bg-accent text-white text-[10px] font-bold px-2 py-1 rounded-full">
            {discount}% OFF
          </span>
        )}

        {/* Wishlist button */}
        <button
          onClick={handleWishlist}
          aria-label="Toggle wishlist"
          className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur rounded-full shadow-sm hover:scale-110 transition-transform"
        >
          <FiHeart
            size={16}
            className={inWishlist ? "fill-accent text-accent" : "text-gray-500"}
          />
        </button>

        {/* Low stock */}
        {product.stock <= 10 && (
          <span className="absolute bottom-2 left-2 bg-red-500/90 text-white text-[10px] font-semibold px-2 py-1 rounded-full">
            Only {product.stock} left
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-3 sm:p-4">
        <span className="text-[11px] uppercase tracking-wide text-primary-600 font-semibold mb-1">
          {product.category}
        </span>
        <h3 className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-2 mb-1">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <FiStar size={13} className="fill-yellow-400 text-yellow-400" />
          <span className="text-xs text-gray-600 font-medium">{product.rating}</span>
          <span className="text-xs text-gray-400">({product.reviews})</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-3 mt-auto">
          <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-sm text-gray-400 line-through">₹{product.originalPrice}</span>
          )}
          <span className="text-xs text-gray-400 ml-auto">/{product.unit}</span>
        </div>

        {/* Cart controls */}
        {qty === 0 ? (
          <button
            onClick={handleAdd}
            className="w-full flex items-center justify-center gap-2 bg-primary-50 text-primary-700 font-semibold text-sm rounded-full py-2 hover:bg-primary-600 hover:text-white transition-colors duration-200"
          >
            <FiShoppingCart size={15} />
            Add to Cart
          </button>
        ) : (
          <div className="flex items-center justify-between bg-primary-600 rounded-full overflow-hidden">
            <button
              onClick={handleDecrease}
              aria-label="Decrease quantity"
              className="px-3 py-2 text-white hover:bg-primary-700 transition-colors"
            >
              <FiMinus size={14} />
            </button>
            <span className="text-white font-semibold text-sm">{qty}</span>
            <button
              onClick={handleIncrease}
              aria-label="Increase quantity"
              className="px-3 py-2 text-white hover:bg-primary-700 transition-colors"
            >
              <FiPlus size={14} />
            </button>
          </div>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;
