import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt";

export const registerUser = async (req: Request, res: Response) => {
    try{
        const {name ,email,password } = req.body;

        //CHeck for the required fields
        if(!name || !email || !password){
            return res.status(400).json({message: "All fields are required"});
        }

        //Check if the user already exists
        const existedUser = await User.findOne({email});
        if(existedUser){
            return res.status(400).json({message: "User already exists"});
        }
        //Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({name, email, password: hashedPassword});

        //Create a token for the user
        const token = generateToken(String(user._id));
        return res.status(201).json({
            _id : user._id,
            name : user.name,
            email : user.email,
            role : user.role,
            token
        })
    }catch(error){
        res.status(500).json({message: "Internal server error", error: error});
    }
}


export const loginUser = async (req:Request, res:Response) => {
    try{
        const {email,password} = req.body;

        //Check for the required fields
        if(!email || !password){
            return res.status(400).json({message: "All fields are required"});
        }

        //Check if the user exists
        const user = await User.findOne({email});
        if(!user){
            return res.json(400).json({message: "Invalid email or password."})
        }

        const isPasswordMatch = await bcrypt.compare(password,user.password);
        if(!isPasswordMatch){
            return res.status(401).json({message: "INvalid email or password."});
        }

        const token = generateToken(String(user._id));

        return res.status(201).json({
            _id : user._id,
            name : user.name,
            email : user.email,
            role : user.role,
            token
        })
    }
    catch(error){
        res.status(500).json({message: "Internal server error", error: error});
    }
}


