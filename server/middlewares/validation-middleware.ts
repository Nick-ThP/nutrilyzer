import { validationResult, ValidationChain } from 'express-validator'

export function validateRequest(validator: ValidationChain[]) {
	return (req, res, next) => {
		validator.forEach(validation => validation.run(req))

		const errors = validationResult(req)

		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() })
		}

		next()
	}
}
