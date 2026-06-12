import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiFacebook,
  FiInstagram,
  FiTwitter,
  FiMail,
  FiPhone,
  FiMapPin,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { CATEGORIES } from "../../data/products";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    toast.success("Subscribed! Check your inbox for updates.");
    setEmail("");
  };

  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="container-px py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand + newsletter */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🛒</span>
              <span className="text-xl font-extrabold text-white">
                Green<span className="text-primary-400">Cart</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 mb-5 max-w-sm">
              Fresh groceries, delivered to your doorstep. Quality produce, dairy,
              bakery items and more — sourced responsibly, priced fairly.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="flex-1 rounded-full bg-gray-800 border border-gray-700 px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                type="submit"
                className="bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-primary-400 transition-colors">Home</Link></li>
              <li><Link to="/shop" className="hover:text-primary-400 transition-colors">Shop</Link></li>
              <li><Link to="/wishlist" className="hover:text-primary-400 transition-colors">Wishlist</Link></li>
              <li><Link to="/account" className="hover:text-primary-400 transition-colors">My Account</Link></li>
              <li><Link to="/checkout" className="hover:text-primary-400 transition-colors">Checkout</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 text-sm">
              {CATEGORIES.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <Link to={`/shop?category=${cat.id}`} className="hover:text-primary-400 transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Get in Touch</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <FiMapPin className="mt-0.5 flex-shrink-0" />
                <span>123 Market Street, Green Valley, CA 90210</span>
              </li>
              <li className="flex items-center gap-2">
                <FiPhone className="flex-shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-2">
                <FiMail className="flex-shrink-0" />
                <span>support@greencart.com</span>
              </li>
            </ul>
            <div className="flex gap-3 mt-4">
              <a href="#" aria-label="Facebook" className="p-2 bg-gray-800 rounded-full hover:bg-primary-600 transition-colors">
                <FiFacebook size={16} />
              </a>
              <a href="#" aria-label="Instagram" className="p-2 bg-gray-800 rounded-full hover:bg-primary-600 transition-colors">
                <FiInstagram size={16} />
              </a>
              <a href="#" aria-label="Twitter" className="p-2 bg-gray-800 rounded-full hover:bg-primary-600 transition-colors">
                <FiTwitter size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="container-px py-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} GreenCart. All rights reserved.</p>
          <p>Made with 💚 for fresh living.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
