import asyncHandler from 'express-async-handler'
import { ObjectId } from 'mongodb'
import { ExtendedRequest } from '../../app-types'
import { DailyLog } from '../models/daily-log-model'
import { HTTP_STATUS } from '../utils/http-messages'
import { ServiceError } from '../utils/service-error'

// @desc Update meals on daily log
// @route POST /api/dailyLogs
// @access Private
export const updateLog = asyncHandler(async (req: ExtendedRequest, res) => {
	const { logId, mealType, mealId } = req.body
	const userId = req.user._id

	// Add the meal to the specified type (breakfast, lunch, etc.)
	const update = { $push: { [`meals.${mealType}`]: mealId } }

	const log = await DailyLog.findOneAndUpdate({ _id: logId, userId }, update, { new: true, upsert: true })

	if (!log) {
		throw new ServiceError('Daily log not found', HTTP_STATUS.INTERNAL_SERVER_ERROR)
	}

	if (log && Object.values(log.meals).every(mealArray => mealArray.length === 0)) {
		await DailyLog.deleteOne({ _id: log._id })
	}

	res.status(HTTP_STATUS.OK).json(log)
})

// @desc Get all daily logs
// @route GET /api/dailyLogs
// @access Private
export const getAllLogs = asyncHandler(async (req: ExtendedRequest, res) => {
	const userId = req.user._id
	const logs = await DailyLog.find({ userId })

	if (!logs.length) {
		throw new ServiceError('Daily logs not found', HTTP_STATUS.NOT_FOUND)
	}

	res.status(HTTP_STATUS.OK).json(logs)
})

// @desc Get a specific daily log (with meal and food item aggregation)
// @route GET /api/dailyLogs/:logId
// @access Private
export const getLogDetails = asyncHandler(async (req: ExtendedRequest, res) => {
	const { logId } = req.params
	const userId = req.user._id

	const log = await DailyLog.aggregate([
		{ $match: { _id: new ObjectId(logId), userId: new ObjectId(userId) } },
		// Unwinding each meal type
		{ $unwind: { path: '$meals.breakfast', preserveNullAndEmptyArrays: true } },
		{ $unwind: { path: '$meals.lunch', preserveNullAndEmptyArrays: true } },
		{ $unwind: { path: '$meals.dinner', preserveNullAndEmptyArrays: true } },
		{ $unwind: { path: '$meals.snacks', preserveNullAndEmptyArrays: true } },
		// Rest of the aggregation pipeline
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
		// Unwinding meal details to get individual food items
		{ $unwind: { path: '$meals.breakfastDetails.foodEntry', preserveNullAndEmptyArrays: true } },
		{ $unwind: { path: '$meals.lunchDetails.foodEntry', preserveNullAndEmptyArrays: true } },
		{ $unwind: { path: '$meals.dinnerDetails.foodEntry', preserveNullAndEmptyArrays: true } },
		{ $unwind: { path: '$meals.snacksDetails.foodEntry', preserveNullAndEmptyArrays: true } },
		// Lookup for food item details
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
		// Grouping back the details
		{
			$group: {
				_id: '$_id',
				date: { $first: '$date' },
				userId: { $first: '$userId' },
				breakfast: { $push: '$meals.breakfastDetails' },
				lunch: { $push: '$meals.lunchDetails' },
				dinner: { $push: '$meals.dinnerDetails' },
				snacks: { $push: '$meals.snacksDetails' }
			}
		}
	])

	if (!log || !log.length) {
		throw new ServiceError('Daily log not found', HTTP_STATUS.NOT_FOUND)
	}

	res.status(HTTP_STATUS.OK).json(log[0])
})
