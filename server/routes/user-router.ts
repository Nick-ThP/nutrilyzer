import express from 'express'
import { currentUser, loginUser, registerUser } from '../controllers/user-controller'
import { authMiddleware } from '../middlewares/auth-middleware'

export const userRouter = express.Router()

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.get('/current', authMiddleware, currentUser)
