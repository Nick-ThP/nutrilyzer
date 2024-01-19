import { body, query } from 'express-validator'
import mongoose from 'mongoose'
import {
	hasRequiredMealTimes,
	isMealBeingSavedOrRemoved,
	isUserPropertyUnique,
	isValidMacronutrientWithUnit,
	isValidMealArray,
	isValidMicronutrientWithUnit,
	isValidNutritionObject
} from './helper-functions'

export const registrationValidator = [
	body('username')
		.trim()
		.notEmpty()
		.withMessage('userame is required')
		.isLength({ min: 5 })
		.withMessage('Username must be at least 5 characters long')
		.custom(async username => {
			const isUnique = await isUserPropertyUnique('username', username)
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
			const isUnique = await isUserPropertyUnique('email', email)
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
	body('nutrition').custom(isValidNutritionObject),
	body('nutrition.calories').isNumeric().withMessage('Calories must be a number'),
	body('nutrition.protein').custom(isValidMacronutrientWithUnit),
	body('nutrition.carbs').custom(isValidMacronutrientWithUnit),
	body('nutrition.fat').custom(isValidMacronutrientWithUnit),
	body('nutrition.sodium').custom(isValidMicronutrientWithUnit)
]

export const mealValidator = [
	body('name').trim().notEmpty().withMessage('Meal name is required'),
	body('foodEntries').isArray({ min: 1 }).withMessage('Food entry must be an non-empty array'),
	body('foodEntries.*.foodItem').isMongoId().withMessage('Food item must be a valid Mongo ID'),
	body('foodEntries.*.grams').isNumeric().withMessage('Grams must be a number'),
	body().custom(isMealBeingSavedOrRemoved)
]

export const dailyLogValidator = [
	body('date')
		.matches(/^\d{8}$/)
		.withMessage('Date must be in MMDDYYYY format with 8 digits')
		.custom(value => {
			const month = parseInt(value.substring(0, 2), 10)
			const day = parseInt(value.substring(2, 4), 10)
			const year = parseInt(value.substring(4, 8), 10)

			const date = new Date(year, month - 1, day)
			return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
		})
		.withMessage('Invalid date'),
	body('meals').custom(hasRequiredMealTimes),
	body('meals.breakfast').custom(isValidMealArray),
	body('meals.lunch').custom(isValidMealArray),
	body('meals.dinner').custom(isValidMealArray),
	body('meals.snacks').custom(isValidMealArray)
]

export const validateIdsInQueryString = [
	query('ids')
		.isString()
		.withMessage('IDs must be a comma-separated string')
		.custom(value => {
			const ids = value.split(',')
			return ids.every((id: string) => mongoose.Types.ObjectId.isValid(id))
		})
		.withMessage('Each ID must be a valid MongoDB ObjectId')
]
