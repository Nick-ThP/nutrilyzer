import { Request, Response } from 'express'
import { AsyncHandlerError } from '../utils/async-handler-error'
import { HTTP_STATUS } from '../utils/http-messages'

const errorResponseMap = {
	[HTTP_STATUS.NOT_FOUND]: { title: 'Not found' },
	[HTTP_STATUS.BAD_REQUEST]: { title: 'Validation failed' },
	[HTTP_STATUS.UNAUTHORIZED]: { title: 'Unauthorized' },
	[HTTP_STATUS.FORBIDDEN]: { title: 'Forbidden' },
	[HTTP_STATUS.SERVER_ERROR]: { title: 'Server error' }
}

export const createHttpErrorResponse = (err: Error, req: Request, res: Response) => {
	const statusCode = err instanceof AsyncHandlerError ? err.statusCode : HTTP_STATUS.SERVER_ERROR
	const errorDetails = errorResponseMap[statusCode] || { title: 'Unexpected Error' }

	const responsePayload = {
		title: errorDetails.title,
		message: err.message,
		...(process.env.NODE_ENV === 'development' && { stackTrace: err.stack })
	}

	res.status(statusCode).json(responsePayload)
}
