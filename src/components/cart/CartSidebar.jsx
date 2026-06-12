import React from "react";
import { Link } from "react-router-dom";
import { FiX, FiPlus, FiMinus, FiTrash2, FiShoppingBag } from "react-icons/fi";
import { useApp } from "../../context/AppContext";
import { DELIVERY_FREE_THRESHOLD } from "../../data/products";

const CartSidebar = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQty,
    removeFromCart,
    cartSubtotal,
    cartSavings,
    deliveryFee,
    taxAmount,
    cartTotal,
    amountToFreeDelivery,
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
          className="fixed inset-0 bg-black/40 z-50 animate-fade-in"
          onClick={() => setIsCartOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!isCartOpen}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <FiShoppingBag /> Your Cart
            {cart.length > 0 && (
              <span className="text-sm font-normal text-gray-500">({cart.length} items)</span>
            )}
          </h2>
          <button
            onClick={() => setIsCartOpen(false)}
            aria-label="Close cart"
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
            <span className="text-5xl mb-4">🛒</span>
            <p className="text-gray-500 mb-4">Your cart is empty</p>
            <Link
              to="/shop"
              onClick={() => setIsCartOpen(false)}
              className="btn-primary"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <>
            {/* Free delivery progress */}
            <div className="px-5 py-3 bg-primary-50 border-b border-primary-100">
              {amountToFreeDelivery > 0 ? (
                <p className="text-xs text-primary-800 mb-2">
                  Add <span className="font-bold">₹{amountToFreeDelivery}</span> more for{" "}
                  <span className="font-bold">FREE delivery</span>!
                </p>
              ) : (
                <p className="text-xs text-primary-800 mb-2 font-semibold">
                  🎉 You've unlocked FREE delivery!
                </p>
              )}
              <div className="w-full h-2 bg-primary-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-600 rounded-full transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>

            {/* Cart items */}
            <div className="flex-1 overflow-y-auto px-5 py-3 space-y-3">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-3 items-center border-b border-gray-100 pb-3 last:border-0">
                  <Link to={`/product/${item.id}`} onClick={() => setIsCartOpen(false)}>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-xl flex-shrink-0 bg-gray-50"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/product/${item.id}`}
                      onClick={() => setIsCartOpen(false)}
                      className="text-sm font-semibold text-gray-900 line-clamp-1 hover:text-primary-600"
                    >
                      {item.name}
                    </Link>
                    <p className="text-xs text-gray-500 mb-1.5">{item.unit}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 bg-gray-100 rounded-full">
                        <button
                          onClick={() => updateQty(item.id, item.qty - 1)}
                          aria-label="Decrease quantity"
                          className="p-1.5 hover:bg-gray-200 rounded-full transition-colors"
                        >
                          <FiMinus size={12} />
                        </button>
                        <span className="text-sm font-semibold w-4 text-center">{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.id, item.qty + 1)}
                          aria-label="Increase quantity"
                          className="p-1.5 hover:bg-gray-200 rounded-full transition-colors"
                        >
                          <FiPlus size={12} />
                        </button>
                      </div>
                      <span className="text-sm font-bold text-gray-900">₹{item.price * item.qty}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id, item.name)}
                    aria-label="Remove item"
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="border-t border-gray-100 px-5 py-4 space-y-2">
              {cartSavings > 0 && (
                <div className="flex justify-between text-sm text-primary-600 font-medium">
                  <span>You're saving</span>
                  <span>₹{cartSavings}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>₹{cartSubtotal}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Delivery Fee</span>
                <span>{deliveryFee === 0 ? <span className="text-primary-600 font-semibold">FREE</span> : `₹${deliveryFee}`}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Tax (5%)</span>
                <span>₹{taxAmount}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-100">
                <span>Total</span>
                <span>₹{cartTotal}</span>
              </div>
              <Link
                to="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="btn-primary w-full text-center block mt-3"
              >
                Proceed to Checkout
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
};

export default CartSidebar;
