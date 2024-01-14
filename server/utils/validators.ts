import { body } from 'express-validator'
import { hasRequiredMealTimes, isValidMealArray, isValidNutritionObject } from './helper-functions'

export const registrationValidator = [
	body('username').trim().notEmpty().withMessage('userame is required'),
	body('email').trim().notEmpty().withMessage('email is required'),
	body('password').trim().notEmpty().withMessage('password is required')
]

export const loginValidator = [
	body('email').trim().notEmpty().withMessage('email is required'),
	body('password').trim().notEmpty().withMessage('password is required')
]

export const foodItemValidator = [
	body('name').trim().notEmpty().withMessage('Name is required'),
	body('nutrition').custom(isValidNutritionObject).withMessage('Invalid nutrition format'),
	body('nutrition.calories').isNumeric().withMessage('Calories must be a number'),
	body('nutrition.carbs').trim().notEmpty().withMessage('Carbs are required'),
	body('nutrition.fiber').trim().notEmpty().withMessage('Fiber is required'),
	body('nutrition.fat').trim().notEmpty().withMessage('Fat is required'),
	body('nutrition.protein').trim().notEmpty().withMessage('Protein is required'),
	body('nutrition.sodium').trim().notEmpty().withMessage('Sodium is required')
]

export const mealValidator = [
	body('name').trim().notEmpty().withMessage('Meal name is required'),
	body('foodEntry').isArray({ min: 1 }).withMessage('Food entry must be an non-empty array'),
	body('foodEntry.*.foodItem').isMongoId().withMessage('Food item must be a valid Mongo ID'),
	body('foodEntry.*.grams').isNumeric().withMessage('Grams must be a number')
]

export const dailyLogValidator = [
	body('date').isISO8601().withMessage('Invalid date format'),
	body('meals').custom(hasRequiredMealTimes).withMessage('Invalid meals array'),
	body('meals.breakfast').custom(isValidMealArray).withMessage('Invalid breakfast array'),
	body('meals.lunch').custom(isValidMealArray).withMessage('Invalid lunch array'),
	body('meals.dinner').custom(isValidMealArray).withMessage('Invalid dinner array'),
	body('meals.snacks').custom(isValidMealArray).withMessage('Invalid snacks array')
]
