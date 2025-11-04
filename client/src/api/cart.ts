import axiosInstance from './axios';
import { Product } from './product';

export interface CartItem {
    product: Product;
    quantity: number;
}

export interface Cart {
    _id?: string;
    items: CartItem[];
    total: number;
}

export interface AddToCartData {
    productId: string;
    quantity: number;
}

export interface UpdateCartItemData {
    productId: string;
    quantity: number;
}

// Backend response format
interface BackendCart {
    _id?: string;
    items: CartItem[];
    totalPrice: number;
}

interface BackendCartResponse {
    message?: string;
    cart?: BackendCart;
    items?: CartItem[];
    totalPrice?: number;
}

// Transform backend cart to frontend format
const transformCart = (data: BackendCartResponse | BackendCart): Cart => {
    // If it's wrapped in a cart object
    if ('cart' in data && data.cart) {
        return {
            _id: data.cart._id,
            items: data.cart.items || [],
            total: data.cart.totalPrice || 0,
        };
    }
    // If it's the direct cart object with totalPrice
    if ('totalPrice' in data) {
        const backendCart = data as BackendCart;
        return {
            _id: backendCart._id,
            items: backendCart.items || [],
            total: backendCart.totalPrice || 0,
        };
    }
    // If it's a direct response with items and totalPrice
    const response = data as BackendCartResponse;
    return {
        items: response.items || [],
        total: response.totalPrice || 0,
    };
};

export const cartAPI = {
    getCart: async (): Promise<Cart> => {
        const response = await axiosInstance.get<BackendCartResponse | BackendCart>('/cart');
        return transformCart(response.data);
    },

    addToCart: async (data: AddToCartData): Promise<Cart> => {
        const response = await axiosInstance.post<BackendCartResponse>('/cart/add', data);
        return transformCart(response.data);
    },

    updateCartItem: async (data: UpdateCartItemData): Promise<Cart> => {
        // Backend doesn't have update endpoint, use add with new quantity
        const response = await axiosInstance.post<BackendCartResponse>('/cart/add', data);
        return transformCart(response.data);
    },

    removeFromCart: async (productId: string): Promise<Cart> => {
        const response = await axiosInstance.delete<BackendCartResponse>('/cart/remove', {
            data: { productId }
        });
        return transformCart(response.data);
    },

    clearCart: async (): Promise<void> => {
        await axiosInstance.delete('/cart/clear');
    },

    syncCart: async (items: CartItem[]): Promise<Cart> => {
        // Since sync endpoint doesn't exist, we'll add items one by one
        for (const item of items) {
            await cartAPI.addToCart({
                productId: item.product._id,
                quantity: item.quantity
            });
        }
        return cartAPI.getCart();
    },
};
