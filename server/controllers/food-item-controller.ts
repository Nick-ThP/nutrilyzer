import asyncHandler from 'express-async-handler'
import mongoose from 'mongoose'
import { ExtendedRequest } from '../../app-types'
import { DailyLog } from '../models/daily-log-model'
import { FoodItem } from '../models/food-item-model'
import { Meal } from '../models/meal-model'
import { HTTP_STATUS } from '../utils/http-messages'
import { ServiceError } from '../utils/service-error'

// @desc Get names and IDs of all food items for a user
// @route GET /api/foodItems
// @access Private
export const getAllFoodItemNames = asyncHandler(async (req: ExtendedRequest, res) => {
	const userId = req.user?._id

	// Check if the user has at least one food item
	const foodItems = await FoodItem.find({ userId }).select('name _id')

	if (!foodItems || foodItems.length === 0) {
		throw new ServiceError('No food items found for the user', HTTP_STATUS.NOT_FOUND)
	}

	res.status(200).json(foodItems)
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
		throw new ServiceError('Food item not found or does not belong to the user', HTTP_STATUS.NOT_FOUND)
	}

	res.status(200).json(foodItem)
})

// @desc Create a new food item
// @route POST /api/foodItems
// @access Private
export const createFoodItem = asyncHandler(async (req: ExtendedRequest, res) => {
	const userId = req.user?._id
	const foodItemData = { ...req.body, userId }

	// Create a new food item
	const foodItem = await FoodItem.create(foodItemData)
	res.status(201).json(foodItem)
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
		throw new ServiceError('Food item not found or does not belong to the user', HTTP_STATUS.NOT_FOUND)
	}

	res.status(200).json(foodItem)
})

// @desc Delete a food item and update related meals and daily logs
// @route DELETE /api/foodItems/:foodItemId
// @access Private
export const deleteFoodItem = asyncHandler(async (req: ExtendedRequest, res) => {
	const session = await mongoose.startSession()
	session.startTransaction()

	try {
		const { foodItemId } = req.params
		const userId = req.user?._id

		// Check if the food item exists and belongs to the user
		const foodItem = await FoodItem.findOne({ _id: foodItemId, userId })

		if (!foodItem) {
			throw new ServiceError('Food item not found or does not belong to the user', HTTP_STATUS.NOT_FOUND)
		}

		// Delete the food item
		await FoodItem.findByIdAndDelete(foodItemId, { session })

		// Find and update meals that include the deleted food item
		const mealsToUpdate = await Meal.find(
			{
				'foodEntry.foodItem': foodItemId,
				userId: userId
			},
			null,
			{ session }
		)

		const mealIdsToUpdate = mealsToUpdate.map(meal => meal._id)

		for (const mealId of mealIdsToUpdate) {
			await Meal.updateOne({ _id: mealId }, { $pull: { foodEntry: { foodItem: foodItemId } } }, { session })
		}

		// Update Daily Logs that reference any updated meals
		await DailyLog.updateMany(
			{ 'meals.foodItem': foodItemId, userId: userId },
			{ $pull: { 'meals.$[meal].foodEntry': { foodItem: foodItemId } } },
			{ arrayFilters: [{ 'meal.foodItem': foodItemId }], session }
		)

		// Commit the transaction
		await session.commitTransaction()
		res.status(200).json({ message: 'Food item and related data deleted successfully' })
	} catch (error) {
		// If an error occurs, abort the transaction
		await session.abortTransaction()
		throw new ServiceError(error.message, HTTP_STATUS.SERVER_ERROR)
	} finally {
		// End the session
		session.endSession()
	}
})
