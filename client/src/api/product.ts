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
    imageUrl: string;
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

    createProduct: async (data: CreateProductData): Promise<Product> => {
        // Transform frontend data to backend format
        const backendData = {
            name: data.name,
            description: data.description,
            price: data.price,
            category: data.category,
            stock: data.stock,
            image: data.imageUrl,
        };
        const response = await axiosInstance.post<BackendProductsResponse>('/products', backendData);
        // Backend returns { message, newProduct }
        if (response.data.newProduct) {
            return transformProduct(response.data.newProduct);
        }
        throw new Error('Failed to create product');
    },

    updateProduct: async (id: string, data: Partial<CreateProductData>): Promise<Product> => {
        // Transform frontend data to backend format
        const backendData: any = {};
        if (data.name) backendData.name = data.name;
        if (data.description) backendData.description = data.description;
        if (data.price) backendData.price = data.price;
        if (data.category) backendData.category = data.category;
        if (data.stock !== undefined) backendData.stock = data.stock;
        if (data.imageUrl) backendData.image = data.imageUrl;

        const response = await axiosInstance.put<BackendProductsResponse>(`/products/${id}`, backendData);
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
