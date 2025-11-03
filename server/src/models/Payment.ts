import mongoose, { Document, mongo, Schema } from "mongoose";
import { IUser } from "./User";


export interface IPayment extends Document{
  user: IUser["_id"];
  amount: number;
  currency: string;
  stripePaymentId: string;
  status: "pending" | "succeeded" | "failed";
  createdAt?: Date;
  updatedAt?: Date;
}

const paymentSchema = new Schema<IPayment>({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "usd" },
    stripePaymentId: { type: String, required: true },
    status: { type: String, enum: ["pending", "succeeded", "failed"], default: "pending" },
  },
  { timestamps: true }
)

export default mongoose.model<IPayment>('Payment',paymentSchema);