import { ValidationChain, validationResult } from 'express-validator'
import { ExtendedRequest } from '../../app-types'

export function validateRequest(validator: ValidationChain[] | ValidationChain[][]) {
	return (req: ExtendedRequest, res, next) => {
		const validationArray = Array.isArray(validator[0]) ? (validator as ValidationChain[][]).flat() : (validator as ValidationChain[])

		validationArray.forEach(validation => validation.run(req))

		const errors = validationResult(req)

		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() })
		}

		next()
	}
}
