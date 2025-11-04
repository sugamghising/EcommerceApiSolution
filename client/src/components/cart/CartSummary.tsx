import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import Button from "../common/Button";

const CartSummary: React.FC = () => {
  const navigate = useNavigate();
  const { items, total } = useCart();

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const shipping = total > 50 ? 0 : 5.99;
  const tax = total * 0.1; // 10% tax
  const grandTotal = total + shipping + tax;

  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <div className="card p-6 sticky top-24">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

      <div className="space-y-3 mb-4">
        <div className="flex justify-between text-gray-600">
          <span>Items ({itemCount}):</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Shipping:</span>
          <span>{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Tax (10%):</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        {total > 0 && total <= 50 && (
          <p className="text-sm text-primary-600">
            Add ${(50 - total).toFixed(2)} more for free shipping!
          </p>
        )}
      </div>

      <div className="border-t pt-3 mb-4">
        <div className="flex justify-between text-lg font-bold text-gray-900">
          <span>Total:</span>
          <span>${grandTotal.toFixed(2)}</span>
        </div>
      </div>

      <Button
        variant="primary"
        onClick={handleCheckout}
        disabled={items.length === 0}
        className="w-full"
      >
        Proceed to Checkout
      </Button>

      <p className="text-xs text-gray-500 text-center mt-3">
        Taxes calculated at checkout
      </p>
    </div>
  );
};

export default CartSummary;
