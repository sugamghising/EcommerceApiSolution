import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProducts } from "../contexts/ProductContext";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { reviewAPI, Review, AddReviewData } from "../api/review";
import Button from "../components/common/Button";
import Loader from "../components/common/Loader";
import Modal from "../components/common/Modal";
import ReviewForm from "../components/product/ReviewForm";
import ReviewList from "../components/product/ReviewList";
import StarRating from "../components/common/StarRating";

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProductById } = useProducts();
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  // Review states
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [isEditingReview, setIsEditingReview] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;
      try {
        const data = await getProductById(id);
        setProduct(data);

        // Load reviews
        await loadReviews();

        // Load user's review if authenticated
        if (isAuthenticated) {
          await loadUserReview();
        }
      } catch (error) {
        console.error("Error loading product:", error);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
    // getProductById is stable from context
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isAuthenticated]);

  const loadReviews = async () => {
    if (!id) return;
    try {
      const data = await reviewAPI.getProductReviews(id);
      setReviews(data);
    } catch (error) {
      console.error("Error loading reviews:", error);
    }
  };

  const loadUserReview = async () => {
    if (!id) return;
    try {
      const data = await reviewAPI.getUserReviewForProduct(id);
      setUserReview(data);
    } catch (error) {
      console.error("Error loading user review:", error);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      setAddingToCart(true);
      await addItem(product, quantity);
      navigate("/cart");
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleAddReview = async (data: AddReviewData) => {
    if (!id) return;
    try {
      setReviewLoading(true);
      await reviewAPI.addReview(id, data);
      setIsReviewModalOpen(false);
      await loadReviews();
      await loadUserReview();
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to add review");
    } finally {
      setReviewLoading(false);
    }
  };

  const handleUpdateReview = async (data: AddReviewData) => {
    if (!userReview) return;
    try {
      setReviewLoading(true);
      await reviewAPI.updateReview(userReview._id, data);
      setIsReviewModalOpen(false);
      setIsEditingReview(false);
      await loadReviews();
      await loadUserReview();
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to update review");
    } finally {
      setReviewLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    try {
      await reviewAPI.deleteReview(reviewId);
      await loadReviews();
      await loadUserReview();
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to delete review");
    }
  };

  const openReviewModal = (editMode: boolean = false) => {
    setIsEditingReview(editMode);
    setIsReviewModalOpen(true);
  };

  if (loading) return <Loader />;
  if (!product)
    return (
      <div className="page-container">
        <p>Product not found</p>
      </div>
    );

  return (
    <div className="page-container">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-primary-600 hover:text-primary-700 flex items-center"
      >
        ← Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <img
            src={product.imageUrl || "https://via.placeholder.com/600"}
            alt={product.name}
            className="w-full rounded-lg shadow-lg"
          />
        </div>

        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {product.name}
          </h1>
          <p className="text-3xl font-bold text-primary-600 mb-6">
            ${product.price.toFixed(2)}
          </p>

          <div className="mb-6">
            <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
              {product.category}
            </span>
            <span className="ml-3 text-gray-600">
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </span>
          </div>

          {/* Product Rating */}
          {product.numReviews > 0 && (
            <div className="mb-6 flex items-center gap-3">
              <StarRating rating={product.ratings || 0} readonly />
              <span className="text-gray-600">
                {product.ratings?.toFixed(1)} ({product.numReviews}{" "}
                {product.numReviews === 1 ? "review" : "reviews"})
              </span>
            </div>
          )}

          <p className="text-gray-700 mb-8 leading-relaxed">
            {product.description}
          </p>

          <div className="mb-6">
            <label
              htmlFor="quantity"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Quantity
            </label>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300"
              >
                -
              </button>
              <input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                }
                className="w-20 text-center input"
                min="1"
                max={product.stock}
              />
              <button
                onClick={() =>
                  setQuantity(Math.min(product.stock, quantity + 1))
                }
                className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300"
              >
                +
              </button>
            </div>
          </div>

          <Button
            variant="primary"
            size="lg"
            onClick={handleAddToCart}
            disabled={product.stock === 0 || addingToCart}
            loading={addingToCart}
            className="w-full"
          >
            Add to Cart
          </Button>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Customer Reviews ({reviews.length})
          </h2>
          {isAuthenticated && !userReview && (
            <Button variant="primary" onClick={() => openReviewModal(false)}>
              Write a Review
            </Button>
          )}
          {isAuthenticated && userReview && (
            <Button variant="secondary" onClick={() => openReviewModal(true)}>
              Edit Your Review
            </Button>
          )}
        </div>

        <ReviewList
          reviews={reviews}
          onEditReview={() => openReviewModal(true)}
          onDeleteReview={handleDeleteReview}
        />
      </div>

      {/* Review Modal */}
      <Modal
        isOpen={isReviewModalOpen}
        onClose={() => {
          setIsReviewModalOpen(false);
          setIsEditingReview(false);
        }}
        title={isEditingReview ? "Edit Your Review" : "Write a Review"}
      >
        <ReviewForm
          onSubmit={isEditingReview ? handleUpdateReview : handleAddReview}
          onCancel={() => {
            setIsReviewModalOpen(false);
            setIsEditingReview(false);
          }}
          loading={reviewLoading}
          initialData={
            isEditingReview && userReview
              ? {
                  rating: userReview.rating,
                  comment: userReview.comment,
                }
              : undefined
          }
          isEdit={isEditingReview}
        />
      </Modal>
    </div>
  );
};

export default ProductDetail;
