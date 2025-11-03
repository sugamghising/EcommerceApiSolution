import mongoose, { Document, Schema } from "mongoose";


export interface IProduct extends Document {
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
    image?: string;
    ratings?: number;
    numReviews?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

const productSchema = new Schema<IProduct>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },
    category: { type: String, required: true },
    image: { type: String, default: "default-product.png" },
    ratings: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
},
    { timestamps: true })

export default mongoose.model<IProduct>('Product', productSchema);