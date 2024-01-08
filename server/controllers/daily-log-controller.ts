import asyncHandler from 'express-async-handler'
import { ExtendedRequest } from '../../app-types'
import { DailyLog } from '../models/daily-log-model'
import { Meal } from '../models/meal-model'

//@desc Update meals in the daily log
//@route PUT /api/dailyLog/:date
//@access private
export const addMealToDailyLog = asyncHandler(async (req, res) => {
	// Extract data from the request body
	const { date, userId, mealData } = req.body

	// Check if a daily log entry exists for the specified date and user
	let dailyLog = await DailyLog.findOne({ date, userId })

	if (!dailyLog) {
		// If no daily log entry exists, create a new one
		dailyLog = await DailyLog.create({ date, userId })
	}

	// Create a new meal document with mealData
	const meal = new Meal(mealData)

	// Add the meal to the daily log entry
	dailyLog.meals.push(meal)

	// Save the changes to the daily log
	await dailyLog.save()

	res.status(200).json({ message: 'Meal added to daily log successfully' })
})
