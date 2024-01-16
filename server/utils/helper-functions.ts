import jwt from 'jsonwebtoken'
import { ObjectId } from 'mongodb'
import { INutrition, IUser } from '../../app-types'
import { User } from '../models/user-model'
import { AsyncHandlerError } from './async-handler-error'
import { HTTP_STATUS } from './http-messages'

export const generateAuthToken = (user: Omit<IUser, 'email' | 'password'>) => {
	return jwt.sign({ user }, process.env.JWT_SECRET as string, { expiresIn: '30d' })
}

export function isLoggedMealsEmpty(meals: ObjectId[][]) {
	return Object.values(meals).every(mealArray => mealArray.length === 0)
}

export const isValidMealArray = (value: ObjectId[] | []) => {
	return Array.isArray(value) && (value.length === 0 || value.every(ObjectId.isValid))
}

export const hasRequiredMealTimes = (meals: Record<string, any[]>) => {
	const requiredMeals = ['breakfast', 'lunch', 'dinner', 'snacks']
	return requiredMeals.every(meal => Array.isArray(meals[meal]))
}

export const isValidNutritionObject = (value: INutrition) => {
	const expectedKeys = ['calories', 'carbs', 'fiber', 'fat', 'protein', 'sodium']
	const keys = Object.keys(value)

	return keys.every(key => expectedKeys.includes(key)) && keys.length === expectedKeys.length
}

export const isUsernameUnique = async (value: string) => {
	try {
		const found = await User.findOne({ username: value })
		return !found
	} catch (error) {
		throw new AsyncHandlerError('Something went wrong on the server', HTTP_STATUS.SERVER_ERROR)
	}
}

export const isEmailUnique = async (value: string) => {
	try {
		const found = await User.findOne({ email: value })
		return !found
	} catch (error) {
		throw new AsyncHandlerError('Something went wrong on the server', HTTP_STATUS.SERVER_ERROR)
	}
}
