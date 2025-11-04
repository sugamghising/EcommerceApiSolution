import express from 'express';
import dotenv from 'dotenv'
import cors from 'cors'
import morgan from 'morgan';
import connectDb from './config/db';
import userRouter from './routes/userRoutes';
import productRouter from './routes/productRoutes';
import cartRouter from './routes/cartRoutes';
import orderRouter from './routes/orderRoutes';
import paymentRouter from './routes/paymentRoutes';

const app = express();

dotenv.config();

const PORT = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'))

app.get('/',(req,res)=>res.send("Hello from backend") )

connectDb();

app.use('/api/v1/users/',userRouter);
app.use('/api/v1/products/',productRouter);
app.use('/api/v1/cart/',cartRouter);
app.use('/api/v1/orders/',orderRouter);
app.use('/api/v1/payment/',paymentRouter);

app.listen(PORT, ()=>{
    console.log(`Server running at PORT ${PORT}`);
})