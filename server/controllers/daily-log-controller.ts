import asyncHandler from 'express-async-handler'
import { ObjectId } from 'mongodb'
import { Aggregated, ExtendedRequest, IDailyLog } from '../../app-types'
import { DailyLog } from '../models/daily-log-model'
import { HTTP_STATUS } from '../utils/http-messages'
import { AsyncHandlerError } from '../utils/async-handler-error'

// @desc Get all daily logs
// @route GET /api/dailyLogs
// @access Private
export const getAllLogs = asyncHandler(async (req: ExtendedRequest, res) => {
	const userId = req.user?._id

	const logs: IDailyLog<ObjectId>[] = await DailyLog.find({ userId })

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
// @route GET /api/dailyLogs/:logId
// @access Private
export const getLogDetails = asyncHandler(async (req: ExtendedRequest, res) => {
	const userId = req.user?._id
	const logId = req.params.logId

	const log: IDailyLog<Aggregated>[] = await DailyLog.aggregate([
		{
			$match: {
				_id: new ObjectId(logId),
				userId: new ObjectId(userId)
			}
		},

		// Start the aggregation by unwinding the mealtimes
		{
			$unwind: {
				path: '$meals.breakfast',
				preserveNullAndEmptyArrays: true
			}
		},
		{
			$unwind: {
				path: '$meals.lunch',
				preserveNullAndEmptyArrays: true
			}
		},
		{
			$unwind: {
				path: '$meals.dinner',
				preserveNullAndEmptyArrays: true
			}
		},
		{
			$unwind: {
				path: '$meals.snacks',
				preserveNullAndEmptyArrays: true
			}
		},

		// Lookup the meals with the id's on the log
		{
			$lookup: {
				from: 'meals',
				localField: 'meals.breakfast',
				foreignField: '_id',
				as: 'meals.breakfastDetails'
			}
		},
		{
			$lookup: {
				from: 'meals',
				localField: 'meals.lunch',
				foreignField: '_id',
				as: 'meals.lunchDetails'
			}
		},
		{
			$lookup: {
				from: 'meals',
				localField: 'meals.dinner',
				foreignField: '_id',
				as: 'meals.dinnerDetails'
			}
		},
		{
			$lookup: {
				from: 'meals',
				localField: 'meals.snacks',
				foreignField: '_id',
				as: 'meals.snacksDetails'
			}
		},

		// Unwinding the found meals themselves
		{
			$unwind: {
				path: '$meals.breakfastDetails.foodEntry',
				preserveNullAndEmptyArrays: true
			}
		},
		{
			$unwind: {
				path: '$meals.lunchDetails.foodEntry',
				preserveNullAndEmptyArrays: true
			}
		},
		{
			$unwind: {
				path: '$meals.dinnerDetails.foodEntry',
				preserveNullAndEmptyArrays: true
			}
		},
		{
			$unwind: {
				path: '$meals.snacksDetails.foodEntry',
				preserveNullAndEmptyArrays: true
			}
		},

		// Lookup the food details with the id's on the meals
		{
			$lookup: {
				from: 'fooditems',
				localField: 'meals.breakfastDetails.foodEntry.foodItem',
				foreignField: '_id',
				as: 'meals.breakfastDetails.foodEntry.foodItemDetails'
			}
		},
		{
			$lookup: {
				from: 'fooditems',
				localField: 'meals.lunchDetails.foodEntry.foodItem',
				foreignField: '_id',
				as: 'meals.lunchDetails.foodEntry.foodItemDetails'
			}
		},
		{
			$lookup: {
				from: 'fooditems',
				localField: 'meals.dinnerDetails.foodEntry.foodItem',
				foreignField: '_id',
				as: 'meals.dinnerDetails.foodEntry.foodItemDetails'
			}
		},
		{
			$lookup: {
				from: 'fooditems',
				localField: 'meals.snacksDetails.foodEntry.foodItem',
				foreignField: '_id',
				as: 'meals.snacksDetails.foodEntry.foodItemDetails'
			}
		},

		// Grouping everything back together
		{
			$group: {
				_id: '$_id',
				date: {
					$first: '$date'
				},
				userId: {
					$first: '$userId'
				},
				breakfast: {
					$push: '$meals.breakfastDetails'
				},
				lunch: {
					$push: '$meals.lunchDetails'
				},
				dinner: {
					$push: '$meals.dinnerDetails'
				},
				snacks: {
					$push: '$meals.snacksDetails'
				}
			}
		}
	])

	if (!log.length) {
		throw new AsyncHandlerError('Daily log not found', HTTP_STATUS.NOT_FOUND)
	}

	res.status(HTTP_STATUS.OK).json(log[0])
})
