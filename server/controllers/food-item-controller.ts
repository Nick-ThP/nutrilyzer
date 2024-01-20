import asyncHandler from 'express-async-handler'
import mongoose from 'mongoose'
import { ExtendedRequest, IFoodItem, IFoodItemSubmit } from '../../app-types'
import { DailyLog } from '../models/daily-log-model'
import { FoodItem } from '../models/food-item-model'
import { Meal } from '../models/meal-model'
import { AsyncHandlerError } from '../utils/async-handler-error'
import { HTTP_STATUS } from '../utils/http-messages'
import { ObjectId } from 'mongodb'
import { isLoggedMealsEmpty } from '../utils/helper-functions'

// @desc Get all food items for a user
// @route GET /api/foodItems
// @access Private
export const getAllFoodItems = asyncHandler(async (req: ExtendedRequest, res, next) => {
	if (req.query.ids) return next()

	const userId = req.user?._id

	const foodItems = await FoodItem.find({ $or: [{ userId }, { isDefault: true }] })

	res.status(HTTP_STATUS.OK).json(foodItems)
})

// @desc Get multiple food items by ID's
// @route GET /api/foodItems?ids=id1,id2,id3
// @access Private
export const getFoodItemsByIds = asyncHandler(async (req: ExtendedRequest, res) => {
	const foodItemIds: ObjectId[] = (req.query.ids as string).split(',').map(id => new mongoose.Types.ObjectId(id))

	// Check if the food item exists and belongs to the user
	const foodItems = await FoodItem.find({ _id: { $in: foodItemIds } })

	if (!foodItems.length) {
		throw new AsyncHandlerError('Could not find food items with the provided ids', HTTP_STATUS.NOT_FOUND)
	}

	res.status(HTTP_STATUS.OK).json(foodItems)
})

// @desc Create a new food item
// @route POST /api/foodItems
// @access Private
export const createFoodItem = asyncHandler(async (req: ExtendedRequest, res) => {
	const userId = req.user?._id
	const { name, nutrition }: IFoodItemSubmit  = req.body

	// Create a new food item
	const newFoodItem = await FoodItem.create({ userId, name, nutrition, isDefault: false })

	if (!newFoodItem) {
		throw new AsyncHandlerError('Food item could not be created', HTTP_STATUS.SERVER_ERROR)
	}

	res.status(HTTP_STATUS.CREATED).json(newFoodItem)
})

// @desc Update a food item
// @route PUT /api/foodItems/:id
// @access Private
export const updateFoodItem = asyncHandler(async (req: ExtendedRequest, res) => {
	const userId = req.user?._id
	const foodItemId = req.params.foodItemId
	const { name, nutrition }: IFoodItemSubmit = req.body

	// Check if the food item exists and belongs to the user
	const updatedFoodItem = await FoodItem.findOneAndUpdate({ userId, _id: foodItemId}, { name, nutrition }, { new: true })

	if (!updatedFoodItem) {
		throw new AsyncHandlerError('Food item not found or does not belong to the user', HTTP_STATUS.NOT_FOUND)
	}

	res.status(HTTP_STATUS.OK).json(updatedFoodItem)
})

/// @desc Delete a food item and update related meals and daily logs
// @route DELETE /api/foodItems/:id
// @access Private
export const deleteFoodItem = asyncHandler(async (req: ExtendedRequest, res) => {
	const session = await mongoose.startSession()
	session.startTransaction()

	try {
		const userId = req.user?._id
		const foodItemId = req.params.foodItemId

		const foodItem = await FoodItem.findOne({ userId, _id: foodItemId }).session(session)
		if (!foodItem) {
			throw new AsyncHandlerError('Food item not found or does not belong to the user', HTTP_STATUS.NOT_FOUND)
		}

		if (foodItem.isDefault && userId) {
			foodItem.hiddenByUsers.push(userId)
			await foodItem.save({ session })
		} else {
			await FoodItem.findByIdAndDelete(foodItemId, { session })
		}

		const mealsToUpdateOrDelete = await Meal.find({ 'foodEntries.foodItem': foodItemId }, null, { session })
		const mealIdsToDelete = mealsToUpdateOrDelete.map(meal => meal._id)

		for (const meal of mealsToUpdateOrDelete) {
			if (foodItem.isDefault && userId) {
				meal.hiddenByUsers.push(userId)
				await meal.save({ session })
			} else {
				await Meal.findByIdAndDelete(meal._id, { session })
			}
		}

		const mealtimes = ['breakfast', 'lunch', 'dinner', 'snacks']
		for (const mealtime of mealtimes) {
			await DailyLog.updateMany(
				{ [`meals.${mealtime}`]: { $in: mealIdsToDelete }, userId },
				{ $pull: { [`meals.${mealtime}`]: { $in: mealIdsToDelete } } },
				{ session }
			)
		}

		const userDailyLogs = await DailyLog.find({ userId }).session(session)
		for (const dailyLog of userDailyLogs) {
			if (isLoggedMealsEmpty(dailyLog.meals)) {
				await DailyLog.deleteOne({ _id: dailyLog._id }, { session })
			}
		}

		await session.commitTransaction()
		res.status(HTTP_STATUS.OK).json({ message: 'Food item and related data processed successfully' })
	} catch (error) {
		await session.abortTransaction()
		throw new AsyncHandlerError(error.message, HTTP_STATUS.SERVER_ERROR)
	} finally {
		session.endSession()
	}
})


