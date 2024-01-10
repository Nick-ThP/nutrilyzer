import asyncHandler from 'express-async-handler'
import { ObjectId } from 'mongodb'
import { ExtendedRequest } from '../../app-types'
import { DailyLog } from '../models/daily-log-model'
import { Meal } from '../models/meal-model'
import { constants } from '../utils/http-messages'
import { ServiceError } from '../utils/service-error'

// @desc Create a new meal
// @route POST /api/meals
// @access private
export const createMeal = asyncHandler(async (req: ExtendedRequest, res) => {
	const { name, foodItems, userId } = req.body

	const newMeal = new Meal({
		name,
		foodItems,
		userId,
		isDefault: false
	})

	await newMeal.save()
	res.status(201).json(newMeal)
})

// @desc Get a single meal by ID
// @route GET /api/meals/:id
// @access private
export const getMealById = asyncHandler(async (req: ExtendedRequest, res) => {
	const { id } = req.params

	const meal = await Meal.findById(id)
	if (!meal) {
		throw new ServiceError('Meal not found', constants.NOT_FOUND)
	}

	res.status(200).json(meal)
})

// @desc Update a meal
// @route PUT /api/meals/:id
// @access private
export const updateMeal = asyncHandler(async (req, res) => {
	const { id } = req.params
	const updateData = req.body

	const meal = await Meal.findByIdAndUpdate(id, updateData, { new: true })
	if (!meal) {
		throw new ServiceError('Meal not found', constants.NOT_FOUND)
	}

	res.status(200).json(meal)
})

// @desc Get multiple meals by IDs
// @route POST /api/meals/byIds
// @access private
export const getMealsByIds = asyncHandler(async (req, res) => {
	const { mealIds } = req.body

	const meals = await Meal.find({ _id: { $in: mealIds } })
	res.status(200).json(meals)
})

// @desc Delete a meal
// @route DELETE /api/meals/:id
// @access private
export const deleteMeal = asyncHandler(async (req: ExtendedRequest, res) => {
	const { id } = req.params
	const userId = req.user._id

	const meal = await Meal.findById(id)
	if (!meal) {
		throw new ServiceError('Meal not found', constants.NOT_FOUND)
	}

	// If meal is default, hide it for the user instead of deleting
	if (meal.isDefault) {
		if (!meal.hiddenByUsers.includes(userId)) {
			meal.hiddenByUsers.push(userId)
			await meal.save()
		}
	} else {
		await Meal.findByIdAndDelete(id)
		await updateDailyLogsForMealDeletion(id, userId) // Call the utility function to update daily logs
	}

	res.status(200).json({ message: 'Meal deleted successfully' })
})

// Utility function to update daily logs for a specific user upon meal deletion
const updateDailyLogsForMealDeletion = async (mealId, userId) => {
	const dailyLogs = await DailyLog.find({ userId })

	dailyLogs.forEach(async log => {
		;['breakfast', 'lunch', 'dinner', 'snack'].forEach(mealTime => {
			log.meals[mealTime] = log.meals[mealTime].filter(id => id.toString() !== mealId.toString())
		})

		await log.save()
	})
}
