import asyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken'
import { ExtendedRequest } from '../../app-types'

export const authenticate = asyncHandler(async (req: ExtendedRequest, res, next) => {
	// Initialize variables
	let token: string
	let authHeader = req.headers.authorization

	// Check if there's something wrong with the request header
	if (!authHeader || !authHeader.startsWith('Bearer')) {
		res.status(401)
		throw new Error('User is not authorized or token is missing in request')
	}

	// Format token correctly
	token = authHeader.split(' ')[1]

	// Verify the token and execute callback to pass the decoded user information on
	jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
		// Check if user is authorized
		if (err) {
			res.status(401)
			throw new Error('User is not authorized')
		}

		// Check if payload is good
		if (!decoded || typeof decoded === 'string') {
			res.status(401)
			throw new Error('There is something wrong with the payload')
		}

		// Assign decoded user to request
		req.user = decoded.user
		next()
	})
})