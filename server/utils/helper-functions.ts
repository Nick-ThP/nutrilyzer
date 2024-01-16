import jwt from 'jsonwebtoken'
import { ObjectId } from 'mongodb'
import { INutrition, IUser } from '../../app-types'
import { User } from '../models/user-model'

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

export const generateAuthToken = (user: Omit<IUser, 'email' | 'password'>) => {
	return jwt.sign({ user }, process.env.JWT_SECRET as string, { expiresIn: '30d' })
}

export const isUsernameUnique = async (value: string) => {
	const found = await User.findOne({ username: value })

	if (found) return false
	return true
}

export const isEmailUnique = async (value: string) => {
	const found = await User.findOne({ email: value })

	if (found) return false
	return true
}
