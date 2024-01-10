import { body, check } from 'express-validator'

export const foodItemValidator = [
	body('name').trim().notEmpty().withMessage('Name is required'),
	body('calories').isNumeric().withMessage('Calories must be a number'),
	body('carbs').trim().notEmpty().withMessage('Carbs are required'),
	body('fiber').trim().notEmpty().withMessage('Fiber is required'),
	body('fat').trim().notEmpty().withMessage('Fat is required'),
	body('protein').trim().notEmpty().withMessage('Protein is required'),
	body('sodium').trim().notEmpty().withMessage('Sodium is required')
]

export const dailyLogValidator = [body('date').isISO8601().withMessage('Invalid date format')]

export const mealOnLogValidator = [body('mealType').isIn(['breakfast', 'lunch', 'dinner', 'snacks']).withMessage('Invalid meal type')]

export const mealValidator = [
	check('name').notEmpty().withMessage('Meal name is required'),
	check('foodItems').isArray({ min: 1 }).withMessage('Food items must be an array')
]
