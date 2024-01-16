import { body } from 'express-validator'
import { hasRequiredMealTimes, isEmailUnique, isUsernameUnique, isValidMealArray, isValidNutritionObject } from './helper-functions'

export const registrationValidator = [
	body('username')
		.trim()
		.notEmpty()
		.withMessage('userame is required')
		.isLength({ min: 5 })
		.withMessage('Username must be at least 5 characters long')
		.custom(async username => {
			const isUnique = await isUsernameUnique(username)
			if (!isUnique) {
				throw new Error('Username is taken')
			}
		}),
	body('email')
		.trim()
		.notEmpty()
		.withMessage('email is required')
		.isEmail()
		.withMessage('Invalid email format')
		.custom(async email => {
			const isUnique = await isEmailUnique(email)
			if (!isUnique) {
				throw new Error('Email is already registered')
			}
		}),
	body('password')
		.trim()
		.notEmpty()
		.withMessage('password is required')
		.isLength({ min: 8 })
		.withMessage('Password must be at least 8 characters long')
		.matches(/\d/)
		.withMessage('Password must contain at least one digit')
]

export const loginValidator = [
	body('email').trim().notEmpty().withMessage('Please include your email'),
	body('password').trim().notEmpty().withMessage('Please include your password')
]

export const foodItemValidator = [
	body('name').trim().notEmpty().withMessage('Name is required'),
	body('nutrition').custom(value => {
		if (!isValidNutritionObject(value)) {
			throw new Error('Invalid nutrition format')
		}
	}),
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
	body('meals').custom(value => {
		if (!hasRequiredMealTimes(value)) {
			throw new Error('Invalid meals array')
		}
	}),
	body('meals.breakfast').custom(value => {
		if (!isValidMealArray(value)) {
			throw new Error('Invalid breakfast array')
		}
	}),
	body('meals.lunch').custom(value => {
		if (!isValidMealArray(value)) {
			throw new Error('Invalid lunch array')
		}
	}),
	body('meals.dinner').custom(value => {
		if (!isValidMealArray(value)) {
			throw new Error('Invalid dinner array')
		}
	}),
	body('meals.snacks').custom(value => {
		if (!isValidMealArray(value)) {
			throw new Error('Invalid snacks array')
		}
	})
]
