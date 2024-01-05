import { Request, Response } from 'express'
import { constants } from '../utils/constants'

export const errorMiddleware = (err: Error, req: Request, res: Response) => {
	const statusCode = res.statusCode || 500

	switch (statusCode) {
		case constants.NOT_FOUND:
			res.json({ title: 'Not found', message: err.message, stackTrace: err.stack })
			break
		case constants.VALIDATION_ERROR:
			res.json({ title: 'Validation failed', message: err.message, stackTrace: err.stack })
			break
		case constants.UNAUTHORIZED:
			res.json({ title: 'Unauthorized', message: err.message, stackTrace: err.stack })
			break
		case constants.FORBIDDEN:
			res.json({ title: 'Forbidden', message: err.message, stackTrace: err.stack })
			break
		case constants.SERVER_ERROR:
			res.json({ title: 'Server error', message: err.message, stackTrace: err.stack })
			break
		default:
			console.log('No errors, all good')
			break
	}
}
