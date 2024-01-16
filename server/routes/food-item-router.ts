import express from 'express'
import { createFoodItem, deleteFoodItem, getAllFoodItems, getFoodItemsByIds, updateFoodItem } from '../controllers/food-item-controller'
import { authenticate } from '../middlewares/auth-middleware'
import { validateRequest } from '../middlewares/validation-middleware'
import { foodItemValidator } from '../utils/validators'

export const foodItemRouter = express.Router()

foodItemRouter
	.route('/')
	.get(authenticate, getAllFoodItems)
	.get(authenticate, getFoodItemsByIds)
	.post(authenticate, validateRequest(foodItemValidator), createFoodItem)

foodItemRouter.route('/:foodItemid').put(authenticate, validateRequest(foodItemValidator), updateFoodItem).delete(authenticate, deleteFoodItem)
