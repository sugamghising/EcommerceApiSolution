import express from "express";
import {
    getProductReviews,
    addReview,
    updateReview,
    deleteReview,
    getUserReviewForProduct,
} from "../controller/reviewController";
import { protectRoute, adminOnly } from "../middleware/authMiddleware";

const reviewRouter = express.Router();

// Public routes
reviewRouter.get('/product/:productId', getProductReviews);

// Protected routes (authentication required)
reviewRouter.post('/product/:productId', protectRoute, addReview);
reviewRouter.get('/product/:productId/my-review', protectRoute, getUserReviewForProduct);
reviewRouter.put('/:reviewId', protectRoute, updateReview);
reviewRouter.delete('/:reviewId', protectRoute, deleteReview);

export default reviewRouter;
