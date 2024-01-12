
import express from 'express'
import { updateLog, getAllLogs, getLogDetails } from '../controllers/daily-log-controller'
import { authenticate } from '../middlewares/auth-middleware'
import asyncHandler from 'express-async-handler'
import { validateRequest } from '../middlewares/validation-middleware'
import { mealValidator } from '../utils/validators'

const dailyLogRouter = express.Router()

dailyLogRouter.route('/').post(authenticate, validateRequest(mealValidator) updateLog)

// Define the route for getting all daily logs
dailyLogRouter.route('/api/dailyLogs').get(authenticate, asyncHandler(getAllLogs))

// Define the route for getting a specific daily log
dailyLogRouter.route('/api/dailyLogs/:logId').get(authenticate, asyncHandler(getLogDetails))

export default dailyLogRouter
