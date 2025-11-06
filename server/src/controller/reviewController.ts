import { Request, Response } from "express";
import Review, { IReview } from "../models/Review";
import Product from "../models/Product";

// Get all reviews for a product
export const getProductReviews = async (req: Request, res: Response) => {
    try {
        const { productId } = req.params;

        const reviews = await Review.find({ product: productId })
            .populate('user', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: reviews.length,
            reviews,
        });
    } catch (error) {
        console.error("Error in getProductReviews:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Add a review to a product
export const addReview = async (req: Request, res: Response) => {
    try {
        const { productId } = req.params;
        const { rating, comment } = req.body;
        const userId = req.user?._id;

        // Validate rating
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: "Rating must be between 1 and 5" });
        }

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Check if user already reviewed this product
        const existingReview = await Review.findOne({
            user: userId,
            product: productId,
        });

        if (existingReview) {
            return res.status(400).json({
                message: "You have already reviewed this product. You can update your review instead.",
            });
        }

        // Create review
        const review = await Review.create({
            user: userId,
            product: productId,
            rating,
            comment: comment || "",
        });

        // Populate user data
        await review.populate('user', 'name email');

        // Update product ratings
        await updateProductRatings(productId as string);

        res.status(201).json({
            success: true,
            message: "Review added successfully",
            review,
        });
    } catch (error) {
        console.error("Error in addReview:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Update user's own review
export const updateReview = async (req: Request, res: Response) => {
    try {
        const { reviewId } = req.params;
        const { rating, comment } = req.body;
        const userId = req.user?._id;

        const review = await Review.findById(reviewId);

        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        // Check if user owns this review
        if ((review.user as any).toString() !== userId?.toString()) {
            return res.status(403).json({
                message: "You can only update your own reviews",
            });
        }

        // Validate rating if provided
        if (rating && (rating < 1 || rating > 5)) {
            return res.status(400).json({ message: "Rating must be between 1 and 5" });
        }

        // Update review
        if (rating !== undefined) review.rating = rating;
        if (comment !== undefined) review.comment = comment;

        await review.save();
        await review.populate('user', 'name email');

        // Update product ratings
        await updateProductRatings((review.product as any).toString());

        res.status(200).json({
            success: true,
            message: "Review updated successfully",
            review,
        });
    } catch (error) {
        console.error("Error in updateReview:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Delete review (user's own or admin can delete any)
export const deleteReview = async (req: Request, res: Response) => {
    try {
        const { reviewId } = req.params;
        const userId = req.user?._id;
        const userRole = req.user?.role;

        const review = await Review.findById(reviewId);

        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        // Check if user owns this review or is admin
        if ((review.user as any).toString() !== userId?.toString() && userRole !== 'admin') {
            return res.status(403).json({
                message: "You can only delete your own reviews",
            });
        }

        const productId = (review.product as any).toString();

        await Review.findByIdAndDelete(reviewId);

        // Update product ratings
        await updateProductRatings(productId);

        res.status(200).json({
            success: true,
            message: "Review deleted successfully",
        });
    } catch (error) {
        console.error("Error in deleteReview:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get user's review for a specific product
export const getUserReviewForProduct = async (req: Request, res: Response) => {
    try {
        const { productId } = req.params;
        const userId = req.user?._id;

        const review = await Review.findOne({
            user: userId,
            product: productId,
        }).populate('user', 'name email');

        if (!review) {
            return res.status(404).json({
                success: false,
                message: "You haven't reviewed this product yet",
            });
        }

        res.status(200).json({
            success: true,
            review,
        });
    } catch (error) {
        console.error("Error in getUserReviewForProduct:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Helper function to update product ratings
const updateProductRatings = async (productId: string) => {
    try {
        const reviews = await Review.find({ product: productId });

        const numReviews = reviews.length;
        const avgRating = numReviews > 0
            ? reviews.reduce((sum, review) => sum + review.rating, 0) / numReviews
            : 0;

        await Product.findByIdAndUpdate(productId, {
            ratings: Math.round(avgRating * 10) / 10, // Round to 1 decimal
            numReviews,
        });
    } catch (error) {
        console.error("Error updating product ratings:", error);
    }
};
