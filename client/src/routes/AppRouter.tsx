import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import ProtectedRoute from "../components/common/ProtectedRoute";

// Pages
import Home from "../pages/Home";
import ProductPage from "../pages/ProductPage";
import ProductDetail from "../pages/ProductDetail";
import CartPage from "../pages/CartPage";
import Checkout from "../pages/Checkout";
import Orders from "../pages/Orders";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Admin/Dashboard";
import ProductManager from "../pages/Admin/ProductManager";

const AppRouter: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductPage />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <ProtectedRoute requireAdmin>
                <ProductManager />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default AppRouter;
