import express from 'express'
import { createFoodItem, deleteFoodItem, getAllFoodItems, getFoodItemsByIds, updateFoodItem } from '../controllers/food-item-controller'
import { authenticate } from '../middlewares/auth-middleware'
import { validateRequest } from '../middlewares/validation-middleware'
import { foodItemValidator, validateIdsInQueryString } from '../utils/validators'

export const foodItemRouter = express.Router()

foodItemRouter
	.route('/')
	.get(authenticate, getAllFoodItems)
	.get(authenticate, validateRequest(validateIdsInQueryString), getFoodItemsByIds)
	.post(authenticate, validateRequest(foodItemValidator), createFoodItem)

foodItemRouter
	.route('/:foodItemId')
	.put(authenticate, validateRequest(foodItemValidator), updateFoodItem)
	.delete(authenticate, deleteFoodItem)
