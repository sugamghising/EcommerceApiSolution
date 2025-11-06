import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CartProvider, useCart } from "../contexts/CartContext";
import { AuthProvider } from "../contexts/AuthContext";

// Mock dependencies
jest.mock("../contexts/AuthContext", () => ({
  ...jest.requireActual("../contexts/AuthContext"),
  useAuth: () => ({ isAuthenticated: false }),
}));

jest.mock("../api/cart");

const TestComponent = () => {
  const { items, total, addItem, removeItem, clearCart } = useCart();

  const mockProduct = {
    _id: "1",
    name: "Test Product",
    price: 29.99,
    description: "Test description",
    category: "Test",
    stock: 10,
    imageUrl: "https://example.com/image.jpg",
  };

  return (
    <div>
      <div>Items: {items.length}</div>
      <div>Total: ${total.toFixed(2)}</div>
      <button onClick={() => addItem(mockProduct, 2)}>Add Item</button>
      <button onClick={() => removeItem("1")}>Remove Item</button>
      <button onClick={clearCart}>Clear Cart</button>
    </div>
  );
};

describe("CartContext", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("provides cart state", () => {
    render(
      <AuthProvider>
        <CartProvider>
          <TestComponent />
        </CartProvider>
      </AuthProvider>
    );

    expect(screen.getByText(/Items: 0/i)).toBeInTheDocument();
    expect(screen.getByText(/Total: \$0\.00/i)).toBeInTheDocument();
  });

  it("adds items to cart", async () => {
    render(
      <AuthProvider>
        <CartProvider>
          <TestComponent />
        </CartProvider>
      </AuthProvider>
    );

    const addButton = screen.getByText(/Add Item/i);
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText(/Items: 1/i)).toBeInTheDocument();
    });
  });

  it("calculates total correctly", async () => {
    render(
      <AuthProvider>
        <CartProvider>
          <TestComponent />
        </CartProvider>
      </AuthProvider>
    );

    const addButton = screen.getByText(/Add Item/i);
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText(/Total: \$59\.98/i)).toBeInTheDocument(); // 29.99 * 2
    });
  });

  it("removes items from cart", async () => {
    render(
      <AuthProvider>
        <CartProvider>
          <TestComponent />
        </CartProvider>
      </AuthProvider>
    );

    // Add item first
    const addButton = screen.getByText(/Add Item/i);
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText(/Items: 1/i)).toBeInTheDocument();
    });

    // Then remove it
    const removeButton = screen.getByText(/Remove Item/i);
    fireEvent.click(removeButton);

    await waitFor(() => {
      expect(screen.getByText(/Items: 0/i)).toBeInTheDocument();
    });
  });

  it("clears cart", async () => {
    render(
      <AuthProvider>
        <CartProvider>
          <TestComponent />
        </CartProvider>
      </AuthProvider>
    );

    // Add item
    const addButton = screen.getByText(/Add Item/i);
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText(/Items: 1/i)).toBeInTheDocument();
    });

    // Clear cart
    const clearButton = screen.getByText(/Clear Cart/i);
    fireEvent.click(clearButton);

    await waitFor(() => {
      expect(screen.getByText(/Items: 0/i)).toBeInTheDocument();
      expect(screen.getByText(/Total: \$0\.00/i)).toBeInTheDocument();
    });
  });
});
