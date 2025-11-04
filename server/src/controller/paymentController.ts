import { Request, Response } from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();
import Payment, { IPayment } from "../models/Payment";

const stripeApiKey = process.env.STRIPE_SECRET_KEY;
if (!stripeApiKey) {
    throw new Error("STRIPE_SECRET_KEY is not set. Please define it in your environment.");
}
const stripe = new Stripe(stripeApiKey, {
    typescript: true
});

export const createPaymentIntent = async (req: Request, res: Response) => {
    try {
        const { amount, currency = "usd" } = req.body;

        if (!amount) {
            res.status(400).json({ message: "Amount is required" });
            return;
        }
        // 1️⃣ Create Stripe Payment Intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Stripe expects cents
            currency,
            payment_method_types: ["card"],
        });
        // 2️⃣ Save payment record in DB (optional: pending until completed)
        const payment: IPayment = await Payment.create({
            user: req.user?._id,
            amount,
            currency,
            stripePaymentId: paymentIntent.id,
            status: "pending",
        });
        res.status(200).json({
            clientSecret: paymentIntent.client_secret,
            payment,
        });
    } catch (error: any) {
        console.error("Error in createPaymentIntent:", error.message);
        res.status(500).json({ message: "Server Error" });
    }
}

// Update payment status (after webhook or frontend confirmation)
export const updatePaymentStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { paymentId, status } = req.body;
  
      const payment = await Payment.findById(paymentId);
      if (!payment) {
        res.status(404).json({ message: "Payment not found" });
        return;
      }
  
      if (!["pending", "succeeded", "failed"].includes(status)) {
        res.status(400).json({ message: "Invalid payment status" });
        return;
      }
  
      payment.status = status as IPayment["status"];
      await payment.save();
  
      res.status(200).json({ message: "Payment status updated", payment });
    } catch (error: any) {
      console.error("Error in updatePaymentStatus:", error.message);
      res.status(500).json({ message: "Server Error" });
    }
  };