import React, { useEffect, useState } from "react";
import { orderAPI, Order } from "../api/order";
import Loader from "../components/common/Loader";

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await orderAPI.getOrders();
        setOrders(data);
      } catch (error) {
        console.error("Error loading orders:", error);
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="page-container">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-gray-600">You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="card p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-gray-600">Order #{order._id}</p>
                  <p className="text-sm text-gray-600">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">
                    ${order.total.toFixed(2)}
                  </p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      order.paymentStatus === "completed"
                        ? "bg-green-100 text-green-800"
                        : order.paymentStatus === "failed"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                  <span
                    className={`ml-2 inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      order.orderStatus === "delivered"
                        ? "bg-green-100 text-green-800"
                        : order.orderStatus === "cancelled"
                        ? "bg-red-100 text-red-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {order.orderStatus}
                  </span>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Items:</h3>
                <div className="space-y-2">
                  {order.items.map((item, index) => {
                    const product =
                      typeof item.product === "string" ? null : item.product;
                    return (
                      <div key={index} className="flex justify-between text-sm">
                        <span>
                          {product?.name || "Product"} x {item.quantity}
                        </span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="border-t mt-4 pt-4">
                <h3 className="font-semibold mb-2">Shipping Address:</h3>
                <p className="text-sm text-gray-600">
                  {order.shippingAddress.street}, {order.shippingAddress.city},{" "}
                  {order.shippingAddress.state} {order.shippingAddress.zipCode},{" "}
                  {order.shippingAddress.country}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
