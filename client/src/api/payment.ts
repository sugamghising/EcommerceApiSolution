import axiosInstance from './axios';

export interface PaymentIntentData {
    amount: number;
    orderId: string;
}

export interface PaymentIntentResponse {
    clientSecret: string;
    paymentIntentId: string;
}

export interface UpdatePaymentStatusData {
    paymentIntentId: string;
    status: 'succeeded' | 'failed';
    orderId: string;
}

export const paymentAPI = {
    createPaymentIntent: async (data: PaymentIntentData): Promise<PaymentIntentResponse> => {
        const response = await axiosInstance.post<PaymentIntentResponse>(
            '/payments/create-intent',
            data
        );
        return response.data;
    },

    updatePaymentStatus: async (data: UpdatePaymentStatusData): Promise<void> => {
        await axiosInstance.post('/payments/update-status', data);
    },

    getPaymentHistory: async (): Promise<any[]> => {
        const response = await axiosInstance.get<any[]>('/payments/history');
        return response.data;
    },
};
