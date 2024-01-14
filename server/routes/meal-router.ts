import express from 'express'
import { createMeal, deleteMeal, getMealById, getMeals, updateMeal } from '../controllers/meal-controller'
import { authenticate } from '../middlewares/auth-middleware'
import { validateRequest } from '../middlewares/validation-middleware'
import { mealValidator } from '../utils/validators'

export const mealRouter = express.Router()

mealRouter.route('/').get(authenticate, getMeals).post(authenticate, validateRequest(mealValidator), createMeal)

mealRouter
	.route('/:mealId')
	.get(authenticate, getMealById)
	.put(authenticate, validateRequest(mealValidator), updateMeal)
	.delete(authenticate, deleteMeal)
