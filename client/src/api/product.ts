import axiosInstance from './axios';

export interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    stock: number;
    imageUrl: string;
    createdAt?: string;
    updatedAt?: string;
}

// Backend product format
interface BackendProduct {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    stock: number;
    image?: string;
    createdAt?: string;
    updatedAt?: string;
}

// Backend response format
interface BackendProductsResponse {
    count: number;
    products: BackendProduct[];
    message?: string;
    newProduct?: BackendProduct;
    product?: BackendProduct;
    updatedProduct?: BackendProduct;
}

// Transform backend product to frontend format
const transformProduct = (backendProduct: BackendProduct): Product => {
    return {
        ...backendProduct,
        imageUrl: backendProduct.image || '',
    };
};

export interface ProductFilters {
    search?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    limit?: number;
}

export interface ProductsResponse {
    products: Product[];
    totalPages: number;
    currentPage: number;
    total: number;
}

export interface CreateProductData {
    name: string;
    description: string;
    price: number;
    category: string;
    stock: number;
    imageUrl?: string; // Made optional since we can use file upload
}

export const productAPI = {
    getProducts: async (filters: ProductFilters = {}): Promise<ProductsResponse> => {
        const params = new URLSearchParams();
        if (filters.search) params.append('search', filters.search);
        if (filters.category) params.append('category', filters.category);
        if (filters.minPrice) params.append('minPrice', filters.minPrice.toString());
        if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
        if (filters.page) params.append('page', filters.page.toString());
        if (filters.limit) params.append('limit', filters.limit.toString());

        const response = await axiosInstance.get<BackendProductsResponse>(
            `/products?${params.toString()}`
        );

        // Transform backend response to frontend format
        const backendData = response.data;
        return {
            products: backendData.products.map(transformProduct),
            totalPages: 1, // Backend doesn't provide pagination, calculate if needed
            currentPage: filters.page || 1,
            total: backendData.count,
        };
    },

    getProductById: async (id: string): Promise<Product> => {
        const response = await axiosInstance.get<BackendProductsResponse>(`/products/${id}`);
        // Backend returns { message, product }
        if (response.data.product) {
            return transformProduct(response.data.product);
        }
        throw new Error('Product not found');
    },

    createProduct: async (data: CreateProductData, imageFile?: File): Promise<Product> => {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('price', data.price.toString());
        formData.append('category', data.category);
        formData.append('stock', data.stock.toString());

        // If image file is provided, upload it
        if (imageFile) {
            formData.append('image', imageFile);
        } else if (data.imageUrl) {
            // Fallback to URL if provided
            formData.append('image', data.imageUrl);
        }

        const response = await axiosInstance.post<BackendProductsResponse>(
            '/products',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        // Backend returns { message, newProduct }
        if (response.data.newProduct) {
            return transformProduct(response.data.newProduct);
        }
        throw new Error('Failed to create product');
    },

    updateProduct: async (id: string, data: Partial<CreateProductData>, imageFile?: File): Promise<Product> => {
        const formData = new FormData();

        if (data.name) formData.append('name', data.name);
        if (data.description) formData.append('description', data.description);
        if (data.price) formData.append('price', data.price.toString());
        if (data.category) formData.append('category', data.category);
        if (data.stock !== undefined) formData.append('stock', data.stock.toString());

        // If new image file is provided, upload it
        if (imageFile) {
            formData.append('image', imageFile);
        } else if (data.imageUrl) {
            // Fallback to URL if provided
            formData.append('image', data.imageUrl);
        }

        const response = await axiosInstance.put<BackendProductsResponse>(
            `/products/${id}`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        // Backend returns { message, updatedProduct }
        if (response.data.updatedProduct) {
            return transformProduct(response.data.updatedProduct);
        }
        throw new Error('Failed to update product');
    },

    deleteProduct: async (id: string): Promise<void> => {
        await axiosInstance.delete(`/products/${id}`);
    },

    getCategories: async (): Promise<string[]> => {
        const response = await axiosInstance.get<string[]>('/products/categories');
        return response.data;
    },
};
