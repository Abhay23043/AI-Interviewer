import { Router } from "express";
import authUserMiddleware from "../middlewares/authUser.middleware.js";
import { createDummyPaymentOrder, getCurrentUser, verifyDummyPayment } from "../controllers/user.controller.js";

const userRouter = Router()

userRouter.get('/getMe',authUserMiddleware.authUser,getCurrentUser)
userRouter.post('/create-payment-order', authUserMiddleware.authUser, createDummyPaymentOrder)
userRouter.post('/verify-payment', authUserMiddleware.authUser, verifyDummyPayment)

export default userRouter;