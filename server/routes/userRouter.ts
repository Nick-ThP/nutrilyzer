import express from 'express'
import { currentUser, loginUser, registerUser } from '../controllers/userController'
import { authMiddleware } from '../middlewares/authMiddleware'

export const userRouter = express.Router()

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.get('/current', authMiddleware, currentUser)
