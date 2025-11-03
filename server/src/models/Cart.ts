import mongoose, { Document, model, Schema ,Types} from "mongoose";
import { IProduct } from "./Product";
import { IUser } from "./User";


export interface ICartItem {
    product: Types.ObjectId | IProduct;
    quantity: number;
}

export interface ICart extends Document{
  user: Types.ObjectId | IUser;
  items: ICartItem[];
  totalPrice: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const cartItemSchema = new Schema<ICartItem>({
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true, min: 1 },
})


const cartSchema = new Schema<ICart>({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    items: [cartItemSchema],
    totalPrice: { type: Number, default: 0 },
  },
  { timestamps: true }
)

export default mongoose.model<ICart>('Cart',cartSchema);