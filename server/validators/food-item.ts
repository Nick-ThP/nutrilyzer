import { body } from 'express-validator'

// Validation middleware for creating and updating a food item
export const foodItemValidator = [
	body('name').trim().notEmpty().withMessage('Name is required'),
	body('calories').isNumeric().withMessage('Calories must be a number'),
	body('carbs').trim().notEmpty().withMessage('Carbs are required'),
	body('fiber').trim().notEmpty().withMessage('Fiber is required'),
	body('fat').trim().notEmpty().withMessage('Fat is required'),
	body('protein').trim().notEmpty().withMessage('Protein is required'),
	body('sodium').trim().notEmpty().withMessage('Sodium is required')
]
