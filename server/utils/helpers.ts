import { ObjectId } from 'mongodb'
import { INutrition } from '../../app-types'

export function isLogMealsEmpty(meals: ObjectId[][]) {
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
