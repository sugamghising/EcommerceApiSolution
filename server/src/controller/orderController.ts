import { Request, Response } from 'express';
import Cart from '../models/Cart';
import Order, { IOrderItem } from '../models/Order';


//Create a order from user cart
//Access: private
export const createOrder = async (req: Request, res: Response) => {
    try {
        const userId = req.user?._id;
        // const {shippingAddress} = req.body;

        //find user cart
        const cart = await Cart.findOne({ user: userId }).populate("items.product");
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }


        // 2️⃣ Map cart items to order items
        const orderItems = cart.items.map((item) => ({
            product: item.product instanceof Object ? item.product._id : item.product,
            quantity: item.quantity,
            price: "price" in item.product ? item.product.price : 0,
        }));

        // 3️⃣ Create order
        const order = await Order.create({
            user: userId,
            orderItems,
            shippingAddress: req.body.shippingAddress,
            totalPrice: cart.totalPrice,
            orderStatus: "Processing",
        });

        // 4️⃣ Clear user's cart
        cart.items = [];
        cart.totalPrice = 0;
        await cart.save();

        res.status(201).json({
            message: "Order created successfully",
            order,
        });
    } catch (error) {
        console.error("Error in createOrder:", (error as Error).message);
        res.status(500).json({ message: "Server Error" });
    }
}

//get user orders
export const getMyOrders = async (req: Request, res: Response) => {
    try {
        const orders = await Order.find({ user: req.user?._id }).populate("orderItems.product");
        res.status(200).json({ count: orders.length, orders });
    } catch (error) {
        console.error("Error in getMyOrders:", (error as Error).message);
        res.status(500).json({ message: "Server Error" });
    }
}


// Admin: get all orders
export const getAllOrders = async (req: Request, res: Response): Promise<void> => {
    try {
        const orders = await Order.find().populate("user").populate("orderItems.product");
        res.status(200).json({ count: orders.length, orders });
    } catch (error: any) {
        console.error("Error in getAllOrders:", error.message);
        res.status(500).json({ message: "Server Error" });
    }
};


// Admin: update order status
export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            res.status(404).json({ message: "Order not found" });
            return;
        }

        const { status } = req.body;
        if (!["Processing", "Shipped", "Delivered", "Cancelled"].includes(status)) {
            res.status(400).json({ message: "Invalid order status" });
            return;
        }

        order.orderStatus = status;
        if (status === "Delivered") {
            order.deliveredAt = new Date();
        }

        await order.save();
        res.status(200).json({ message: "Order status updated", order });
    } catch (error: any) {
        console.error("Error in updateOrderStatus:", error.message);
        res.status(500).json({ message: "Server Error" });
    }
};