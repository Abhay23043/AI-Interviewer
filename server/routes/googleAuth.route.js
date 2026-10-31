import googleAuthController from "../controllers/googleAuth.controller.js";
import {Router} from 'express';
const googleAuthRouter = Router()

googleAuthRouter.post('/google',googleAuthController)

export default googleAuthRouter