import asyncHandler from 'express-async-handler'
import Workout from '../models/workoutModel'
import { Exercise, ExtendedRequest } from '../utils/types'

//@desc Get all workouts
//@route GET /api/workouts
//@access private
export const getWorkouts = asyncHandler(async (req: ExtendedRequest, res) => {
	// Find all workouts associated with the user and send them back
	const workouts = await Workout.find({ user_id: req.user?.id })
	res.status(200).json(workouts)
})

//@desc Create a workout
//@route POST /api/workouts
//@access private
export const createWorkout = asyncHandler(async (req: ExtendedRequest, res) => {
	// Grab the keys from body object
	const { exercises }: { exercises: Exercise[] } = req.body

	// Check for mandatory information
	if (exercises.length === 0) {
		res.status(400)
		throw new Error('Provide at least one exercise')
	}

	// Check for all properties on each exercise
	for (const exercise of exercises) {
		const { movement, sets, reps } = exercise

		if (!movement || !sets || !reps) {
			res.status(400)
			throw new Error('Provide all required properties on each exercise')
		}
	}

	// Create the workout in the database
	const workout = await Workout.create({
		...req.body,
		user_id: req.user?.id
	})

	// Send back the workout
	res.status(201).json(workout)
})

//@desc Get a workout
//@route GET /api/workouts/:id
//@access private
export const getWorkout = asyncHandler(async (req: ExtendedRequest, res) => {
	// Check for workout
	const workout = await Workout.findById(req.params.id)
	if (!workout) {
		res.status(404)
		throw new Error('Workout not found')
	}

	// Check for user
	if (!req.user) {
		res.status(404)
		throw new Error('User not found')
	}

	// Check that user has permission
	if (workout?.user_id.toString() !== req.user?.id?.toString()) {
		res.status(403)
		throw new Error('User not authorized')
	}

	// Send back the workout
	res.status(200).json(workout)
})

//@desc Put a workout
//@route PUT /api/workouts/:id
//@access private
export const updateWorkout = asyncHandler(async (req: ExtendedRequest, res) => {
	// Grab the keys from body object
	const { exercises }: { exercises: Exercise[] } = req.body

	// Check for mandatory information
	if (exercises.length === 0) {
		res.status(400)
		throw new Error('Provide at least one exercise')
	}

	// Check for all properties on each exercise
	for (const exercise of exercises) {
		const { movement, sets, reps } = exercise

		if (!movement || !sets || !reps) {
			res.status(400)
			throw new Error('Provide all required properties on each exercise')
		}
	}

	// Check for workout
	const workout = await Workout.findById(req.params.id)
	if (!workout) {
		res.status(404)
		throw new Error('Workout not found')
	}

	// Check for user
	if (!req.user) {
		res.status(404)
		throw new Error('User not found')
	}

	// Check that user has permission
	if (workout?.user_id.toString() !== req.user?.id?.toString()) {
		res.status(403)
		throw new Error('User not authorized')
	}

	// Update the database and send back the workout
	const updatedWorkout = await Workout.findByIdAndUpdate(req.params.id, req.body, { new: true })
	res.status(200).json(updatedWorkout)
})

//@desc Delete a workout
//@route DELETE /api/workouts/:id
//@access private
export const deleteWorkout = asyncHandler(async (req: ExtendedRequest, res) => {
	// Check for workout
	const workout = await Workout.findById(req.params.id)
	if (!workout) {
		res.status(404)
		throw new Error('Workout not found')
	}

	// Check for user
	if (!req.user) {
		res.status(404)
		throw new Error('User not found')
	}

	// Check that user has permission
	if (workout.user_id.toString() !== req.user.id?.toString()) {
		res.status(403)
		throw new Error('User not authorized')
	}

	// Update database and send back the workout
	await Workout.findByIdAndDelete(req.params.id)
	res.status(200).json(workout)
})
