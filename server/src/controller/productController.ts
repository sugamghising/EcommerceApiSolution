import { Request, Response } from "express";
import Product, { IProduct } from "../models/Product";


//Add new Product (Admin only)
export const addProduct = async (req: Request, res: Response) => {
    try {
        const { name, description, price, stock, category, image } = req.body;
        if (!name || !description || !price || !category) {
            return res.status(400).json({ message: "All required field must be provided." });
        }

        const newProduct: IProduct = await Product.create({
            name, description, price, stock, category, image
        })

        res.status(201).json({ message: " New product added.", newProduct });
    } catch (error) {
        console.log("Error in create/add Product", error);
        res.status(500).json({ message: "Server error" });
    }
}

//get all products (public)
export const getAllProducts = async (req: Request, res: Response) => {
    try {
        const { limit, page = 1, category, sort } = req.query;

        // Build query
        const query: any = {};
        if (category) {
            query.category = category;
        }

        // Build sort
        let sortOption: any = {};
        if (sort === 'price-asc') {
            sortOption.price = 1;
        } else if (sort === 'price-desc') {
            sortOption.price = -1;
        } else if (sort === 'newest') {
            sortOption.createdAt = -1;
        }

        // Calculate pagination
        const limitNum = limit ? parseInt(limit as string) : 0;
        const pageNum = parseInt(page as string);
        const skip = limitNum ? (pageNum - 1) * limitNum : 0;

        // Fetch products
        let productsQuery = Product.find(query);

        if (Object.keys(sortOption).length > 0) {
            productsQuery = productsQuery.sort(sortOption);
        }

        if (limitNum > 0) {
            productsQuery = productsQuery.skip(skip).limit(limitNum);
        }

        const products = await productsQuery;
        const total = await Product.countDocuments(query);

        res.status(200).json({ count: products.length, products });

    } catch (error) {
        console.log("Error in getAllProduct", error);
        res.status(500).json({ message: "Server error" });
    }
}

//get product By Id
export const getProductById = async (req: Request, res: Response) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId);

        if (!product) {
            res.status(404).json({ message: "Product not found." });
        }
        res.status(200).json({ message: "Product found", product })
    } catch (error) {
        console.log("Error in getProductById", error);
        res.status(500).json({ message: "Server error" });
    }
}


//update product( admin only)
export const updateProduct = async (req: Request, res: Response) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId);

        if (!product) {
            res.status(404).json({ message: "Product not found." })
        }

        // const { name, description, price, stock, category, image } = req.body;
        const updatedProduct = await Product.findByIdAndUpdate(productId, req.body, { new: true });

        res.status(200).json({ message: "Product deleted successfully.", product });
    } catch (error) {
        console.log("Error in deleteProduct", error);
        res.status(500).json({ message: "Server error" });
    }
}

//Get all unique categories (public)
export const getCategories = async (req: Request, res: Response) => {
    try {
        const categories = await Product.distinct('category');
        res.status(200).json(categories);
    } catch (error) {
        console.log("Error in getCategories", error);
        res.status(500).json({ message: "Server error" });
    }
}

//Delete the product (admin only)
export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const productId = req.params.id;
        const product = await Product.findByIdAndDelete(productId);

        if (!product) {
            res.status(404).json({ message: "Product not found." })
            return
        }
        res.status(200).json({ message: "Product deleted successfully.", product });
    } catch (error) {
        console.log("Error in deleteProduct", error);
        res.status(500).json({ message: "Server error" });
    }
}