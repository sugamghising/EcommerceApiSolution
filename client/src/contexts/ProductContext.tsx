import React, { createContext, useState, useContext, ReactNode } from "react";
import {
  productAPI,
  Product,
  ProductFilters,
  CreateProductData,
} from "../api/product";

interface ProductContextType {
  products: Product[];
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
  fetchProducts: (filters?: ProductFilters) => Promise<void>;
  getProductById: (id: string) => Promise<Product>;
  createProduct: (
    data: CreateProductData,
    imageFile?: File
  ) => Promise<Product>;
  updateProduct: (
    id: string,
    data: Partial<CreateProductData>,
    imageFile?: File
  ) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;
  categories: string[];
  fetchCategories: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
};

interface ProductProviderProps {
  children: ReactNode;
}

export const ProductProvider: React.FC<ProductProviderProps> = ({
  children,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchProducts = async (filters: ProductFilters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await productAPI.getProducts(filters);
      setProducts(response.products);
      setTotalPages(response.totalPages);
      setCurrentPage(response.currentPage);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch products");
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const getProductById = async (id: string): Promise<Product> => {
    try {
      setLoading(true);
      setError(null);
      const product = await productAPI.getProductById(id);
      return product;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Failed to fetch product";
      setError(errorMsg);
      console.error("Error fetching product:", err);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (
    data: CreateProductData,
    imageFile?: File
  ): Promise<Product> => {
    try {
      setLoading(true);
      setError(null);
      const product = await productAPI.createProduct(data, imageFile);
      setProducts((prev) => [product, ...prev]);
      return product;
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || "Failed to create product";
      setError(errorMsg);
      console.error("Error creating product:", err);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (
    id: string,
    data: Partial<CreateProductData>,
    imageFile?: File
  ): Promise<Product> => {
    try {
      setLoading(true);
      setError(null);
      const product = await productAPI.updateProduct(id, data, imageFile);
      setProducts((prev) => prev.map((p) => (p._id === id ? product : p)));
      return product;
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || "Failed to update product";
      setError(errorMsg);
      console.error("Error updating product:", err);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await productAPI.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || "Failed to delete product";
      setError(errorMsg);
      console.error("Error deleting product:", err);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const cats = await productAPI.getCategories();
      setCategories(cats);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const value: ProductContextType = {
    products,
    loading,
    error,
    totalPages,
    currentPage,
    fetchProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    categories,
    fetchCategories,
  };

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
};
