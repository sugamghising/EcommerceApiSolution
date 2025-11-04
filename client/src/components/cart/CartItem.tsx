import React from "react";
import { CartItem as CartItemType } from "../../api/cart";
import { useCart } from "../../contexts/CartContext";
import Button from "../common/Button";

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeItem, loading } = useCart();
  const [localLoading, setLocalLoading] = React.useState(false);

  const handleQuantityChange = async (newQuantity: number) => {
    try {
      setLocalLoading(true);
      await updateQuantity(item.product._id, newQuantity);
    } catch (error) {
      console.error("Error updating quantity:", error);
    } finally {
      setLocalLoading(false);
    }
  };

  const handleRemove = async () => {
    try {
      setLocalLoading(true);
      await removeItem(item.product._id);
    } catch (error) {
      console.error("Error removing item:", error);
    } finally {
      setLocalLoading(false);
    }
  };

  const subtotal = item.product.price * item.quantity;

  return (
    <div className="flex items-center space-x-4 py-4 border-b">
      <img
        src={item.product.imageUrl || "https://via.placeholder.com/100"}
        alt={item.product.name}
        className="w-20 h-20 object-cover rounded"
      />
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900">{item.product.name}</h3>
        <p className="text-sm text-gray-600 line-clamp-1">
          {item.product.description}
        </p>
        <p className="text-primary-600 font-semibold mt-1">
          ${item.product.price.toFixed(2)}
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => handleQuantityChange(item.quantity - 1)}
          disabled={localLoading || loading || item.quantity <= 1}
          className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          aria-label="Decrease quantity"
        >
          -
        </button>
        <span className="w-12 text-center font-medium">{item.quantity}</span>
        <button
          onClick={() => handleQuantityChange(item.quantity + 1)}
          disabled={
            localLoading || loading || item.quantity >= item.product.stock
          }
          className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
      <div className="text-right">
        <p className="font-bold text-gray-900">${subtotal.toFixed(2)}</p>
        <Button
          variant="danger"
          size="sm"
          onClick={handleRemove}
          loading={localLoading}
          className="mt-2"
        >
          Remove
        </Button>
      </div>
    </div>
  );
};

export default CartItem;
