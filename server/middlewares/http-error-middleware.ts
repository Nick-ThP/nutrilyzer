import { Request, Response } from 'express'
import { HTTP_STATUS } from '../utils/http-messages'
import { ServiceError } from '../utils/service-error'

export const createHttpErrorResponse = (err: Error, req: Request, res: Response) => {
	const statusCode = err instanceof ServiceError ? err.statusCode : HTTP_STATUS.SERVER_ERROR

	switch (statusCode) {
		case HTTP_STATUS.NOT_FOUND:
			res.json({ title: 'Not found', message: err.message, stackTrace: err.stack })
			break
		case HTTP_STATUS.BAD_REQUEST:
			res.json({ title: 'Validation failed', message: err.message, stackTrace: err.stack })
			break
		case HTTP_STATUS.UNAUTHORIZED:
			res.json({ title: 'Unauthorized', message: err.message, stackTrace: err.stack })
			break
		case HTTP_STATUS.FORBIDDEN:
			res.json({ title: 'Forbidden', message: err.message, stackTrace: err.stack })
			break
		case HTTP_STATUS.SERVER_ERROR:
			res.json({ title: 'Server error', message: err.message, stackTrace: err.stack })
			break
		default:
			console.log('No errors, all good')
			break
	}
}
