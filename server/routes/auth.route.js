import { Router } from 'express'
import controllers from '../controllers/auth.controller.js'
const authRouter = Router()

/**
 * @route post /api/auth/register
 * @description registerig a new user
 * @access Public
 */

authRouter.post('/register', controllers.handleRegisterNewUserController)
/**
 * @route post /api/auth/login
 * @description logining a existing user
 * @access Public
 */
authRouter.post('/login', controllers.handleLoginUserController)

/**
 * @route get /api/auth/logout
 * @description logging out an user
 * @access Private
 */

authRouter.get('/logout', controllers.handleLogoutUserController)



export default authRouter;