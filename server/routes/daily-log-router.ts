import express from 'express'
import { getAllLogs, getLogDetails, updateLog } from '../controllers/daily-log-controller'
import { authenticate } from '../middlewares/auth-middleware'
import { validateRequest } from '../middlewares/validation-middleware'
import { dailyLogValidator } from '../utils/validators'

export const dailyLogRouter = express.Router()

dailyLogRouter.route('/').get(authenticate, getAllLogs).post(authenticate, validateRequest(dailyLogValidator), updateLog)

dailyLogRouter.route('/:logId').get(authenticate, getLogDetails)
