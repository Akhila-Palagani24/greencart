import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { PRODUCTS, DELIVERY_FREE_THRESHOLD, DELIVERY_FEE, TAX_RATE } from "../data/products";

const AppContext = createContext(null);

// ── LocalStorage helpers ─────────────────────────────────
const loadFromStorage = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore write errors (e.g. storage full / privacy mode)
  }
};

// ── Cart Reducer ──────────────────────────────────────────
const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD": {
      const existing = state.find((item) => item.id === action.payload.id);
      if (existing) {
        return state.map((item) =>
          item.id === action.payload.id
            ? { ...item, qty: item.qty + (action.qty || 1) }
            : item
        );
      }
      return [...state, { ...action.payload, qty: action.qty || 1 }];
    }
    case "REMOVE":
      return state.filter((item) => item.id !== action.id);
    case "UPDATE_QTY":
      if (action.qty <= 0) {
        return state.filter((item) => item.id !== action.id);
      }
      return state.map((item) =>
        item.id === action.id ? { ...item, qty: action.qty } : item
      );
    case "CLEAR":
      return [];
    case "HYDRATE":
      return action.payload || [];
    default:
      return state;
  }
};

// ── Wishlist Reducer ─────────────────────────────────────
const wishlistReducer = (state, action) => {
  switch (action.type) {
    case "TOGGLE": {
      const exists = state.includes(action.id);
      return exists ? state.filter((id) => id !== action.id) : [...state, action.id];
    }
    case "HYDRATE":
      return action.payload || [];
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  // ── Cart state ──
  const [cart, dispatchCart] = useReducer(cartReducer, [], () =>
    loadFromStorage("greencart_cart", [])
  );

  // ── Wishlist state ──
  const [wishlist, dispatchWishlist] = useReducer(wishlistReducer, [], () =>
    loadFromStorage("greencart_wishlist", [])
  );

  // ── Cart sidebar visibility ──
  const [isCartOpen, setIsCartOpen] = useState(false);

  // ── Search & category filter ──
  const [searchQuery, setSearchQuery] = useState("");

  // ── Auth (mock) ──
  const [user, setUser] = useState(() => loadFromStorage("greencart_user", null));
  const [orders, setOrders] = useState(() =>
  loadFromStorage("greencart_orders", [])
);

  // ── Persist cart & wishlist ──
  useEffect(() => {
    saveToStorage("greencart_cart", cart);
  }, [cart]);

  useEffect(() => {
    saveToStorage("greencart_wishlist", wishlist);
  }, [wishlist]);

  useEffect(() => {
    saveToStorage("greencart_user", user);
  }, [user]);

  // ── Cart actions ──
  const addToCart = useCallback((product, qty = 1) => {
    dispatchCart({ type: "ADD", payload: product, qty });
    toast.success(`${product.name} added to cart`, {
      icon: "🛒",
      style: { borderRadius: "12px" },
    });
  }, []);

  const removeFromCart = useCallback((id, name) => {
    dispatchCart({ type: "REMOVE", id });
    if (name) {
      toast(`${name} removed from cart`, { icon: "🗑️" });
    }
  }, []);

  const updateQty = useCallback((id, qty) => {
    dispatchCart({ type: "UPDATE_QTY", id, qty });
  }, []);

  const clearCart = useCallback(() => {
    dispatchCart({ type: "CLEAR" });
  }, []);

  // ── Wishlist actions ──
  const toggleWishlist = useCallback((id, name) => {
    dispatchWishlist({ type: "TOGGLE", id });
    const isCurrentlyIn = wishlist.includes(id);
    toast(isCurrentlyIn ? `Removed from wishlist` : `${name || "Item"} added to wishlist`, {
      icon: isCurrentlyIn ? "💔" : "❤️",
    });
  }, [wishlist]);

  const isInWishlist = useCallback((id) => wishlist.includes(id), [wishlist]);

  // ── Auth actions (mock) ──
  const login = useCallback((email, name) => {
    const userData = { email, name: name || email.split("@")[0], joinedAt: new Date().toISOString() };
    setUser(userData);
    toast.success(`Welcome back, ${userData.name}!`);
    return userData;
  }, []);

  const signup = useCallback((email, name) => {
    const userData = { email, name, joinedAt: new Date().toISOString() };
    setUser(userData);
    toast.success(`Welcome to GreenCart, ${name}!`);
    return userData;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    toast("Logged out successfully", { icon: "👋" });
  }, []);

  // ── Derived cart values ──
  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.qty, 0), [cart]);

  const cartSubtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.qty, 0),
    [cart]
  );

  const cartOriginalTotal = useMemo(
    () => cart.reduce((sum, item) => sum + (item.originalPrice || item.price) * item.qty, 0),
    [cart]
  );

  const cartSavings = useMemo(() => cartOriginalTotal - cartSubtotal, [cartOriginalTotal, cartSubtotal]);

  const deliveryFee = useMemo(
    () => (cartSubtotal >= DELIVERY_FREE_THRESHOLD || cartSubtotal === 0 ? 0 : DELIVERY_FEE),
    [cartSubtotal]
  );

  const taxAmount = useMemo(() => Math.round(cartSubtotal * TAX_RATE), [cartSubtotal]);

  const cartTotal = useMemo(
    () => cartSubtotal + deliveryFee + taxAmount,
    [cartSubtotal, deliveryFee, taxAmount]
  );

  const amountToFreeDelivery = useMemo(
    () => Math.max(0, DELIVERY_FREE_THRESHOLD - cartSubtotal),
    [cartSubtotal]
  );

  // ── Product filtering / searching ──
  const getFilteredProducts = useCallback(
    ({ category, search, sort } = {}) => {
      let result = [...PRODUCTS];

      if (category && category !== "all") {
        result = result.filter((p) => p.category === category);
      }

      const query = (search ?? searchQuery)?.trim().toLowerCase();
      if (query) {
        result = result.filter(
          (p) =>
            p.name.toLowerCase().includes(query) ||
            p.category.toLowerCase().includes(query) ||
            p.description.toLowerCase().includes(query) ||
            p.tags?.some((t) => t.toLowerCase().includes(query))
        );
      }

      switch (sort) {
        case "price-low":
          result.sort((a, b) => a.price - b.price);
          break;
        case "price-high":
          result.sort((a, b) => b.price - a.price);
          break;
        case "rating":
          result.sort((a, b) => b.rating - a.rating);
          break;
        case "name":
          result.sort((a, b) => a.name.localeCompare(b.name));
          break;
        default:
          break;
      }

      return result;
    },
    [searchQuery]
  );

  const getProductById = useCallback((id) => {
    return PRODUCTS.find((p) => p.id === Number(id));
  }, []);

  const getRelatedProducts = useCallback((product, limit = 4) => {
    if (!product) return [];
    return PRODUCTS.filter(
      (p) => p.category === product.category && p.id !== product.id
    ).slice(0, limit);
  }, []);

  const getCartQty = useCallback(
    (id) => {
      const item = cart.find((i) => i.id === id);
      return item ? item.qty : 0;
    },
    [cart]
  );

  const value = {
    // products
    products: PRODUCTS,
    getFilteredProducts,
    getProductById,
    getRelatedProducts,
    // search
    searchQuery,
    setSearchQuery,
    // cart
    cart,
    cartCount,
    cartSubtotal,
    cartOriginalTotal,
    cartSavings,
    deliveryFee,
    taxAmount,
    cartTotal,
    amountToFreeDelivery,
    addToCart,
    removeFromCart,
    updateQty,
    clearCart,
    getCartQty,
    isCartOpen,
    setIsCartOpen,
    // wishlist
    wishlist,
    toggleWishlist,
    isInWishlist,
    // auth
    user,
    login,
    signup,
    logout,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};

export default AppContext;
