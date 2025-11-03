import express from 'express'
import { addToCart, clearCart, getCart, removeFromCart } from '../controller/cartController';
import { protectRoute } from '../middleware/authMiddleware';

const cartRouter = express.Router();

cartRouter.get('/',protectRoute,getCart);
cartRouter.post('/add',protectRoute,addToCart);
cartRouter.delete('/remove',protectRoute,removeFromCart);
cartRouter.delete('/clear',protectRoute,clearCart);

export default cartRouter;