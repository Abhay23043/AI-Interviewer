import express from 'express'
import cors from 'cors';
import dotenv from 'dotenv'
dotenv.config()
const app = express()

//import database
import connectDB from './config/database.js'
//middlewares
const allowedOrigins = [
    "http://localhost:5173",
    "https://ai-interviewer.abhayjaiswal457.workers.dev"
];
if (process.env.FRONTEND_URI) {
    allowedOrigins.push(process.env.FRONTEND_URI);
}

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));
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