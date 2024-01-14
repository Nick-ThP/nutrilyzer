import asyncHandler from 'express-async-handler'
import mongoose from 'mongoose'
import { ExtendedRequest } from '../../app-types'
import { DailyLog } from '../models/daily-log-model'
import { FoodItem } from '../models/food-item-model'
import { Meal } from '../models/meal-model'
import { AsyncHandlerError } from '../utils/async-handler-error'
import { HTTP_STATUS } from '../utils/http-messages'

// @desc Get all food items for a user
// @route GET /api/foodItems
// @access Private
export const getAllFoodItems = asyncHandler(async (req: ExtendedRequest, res) => {
	const userId = req.user?._id

	// Check if the user has at least one food item available to them
	const foodItems = await FoodItem.find({ $or: [{ userId }, { isDefault: true }] })

	if (foodItems.length === 0) {
		throw new AsyncHandlerError('No food items found for the user', HTTP_STATUS.NOT_FOUND)
	}

	res.status(HTTP_STATUS.OK).json(foodItems)
})

// @desc Get a single food item by ID
// @route GET /api/foodItems/:id
// @access Private
export const getFoodItemById = asyncHandler(async (req: ExtendedRequest, res) => {
	const { id } = req.params
	const userId = req.user?._id

	// Check if the food item exists and belongs to the user
	const foodItem = await FoodItem.findOne({ _id: id, userId })

	if (!foodItem) {
		throw new AsyncHandlerError('Food item not found or does not belong to the user', HTTP_STATUS.NOT_FOUND)
	}

	res.status(HTTP_STATUS.OK).json(foodItem)
})

// @desc Create a new food item
// @route POST /api/foodItems
// @access Private
export const createFoodItem = asyncHandler(async (req: ExtendedRequest, res) => {
	const userId = req.user?._id
	const foodItemData = { ...req.body, userId, isDefault: false }

	// Create a new food item
	const foodItem = await FoodItem.create(foodItemData)

	if (!foodItem) {
		throw new AsyncHandlerError('Food item could no be created', HTTP_STATUS.SERVER_ERROR)
	}

	res.status(HTTP_STATUS.CREATED).json(foodItem)
})

// @desc Update a food item
// @route PUT /api/foodItems/:id
// @access Private
export const updateFoodItem = asyncHandler(async (req: ExtendedRequest, res) => {
	const { id } = req.params
	const userId = req.user?._id
	const updateData = req.body

	// Check if the food item exists and belongs to the user
	const foodItem = await FoodItem.findOneAndUpdate({ _id: id, userId }, updateData, { new: true })

	if (!foodItem) {
		throw new AsyncHandlerError('Food item not found or does not belong to the user', HTTP_STATUS.NOT_FOUND)
	}

	res.status(HTTP_STATUS.OK).json(foodItem)
})

/// @desc Delete a food item and update related meals and daily logs
// @route DELETE /api/foodItems/:foodItemId
// @access Private
export const deleteFoodItem = asyncHandler(async (req: ExtendedRequest, res) => {
	const session = await mongoose.startSession()
	session.startTransaction()

	try {
		const { foodItemId } = req.params
		const userId = req.user?._id

		// Find the food item
		const foodItem = await FoodItem.findOne({ _id: foodItemId, userId }).session(session)

		if (!foodItem) {
			throw new AsyncHandlerError('Food item not found or does not belong to the user', HTTP_STATUS.NOT_FOUND)
		}

		// Check if it's default or not
		if (foodItem.isDefault && userId) {
			// If isDefault is true, hide the food item by adding the user ID to hiddenByUsers
			foodItem.hiddenByUsers.push(userId)
			await foodItem.save({ session })
		} else {
			// If isDefault is false, delete the food item
			await FoodItem.findByIdAndDelete(foodItemId, { session })
		}

		// Now, update or delete associated Meals
		const mealsToUpdateOrDelete = await Meal.find({ 'foodEntry.foodItem': foodItemId, userId }, null, { session })

		for (const meal of mealsToUpdateOrDelete) {
			if (foodItem.isDefault && userId) {
				// If isDefault is true, hide the meal by adding the user ID to hiddenByUsers
				meal.hiddenByUsers.push(userId)
				await meal.save({ session })
			} else {
				// If isDefault is false, delete the meal
				await Meal.findByIdAndDelete(meal._id, { session })
			}
		}

		// Now, update or delete associated DailyLogs for all mealtimes
		const mealIdsToDelete = mealsToUpdateOrDelete.map(meal => meal._id)

		const mealtimes = ['breakfast', 'lunch', 'dinner', 'snacks']

		for (const mealtime of mealtimes) {
			await DailyLog.updateManyAndDeleteIfEmpty(
				{ [`meals.${mealtime}`]: { $in: mealIdsToDelete }, userId: userId },
				{ $pull: { [`meals.${mealtime}`]: { $in: mealIdsToDelete } } },
				{ session }
			)
		}

		// Commit the transaction
		await session.commitTransaction()
		res.status(HTTP_STATUS.OK).json({ message: 'Food item and related data processed successfully' })
	} catch (error) {
		// If an error occurs, abort the transaction
		await session.abortTransaction()
		throw new AsyncHandlerError(error.message, HTTP_STATUS.SERVER_ERROR)
	} finally {
		// End the session
		session.endSession()
	}
})
