import express from 'express'
import { getMeals, createMeal, updateMeal, deleteMeal } from '../controllers/meal-controller'
import { authMiddleware } from '../middlewares/auth-middleware'
import { validationErrorsMiddleware } from '../middlewares/validation-errors-middleware'
import { mealValidator } from '../validators/meal-validator'

export const mealRouter = express.Router()

mealRouter.route('/').get(authMiddleware, getMeals).post(authMiddleware, mealValidator, validationErrorsMiddleware, createMeal)

mealRouter.route('/:mealId').put(authMiddleware, mealValidator, validationErrorsMiddleware, updateMeal).delete(authMiddleware, deleteMeal)
