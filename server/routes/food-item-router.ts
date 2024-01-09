import express from 'express'
import { createFoodItem, getAllFoodItemNames, getFoodItemById, updateFoodItem, deleteFoodItem } from '../controllers/food-item-controller'
import { authMiddleware } from '../middlewares/auth-middleware'
import { validationErrorsMiddleware } from '../middlewares/validation-errors-middleware'
import { foodItemValidator } from '../validators/food-item'

export const foodItemRouter = express.Router()

// Route for getting a lightweight list of all food items and creating a new food item
foodItemRouter
	.route('/')
	.get(authMiddleware, getAllFoodItemNames)
	.post(authMiddleware, foodItemValidator, validationErrorsMiddleware, createFoodItem)

// Route for operations on a specific food item
foodItemRouter
	.route('/:id')
	.get(authMiddleware, getFoodItemById)
	.put(authMiddleware, foodItemValidator, validationErrorsMiddleware, updateFoodItem)
	.delete(authMiddleware, deleteFoodItem)
