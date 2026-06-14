import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  FiUser, FiPackage, FiMapPin, FiHeart, FiLogOut, FiLogIn,
  FiUserPlus, FiEye, FiEyeOff, FiChevronRight, FiTrash2,
  FiShoppingBag, FiCheck, FiTruck, FiClock,
} from "react-icons/fi";
import { useApp } from "../context/AppContext";
import toast from "react-hot-toast";

const TABS = [
  { id: "orders", label: "My Orders", icon: FiPackage },
  { id: "addresses", label: "Addresses", icon: FiMapPin },
  { id: "profile", label: "Profile", icon: FiUser },
];

const STATUS_CONFIG = {
  Confirmed: { color: "bg-blue-100 text-blue-700", icon: FiCheck },
  Processing: { color: "bg-yellow-100 text-yellow-700", icon: FiClock },
  Shipped: { color: "bg-purple-100 text-purple-700", icon: FiTruck },
  Delivered: { color: "bg-green-100 text-green-700", icon: FiCheck },
  Cancelled: { color: "bg-red-100 text-red-700", icon: FiCheck },
};

const formatDate = (iso) => {
  try {
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
    });
  } catch {
    return iso;
  }
};

// ── Auth forms ──────────────────────────────────────────────
const AuthPanel = () => {
  const { login, signup } = useApp();
  const [mode, setMode] = useState("login");
  const [showPwd, setShowPwd] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { toast.error("Please fill all fields"); return; }
    if (!/\S+@\S+\.\S+/.test(form.email)) { toast.error("Enter a valid email"); return; }
    if (form.password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    if (mode === "signup" && !form.name.trim()) { toast.error("Enter your name"); return; }
    if (mode === "login") {
      login(form.email, form.name);
    } else {
      signup(form.email, form.name.trim());
    }
  };

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiUser size={28} />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900">
            {mode === "login" ? "Welcome back" : "Create account"}
          </h1>
          <p className="text-gray-400 mt-1.5 text-sm">
            {mode === "login" ? "Sign in to access your orders and account" : "Join GreenCart for a fresher experience"}
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-7 sm:p-9">
          {/* Tabs */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            <button
              onClick={() => setMode("login")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${mode === "login" ? "bg-white text-gray-900 shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
            >
              <FiLogIn size={14} /> Sign In
            </button>
            <button
              onClick={() => setMode("signup")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${mode === "signup" ? "bg-white text-gray-900 shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
            >
              <FiUserPlus size={14} /> Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">Full Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={set("name")}
                  placeholder="Your full name"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                />
              </div>
            )}
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">Email Address *</label>
              <input
                type="email"
                value={form.email}
                onChange={set("email")}
                placeholder="you@example.com"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">Password *</label>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  value={form.password}
                  onChange={set("password")}
                  placeholder="At least 6 characters"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((s) => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPwd ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 rounded-full transition-all text-sm mt-2 shadow-sm hover:shadow-md"
            >
              {mode === "login" ? "Sign In to GreenCart" : "Create My Account"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          By continuing you agree to our{" "}
          <Link to="/" className="text-primary-600 hover:underline">Terms of Service</Link> and{" "}
          <Link to="/" className="text-primary-600 hover:underline">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
};

// ── Orders tab ──────────────────────────────────────────────
const OrdersTab = ({ orders }) => {
  if (orders.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">📦</div>
        <h3 className="font-bold text-gray-900 text-lg mb-2">No orders yet</h3>
        <p className="text-gray-400 text-sm mb-6">Your order history will appear here after your first purchase.</p>
        <Link to="/shop" className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-3 rounded-full transition-colors text-sm">
          Start Shopping <FiShoppingBag size={14} />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => {
        const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.Confirmed;
        const StatusIcon = status.icon;
        return (
          <div key={order.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            {/* Order header */}
            <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-gray-50">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FiPackage size={18} />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-gray-900 text-sm font-mono truncate">{order.id}</p>
                  <p className="text-xs text-gray-400">{formatDate(order.date)}</p>
                </div>
              </div>
              <span className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full flex-shrink-0 ${status.color}`}>
                <StatusIcon size={11} /> {order.status}
              </span>
            </div>

            {/* Items preview */}
            <div className="px-5 py-4">
              <div className="flex gap-2 mb-4 flex-wrap">
                {order.items.slice(0, 4).map((item, idx) => (
                  <div key={idx} className="relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-lg object-cover bg-gray-50 border border-gray-100"
                    />
                    {item.qty > 1 && (
                      <span className="absolute -top-1.5 -right-1.5 bg-primary-600 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                        {item.qty}
                      </span>
                    )}
                  </div>
                ))}
                {order.items.length > 4 && (
                  <div className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                    +{order.items.length - 4}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-y-3 gap-x-6">
                <div className="flex flex-wrap gap-4 text-sm">
                  <div>
                    <p className="text-xs text-gray-400">Items</p>
                    <p className="font-semibold text-gray-700">{order.itemCount} item{order.itemCount > 1 ? "s" : ""}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Payment</p>
                    <p className="font-semibold text-gray-700 capitalize">
                      {order.paymentMethod === "cod" ? "Cash on Delivery"
                        : order.paymentMethod === "upi" ? `UPI${order.upiId ? ` (${order.upiId})` : ""}`
                        : order.paymentMethod === "card" ? "Card"
                        : order.paymentMethod}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Total</p>
                    <p className="font-extrabold text-primary-700">₹{order.total?.toFixed(0)}</p>
                  </div>
                </div>

                {/* Delivery address brief */}
                {order.address && (
                  <div className="text-xs text-gray-400 max-w-[200px] text-right hidden sm:block">
                    <FiMapPin size={11} className="inline mr-1" />
                    {order.address.city}, {order.address.state}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ── Addresses tab ───────────────────────────────────────────
const AddressesTab = ({ addresses, deleteAddress }) => {
  if (addresses.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">📍</div>
        <h3 className="font-bold text-gray-900 text-lg mb-2">No saved addresses</h3>
        <p className="text-gray-400 text-sm mb-6">Addresses you enter during checkout will be saved here automatically.</p>
        <Link to="/checkout" className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-3 rounded-full transition-colors text-sm">
          Go to Checkout
        </Link>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {addresses.map((addr) => (
        <div key={addr.id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow group">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="w-9 h-9 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <FiMapPin size={16} />
            </div>
            <button
              onClick={() => deleteAddress(addr.id)}
              className="text-gray-200 hover:text-red-400 transition-colors p-1 opacity-0 group-hover:opacity-100"
              aria-label="Delete address"
            >
              <FiTrash2 size={15} />
            </button>
          </div>
          <p className="font-bold text-gray-900 text-sm mb-1">{addr.name}</p>
          <p className="text-xs text-gray-500 leading-relaxed">
            {addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}
          </p>
          <p className="text-xs text-gray-500">{addr.city}, {addr.state} – {addr.pincode}</p>
          <p className="text-xs text-gray-400 mt-2">📞 {addr.phone}</p>
        </div>
      ))}
    </div>
  );
};

// ── Profile tab ─────────────────────────────────────────────
const ProfileTab = ({ user, orders, wishlist, logout }) => (
  <div className="space-y-5">
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <div className="flex items-center gap-4 mb-5">
        <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-emerald-500 rounded-2xl flex items-center justify-center text-white text-2xl font-extrabold shadow-md">
          {user.name?.[0]?.toUpperCase() || "U"}
        </div>
        <div>
          <h3 className="text-lg font-extrabold text-gray-900">{user.name}</h3>
          <p className="text-sm text-gray-400">{user.email}</p>
          <p className="text-xs text-gray-300 mt-0.5">Member since {formatDate(user.joinedAt)}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Orders", value: orders.length, icon: "📦" },
          { label: "Wishlist", value: wishlist.length, icon: "❤️" },
          { label: "Savings", value: `₹${orders.reduce((s, o) => s + (o.savings || 0), 0).toFixed(0)}`, icon: "💰" },
        ].map((stat) => (
          <div key={stat.label} className="bg-gray-50 rounded-xl p-3 text-center">
            <p className="text-xl mb-1">{stat.icon}</p>
            <p className="text-lg font-extrabold text-gray-900">{stat.value}</p>
            <p className="text-[11px] text-gray-400 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>

    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      {[
        { icon: FiPackage, label: "My Orders", desc: `${orders.length} order${orders.length !== 1 ? "s" : ""} placed`, tab: "orders" },
        { icon: FiMapPin, label: "Saved Addresses", desc: "Manage delivery addresses", tab: "addresses" },
        { icon: FiHeart, label: "Wishlist", desc: `${wishlist.length} item${wishlist.length !== 1 ? "s" : ""} saved`, link: "/wishlist" },
      ].map((item, idx) => {
        const Icon = item.icon;
        const content = (
          <div className={`flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors cursor-pointer ${idx > 0 ? "border-t border-gray-50" : ""}`}>
            <div className="w-9 h-9 bg-gray-100 text-gray-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <Icon size={16} />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-800 text-sm">{item.label}</p>
              <p className="text-xs text-gray-400">{item.desc}</p>
            </div>
            <FiChevronRight size={15} className="text-gray-300" />
          </div>
        );
        return item.link ? (
          <Link key={item.label} to={item.link}>{content}</Link>
        ) : (
          <div key={item.label}>{content}</div>
        );
      })}
    </div>

    <button
      onClick={logout}
      className="w-full flex items-center justify-center gap-2 border border-red-100 bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-3.5 rounded-2xl transition-colors text-sm"
    >
      <FiLogOut size={15} /> Sign Out
    </button>
  </div>
);

// ── Main AccountPage ─────────────────────────────────────────
const AccountPage = () => {
  const { user, orders, savedAddresses, wishlist, logout, deleteAddress } = useApp();
  const [activeTab, setActiveTab] = useState("orders");

  if (!user) return <AuthPanel />;

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <p className="text-xs text-gray-400 mb-1">My Account</p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Hello, {user.name.split(" ")[0]} 👋
          </h1>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar tabs */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              {TABS.map((tab, idx) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-4 text-left transition-colors ${idx > 0 ? "border-t border-gray-50" : ""} ${isActive ? "bg-primary-50 text-primary-700" : "text-gray-600 hover:bg-gray-50"}`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${isActive ? "bg-primary-100 text-primary-600" : "bg-gray-100 text-gray-400"}`}>
                      <Icon size={15} />
                    </div>
                    <div className="flex-1 text-left">
                      <p className={`text-sm font-semibold ${isActive ? "text-primary-700" : "text-gray-700"}`}>{tab.label}</p>
                      {tab.id === "orders" && (
                        <p className="text-[11px] text-gray-400">{orders.length} order{orders.length !== 1 ? "s" : ""}</p>
                      )}
                      {tab.id === "addresses" && (
                        <p className="text-[11px] text-gray-400">{savedAddresses.length} saved</p>
                      )}
                    </div>
                    {isActive && <div className="w-1.5 h-6 bg-primary-500 rounded-full" />}
                  </button>
                );
              })}
              <div className="border-t border-gray-50">
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-4 text-red-500 hover:bg-red-50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                    <FiLogOut size={15} />
                  </div>
                  <span className="text-sm font-semibold">Sign Out</span>
                </button>
              </div>
            </div>
          </div>

          {/* Tab content */}
          <div className="lg:col-span-3">
            {activeTab === "orders" && <OrdersTab orders={orders} />}
            {activeTab === "addresses" && <AddressesTab addresses={savedAddresses} deleteAddress={deleteAddress} />}
            {activeTab === "profile" && <ProfileTab user={user} orders={orders} wishlist={wishlist} logout={logout} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
