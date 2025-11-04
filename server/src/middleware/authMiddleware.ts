import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt";
import User from "../models/User";



//Verify JWT and attach user
export const protectRoute = async( req: Request,res:Response,next :NextFunction)=>{
    try{
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')){
            return res.status(401).json({message: "Unathorized access."})
        }

        const token = authHeader.split(' ')[1];

        if(!token){
            return res.status(401).json({ message: "Unauthorized - Invalid token format" })
        }

        const decoded = verifyToken(token);
        console.log(decoded);

        const user = await User.findById(decoded.userId).select('-password');
        console.log(user);
        if(!user){
            return res.status(404).json({message : "User not Found."});
        }
        req.user = user;
        next();

    }catch(error){
        res.status(401).json({ message: 'Invalid or expired token' });
        return;
    }
}

//Restrict to admin only(Admin provilage)
export const adminOnly = async(req: Request,res:Response,next : NextFunction)=>{
    if(req.user && req.user.role === "admin") next();
    else res.status(403).json({message: "Access denied . Admin Only."})
}