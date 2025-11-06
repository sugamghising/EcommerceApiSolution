import express from "express";
import {
    addProduct,
    deleteProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    getCategories
} from "../controller/productController";
import { adminOnly, protectRoute } from "../middleware/authMiddleware";
import upload from "../config/multer"; // Import multer config

const productRouter = express.Router();

productRouter.get('/categories', getCategories);
productRouter.get('/', getAllProducts);
productRouter.get('/:id', getProductById);

// Add upload.single('image') middleware for image upload
productRouter.post('/', protectRoute, adminOnly, upload.single('image'), addProduct);
productRouter.put('/:id', protectRoute, adminOnly, upload.single('image'), updateProduct);
productRouter.delete('/:id', protectRoute, adminOnly, deleteProduct);

export default productRouter;