import express from 'express'
import { currentUser, loginUser, registerUser } from '../controllers/user-controller'
import { authenticate } from '../middlewares/auth-middleware'

export const userRouter = express.Router()

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.get('/current', authenticate, currentUser)
