import React from "react";
import { useNavigate } from "react-router-dom";
import { Product } from "../../api/product";
import { useCart } from "../../contexts/CartContext";
import Button from "../common/Button";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [loading, setLoading] = React.useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setLoading(true);
      await addItem(product, 1);
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = () => {
    navigate(`/products/${product._id}`);
  };

  return (
    <div
      className="card hover:shadow-xl transition-shadow cursor-pointer"
      onClick={handleCardClick}
      role="article"
      aria-label={`Product: ${product.name}`}
    >
      <div className="aspect-w-16 aspect-h-9 bg-gray-200">
        <img
          src={
            product.imageUrl ||
            "https://via.placeholder.com/400x300?text=No+Image"
          }
          alt={product.name}
          className="w-full h-48 object-cover"
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-primary-600">
            ${product.price.toFixed(2)}
          </span>
          <span className="text-sm text-gray-500">
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded">
            {product.category}
          </span>
          <Button
            variant="primary"
            size="sm"
            onClick={handleAddToCart}
            disabled={product.stock === 0 || loading}
            loading={loading}
            aria-label={`Add ${product.name} to cart`}
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
