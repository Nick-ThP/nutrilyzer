import asyncHandler from 'express-async-handler'
import { ObjectId } from 'mongodb'
import mongoose from 'mongoose'
import { Create, ExtendedRequest, IMealSubmit, Update } from '../../app-types'
import { DailyLog } from '../models/daily-log-model'
import { FoodItem } from '../models/food-item-model'
import { Meal } from '../models/meal-model'
import { AsyncHandlerError } from '../utils/async-handler-error'
import { HTTP_STATUS } from '../utils/http-messages'

// @desc Get all meals for a user
// @route GET /api/meals/
// @access Private
export const getAllMeals = asyncHandler(async (req: ExtendedRequest, res, next) => {
	if (req.query.ids) return next()

	const userId = req.user?._id

	const meals = await Meal.find({ $or: [{ userId }, { isDefault: true }] })

	res.status(HTTP_STATUS.OK).json(meals)
})

// @desc Get multiple meals by ID's
// @route GET /api/meals?ids=id1,id2,id3
// @access Private
export const getMealsByIds = asyncHandler(async (req: ExtendedRequest, res) => {
	const mealIds: ObjectId[] = (req.query.ids as string).split(',').map(id => new mongoose.Types.ObjectId(id))

	const meals = await Meal.find({ _id: { $in: mealIds } })

	if (!meals.length) {
		throw new AsyncHandlerError('Could not find meals with the provided ids', HTTP_STATUS.NOT_FOUND)
	}

	res.status(HTTP_STATUS.OK).json(meals)
})

// @desc Create a new meal
// @route POST /api/meals
// @access Private
export const createMeal = asyncHandler(async (req: ExtendedRequest, res) => {
	const userId = req.user?._id
	const { name, foodEntries, isSavedInCollection }: IMealSubmit<Create> = req.body
	const visibility = isSavedInCollection ? { hiddenByUsers: [] } : { hiddenByUsers: [userId] }

	const foodItemPromises = foodEntries.map(entry => FoodItem.find({ _id: entry.foodItem }))
	const foodItems = await Promise.all(foodItemPromises)

	foodItems.forEach((found, index) => {
		if (!found || found.length === 0) {
			throw new AsyncHandlerError(`Food item not found for entry at index ${index}`, HTTP_STATUS.SERVER_ERROR)
		}
	})

	// Create a new meal
	const newMeal = await Meal.create({ userId, name, foodEntries, isDefault: false, visibility })

	if (!newMeal) {
		throw new AsyncHandlerError('Meal could not be created', HTTP_STATUS.SERVER_ERROR)
	}

	res.status(HTTP_STATUS.CREATED).json(newMeal)
})

// @desc Update a meal
// @route PUT /api/meals/:mealId
// @access Private
export const updateMeal = asyncHandler(async (req: ExtendedRequest, res) => {
	const userId = req.user?._id
	const mealId = req.params.mealId
	const { name, foodEntries, isRemovedFromCollection }: IMealSubmit<Update> = req.body
	const visibility = isRemovedFromCollection ? { hiddenByUsers: [userId] } : { hiddenByUsers: [] }

	// Check if the meal exists and belongs to the user
	const updatedMeal = await Meal.findOneAndUpdate({ userId, _id: mealId }, { name, foodEntries, visibility }, { new: true })

	if (!updatedMeal) {
		throw new AsyncHandlerError('Meal not found or does not belong to the user', HTTP_STATUS.NOT_FOUND)
	}

	res.status(HTTP_STATUS.OK).json(updatedMeal)
})

// @desc Delete a meal and update related daily logs
// @route DELETE /api/meals/:mealId
// @access Private
export const deleteMeal = asyncHandler(async (req: ExtendedRequest, res) => {
	const session = await mongoose.startSession()
	session.startTransaction()

	try {
		const userId = req.user?._id
		const mealId = req.params.mealId

		// Find the meal
		const meal = await Meal.findOne({ userId, _id: mealId }).session(session)

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
			await Meal.findByIdAndDelete(mealId, { session })
		}

		// Update or delete associated DailyLogs for all mealtimes
		const mealtimes = ['breakfast', 'lunch', 'dinner', 'snacks']

		for (const mealtime of mealtimes) {
			await DailyLog.updateManyAndDeleteIfEmpty(
				{ [`meals.${mealtime}`]: mealId, userId },
				{ $pull: { [`meals.${mealtime}`]: mealId } },
				{ session }
			)
		}

		// Commit the transaction
		await session.commitTransaction()
		res.status(HTTP_STATUS.OK).json({ message: 'Meal and related data processed successfully' })
	} catch (error) {
		// If an error occurs, abort the transaction
		await session.abortTransaction()
		throw new AsyncHandlerError(error.message, HTTP_STATUS.SERVER_ERROR)
	} finally {
		// End the session
		session.endSession()
	}
})
