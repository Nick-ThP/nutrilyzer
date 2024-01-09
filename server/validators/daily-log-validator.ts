import { check } from 'express-validator'

export const dailyLogValidator = [check('date').isISO8601().withMessage('Invalid date format')]
