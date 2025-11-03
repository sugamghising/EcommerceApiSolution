import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "./User";
import { IProduct } from "./Product";


export interface IReview extends Document {
  user: IUser["_id"];
  product: IProduct["_id"];
  rating: number;
  comment?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: String,
  },
  { timestamps: true }
);

export default mongoose.model<IReview>("Review", reviewSchema);
