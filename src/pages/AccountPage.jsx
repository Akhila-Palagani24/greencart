import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiLock,
  FiLogOut,
  FiPackage,
  FiMapPin,
  FiSettings,
  FiHeart,
} from "react-icons/fi";
import { useApp } from "../context/AppContext";
import toast from "react-hot-toast";

const MOCK_ORDERS = [
  { id: "GC-LX3K9-A1B2", date: "2026-06-08", total: 487, status: "Delivered", items: 4 },
  { id: "GC-LX2J1-C3D4", date: "2026-05-28", total: 1240, status: "Delivered", items: 7 },
  { id: "GC-LX1H8-E5F6", date: "2026-05-15", total: 320, status: "Cancelled", items: 2 },
];

const AccountPage = () => {
  const { user, login, signup, logout, wishlist } = useApp();
  const navigate = useNavigate();

  const [authMode, setAuthMode] = useState("login"); // login | signup
  const [activeTab, setActiveTab] = useState("profile");

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [profileForm, setProfileForm] = useState({ name: user?.name || "", email: user?.email || "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (!form.email.trim() || !form.password.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    if (authMode === "signup") {
      if (!form.name.trim()) {
        toast.error("Please enter your name");
        return;
      }
      signup(form.email, form.name);
    } else {
      login(form.email);
    }
    setForm({ name: "", email: "", password: "" });
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    toast.success("Profile updated successfully!");
  };

  // ── Not logged in ──────────────────────────────────────
  if (!user) {
    return (
      <div className="container-px py-10 sm:py-16">
        <div className="max-w-md mx-auto card p-6 sm:p-8">
          <div className="text-center mb-6">
            <span className="text-4xl">🛒</span>
            <h1 className="text-2xl font-bold text-gray-900 mt-2">
              {authMode === "login" ? "Welcome Back" : "Create an Account"}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {authMode === "login" ? "Login to access your account" : "Sign up to start shopping"}
            </p>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {authMode === "signup" && (
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Full Name</label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="input-field pl-9"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="input-field pl-9"
                  placeholder="you@example.com"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="input-field pl-9"
                  placeholder="••••••••"
                />
              </div>
            </div>
            <button type="submit" className="btn-primary w-full">
              {authMode === "login" ? "Login" : "Sign Up"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            {authMode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => setAuthMode(authMode === "login" ? "signup" : "login")}
              className="text-primary-600 font-semibold hover:underline"
            >
              {authMode === "login" ? "Sign Up" : "Login"}
            </button>
          </p>
          <p className="text-center text-xs text-gray-400 mt-3">
            This is a demo — any email/password combination will work.
          </p>
        </div>
      </div>
    );
  }

  // ── Logged in ──────────────────────────────────────────
  const tabs = [
    { id: "profile", label: "Profile", icon: FiSettings },
    { id: "orders", label: "Orders", icon: FiPackage },
    { id: "addresses", label: "Addresses", icon: FiMapPin },
    { id: "wishlist", label: "Wishlist", icon: FiHeart },
  ];

  return (
    <div className="container-px py-6 sm:py-8">
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Sidebar */}
        <aside className="sm:w-64 flex-shrink-0">
          <div className="card p-5 mb-4">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-lg flex-shrink-0">
                {user.name?.[0]?.toUpperCase() || "U"}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-gray-900 truncate">{user.name}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
          </div>

          <div className="card p-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    activeTab === tab.id ? "bg-primary-50 text-primary-700" : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon size={16} /> {tab.label}
                </button>
              );
            })}
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
            >
              <FiLogOut size={16} /> Logout
            </button>
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1">
          {activeTab === "profile" && (
            <div className="card p-5 sm:p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Profile Information</h2>
              <form onSubmit={handleProfileSave} className="grid sm:grid-cols-2 gap-4 max-w-lg">
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Full Name</label>
                  <input
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
                  <input
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div className="sm:col-span-2">
                  <button type="submit" className="btn-primary">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "orders" && (
            <div className="card p-5 sm:p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Order History</h2>
              <div className="space-y-3">
                {MOCK_ORDERS.map((order) => (
                  <div key={order.id} className="flex items-center justify-between border border-gray-100 rounded-xl p-4 flex-wrap gap-2">
                    <div>
                      <p className="text-sm font-bold text-gray-900">{order.id}</p>
                      <p className="text-xs text-gray-500">{order.date} • {order.items} items</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-gray-900">₹{order.total}</span>
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          order.status === "Delivered"
                            ? "bg-primary-50 text-primary-700"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "addresses" && (
            <div className="card p-5 sm:p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Saved Addresses</h2>
              <div className="border border-dashed border-gray-200 rounded-xl p-6 text-center text-sm text-gray-500">
                <FiMapPin className="mx-auto mb-2 text-gray-300" size={28} />
                No saved addresses yet. Addresses entered during checkout will appear here.
              </div>
            </div>
          )}

          {activeTab === "wishlist" && (
            <div className="card p-5 sm:p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">My Wishlist</h2>
              {wishlist.length === 0 ? (
                <p className="text-sm text-gray-500">You haven't saved any items yet.</p>
              ) : (
                <p className="text-sm text-gray-600">
                  You have {wishlist.length} item{wishlist.length > 1 ? "s" : ""} saved.{" "}
                  <button onClick={() => navigate("/wishlist")} className="text-primary-600 font-semibold hover:underline">
                    View Wishlist →
                  </button>
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
