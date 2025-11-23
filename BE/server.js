import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import userRouter from './router/userRoutes.js';
import mitraRouter from './router/mitraRoutes.js';
import categoryRouter from './router/categoryRoutes.js';
import listingRouter from './router/listingRoutes.js';
import adminRouter from './router/adminRoutes.js';

dotenv.config();

const app = express();

app.use(
    cors({
        origin: 'http://localhost:3000', //url frontend
        credentials: true
    }),
);

app.use(express.json());
app.use(cookieParser());
app.use('/api/users', userRouter);
app.use('/api/mitra', mitraRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/listings', listingRouter);
app.use('/api/admin', adminRouter);

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});