import jwt from 'jsonwebtoken'
import { ObjectId } from 'mongodb'
import { INutrition, IUser } from '../../app-types'
import { User } from '../models/user-model'
import { AsyncHandlerError } from './async-handler-error'
import { HTTP_STATUS } from './http-messages'

export const generateAuthToken = (user: Omit<IUser, 'email' | 'password'>) => {
	return jwt.sign({ user }, process.env.JWT_SECRET as string, { expiresIn: '30d' })
}

export function isLoggedMealsEmpty(meals: Record<string, ObjectId[] | []>) {
	return Object.values(meals).every(mealArray => mealArray.length === 0)
}

export const isValidMealArray = (meals: ObjectId[] | []) => {
	return Array.isArray(meals) && (meals.length === 0 || meals.every(ObjectId.isValid))
}

export const hasRequiredMealTimes = (meals: Record<string, ObjectId[] | []>) => {
	const requiredMeals = ['breakfast', 'lunch', 'dinner', 'snacks']

	return requiredMeals.every(meal => Array.isArray(meals[meal]))
}

export const isValidNutritionObject = (nutrition: INutrition) => {
	const expectedKeys = ['calories', 'protein', 'carbs', 'fat', 'sodium']
	const keys = Object.keys(nutrition)

	if (!keys.every(key => expectedKeys.includes(key)) || keys.length !== expectedKeys.length) {
		throw new Error('Invalid nutrition format')
	}

	return true
}

export const isUserPropertyUnique = async (key: string, value: string) => {
	try {
		const found = await User.findOne({ [key]: value })

		return !found
	} catch (error) {
		throw new AsyncHandlerError('Something went wrong on the server', HTTP_STATUS.SERVER_ERROR)
	}
}

export function isValidMacronutrientWithUnit(value: string) {
	const regex = /^\d+g$/

	if (value === undefined) {
		throw new Error('Required information is missing from nutrition object')
	}

	if (!regex.test(value)) {
		throw new Error(`${value} is an invalid format for macronutrients. Please use grams (g)`)
	}

	return true
}

export function isValidMicronutrientWithUnit(value: string) {
	const regex = /^\d+mg$/

	if (!regex.test(value)) {
		throw new Error(`${value} is an invalid format for micronutrients. Please use milligrams (mg)`)
	}

	return true
}
