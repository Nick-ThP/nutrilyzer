import { ValidationChain, validationResult } from 'express-validator'
import { ExtendedRequest } from '../../app-types'
import { HTTP_STATUS } from '../utils/http-messages'
import { NextFunction, Response } from 'express'

export function validateRequest(validator: ValidationChain[] | ValidationChain[][]) {
	return async (req: ExtendedRequest, res: Response, next: NextFunction) => {
		const validationArray = Array.isArray(validator[0]) ? (validator as ValidationChain[][]).flat() : (validator as ValidationChain[])

		for (let validation of validationArray) {
			await validation.run(req)
		}

		const errors = validationResult(req)

		if (!errors.isEmpty()) {
			return res.status(HTTP_STATUS.BAD_REQUEST).json({ errors: errors.array().map(err => err.msg) })
		}

		next()
	}
}
