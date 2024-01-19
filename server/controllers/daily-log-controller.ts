import asyncHandler from 'express-async-handler'
import { ObjectId } from 'mongodb'
import mongoose from 'mongoose'
import { ExtendedRequest, IDailyLog } from '../../app-types'
import { DailyLog } from '../models/daily-log-model'
import { AsyncHandlerError } from '../utils/async-handler-error'
import { HTTP_STATUS } from '../utils/http-messages'
import { FoodItem } from '../models/food-item-model'

// @desc Get all daily logs
// @route GET /api/dailyLogs
// @access Private
export const getAllLogs = asyncHandler(async (req: ExtendedRequest, res) => {
	const userId = req.user?._id

	const logs = await DailyLog.find({ userId })

	res.status(HTTP_STATUS.OK).json(logs)
})

// @desc Update meals on daily log
// @route PUT /api/dailyLogs
// @access Private
export const updateLog = asyncHandler(async (req: ExtendedRequest, res) => {
	const userId = req.user?._id
	const { date, meals }: Omit<IDailyLog<ObjectId>, 'userId'> = req.body

	// Create objects for the update
	const filter = { userId, date }
	const update = {
		$set: { meals },
		$setOnInsert: { userId, date }
	}
	const options = {
		new: true,
		upsert: true
	}

	// Perform the update with upsert option
	const updateResult = await DailyLog.updateOneAndDeleteIfEmpty(filter, update, options)

	// Check if the operation was successful
	if (!updateResult) {
		throw new AsyncHandlerError('Error updating or creating daily log', HTTP_STATUS.SERVER_ERROR)
	}

	// Respond with the updated log information
	res.status(HTTP_STATUS.OK).json(updateResult)
})

// @desc Get a specific daily log (with meal and food item aggregation)
// @route GET /api/dailyLogs/:logDate
// @access Private
export const getLogDetails = asyncHandler(async (req: ExtendedRequest, res) => {
	const userId = req.user?._id
	const logDate = req.params.logDate

	const log = await DailyLog.aggregate([
		{
			$match: {
				date: logDate,
				userId: new mongoose.Types.ObjectId(userId)
			}
		},
		...['breakfast', 'lunch', 'dinner', 'snacks'].map(mealType => ({
        $lookup: {
            from: 'meals',
            localField: `meals.${mealType}`,
            foreignField: '_id',
            as: `meals.${mealType}`
        }
    })),
    {
        $project: {
            date: 1,
            userId: 1,
            'meals.breakfast': 1,
            'meals.lunch': 1,
            'meals.dinner': 1,
            'meals.snacks': 1
        }
    }
	])

	async function enrichMealWithFoodItems(meal) {
		if (!meal || !meal.foodEntries) {
			return meal
		}

		for (const entry of meal.foodEntries) {
			if (entry.foodItem) {
				const foodItemDetails = await FoodItem.findById(entry.foodItem)
				entry.foodItemDetails = foodItemDetails
			}
		}

		return meal
	}

	for (const mealType of ['breakfast', 'lunch', 'dinner', 'snacks']) {
		if (log[0].meals[mealType]) {
			for (let i = 0; i < log[0].meals[mealType].length; i++) {
				log[0].meals[mealType][i] = await enrichMealWithFoodItems(log[0].meals[mealType][i])
			}
		}
	}

	if (!log || !log.length) {
		throw new AsyncHandlerError('Daily log not found', HTTP_STATUS.NOT_FOUND)
	}

	res.status(HTTP_STATUS.OK).json(log[0])
})
