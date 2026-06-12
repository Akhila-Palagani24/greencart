import React from "react";
import { Link } from "react-router-dom";
import { FiHome, FiShoppingBag } from "react-icons/fi";

const NotFoundPage = () => {
  return (
    <div className="container-px py-20 text-center">
      <span className="text-6xl block mb-4">🥬</span>
      <h1 className="text-4xl font-extrabold text-gray-900 mb-2">404</h1>
      <h2 className="text-lg font-semibold text-gray-700 mb-2">Page Not Found</h2>
      <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
        Looks like this aisle doesn't exist. Let's get you back to shopping fresh groceries.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link to="/" className="btn-primary flex items-center justify-center gap-2">
          <FiHome size={16} /> Back to Home
        </Link>
        <Link to="/shop" className="btn-outline flex items-center justify-center gap-2">
          <FiShoppingBag size={16} /> Browse Shop
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
