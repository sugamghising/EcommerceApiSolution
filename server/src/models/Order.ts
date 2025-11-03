import mongoose, { Document, Schema, Types } from "mongoose";
import { IProduct } from "./Product";
import { IUser } from "./User";


export interface IOrderItem {
    product: Types.ObjectId | IProduct;
    quantity: number;
    price: number;
}

export interface IOrder extends Document {
    user: Types.ObjectId |IUser;
    orderItems: Types.ObjectId | IOrderItem;
    shippingAddress: {
        street?: string;
        city?: string;
        postalCode?: string;
        country?: string;
    };
    paymentInfo?: {
        id?: string;
        status?: string;
    };
    totalPrice: number;
    orderStatus: "Processing" | "Shipped" | "Delivered" | "Cancelled";
    deliveredAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

const orderSchema = new Schema<IOrder>({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    orderItems: [
      {
        product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    shippingAddress: {
      street: String,
      city: String,
      postalCode: String,
      country: String,
    },
    paymentInfo: {
      id: String,
      status: String,
    },
    totalPrice: { type: Number, required: true },
    orderStatus: {
      type: String,
      enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Processing",
    },
    deliveredAt: Date,
  },
  { timestamps: true }
)


export default mongoose.model<IOrder>('Order', orderSchema);