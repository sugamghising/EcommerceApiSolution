import axiosInstance from './axios';

export interface Review {
    _id: string;
    user: {
        _id: string;
        name: string;
        email: string;
    };
    product: string;
    rating: number;
    comment?: string;
    createdAt: string;
    updatedAt: string;
}

export interface ReviewsResponse {
    success: boolean;
    count: number;
    reviews: Review[];
}

export interface AddReviewData {
    rating: number;
    comment?: string;
}

export interface UpdateReviewData {
    rating?: number;
    comment?: string;
}

export const reviewAPI = {
    // Get all reviews for a product (public)
    getProductReviews: async (productId: string): Promise<Review[]> => {
        const response = await axiosInstance.get<ReviewsResponse>(
            `/reviews/product/${productId}`
        );
        return response.data.reviews;
    },

    // Get user's review for a product (protected)
    getUserReviewForProduct: async (productId: string): Promise<Review | null> => {
        try {
            const response = await axiosInstance.get<{ success: boolean; review: Review }>(
                `/reviews/product/${productId}/my-review`
            );
            return response.data.review;
        } catch (error: any) {
            if (error.response?.status === 404) {
                return null; // User hasn't reviewed this product
            }
            throw error;
        }
    },

    // Add a review (protected)
    addReview: async (productId: string, data: AddReviewData): Promise<Review> => {
        const response = await axiosInstance.post<{ success: boolean; message: string; review: Review }>(
            `/reviews/product/${productId}`,
            data
        );
        return response.data.review;
    },

    // Update a review (protected)
    updateReview: async (reviewId: string, data: UpdateReviewData): Promise<Review> => {
        const response = await axiosInstance.put<{ success: boolean; message: string; review: Review }>(
            `/reviews/${reviewId}`,
            data
        );
        return response.data.review;
    },

    // Delete a review (protected)
    deleteReview: async (reviewId: string): Promise<void> => {
        await axiosInstance.delete(`/reviews/${reviewId}`);
    },
};
