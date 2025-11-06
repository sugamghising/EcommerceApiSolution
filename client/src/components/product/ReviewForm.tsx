import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { AddReviewData } from "../../api/review";
import Button from "../common/Button";
import StarRating from "../common/StarRating";

interface ReviewFormProps {
  onSubmit: (data: AddReviewData) => Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
  initialData?: AddReviewData;
  isEdit?: boolean;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  onSubmit,
  onCancel,
  loading = false,
  initialData,
  isEdit = false,
}) => {
  const [rating, setRating] = useState(initialData?.rating || 0);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddReviewData>({
    defaultValues: initialData,
  });

  const handleFormSubmit = async (data: AddReviewData) => {
    if (rating === 0) {
      alert("Please select a rating");
      return;
    }
    await onSubmit({ ...data, rating });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rating *
        </label>
        <StarRating rating={rating} onRatingChange={setRating} size="lg" />
        {rating === 0 && (
          <p className="mt-1 text-sm text-red-600">Please select a rating</p>
        )}
      </div>

      <div>
        <label
          htmlFor="comment"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Your Review (Optional)
        </label>
        <textarea
          {...register("comment")}
          id="comment"
          rows={4}
          className="input"
          placeholder="Share your experience with this product..."
        />
      </div>

      <div className="flex space-x-3 pt-4">
        <Button
          type="submit"
          variant="primary"
          loading={loading}
          className="flex-1"
        >
          {isEdit ? "Update Review" : "Submit Review"}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            className="flex-1"
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};

export default ReviewForm;
