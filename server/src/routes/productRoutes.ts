import express from "express";
import { addProduct, deleteProduct, getAllProducts, getProductById, updateProduct, getCategories } from "../controller/productController";
import { adminOnly, protectRoute } from "../middleware/authMiddleware";

const productRouter = express.Router();

productRouter.get('/categories', getCategories);
productRouter.get('/', getAllProducts);
productRouter.get('/:id', getProductById);

productRouter.post('/', protectRoute, adminOnly, addProduct);
productRouter.put('/:id', protectRoute, adminOnly, updateProduct);
productRouter.delete('/:id', protectRoute, adminOnly, deleteProduct);

export default productRouter;