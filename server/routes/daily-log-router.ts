import express from 'express'
import asyncHandler from 'express-async-handler'
import { getAllLogs, getLogDetails, updateLog } from '../controllers/daily-log-controller'
import { authenticate } from '../middlewares/auth-middleware'
import { validateRequest } from '../middlewares/validation-middleware'
import { mealValidator } from '../utils/validators'

export const dailyLogRouter = express.Router()

dailyLogRouter.route('/').get(authenticate, asyncHandler(getAllLogs)).post(authenticate, validateRequest(mealValidator), updateLog)

dailyLogRouter.route('/:logId').get(authenticate, asyncHandler(getLogDetails))
