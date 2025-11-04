import express from "express"
import { protectRoute } from "../middleware/authMiddleware";
import { createPaymentIntent, updatePaymentStatus } from "../controller/paymentController";

const paymentRouter = express.Router();

paymentRouter.post('/create-intent',protectRoute,createPaymentIntent);
paymentRouter.put('/update-intent',protectRoute,updatePaymentStatus);

export default paymentRouter;