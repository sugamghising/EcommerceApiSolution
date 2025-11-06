import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import ProductCard from "../components/product/ProductCard";
import { CartProvider } from "../contexts/CartContext";
import { AuthProvider } from "../contexts/AuthContext";

const mockProduct = {
  _id: "1",
  name: "Test Product",
  description: "This is a test product description",
  price: 49.99,
  category: "Electronics",
  stock: 15,
  imageUrl: "https://example.com/image.jpg",
};

describe("ProductCard Component", () => {
  it("renders product information correctly", () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <ProductCard product={mockProduct} />
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByText(/Test Product/i)).toBeInTheDocument();
    expect(screen.getByText(/\$49\.99/i)).toBeInTheDocument();
    expect(screen.getByText(/Electronics/i)).toBeInTheDocument();
    expect(screen.getByText(/15 in stock/i)).toBeInTheDocument();
  });

  it('shows "Out of stock" when stock is 0', () => {
    const outOfStockProduct = { ...mockProduct, stock: 0 };

    render(
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <ProductCard product={outOfStockProduct} />
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByText(/Out of stock/i)).toBeInTheDocument();
  });

  it('displays "Add to Cart" button', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <ProductCard product={mockProduct} />
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    );

    const addToCartButton = screen.getByRole("button", {
      name: /Add to Cart/i,
    });
    expect(addToCartButton).toBeInTheDocument();
    expect(addToCartButton).not.toBeDisabled();
  });

  it('disables "Add to Cart" button when out of stock', () => {
    const outOfStockProduct = { ...mockProduct, stock: 0 };

    render(
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <ProductCard product={outOfStockProduct} />
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    );

    const addToCartButton = screen.getByRole("button", {
      name: /Add to Cart/i,
    });
    expect(addToCartButton).toBeDisabled();
  });
});
