import asyncHandler from 'express-async-handler'
import MovementList from '../models/movementModel'
import User from '../models/userModel'
import { ExtendedRequest, Movement } from '../utils/types'

//@desc Get list of movements
//@route GET /api/movements/:id
//@access private
export const getMovementList = asyncHandler(async (req: ExtendedRequest, res) => {
	// Check for user
	const user = await User.findById(req.params.id)
	if (!user) {
		res.status(404)
		throw new Error('User not found')
	}

	// Find list associated with user and send it back
	const movements = await MovementList.findOne({ user_id: req.user?.id })
	res.status(200).json(movements)
})

//@desc Put list of movements
//@route PUT /api/movements/:id
//@access private
export const updateMovementList = asyncHandler(async (req: ExtendedRequest, res) => {
	// Check for user
	const user = await User.findById(req.params.id)
	if (!user) {
		res.status(404)
		throw new Error('User not found')
	}

	// Grab the keys from body object
	const movements: Movement[] = req.body

	// Check for mandatory information
	if (movements.length === 0) {
		res.status(400)
		throw new Error('Provide at least one movement')
	}

	// Check for all properties on each exercise
	for (const movement of movements) {
		const { name, area, targetedMuscle } = movement

		if (!name || !area || targetedMuscle.length === 0) {
			res.status(400)
			throw new Error('Provide all required properties on each movement')
		}
	}

	// Update the database and send back the movement list
	const updatedMovements = await MovementList.findOneAndUpdate(
		{ user_id: req.params.id },
		{ $set: { movements: movements } },
		{ new: true }
	)

	// Check if the update was successful
	if (!updatedMovements) {
		res.status(400)
		throw new Error('Could not update the list with the provided information')
	}

	res.status(200).json(updatedMovements)
})