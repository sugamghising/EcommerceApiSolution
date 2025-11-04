import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="page-container">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      <div className="mb-6">
        <p className="text-gray-600">Welcome, {user?.name}!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          to="/admin/products"
          className="card p-6 hover:shadow-xl transition-shadow"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-primary-100 p-3 rounded-full">
              <svg
                className="w-8 h-8 text-primary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold">Manage Products</h2>
              <p className="text-gray-600 text-sm">
                Add, edit, or remove products
              </p>
            </div>
          </div>
        </Link>

        <div className="card p-6">
          <div className="flex items-center space-x-4">
            <div className="bg-green-100 p-3 rounded-full">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold">View Orders</h2>
              <p className="text-gray-600 text-sm">Monitor customer orders</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center space-x-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <svg
                className="w-8 h-8 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold">Manage Users</h2>
              <p className="text-gray-600 text-sm">View and manage customers</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 card p-6">
        <h2 className="text-2xl font-bold mb-4">Quick Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded">
            <p className="text-3xl font-bold text-primary-600">0</p>
            <p className="text-gray-600 text-sm">Total Products</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded">
            <p className="text-3xl font-bold text-green-600">0</p>
            <p className="text-gray-600 text-sm">Total Orders</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded">
            <p className="text-3xl font-bold text-purple-600">0</p>
            <p className="text-gray-600 text-sm">Total Customers</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded">
            <p className="text-3xl font-bold text-yellow-600">$0</p>
            <p className="text-gray-600 text-sm">Total Revenue</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
