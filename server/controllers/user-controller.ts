import bcrypt from 'bcrypt'
import asyncHandler from 'express-async-handler'
import { ExtendedRequest } from '../../app-types'
import { User } from '../models/user-model'
import { generateToken } from '../utils/generate-token'

//@desc Register a user
//@route POST /api/users/register
//@access public
export const registerUser = asyncHandler(async (req, res) => {
	// Grab the keys from body object
	const { username, email, password } = req.body

	// Check if user is already registered
	const userAvailable = await User.findOne({ email })
	if (userAvailable) {
		res.status(400)
		throw new Error('User is already registered')
	}

	// Hash password and create user in database
	const hashedPassword = await bcrypt.hash(password, 10)
	const user = await User.create({
		username,
		email,
		password: hashedPassword
	})

	// Check if user creation was successful
	if (!user) {
		res.status(400)
		throw new Error('User data is not valid')
	}

	// Send a response with new user object including token
	res.status(201).json({
		_id: user._id,
		username: user.username,
		email: user.email,
		token: generateToken({ username, _id: user._id })
	})
})

//@desc Login user
//@route POST /api/users/login
//@access public
export const loginUser = asyncHandler(async (req, res) => {
	// Grab the keys from body object
	const { email, password } = req.body

	// Check if user's email is registered
	const user = await User.findOne({ email })
	if (!user) {
		res.status(400)
		throw new Error('User does not exist')
	}

	// Compare user's password with hashed and create a token
	if (user && (await bcrypt.compare(password, user.password))) {
		res.status(200).json({
			id: user.id,
			username: user.username,
			email: user.email,
			token: generateToken({ username: user.username, _id: user._id })
		})
	} else {
		res.status(401)
		throw new Error('Password is not valid')
	}
})

//@desc Current information about user
//@route GET /api/users/current
//@access private
export const currentUser = asyncHandler(async (req: ExtendedRequest, res) => {
	// Give the user their stored information
	res.status(200).json(req.user)
})
