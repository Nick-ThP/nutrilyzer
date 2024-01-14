import asyncHandler from 'express-async-handler'
import mongoose from 'mongoose'
import { ExtendedRequest } from '../../app-types'
import { DailyLog } from '../models/daily-log-model'
import { Meal } from '../models/meal-model'
import { AsyncHandlerError } from '../utils/async-handler-error'
import { HTTP_STATUS } from '../utils/http-messages'

// @desc Create a new meal
// @route POST /api/meals
// @access Private
export const createMeal = asyncHandler(async (req: ExtendedRequest, res) => {
	const mealData = { ...req.body, userId: req.user?._id }

	const newMeal = await Meal.create(mealData)
	if (!newMeal) {
		throw new AsyncHandlerError('Meal could not be created', HTTP_STATUS.SERVER_ERROR)
	}

	res.status(201).json(newMeal)
})

// @desc Get a single meal by ID
// @route GET /api/meals/:id
// @access Private
export const getMealById = asyncHandler(async (req: ExtendedRequest, res) => {
	const { id } = req.params

	const meal = await Meal.findOne({ _id: id })
	if (!meal) {
		throw new AsyncHandlerError('Meal not found', HTTP_STATUS.NOT_FOUND)
	}

	res.status(200).json(meal)
})

// @desc Update a meal
// @route PUT /api/meals/:id
// @access Private
export const updateMeal = asyncHandler(async (req: ExtendedRequest, res) => {
	const { id } = req.params

	const meal = await Meal.findOneAndUpdate({ _id: id, userId: req.user?._id }, ...req.body, { new: true })
	if (!meal) {
		throw new AsyncHandlerError('Meal not found', HTTP_STATUS.NOT_FOUND)
	}

	res.status(200).json(meal)
})

// @desc Delete a meal and update related daily logs
// @route DELETE /api/meals/:id
// @access Private
export const deleteMeal = asyncHandler(async (req: ExtendedRequest, res) => {
	const session = await mongoose.startSession()
	session.startTransaction()

	try {
		const { id } = req.params
		const userId = req.user?._id

		// Find the meal
		const meal = await Meal.findOne({ _id: id, userId }).session(session)

		if (!meal) {
			throw new AsyncHandlerError('Meal not found or does not belong to the user', HTTP_STATUS.NOT_FOUND)
		}

		// Check if it's default or not
		if (meal.isDefault && userId) {
			// If isDefault is true, hide the meal by adding the user ID to hiddenByUsers
			meal.hiddenByUsers.push(userId)
			await meal.save({ session })
		} else {
			// If isDefault is false, delete the meal
			await Meal.findByIdAndDelete(id, { session })
		}

		// Now, update or delete associated DailyLogs for all mealtimes
		const mealtimes = ['breakfast', 'lunch', 'dinner', 'snacks']
		for (const mealtime of mealtimes) {
			await DailyLog.updateManyAndDeleteIfEmpty(
				{ [`meals.${mealtime}`]: id, userId },
				{ $pull: { [`meals.${mealtime}`]: id } },
				{ session }
			)
		}

		// Commit the transaction
		await session.commitTransaction()
		res.status(200).json({ message: 'Meal and related data processed successfully' })
	} catch (error) {
		// If an error occurs, abort the transaction
		await session.abortTransaction()
		throw new AsyncHandlerError(error.message, HTTP_STATUS.SERVER_ERROR)
	} finally {
		// End the session
		session.endSession()
	}
})

// Get multiple meals by IDs
export const getMealsByIds = asyncHandler(async (req: ExtendedRequest, res) => {
	const { mealIds } = req.body

	const meals = await Meal.find({ _id: { $in: mealIds }, userId: req.user?._id })
	if (!meals.length) {
		throw new AsyncHandlerError('Meals not found', HTTP_STATUS.NOT_FOUND)
	}

	res.status(200).json(meals)
})
