import express from 'express'
import { createMeal, deleteMeal, getMeals, updateMeal } from '../controllers/meal-controller'
import { authMiddleware } from '../middlewares/auth-middleware'
import { validationErrorsMiddleware } from '../middlewares/validation-middleware'
import { mealValidator } from '../validators/meal-validator'

export const mealRouter = express.Router()

mealRouter.route('/').get(authMiddleware, getMeals).post(authMiddleware, mealValidator, validationErrorsMiddleware, createMeal)

mealRouter.route('/:mealId').put(authMiddleware, mealValidator, validationErrorsMiddleware, updateMeal).delete(authMiddleware, deleteMeal)
