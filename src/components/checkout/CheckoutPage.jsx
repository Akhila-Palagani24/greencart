import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiCheck,
  FiMapPin,
  FiCreditCard,
  FiTruck,
  FiShoppingBag,
  FiChevronLeft,
  FiCheckCircle,
  FiCopy,
} from "react-icons/fi";
import { useApp } from "../../context/AppContext";
import toast from "react-hot-toast";

const STEPS = [
  { id: 1, label: "Review", icon: FiShoppingBag },
  { id: 2, label: "Address", icon: FiMapPin },
  { id: 3, label: "Payment", icon: FiCreditCard },
  { id: 4, label: "Done", icon: FiCheckCircle },
];

const generateOrderId = () => {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `GC-${ts}-${rand}`;
};

const CheckoutPage = () => {
  const {
    cart,
    cartSubtotal,
    cartSavings,
    deliveryFee,
    taxAmount,
    cartTotal,
    clearCart,
    user,
  } = useApp();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [orderId, setOrderId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("card");

  const [address, setAddress] = useState({
    name: user?.name || "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvv: "" });

  // Empty cart guard (only relevant before order placed)
  if (cart.length === 0 && step !== 4) {
    return (
      <div className="container-px py-20 text-center">
        <span className="text-5xl block mb-4">🛍️</span>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Add some products before checking out.</p>
        <Link to="/shop" className="btn-primary">
          Continue Shopping
        </Link>
      </div>
    );
  }

  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleCardChange = (e) => {
    setCard({ ...card, [e.target.name]: e.target.value });
  };

  const validateAddress = () => {
    const required = ["name", "phone", "line1", "city", "state", "pincode"];
    for (const field of required) {
      if (!address[field]?.trim()) {
        toast.error("Please fill in all required address fields");
        return false;
      }
    }
    if (!/^\d{10}$/.test(address.phone)) {
      toast.error("Please enter a valid 10-digit phone number");
      return false;
    }
    if (!/^\d{6}$/.test(address.pincode)) {
      toast.error("Please enter a valid 6-digit pincode");
      return false;
    }
    return true;
  };

  const validatePayment = () => {
    if (paymentMethod === "card") {
      if (!/^\d{16}$/.test(card.number.replace(/\s/g, ""))) {
        toast.error("Please enter a valid 16-digit card number");
        return false;
      }
      if (!card.name.trim()) {
        toast.error("Please enter the name on card");
        return false;
      }
      if (!/^\d{2}\/\d{2}$/.test(card.expiry)) {
        toast.error("Please enter expiry as MM/YY");
        return false;
      }
      if (!/^\d{3,4}$/.test(card.cvv)) {
        toast.error("Please enter a valid CVV");
        return false;
      }
    }
    return true;
  };

  const goNext = () => {
    if (step === 2 && !validateAddress()) return;
    if (step === 3) {
      if (!validatePayment()) return;
      const id = generateOrderId();
      setOrderId(id);
      clearCart();
      toast.success("Order placed successfully!");
    }
    setStep((s) => Math.min(4, s + 1));
  };

  const goBack = () => setStep((s) => Math.max(1, s - 1));

  const copyOrderId = () => {
    navigator.clipboard?.writeText(orderId);
    toast.success("Order ID copied!");
  };

  return (
    <div className="container-px py-6 sm:py-8 max-w-4xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Checkout</h1>

      {/* Step indicator */}
      <div className="flex items-center justify-between mb-8 max-w-xl mx-auto">
        {STEPS.map((s, idx) => {
          const Icon = s.icon;
          const isActive = step === s.id;
          const isDone = step > s.id;
          return (
            <React.Fragment key={s.id}>
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-colors duration-300 ${
                    isDone
                      ? "bg-primary-600 text-white"
                      : isActive
                      ? "bg-primary-100 text-primary-700 ring-2 ring-primary-600"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {isDone ? <FiCheck size={18} /> : <Icon size={16} />}
                </div>
                <span className={`text-xs font-medium ${isActive || isDone ? "text-primary-700" : "text-gray-400"}`}>
                  {s.label}
                </span>
              </div>
              {idx < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-1 sm:mx-2 transition-colors duration-300 ${step > s.id ? "bg-primary-600" : "bg-gray-200"}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2">
          <div className="card p-5 sm:p-6">
            {/* STEP 1: Review */}
            {step === 1 && (
              <div className="animate-fade-in">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Review Your Order</h2>
                <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 border-b border-gray-100 pb-3 last:border-0">
                      <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover bg-gray-50" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 line-clamp-1">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.unit} × {item.qty}</p>
                      </div>
                      <span className="text-sm font-bold text-gray-900">₹{item.price * item.qty}</span>
                    </div>
                  ))}
                </div>
                <Link to="/shop" className="text-sm font-semibold text-primary-600 hover:underline">
                  ← Continue Shopping
                </Link>
              </div>
            )}

            {/* STEP 2: Address */}
            {step === 2 && (
              <div className="animate-fade-in">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Delivery Address</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Full Name *</label>
                    <input name="name" value={address.name} onChange={handleAddressChange} className="input-field" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Phone Number *</label>
                    <input name="phone" value={address.phone} onChange={handleAddressChange} className="input-field" placeholder="9876543210" maxLength={10} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Pincode *</label>
                    <input name="pincode" value={address.pincode} onChange={handleAddressChange} className="input-field" placeholder="560001" maxLength={6} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Address Line 1 *</label>
                    <input name="line1" value={address.line1} onChange={handleAddressChange} className="input-field" placeholder="House no., Street name" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Address Line 2 (optional)</label>
                    <input name="line2" value={address.line2} onChange={handleAddressChange} className="input-field" placeholder="Landmark, Apartment" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">City *</label>
                    <input name="city" value={address.city} onChange={handleAddressChange} className="input-field" placeholder="Bengaluru" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">State *</label>
                    <input name="state" value={address.state} onChange={handleAddressChange} className="input-field" placeholder="Karnataka" />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Payment */}
            {step === 3 && (
              <div className="animate-fade-in">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Payment Method</h2>
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {[
                    { id: "card", label: "Card" },
                    { id: "upi", label: "UPI" },
                    { id: "cod", label: "Cash on Delivery" },
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setPaymentMethod(m.id)}
                      className={`text-sm font-semibold rounded-xl py-3 border-2 transition-colors ${
                        paymentMethod === m.id
                          ? "border-primary-600 bg-primary-50 text-primary-700"
                          : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>

                {paymentMethod === "card" && (
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Card Number *</label>
                      <input
                        name="number"
                        value={card.number}
                        onChange={handleCardChange}
                        className="input-field"
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Name on Card *</label>
                      <input name="name" value={card.name} onChange={handleCardChange} className="input-field" placeholder="John Doe" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Expiry (MM/YY) *</label>
                      <input name="expiry" value={card.expiry} onChange={handleCardChange} className="input-field" placeholder="12/28" maxLength={5} />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">CVV *</label>
                      <input name="cvv" value={card.cvv} onChange={handleCardChange} className="input-field" placeholder="123" maxLength={4} type="password" />
                    </div>
                  </div>
                )}

                {paymentMethod === "upi" && (
                  <div className="bg-gray-50 rounded-xl p-6 text-center">
                    <p className="text-sm text-gray-600 mb-2">Scan the QR code or enter UPI ID at payment time</p>
                    <div className="w-32 h-32 bg-white border-2 border-dashed border-gray-300 rounded-xl mx-auto flex items-center justify-center text-3xl">
                      📱
                    </div>
                    <p className="text-xs text-gray-400 mt-3">pay@greencart (demo)</p>
                  </div>
                )}

                {paymentMethod === "cod" && (
                  <div className="bg-gray-50 rounded-xl p-6 text-center text-sm text-gray-600">
                    <FiTruck className="mx-auto mb-2 text-primary-600" size={28} />
                    Pay with cash when your order arrives. Please keep exact change ready.
                  </div>
                )}
              </div>
            )}

            {/* STEP 4: Confirmation */}
            {step === 4 && (
              <div className="animate-fade-in text-center py-6">
                <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiCheckCircle className="text-primary-600" size={40} />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Order Confirmed!</h2>
                <p className="text-gray-500 mb-5">
                  Thank you{address.name ? `, ${address.name}` : ""}! Your order has been placed successfully and will be delivered soon.
                </p>
                <div className="inline-flex items-center gap-2 bg-gray-50 rounded-full px-4 py-2 mb-6">
                  <span className="text-sm text-gray-500">Order ID:</span>
                  <span className="text-sm font-bold text-gray-900">{orderId}</span>
                  <button onClick={copyOrderId} aria-label="Copy order ID" className="text-gray-400 hover:text-primary-600">
                    <FiCopy size={14} />
                  </button>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link to="/" className="btn-primary">Back to Home</Link>
                  <Link to="/shop" className="btn-outline">Continue Shopping</Link>
                </div>
              </div>
            )}

            {/* Nav buttons */}
            {step < 4 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                <button
                  onClick={goBack}
                  disabled={step === 1}
                  className="flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-gray-900 disabled:opacity-0 disabled:pointer-events-none transition-colors"
                >
                  <FiChevronLeft /> Back
                </button>
                <button onClick={goNext} className="btn-primary">
                  {step === 3 ? "Place Order" : "Continue"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Order summary sidebar */}
        {step < 4 && (
          <div className="lg:col-span-1">
            <div className="card p-5 sticky top-20">
              <h3 className="font-bold text-gray-900 mb-4">Order Summary</h3>
              <div className="space-y-2 mb-3">
                {cartSavings > 0 && (
                  <div className="flex justify-between text-sm text-primary-600 font-medium">
                    <span>You're saving</span>
                    <span>₹{cartSavings}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal ({cart.reduce((s, i) => s + i.qty, 0)} items)</span>
                  <span>₹{cartSubtotal}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Delivery</span>
                  <span>{deliveryFee === 0 ? <span className="text-primary-600 font-semibold">FREE</span> : `₹${deliveryFee}`}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Tax (5%)</span>
                  <span>₹{taxAmount}</span>
                </div>
              </div>
              <div className="flex justify-between text-base font-bold text-gray-900 pt-3 border-t border-gray-100">
                <span>Total</span>
                <span>₹{cartTotal}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
