import express from 'express'
import { getMovementList, updateMovementList } from '../controllers/foodItemController'
import { authMiddleware } from '../middlewares/authMiddleware'

export const movementRouter = express.Router()

movementRouter.route('/:id').get(authMiddleware, getMovementList).put(authMiddleware, updateMovementList)
