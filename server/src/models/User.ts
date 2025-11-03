import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: 'user' | 'admin';
    address?: {
        street?: string;
        city?: string;
        postalCode?: string;
        country?: string;
    };
    createdAt?: Date;
    updatedAt?: Date;
}

const userSchema = new Schema<IUser>({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    address: {
        street: String,
        city: String,
        postalCode: String,
        country: String,
    },

}, { timestamps: true }
)

export default mongoose.model<IUser>('User', userSchema);