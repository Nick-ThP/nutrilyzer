import { body } from 'express-validator'
import { AsyncHandlerError } from './async-handler-error'
import { hasRequiredMealTimes, isEmailUnique, isUsernameUnique, isValidMealArray, isValidNutritionObject } from './helper-functions'
import { HTTP_STATUS } from './http-messages'

export const registrationValidator = [
	body('username')
		.trim()
		.notEmpty()
		.withMessage('userame is required')
		.isLength({ min: 5 })
		.withMessage('Username must be at least 5 characters long')
		.custom(async value => {
			try {
				await isUsernameUnique(value)
			} catch (error) {
				throw new AsyncHandlerError('Something went wrong on the server', HTTP_STATUS.SERVER_ERROR)
			}
		})
		.withMessage('This username is taken'),
	body('email')
		.trim()
		.notEmpty()
		.withMessage('email is required')
		.isEmail()
		.withMessage('Invalid email format')
		.custom(async value => {
			try {
				await isEmailUnique(value)
			} catch (error) {
				throw new AsyncHandlerError('Something went wrong on the server', HTTP_STATUS.SERVER_ERROR)
			}
		})
		.withMessage('Email is already registered'),
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
