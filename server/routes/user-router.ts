import express from 'express'
import { currentUser, loginUser, registerUser } from '../controllers/user-controller'
import { authenticate } from '../middlewares/auth-middleware'
import { validateRequest } from '../middlewares/validation-middleware'
import { loginValidator, registrationValidator } from '../utils/validators'

export const userRouter = express.Router()

userRouter.post('/register', validateRequest(registrationValidator), registerUser)
userRouter.post('/login', validateRequest(loginValidator), loginUser)
userRouter.get('/current', authenticate, currentUser)
