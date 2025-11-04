import React from "react";
import { render } from "@testing-library/react";
import App from "./App";

// Mock the contexts and components
jest.mock("./contexts/AuthContext", () => ({
  AuthProvider: ({ children }: any) => <div>{children}</div>,
  useAuth: () => ({ user: null, loading: false }),
}));

jest.mock("./contexts/CartContext", () => ({
  CartProvider: ({ children }: any) => <div>{children}</div>,
  useCart: () => ({ items: [], total: 0 }),
}));

jest.mock("./contexts/ProductContext", () => ({
  ProductProvider: ({ children }: any) => <div>{children}</div>,
  useProducts: () => ({ products: [], loading: false }),
}));

describe("App Component", () => {
  it("renders without crashing", () => {
    render(<App />);
  });
});
