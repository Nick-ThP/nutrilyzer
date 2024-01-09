import { check } from 'express-validator'

export const mealValidator = [
	check('name').notEmpty().withMessage('Meal name is required'),
	check('foodItems').isArray({ min: 1 }).withMessage('Food items must be an array')
]
