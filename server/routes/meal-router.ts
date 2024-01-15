import express from 'express'
import { createMeal, deleteMeal, getAllMeals, getMealsByIds, updateMeal } from '../controllers/meal-controller'
import { authenticate } from '../middlewares/auth-middleware'
import { validateRequest } from '../middlewares/validation-middleware'
import { mealValidator } from '../utils/validators'

export const mealRouter = express.Router()

mealRouter
	.route('/')
	.get(authenticate, getAllMeals)
	.get(authenticate, getMealsByIds)
	.post(authenticate, validateRequest(mealValidator), createMeal)

mealRouter.route('/:id').put(authenticate, validateRequest(mealValidator), updateMeal).delete(authenticate, deleteMeal)
