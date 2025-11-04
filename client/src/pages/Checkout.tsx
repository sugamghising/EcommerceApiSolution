import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useCart } from "../contexts/CartContext";
import { orderAPI, ShippingAddress } from "../api/order";
import { paymentAPI } from "../api/payment";
import Button from "../components/common/Button";

const stripePromise = loadStripe(
  process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || ""
);

interface CheckoutFormData extends ShippingAddress {}

const CheckoutForm: React.FC = () => {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const { items, total, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>();

  const shipping = total > 50 ? 0 : 5.99;
  const tax = total * 0.1;
  const grandTotal = total + shipping + tax;

  const onSubmit = async (data: CheckoutFormData) => {
    if (!stripe || !elements) return;

    try {
      setLoading(true);
      setError(null);

      // Create order
      const order = await orderAPI.createOrder({
        items: items.map((item) => ({
          productId: item.product._id,
          quantity: item.quantity,
          price: item.product.price,
        })),
        shippingAddress: data,
        total: grandTotal,
      });

      // Create payment intent
      const { clientSecret } = await paymentAPI.createPaymentIntent({
        amount: Math.round(grandTotal * 100), // Convert to cents
        orderId: order._id,
      });

      // Confirm payment
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error("Card element not found");

      const { error: stripeError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
          },
        });

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      if (paymentIntent?.status === "succeeded") {
        await clearCart();
        navigate("/orders", { state: { success: true } });
      }
    } catch (err: any) {
      setError(err.message || "Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="card p-6">
            <h2 className="text-2xl font-bold mb-6">Shipping Information</h2>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label
                  htmlFor="street"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Street Address *
                </label>
                <input
                  {...register("street", {
                    required: "Street address is required",
                  })}
                  id="street"
                  type="text"
                  className="input"
                />
                {errors.street && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.street.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    City *
                  </label>
                  <input
                    {...register("city", { required: "City is required" })}
                    id="city"
                    type="text"
                    className="input"
                  />
                  {errors.city && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.city.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="state"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    State *
                  </label>
                  <input
                    {...register("state", { required: "State is required" })}
                    id="state"
                    type="text"
                    className="input"
                  />
                  {errors.state && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.state.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="zipCode"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Zip Code *
                  </label>
                  <input
                    {...register("zipCode", {
                      required: "Zip code is required",
                    })}
                    id="zipCode"
                    type="text"
                    className="input"
                  />
                  {errors.zipCode && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.zipCode.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Country *
                  </label>
                  <input
                    {...register("country", {
                      required: "Country is required",
                    })}
                    id="country"
                    type="text"
                    className="input"
                    defaultValue="United States"
                  />
                  {errors.country && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.country.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">
                  Payment Information
                </h3>
                <div className="p-4 border border-gray-300 rounded-lg">
                  <CardElement
                    options={{
                      style: {
                        base: {
                          fontSize: "16px",
                          color: "#424770",
                          "::placeholder": {
                            color: "#aab7c4",
                          },
                        },
                        invalid: {
                          color: "#9e2146",
                        },
                      },
                    }}
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                loading={loading}
                disabled={!stripe || loading}
                className="w-full mt-6"
                size="lg"
              >
                Place Order ${grandTotal.toFixed(2)}
              </Button>
            </form>
          </div>
        </div>

        <div>
          <div className="card p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4">
              {items.map((item) => (
                <div
                  key={item.product._id}
                  className="flex justify-between text-sm"
                >
                  <span>
                    {item.product.name} x {item.quantity}
                  </span>
                  <span>
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t pt-3 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping:</span>
                <span>
                  {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax:</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total:</span>
                <span>${grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Checkout: React.FC = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

export default Checkout;
