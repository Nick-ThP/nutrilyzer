import jwt from 'jsonwebtoken'
import { ObjectId } from 'mongodb'
import { INutrition, IUser } from '../../app-types'
import { User } from '../models/user-model'
import { AsyncHandlerError } from './async-handler-error'
import { HTTP_STATUS } from './http-messages'
import { FoodItem } from '../models/food-item-model'
import { Meal } from '../models/meal-model'

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

export const isValidNutritionObject = (foodItem: INutrition) => {
	const expectedKeys = ['calories', 'protein', 'carbs', 'fat', 'sodium']
	const keys = Object.keys(foodItem)

	return keys.every(key => expectedKeys.includes(key)) && keys.length === expectedKeys.length
}

export const isUserPropertyUnique = async (key: string, value: string) => {
	try {
		const found = await User.findOne({ [key]: value })
		return !found
	} catch (error) {
		throw new AsyncHandlerError('Something went wrong on the server', HTTP_STATUS.SERVER_ERROR)
	}
}

export const isFoodItemNameUnique = async (value: string) => {
	try {
		const found = await FoodItem.findOne({ name: value })
		return !found
	} catch (error) {
		throw new AsyncHandlerError('Something went wrong on the server', HTTP_STATUS.SERVER_ERROR)
	}
}

export const isMealNameUnique = async (value: string) => {
	try {
		const found = await Meal.findOne({ name: value })
		return !found
	} catch (error) {
		throw new AsyncHandlerError('Something went wrong on the server', HTTP_STATUS.SERVER_ERROR)
	}
}
