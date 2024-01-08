import express from 'express'
import { getMovementList, updateMovementList } from '../controllers/food-item-controller'
import { authMiddleware } from '../middlewares/auth-middleware'

export const movementRouter = express.Router()

movementRouter.route('/:id').get(authMiddleware, getMovementList).put(authMiddleware, updateMovementList)
