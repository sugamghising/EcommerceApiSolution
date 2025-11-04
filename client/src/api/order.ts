import axiosInstance from './axios';
import { Product } from './product';

export interface OrderItem {
    product: Product | string;
    quantity: number;
    price: number;
}

export interface ShippingAddress {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    postalCode?: string;
    country?: string;
}

export interface Order {
    _id: string;
    user: string;
    items: OrderItem[];
    total: number;
    shippingAddress: ShippingAddress;
    paymentStatus: 'pending' | 'completed' | 'failed';
    orderStatus: 'processing' | 'shipped' | 'delivered' | 'cancelled';
    createdAt: string;
    updatedAt: string;
}

// Backend response format
interface BackendOrder {
    _id: string;
    user: string;
    orderItems: OrderItem[];
    totalPrice: number;
    shippingAddress: {
        street?: string;
        city?: string;
        postalCode?: string;
        country?: string;
    };
    paymentInfo?: {
        id?: string;
        status?: string;
    };
    orderStatus: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
    deliveredAt?: string;
    createdAt: string;
    updatedAt: string;
}

// Transform backend order to frontend format
const transformOrder = (backendOrder: BackendOrder): Order => {
    return {
        _id: backendOrder._id,
        user: backendOrder.user,
        items: backendOrder.orderItems,
        total: backendOrder.totalPrice,
        shippingAddress: {
            street: backendOrder.shippingAddress.street,
            city: backendOrder.shippingAddress.city,
            zipCode: backendOrder.shippingAddress.postalCode,
            postalCode: backendOrder.shippingAddress.postalCode,
            country: backendOrder.shippingAddress.country,
        },
        paymentStatus: (backendOrder.paymentInfo?.status as any) || 'pending',
        orderStatus: backendOrder.orderStatus.toLowerCase() as Order['orderStatus'],
        createdAt: backendOrder.createdAt,
        updatedAt: backendOrder.updatedAt,
    };
};

export interface CreateOrderData {
    items: {
        productId: string;
        quantity: number;
        price: number;
    }[];
    shippingAddress: ShippingAddress;
    total: number;
}

export const orderAPI = {
    createOrder: async (data: CreateOrderData): Promise<Order> => {
        const response = await axiosInstance.post<{ message: string; order: BackendOrder }>('/orders', data);
        return transformOrder(response.data.order);
    },

    getOrders: async (): Promise<Order[]> => {
        const response = await axiosInstance.get<{ count: number; orders: BackendOrder[] }>('/orders');
        return response.data.orders.map(transformOrder);
    },

    getOrderById: async (id: string): Promise<Order> => {
        const response = await axiosInstance.get<BackendOrder>(`/orders/${id}`);
        return transformOrder(response.data);
    },

    updateOrderStatus: async (
        id: string,
        status: Order['orderStatus']
    ): Promise<Order> => {
        const response = await axiosInstance.put<{ message: string; order: BackendOrder }>(`/orders/${id}/status`, { status });
        return transformOrder(response.data.order);
    },
};
