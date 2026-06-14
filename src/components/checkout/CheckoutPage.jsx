import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FiCheck, FiChevronRight, FiMapPin, FiCreditCard, FiPackage,
  FiLock, FiArrowLeft, FiAlertCircle, FiSmartphone,
} from "react-icons/fi";
import { useApp } from "../../context/AppContext";
import toast from "react-hot-toast";

const STEPS = [
  { id: 1, label: "Address", icon: FiMapPin },
  { id: 2, label: "Payment", icon: FiCreditCard },
  { id: 3, label: "Review", icon: FiPackage },
];

const PAYMENT_METHODS = [
  { id: "cod", label: "Cash on Delivery", icon: "💵", desc: "Pay when your order arrives" },
  { id: "upi", label: "UPI", icon: "📲", desc: "Google Pay, PhonePe, Paytm, etc." },
  { id: "card", label: "Credit / Debit Card", icon: "💳", desc: "All major cards accepted" },
  { id: "netbanking", label: "Net Banking", icon: "🏦", desc: "All major banks supported" },
];

const CheckoutPage = () => {
  const navigate = useNavigate();
  const {
    cart, cartSubtotal, cartSavings, deliveryFee, taxAmount, cartTotal,
    user, placeOrder, savedAddresses,
  } = useApp();

  const [step, setStep] = useState(1);
  const [placed, setPlaced] = useState(null);
  const [loading, setLoading] = useState(false);

  const [address, setAddress] = useState({
    name: user?.name || "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [useExistingAddr, setUseExistingAddr] = useState(null);

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [upiId, setUpiId] = useState("");

  // Redirect if no items or not logged in
  useEffect(() => {
    if (cart.length === 0 && !placed) {
      navigate("/shop");
    }
  }, [cart.length, placed, navigate]);

  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 sm:p-12 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <FiLock size={28} />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-3">Login Required</h2>
          <p className="text-gray-500 mb-7">You need to be logged in to proceed to checkout and place your order.</p>
          <Link
            to="/account"
            state={{ redirectTo: "/checkout" }}
            className="block w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 rounded-full transition-colors mb-3"
          >
            Login to Continue
          </Link>
          <Link to="/shop" className="block text-sm text-gray-400 hover:text-gray-600 transition-colors">
            Back to Shopping
          </Link>
        </div>
      </div>
    );
  }

  // ── Step validators ──
  const validateAddress = () => {
    const a = useExistingAddr != null ? savedAddresses.find((a) => a.id === useExistingAddr) : address;
    if (!a) { toast.error("Please select or enter an address"); return false; }
    const required = [a.name, a.phone, a.line1, a.city, a.state, a.pincode];
    if (required.some((f) => !f?.trim())) { toast.error("Please fill all required address fields"); return false; }
    if (!/^\d{6}$/.test(a.pincode)) { toast.error("Enter a valid 6-digit pincode"); return false; }
    if (!/^\d{10}$/.test(a.phone)) { toast.error("Enter a valid 10-digit phone number"); return false; }
    return true;
  };

  const validatePayment = () => {
    if (paymentMethod === "upi" && !upiId.trim()) { toast.error("Please enter your UPI ID"); return false; }
    if (paymentMethod === "upi" && !upiId.includes("@")) { toast.error("Enter a valid UPI ID (e.g. name@upi)"); return false; }
    return true;
  };

  const handleNext = () => {
    if (step === 1 && !validateAddress()) return;
    if (step === 2 && !validatePayment()) return;
    setStep((s) => s + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setStep((s) => s - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePlaceOrder = async () => {
    if (!validateAddress() || !validatePayment()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    const finalAddress = useExistingAddr != null
      ? savedAddresses.find((a) => a.id === useExistingAddr)
      : address;
    const order = placeOrder({
      address: finalAddress,
      paymentMethod,
      upiId,
      cartItems: cart,
      subtotal: cartSubtotal,
      deliveryFee,
      taxAmount,
      total: cartTotal,
      savings: cartSavings,
    });
    setLoading(false);
    setPlaced(order);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const activeAddress = useExistingAddr != null
    ? savedAddresses.find((a) => a.id === useExistingAddr)
    : address;

  // ── ORDER SUCCESS ──
  if (placed) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-12 max-w-lg w-full text-center">
          <div className="w-20 h-20 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <FiCheck size={36} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">Order Confirmed! 🎉</h2>
          <p className="text-gray-500 mb-6">Your order has been placed successfully. You'll receive a confirmation shortly.</p>
          <div className="bg-gray-50 rounded-2xl px-6 py-4 mb-6 text-left space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Order ID</span>
              <span className="font-bold text-gray-900 font-mono">{placed.id}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Items</span>
              <span className="font-semibold">{placed.itemCount} item{placed.itemCount > 1 ? "s" : ""}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Payment</span>
              <span className="font-semibold capitalize">{PAYMENT_METHODS.find((p) => p.id === placed.paymentMethod)?.label}</span>
            </div>
            <div className="flex justify-between text-sm border-t border-gray-200 pt-2 mt-2">
              <span className="text-gray-700 font-bold">Total Paid</span>
              <span className="font-extrabold text-primary-700 text-base">₹{placed.total.toFixed(0)}</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/account" className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 rounded-full transition-colors text-sm text-center">
              View My Orders
            </Link>
            <Link to="/shop" className="flex-1 border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-3.5 rounded-full transition-colors text-sm text-center">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8">
          <Link to="/shop" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors mb-3">
            <FiArrowLeft size={14} /> Back to shopping
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Checkout</h1>
        </div>

        {/* Stepper */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 mb-6">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-100 z-0" />
            <div
              className="absolute top-5 left-0 h-0.5 bg-primary-500 z-0 transition-all duration-500"
              style={{ width: step === 1 ? "0%" : step === 2 ? "50%" : "100%" }}
            />
            {STEPS.map((s) => {
              const Icon = s.icon;
              const done = step > s.id;
              const active = step === s.id;
              return (
                <div key={s.id} className="flex flex-col items-center gap-2 relative z-10">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                      done ? "bg-primary-600 text-white shadow-md" :
                      active ? "bg-primary-600 text-white ring-4 ring-primary-100 shadow-md" :
                      "bg-white border-2 border-gray-200 text-gray-400"
                    }`}
                  >
                    {done ? <FiCheck size={16} /> : <Icon size={16} />}
                  </div>
                  <span className={`text-xs font-semibold hidden sm:block ${active ? "text-primary-700" : done ? "text-primary-500" : "text-gray-400"}`}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main panel */}
          <div className="lg:col-span-2 space-y-4">

            {/* ── STEP 1: Address ── */}
            {step === 1 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-7">
                <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                  <FiMapPin className="text-primary-600" /> Delivery Address
                </h2>

                {/* Saved addresses */}
                {savedAddresses.length > 0 && (
                  <div className="mb-6">
                    <p className="text-sm font-semibold text-gray-700 mb-3">Saved Addresses</p>
                    <div className="space-y-2">
                      {savedAddresses.map((addr) => (
                        <label
                          key={addr.id}
                          className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            useExistingAddr === addr.id
                              ? "border-primary-500 bg-primary-50"
                              : "border-gray-100 hover:border-gray-200"
                          }`}
                        >
                          <input
                            type="radio"
                            name="savedAddr"
                            checked={useExistingAddr === addr.id}
                            onChange={() => setUseExistingAddr(addr.id)}
                            className="mt-0.5 accent-primary-600"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 text-sm">{addr.name}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}, {addr.city}, {addr.state} – {addr.pincode}</p>
                            <p className="text-xs text-gray-400">📞 {addr.phone}</p>
                          </div>
                        </label>
                      ))}
                      <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        useExistingAddr === null ? "border-primary-500 bg-primary-50" : "border-gray-100 hover:border-gray-200"
                      }`}>
                        <input
                          type="radio"
                          name="savedAddr"
                          checked={useExistingAddr === null}
                          onChange={() => setUseExistingAddr(null)}
                          className="accent-primary-600"
                        />
                        <span className="text-sm font-semibold text-primary-700">+ Add a new address</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* New address form */}
                {useExistingAddr === null && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2 sm:grid sm:grid-cols-2 gap-4 flex flex-col">
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Full Name *</label>
                        <input
                          className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                          placeholder="Your full name"
                          value={address.name}
                          onChange={(e) => setAddress((a) => ({ ...a, name: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Phone Number *</label>
                        <input
                          className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                          placeholder="10-digit mobile number"
                          value={address.phone}
                          maxLength={10}
                          onChange={(e) => setAddress((a) => ({ ...a, phone: e.target.value.replace(/\D/g, "") }))}
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Address Line 1 *</label>
                      <input
                        className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                        placeholder="House/Flat no., Building name, Street"
                        value={address.line1}
                        onChange={(e) => setAddress((a) => ({ ...a, line1: e.target.value }))}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Address Line 2</label>
                      <input
                        className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                        placeholder="Area, Landmark (optional)"
                        value={address.line2}
                        onChange={(e) => setAddress((a) => ({ ...a, line2: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">City *</label>
                      <input
                        className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                        placeholder="City"
                        value={address.city}
                        onChange={(e) => setAddress((a) => ({ ...a, city: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">State *</label>
                      <input
                        className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                        placeholder="State"
                        value={address.state}
                        onChange={(e) => setAddress((a) => ({ ...a, state: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Pincode *</label>
                      <input
                        className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                        placeholder="6-digit pincode"
                        value={address.pincode}
                        maxLength={6}
                        onChange={(e) => setAddress((a) => ({ ...a, pincode: e.target.value.replace(/\D/g, "") }))}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── STEP 2: Payment ── */}
            {step === 2 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-7">
                <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                  <FiCreditCard className="text-primary-600" /> Payment Method
                </h2>
                <div className="space-y-3">
                  {PAYMENT_METHODS.map((pm) => (
                    <label
                      key={pm.id}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        paymentMethod === pm.id
                          ? "border-primary-500 bg-primary-50"
                          : "border-gray-100 hover:border-gray-200"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={pm.id}
                        checked={paymentMethod === pm.id}
                        onChange={() => setPaymentMethod(pm.id)}
                        className="accent-primary-600"
                      />
                      <span className="text-2xl">{pm.icon}</span>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 text-sm">{pm.label}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{pm.desc}</p>
                      </div>
                      {paymentMethod === pm.id && (
                        <span className="w-5 h-5 bg-primary-600 rounded-full flex items-center justify-center">
                          <FiCheck size={11} className="text-white" />
                        </span>
                      )}
                    </label>
                  ))}
                </div>

                {/* UPI ID field */}
                {paymentMethod === "upi" && (
                  <div className="mt-5 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                    <label className="block text-xs font-bold text-blue-700 mb-2 flex items-center gap-1.5">
                      <FiSmartphone size={13} /> Enter your UPI ID *
                    </label>
                    <input
                      className="w-full border border-blue-200 bg-white rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                      placeholder="yourname@upi  (e.g. john@oksbi)"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                    />
                    <p className="text-xs text-blue-400 mt-1.5">Supported: Google Pay, PhonePe, Paytm, BHIM, etc.</p>
                  </div>
                )}

                {paymentMethod === "card" && (
                  <div className="mt-5 p-4 bg-gray-50 border border-gray-100 rounded-xl flex items-start gap-3">
                    <FiAlertCircle size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-gray-500">Card payment integration would connect to a payment gateway (Razorpay, Stripe) in production. For this demo, your order will be confirmed instantly.</p>
                  </div>
                )}
              </div>
            )}

            {/* ── STEP 3: Review ── */}
            {step === 3 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-7 space-y-5">
                <h2 className="text-lg font-bold text-gray-900">Review Your Order</h2>

                {/* Address summary */}
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Delivering to</p>
                  {activeAddress && (
                    <>
                      <p className="font-semibold text-gray-900">{activeAddress.name}</p>
                      <p className="text-sm text-gray-500 mt-0.5">{activeAddress.line1}{activeAddress.line2 ? `, ${activeAddress.line2}` : ""}, {activeAddress.city}, {activeAddress.state} – {activeAddress.pincode}</p>
                      <p className="text-sm text-gray-400 mt-0.5">📞 {activeAddress.phone}</p>
                    </>
                  )}
                  <button onClick={() => setStep(1)} className="text-xs text-primary-600 font-semibold mt-2 hover:underline">
                    Change address
                  </button>
                </div>

                {/* Payment summary */}
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Payment method</p>
                  <p className="font-semibold text-gray-900">
                    {PAYMENT_METHODS.find((p) => p.id === paymentMethod)?.icon} {" "}
                    {PAYMENT_METHODS.find((p) => p.id === paymentMethod)?.label}
                  </p>
                  {paymentMethod === "upi" && upiId && (
                    <p className="text-sm text-gray-500 mt-0.5">UPI ID: {upiId}</p>
                  )}
                  <button onClick={() => setStep(2)} className="text-xs text-primary-600 font-semibold mt-2 hover:underline">
                    Change payment
                  </button>
                </div>

                {/* Items */}
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Order Items ({cart.length})</p>
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover bg-gray-50 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 truncate">{item.name}</p>
                          <p className="text-xs text-gray-400">Qty: {item.qty} × ₹{item.price}</p>
                        </div>
                        <p className="font-bold text-gray-900 text-sm flex-shrink-0">₹{(item.price * item.qty).toFixed(0)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex items-center justify-between gap-3">
              {step > 1 ? (
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 px-5 py-3 border border-gray-200 rounded-full text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <FiArrowLeft size={14} /> Back
                </button>
              ) : (
                <Link to="/shop" className="flex items-center gap-2 px-5 py-3 border border-gray-200 rounded-full text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                  <FiArrowLeft size={14} /> Back to Shop
                </Link>
              )}
              {step < 3 ? (
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold px-7 py-3 rounded-full transition-colors shadow-sm"
                >
                  Continue <FiChevronRight size={15} />
                </button>
              ) : (
                <button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white font-bold px-7 py-3 rounded-full transition-colors shadow-sm"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Placing Order…
                    </>
                  ) : (
                    <>
                      <FiLock size={14} /> Place Order
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* ── ORDER SUMMARY SIDEBAR ── */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4">Order Summary</h3>
              <div className="space-y-3 mb-4 max-h-56 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover bg-gray-50 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-700 truncate">{item.name}</p>
                      <p className="text-xs text-gray-400">×{item.qty}</p>
                    </div>
                    <p className="text-xs font-bold text-gray-800 flex-shrink-0">₹{(item.price * item.qty).toFixed(0)}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span><span className="font-medium">₹{cartSubtotal.toFixed(0)}</span>
                </div>
                {cartSavings > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Savings</span><span className="font-semibold">-₹{Math.round(cartSavings)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Delivery</span>
                  {deliveryFee === 0 ? (
                    <span className="text-primary-600 font-semibold">FREE</span>
                  ) : (
                    <span className="font-medium">₹{deliveryFee}</span>
                  )}
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Tax (5%)</span><span className="font-medium">₹{taxAmount}</span>
                </div>
                <div className="flex justify-between font-extrabold text-gray-900 text-base border-t border-gray-100 pt-3">
                  <span>Total</span><span className="text-primary-700">₹{cartTotal.toFixed(0)}</span>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
                <FiLock size={12} /><span>Secure 256-bit SSL encrypted checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
