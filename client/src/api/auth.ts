import axiosInstance from './axios';

export interface RegisterData {
    name: string;
    email: string;
    password: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    user: {
        id: string;
        name: string;
        email: string;
        role: string;
    };
}

// Backend response format
interface BackendAuthResponse {
    _id: string;
    name: string;
    email: string;
    role: string;
    token: string;
}

// Transform backend response to frontend format
const transformAuthResponse = (backendResponse: BackendAuthResponse): AuthResponse => {
    return {
        token: backendResponse.token,
        user: {
            id: backendResponse._id,
            name: backendResponse.name,
            email: backendResponse.email,
            role: backendResponse.role,
        },
    };
};

export const authAPI = {
    register: async (data: RegisterData): Promise<AuthResponse> => {
        const response = await axiosInstance.post<BackendAuthResponse>('/users/register', data);
        return transformAuthResponse(response.data);
    },

    login: async (data: LoginData): Promise<AuthResponse> => {
        const response = await axiosInstance.post<BackendAuthResponse>('/users/login', data);
        return transformAuthResponse(response.data);
    },

    getProfile: async (): Promise<AuthResponse['user']> => {
        const response = await axiosInstance.get<AuthResponse['user']>('/users/profile');
        return response.data;
    },

    updateProfile: async (data: Partial<RegisterData>): Promise<AuthResponse['user']> => {
        const response = await axiosInstance.put<AuthResponse['user']>('/users/profile', data);
        return response.data;
    },
};
