import jwt  from "jsonwebtoken";

interface JwtPayload{
    userId : string;
    role: string;
}

export const generateToken = (userId : string)=>{
    return jwt.sign({userId},process.env.JWT_SECRET as string,{expiresIn: "7d"});
}

export const verifyToken = (token : string) =>{
    return jwt.verify(token, process.env.JWT_SECRET as string)  as JwtPayload  ;
}