import express from "express"
import { adminOnly, protectRoute } from "../middleware/authMiddleware";
import { createOrder, getAllOrders, getMyOrders, updateOrderStatus } from "../controller/orderController";

const orderRouter = express.Router();

orderRouter.post('/',protectRoute,createOrder)
orderRouter.get('/my-orders',protectRoute,getMyOrders)
orderRouter.get('/',protectRoute,adminOnly,getAllOrders)
orderRouter.put('/:id',protectRoute,adminOnly,updateOrderStatus)

export default orderRouter;