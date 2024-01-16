import bcrypt from 'bcrypt'
import asyncHandler from 'express-async-handler'
import { ExtendedRequest, IUser } from '../../app-types'
import { User } from '../models/user-model'
import { AsyncHandlerError } from '../utils/async-handler-error'
import { generateAuthToken } from '../utils/helper-functions'
import { HTTP_STATUS } from '../utils/http-messages'

//@desc Register a user
//@route POST /api/users/register
//@access public
export const registerUser = asyncHandler(async (req, res) => {
	const { username, email, password }: IUser = req.body

	// Check if user is already registered
	const userAvailable = await User.findOne({ email })

	if (userAvailable) {
		throw new AsyncHandlerError('User is already registered', HTTP_STATUS.BAD_REQUEST)
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
		throw new AsyncHandlerError('User data is not valid', HTTP_STATUS.BAD_REQUEST)
	}

	// Send a response with new user object including token
	res.status(HTTP_STATUS.CREATED).json({
		_id: user._id,
		username: user.username,
		email: user.email,
		token: generateAuthToken({ username, _id: user._id })
	})
})

//@desc Login user
//@route POST /api/users/login
//@access public
export const loginUser = asyncHandler(async (req, res) => {
	const { email, password }: Omit<IUser, 'username'> = req.body

	// Check if user's email is registered
	const user = await User.findOne({ email })

	if (!user) {
		throw new AsyncHandlerError('User does not exist', HTTP_STATUS.BAD_REQUEST)
	}

	// Compare user's password with hashed and create a token
	const isValidPassword = await bcrypt.compare(password, user.password)

	if (!isValidPassword) {
		throw new AsyncHandlerError('Password is not valid', HTTP_STATUS.UNAUTHORIZED)
	}

	res.status(HTTP_STATUS.OK).json({
		id: user.id,
		username: user.username,
		email: user.email,
		token: generateAuthToken({ username: user.username, _id: user._id })
	})
})

//@desc Information about current user
//@route GET /api/users/current
//@access private
export const currentUser = asyncHandler(async (req: ExtendedRequest, res) => {
	res.status(HTTP_STATUS.OK).json(req.user)
})
