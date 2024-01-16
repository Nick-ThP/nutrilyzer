import asyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken'
import { ExtendedRequest } from '../../app-types'
import { AsyncHandlerError } from '../utils/async-handler-error'
import { HTTP_STATUS } from '../utils/http-messages'

export const authenticate = asyncHandler(async (req: ExtendedRequest, res, next) => {
	// Initialize variables
	let token: string
	let authHeader = req.headers.authorization

	// Check if there's something wrong with the request header
	if (!authHeader || !authHeader.startsWith('Bearer')) {
		throw new AsyncHandlerError('User is not authorized or token is missing in request', HTTP_STATUS.UNAUTHORIZED)
	}

	// Format token correctly
	token = authHeader.split(' ')[1]

	// Verify the token and execute callback to pass the decoded user information on
	jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
		// Check if user is authorized
		if (err) {
			throw new AsyncHandlerError('User is not authorized', HTTP_STATUS.UNAUTHORIZED)
		}

		// Check if payload is good
		if (!decoded || typeof decoded === 'string') {
			throw new AsyncHandlerError('There is something wrong with the payload', HTTP_STATUS.UNAUTHORIZED)
		}

		// Assign decoded user to request
		req.user = decoded.user
		next()
	})
})
