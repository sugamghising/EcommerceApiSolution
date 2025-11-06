import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import { authAPI } from "../api/auth";

// Mock the auth API
jest.mock("../api/auth");

const TestComponent = () => {
  const { user, login, logout, isAuthenticated } = useAuth();

  return (
    <div>
      {isAuthenticated ? (
        <>
          <div>User: {user?.name}</div>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <button
          onClick={() =>
            login({ email: "test@example.com", password: "password" })
          }
        >
          Login
        </button>
      )}
    </div>
  );
};

describe("AuthContext", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it("provides authentication state", () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByText(/Login/i)).toBeInTheDocument();
  });

  it("handles user login", async () => {
    const mockUser = {
      id: "1",
      name: "Test User",
      email: "test@example.com",
      role: "user",
    };

    (authAPI.login as jest.Mock).mockResolvedValue({
      token: "test-token",
      user: mockUser,
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const loginButton = screen.getByText(/Login/i);
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText(/User: Test User/i)).toBeInTheDocument();
    });
  });

  it("handles logout", async () => {
    localStorage.setItem("token", "test-token");
    localStorage.setItem("user", JSON.stringify({ name: "Test User" }));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      const logoutButton = screen.getByText(/Logout/i);
      fireEvent.click(logoutButton);
    });

    await waitFor(() => {
      expect(screen.getByText(/Login/i)).toBeInTheDocument();
      expect(localStorage.getItem("token")).toBeNull();
    });
  });
});
