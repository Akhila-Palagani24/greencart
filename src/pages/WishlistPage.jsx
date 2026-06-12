import React from "react";
import { Link } from "react-router-dom";
import { FiHeart } from "react-icons/fi";
import { useApp } from "../context/AppContext";
import ProductCard from "../components/product/ProductCard";

const WishlistPage = () => {
  const { wishlist, products } = useApp();

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="container-px py-6 sm:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">My Wishlist</h1>
      <p className="text-sm text-gray-500 mb-6">{wishlistProducts.length} saved items</p>

      {wishlistProducts.length === 0 ? (
        <div className="text-center py-20">
          <FiHeart className="mx-auto text-gray-300 mb-4" size={56} />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Your wishlist is empty</h3>
          <p className="text-sm text-gray-500 mb-4">Save items you love by tapping the heart icon.</p>
          <Link to="/shop" className="btn-primary">
            Discover Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-5">
          {wishlistProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
