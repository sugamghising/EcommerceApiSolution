import { Request, Response } from "express"
import Cart from "../models/Cart"
import Product from "../models/Product";


//Get user's Cart
export const getCart = async (req: Request, res: Response) => {
    try {
        const cart = await Cart.findOne({ user: req.user?._id }).populate('items.product');
        if (!cart) {
            res.status(200).json({ message: "Cart is empty", items: [], totalPrice: 0 });
            return;
        }
        res.status(200).json(cart);

    } catch (error) {
        console.error("Error in getCart:", (error as Error).message);
        res.status(500).json({ message: "Server Error" });
    }
}

//add Item to cart
export const addToCart = async (req: Request, res: Response) => {
    try {
        const userId = req.user?._id;
        const { productId, quantity } = req.body;

        if (!productId || !quantity || quantity <= 0) {
            return res.status(400).json({ message: "Invalid product or quantity" })
        }
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not Found." })
        }
        //find user existing cart
        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            cart = new Cart({ user: userId, items: [], totalPrice: 0 })
        }

        //check if product already exists in the cart 
        const existingItem = cart.items.find(
            (item) => item.product.toString() === productId
        )
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({ product: productId, quantity })
        }


        //calculate the total price 
        cart.totalPrice = 0;
        for (const item of cart.items) {
            const prod = await Product.findById(item.product);
            if (prod) {
                cart.totalPrice += prod.price * item.quantity;
            }
        }

        await cart.save();
        const populatedCart = await cart.populate("items.product");

        res.status(200).json({
            message: "Item added to cart successfully",
            cart: populatedCart,
        });
    } catch (error) {
        console.error("Error in addToCart:", (error as Error).message);
        res.status(500).json({ message: "Server Error" });
    }
}


//remove item from cart
export const removeFromCart = async (req: Request, res: Response) => {
    try {
        const userId = req.user?._id;
        const { productId } = req.body;

        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            res.status(404).json({ message: "Cart not found" });
            return;
        }

        // Filter out the product to remove it
        cart.items = cart.items.filter(
            (item) => item.product.toString() !== productId
        )

        //Recalculate the total price
        cart.totalPrice = 0;
        for (const item of cart.items) {
            const prod = await Product.findById(item.product);
            if (prod) {
                cart.totalPrice += prod.price * item.quantity;
            }
        }

        await cart.save();
        const populatedCart = await cart.populate("items.product");

        res.status(200).json({
            message: "Item removed from cart successfully",
            cart: populatedCart,
        });
    } catch (error) {
        console.error("Error in removeFromCart:", (error as Error).message);
        res.status(500).json({ message: "Server Error" });
    }
}

//clear the cart
export const clearCart = async(req:Request,res:Response)=>{
    try {
        const userId = req.user?._id;

        const cart = await Cart.findOne({user : userId});
        if(!cart){
            res.status(404).json({ message: "Cart not found" });
            return;
        }

        cart.items = [];
        cart.totalPrice = 0;
        await cart.save();

        res.status(200).json({ message: "Cart cleared successfully" });
    } catch (error) {
        console.error("Error in clearCart:", (error as Error).message);
        res.status(500).json({ message: "Server Error" });
    }
}