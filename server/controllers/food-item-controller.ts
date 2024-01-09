import asyncHandler from 'express-async-handler'
import mongoose from 'mongoose'
import { ExtendedRequest } from '../../app-types'
import { DailyLog } from '../models/daily-log-model'
import { FoodItem } from '../models/food-item-model'
import { Meal } from '../models/meal-model'
import { constants } from '../utils/constants'
import { ServiceError } from '../utils/service-error'

// @desc Get names and IDs of all food items for a user
// @route GET /api/foodItems
// @access private
export const getAllFoodItemNames = asyncHandler(async (req: ExtendedRequest, res) => {
	const userId = req.user._id
	const foodItems = await FoodItem.find({ userId }).select('name _id')
	res.status(200).json(foodItems)
})

// @desc Get a single food item by ID
// @route GET /api/foodItems/:id
// @access private
export const getFoodItemById = asyncHandler(async (req: ExtendedRequest, res) => {
	const { id } = req.params
	const userId = req.user._id
	const foodItem = await FoodItem.findOne({ _id: id, userId })

	if (!foodItem) {
		throw new ServiceError('Food item not found', constants.NOT_FOUND)
	}

	res.status(200).json(foodItem)
})

// @desc Create a new food item
// @route POST /api/foodItems
// @access private
export const createFoodItem = asyncHandler(async (req: ExtendedRequest, res) => {
	const userId = req.user._id
	const foodItemData = { ...req.body, userId }
	const foodItem = await FoodItem.create(foodItemData)
	res.status(201).json(foodItem)
})

// @desc Update a food item
// @route PUT /api/foodItems/:id
// @access private
export const updateFoodItem = asyncHandler(async (req: ExtendedRequest, res) => {
	const { id } = req.params
	const userId = req.user._id
	const updateData = req.body

	const foodItem = await FoodItem.findOneAndUpdate({ _id: id, userId }, updateData, { new: true })
	if (!foodItem) {
		throw new ServiceError('Food item not found', constants.NOT_FOUND)
	}

	res.status(200).json(foodItem)
})

// @desc Delete a food item and update related meals and daily logs
// @route DELETE /api/foodItems/:foodItemId
// @access private
export const deleteFoodItem = asyncHandler(async (req: ExtendedRequest, res) => {
	const session = await mongoose.startSession()
	session.startTransaction()

	try {
		const { foodItemId } = req.params
		const userId = req.user._id // Assuming req.user is populated by your auth middleware

		// Verify the food item belongs to the user
		const foodItem = await FoodItem.findOne({ _id: foodItemId, userId })
		if (!foodItem) {
			throw new ServiceError('Food item not found or does not belong to the user', constants.NOT_FOUND)
		}

		// Delete the food item
		await FoodItem.findByIdAndDelete(foodItemId, { session })

		// Find and update meals that include the deleted food item
		const mealsToUpdate = await Meal.find(
			{
				'foodItems._id': foodItemId,
				userId: userId
			},
			null,
			{ session }
		)

		for (const meal of mealsToUpdate) {
			meal.foodItems = meal.foodItems.filter(item => item._id.toString() !== foodItemId)
			if (meal.foodItems.length === 0) {
				await Meal.findByIdAndDelete(meal._id, { session })
			} else {
				await meal.save({ session })
			}
		}

		// Update Daily Logs that reference any updated meals
		for (const meal of mealsToUpdate) {
			await DailyLog.updateMany({ 'meals.mealId': meal._id, userId: userId }, { $pull: { meals: { mealId: meal._id } } }, { session })
		}

		// Commit the transaction
		await session.commitTransaction()
		res.status(200).json({ message: 'Food item and related data deleted successfully' })
	} catch (error) {
		// If an error occurs, abort the transaction
		await session.abortTransaction()
		throw new ServiceError(error.message, constants.SERVER_ERROR)
	} finally {
		// End the session
		session.endSession()
	}
})
