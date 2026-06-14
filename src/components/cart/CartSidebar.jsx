import React from "react";
import { Link } from "react-router-dom";
import { FiX, FiPlus, FiMinus, FiTrash2, FiShoppingBag, FiArrowRight, FiTag } from "react-icons/fi";
import { useApp } from "../../context/AppContext";
import { DELIVERY_FREE_THRESHOLD } from "../../data/products";

const CartSidebar = () => {
  const {
    cart, isCartOpen, setIsCartOpen,
    updateQty, removeFromCart,
    cartSubtotal, cartSavings, deliveryFee,
    taxAmount, cartTotal, amountToFreeDelivery,
  } = useApp();

  const progressPct = Math.min(
    100,
    Math.round(((DELIVERY_FREE_THRESHOLD - amountToFreeDelivery) / DELIVERY_FREE_THRESHOLD) * 100)
  );

  return (
    <>
      {/* Overlay */}
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsCartOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!isCartOpen}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center">
              <FiShoppingBag size={18} />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-base">Your Cart</h2>
              <p className="text-xs text-gray-400">{cart.length} {cart.length === 1 ? "item" : "items"}</p>
            </div>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            aria-label="Close cart"
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-500"
          >
            <FiX size={20} />
          </button>
        </div>

        {cart.length === 0 ? (
          /* Empty state */
          <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-5 text-4xl">
              🛒
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-400 text-sm mb-6">Add items to get started on your fresh grocery order</p>
            <Link
              to="/shop"
              onClick={() => setIsCartOpen(false)}
              className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-3 rounded-full transition-colors"
            >
              Browse Products <FiArrowRight size={15} />
            </Link>
          </div>
        ) : (
          <>
            {/* Free delivery progress */}
            <div className="px-5 py-3.5 bg-gradient-to-r from-primary-50 to-emerald-50 border-b border-primary-100">
              {amountToFreeDelivery > 0 ? (
                <p className="text-xs text-primary-800 mb-2 font-medium">
                  Add <span className="font-extrabold">₹{amountToFreeDelivery}</span> more for <span className="font-extrabold">FREE delivery</span>!
                </p>
              ) : (
                <p className="text-xs text-primary-800 mb-2 font-bold flex items-center gap-1">
                  🎉 You've unlocked free delivery!
                </p>
              )}
              <div className="h-1.5 bg-primary-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary-500 to-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>

            {/* Cart items */}
            <div className="flex-1 overflow-y-auto px-5 py-2 space-y-1">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 py-3.5 border-b border-gray-50 last:border-0 group"
                >
                  <Link
                    to={`/product/${item.id}`}
                    onClick={() => setIsCartOpen(false)}
                    className="w-16 h-16 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        to={`/product/${item.id}`}
                        onClick={() => setIsCartOpen(false)}
                        className="text-sm font-semibold text-gray-800 hover:text-primary-700 line-clamp-2 leading-snug"
                      >
                        {item.name}
                      </Link>
                      <button
                        onClick={() => removeFromCart(item.id, item.name)}
                        aria-label="Remove"
                        className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0 p-0.5 opacity-0 group-hover:opacity-100"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{item.unit}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center bg-gray-50 border border-gray-100 rounded-full">
                        <button
                          onClick={() => updateQty(item.id, item.qty - 1)}
                          aria-label="Decrease"
                          className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors"
                        >
                          <FiMinus size={12} />
                        </button>
                        <span className="w-7 text-center text-sm font-bold text-gray-800">{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.id, item.qty + 1)}
                          aria-label="Increase"
                          className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors"
                        >
                          <FiPlus size={12} />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">₹{(item.price * item.qty).toFixed(0)}</p>
                        {item.originalPrice && item.originalPrice > item.price && (
                          <p className="text-xs text-gray-400 line-through">₹{(item.originalPrice * item.qty).toFixed(0)}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="border-t border-gray-100 bg-gray-50 px-5 py-4">
              {cartSavings > 0 && (
                <div className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-xl px-3 py-2 mb-3">
                  <FiTag size={13} className="text-green-600 flex-shrink-0" />
                  <p className="text-xs font-semibold text-green-700">
                    You're saving <span className="font-extrabold">₹{Math.round(cartSavings)}</span> on this order!
                  </p>
                </div>
              )}

              <div className="space-y-1.5 mb-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium">₹{cartSubtotal.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Delivery</span>
                  {deliveryFee === 0 ? (
                    <span className="text-primary-600 font-semibold">FREE</span>
                  ) : (
                    <span className="font-medium">₹{deliveryFee}</span>
                  )}
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Tax (5%)</span>
                  <span className="font-medium">₹{taxAmount}</span>
                </div>
                <div className="flex justify-between font-extrabold text-gray-900 text-base pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span>₹{cartTotal.toFixed(0)}</span>
                </div>
              </div>

              <Link
                to="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 rounded-full transition-all shadow-sm hover:shadow-md text-sm"
              >
                Proceed to Checkout <FiArrowRight size={15} />
              </Link>
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-full text-center text-sm text-gray-400 hover:text-gray-600 mt-3 py-1 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
};

export default CartSidebar;
