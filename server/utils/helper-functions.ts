import jwt from 'jsonwebtoken'
import { ObjectId } from 'mongodb'
import { Create, IMealSubmit, INutrition, IUser, Update } from '../../app-types'
import { FoodItem } from '../models/food-item-model'
import { Meal } from '../models/meal-model'
import { User } from '../models/user-model'
import { AsyncHandlerError } from './async-handler-error'
import { HTTP_STATUS } from './http-messages'

export const generateAuthToken = (user: Omit<IUser, 'email' | 'password'>) => {
	return jwt.sign({ user }, process.env.JWT_SECRET as string, { expiresIn: '30d' })
}

export const isLoggedMealsEmpty = (meals: Record<string, ObjectId[] | []>) => {
	return ['breakfast', 'lunch', 'dinner', 'snacks'].every(mealType => !meals[mealType] || meals[mealType].length === 0)
}

export const hasRequiredMealTimes = (meals: Record<string, ObjectId[] | []>) => {
	const requiredMeals = ['breakfast', 'lunch', 'dinner', 'snacks']
	if (!requiredMeals.every(meal => Array.isArray(meals[meal]))) {
		throw new Error('Invalid meals array')
	}

	return true
}

export const isValidMealArray = (meals: ObjectId[] | []) => {
	if (!meals.every(ObjectId.isValid)) {
		throw new Error(`Invalid ${meals} array`)
	}

	return true
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

export const areItemsExisting = async (ids: ObjectId[], model: 'FoodItem' | 'Meal') => {
	try {
		let foundItems: unknown[]

		if (model === 'FoodItem') {
			foundItems = await FoodItem.find({ _id: { $in: ids } })
		} else if (model === 'Meal') {
			foundItems = await Meal.find({ _id: { $in: ids } })
		} else {
			throw new Error('Invalid model type')
		}

		return foundItems.length === ids.length
	} catch (error) {
		throw new AsyncHandlerError('Something went wrong on the server', HTTP_STATUS.SERVER_ERROR)
	}
}

export const isValidMacronutrientWithUnit = (value: string) => {
	const regex = /^\d+(\.\d+)?g$/

	if (value === undefined) {
		throw new Error('Required information is missing from nutrition object')
	}

	if (!regex.test(value)) {
		throw new Error(`${value} is an invalid format for macronutrients. Please use grams (g)`)
	}

	return true
}

export const isValidMicronutrientWithUnit = (value: string) => {
	const regex = /^\d+(\.\d+)?mg$/

	if (!regex.test(value)) {
		throw new Error(`${value} is an invalid format for micronutrients. Please use milligrams (mg)`)
	}

	return true
}

export const isMealBeingSavedOrRemoved = (mealData: IMealSubmit<Create | Update>) => {
	const isSaved = typeof mealData.isSavedInCollection === 'boolean'
	const isRemoved = typeof mealData.isRemovedFromCollection === 'boolean'

	if (isSaved === isRemoved) {
		throw new Error('Either isSavedInCollection or isRemovedFromCollection must be provided, but not both')
	}

	return true
}
