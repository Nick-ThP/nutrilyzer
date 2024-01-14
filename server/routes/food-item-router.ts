import express from 'express'
import { createFoodItem, deleteFoodItem, getAllFoodItems, getFoodItemById, updateFoodItem } from '../controllers/food-item-controller'
import { authenticate } from '../middlewares/auth-middleware'
import { validateRequest } from '../middlewares/validation-middleware'
import { foodItemValidator } from '../utils/validators'

export const foodItemRouter = express.Router()

foodItemRouter.route('/').get(authenticate, getAllFoodItems).post(authenticate, validateRequest(foodItemValidator), createFoodItem)

foodItemRouter
	.route('/:id')
	.get(authenticate, getFoodItemById)
	.put(authenticate, validateRequest(foodItemValidator), updateFoodItem)
	.delete(authenticate, deleteFoodItem)
