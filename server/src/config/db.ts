import mongoose from "mongoose";

const connectDb = async() =>{
    try{
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log("✅ MongoDB Connected");
    }catch(error){
        console.log("❌ Failed to connect to MONGODB", error);
        process.exit(1);
    }
}
export default connectDb;