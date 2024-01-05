import express from 'express'
import { getMovementList, updateMovementList } from '../controllers/movementController'
import { authMiddleware } from '../middlewares/authMiddleware'

export const movementRouter = express.Router()

movementRouter.route('/:id').get(authMiddleware, getMovementList).put(authMiddleware, updateMovementList)
