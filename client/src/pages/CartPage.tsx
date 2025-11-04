import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import CartItem from "../components/cart/CartItem";
import CartSummary from "../components/cart/CartSummary";

const CartPage: React.FC = () => {
  const { items } = useCart();

  if (items.length === 0) {
    return (
      <div className="page-container">
        <div className="text-center py-16">
          <svg
            className="mx-auto h-24 w-24 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Your cart is empty
          </h2>
          <p className="mt-2 text-gray-600">
            Start shopping to add items to your cart
          </p>
          <Link to="/products" className="mt-6 inline-block btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="card p-6">
            {items.map((item) => (
              <CartItem key={item.product._id} item={item} />
            ))}
          </div>
        </div>

        <div>
          <CartSummary />
        </div>
      </div>
    </div>
  );
};

export default CartPage;
