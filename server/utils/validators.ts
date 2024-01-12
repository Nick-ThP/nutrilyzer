import { body } from 'express-validator'

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
	body('calories').isNumeric().withMessage('Calories must be a number'),
	body('carbs').trim().notEmpty().withMessage('Carbs are required'),
	body('fiber').trim().notEmpty().withMessage('Fiber is required'),
	body('fat').trim().notEmpty().withMessage('Fat is required'),
	body('protein').trim().notEmpty().withMessage('Protein is required'),
	body('sodium').trim().notEmpty().withMessage('Sodium is required')
]

export const dailyLogValidator = [
	body('date').isISO8601().withMessage('Invalid date format'),
	body('meals').isArray({ min: 4, max: 4 }).withMessage('Invalid meals object'),
	body('meals.breakfast').withMessage('breakfast array is required'),
	body('meals.lunch').withMessage('lunch array is required'),
	body('meals.dinner').withMessage('dinner array is required'),
	body('meals.snacks').withMessage('snacks array is required')
]

export const mealValidator = [
	body('name').trim().notEmpty().withMessage('Meal name is required'),
	body('foodEntry').isArray({ min: 1 }).withMessage('Food entry must be an array'),
	body('foodEntry.foodItem').isMongoId().withMessage('Food item must be an ID'),
	body('foodEntry.grams').isNumeric().withMessage('Grams must be a number')
]
