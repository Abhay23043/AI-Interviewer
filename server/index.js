import express from 'express'
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv'
dotenv.config()
const app = express()

//import database
import connectDB from './config/database.js'
//middlewares
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URI,
    credentials: true
}))
app.use(express.json());

connectDB()

//importing routes here
import authRouter from './routes/auth.route.js'
import googleAuthRouter from './routes/googleAuth.route.js'
import userRouter from './routes/user.route.js';
import interviewRouter from './routes/interview.route.js';

app.use('/api/auth', authRouter)
app.use('/api/auth', googleAuthRouter)
app.use('/api/user', userRouter)
app.use('/api/interview', interviewRouter)



app.listen(process.env.PORT, () => {
    console.log(`Server started at localhost:${process.env.PORT}`)
})