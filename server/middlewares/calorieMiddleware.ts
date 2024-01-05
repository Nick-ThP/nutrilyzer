import asyncHandler from 'express-async-handler'
import { Exercise, ExtendedRequest } from '../utils/types'

export const calorieMiddleware = asyncHandler(async (req: ExtendedRequest, res, next) => {
	// Grab properties from body object
	const { exercises } = req.body

	// Ensure exercises are available
	if (!exercises || exercises.length === 0) {
		res.status(400)
		throw new Error('No exercises has been provided')
	}

	// Calculate exercise calories
	const exercisesWithCalories = exercises.map((exercise: Exercise) => {
		if (!exercise.sets || !exercise.reps) {
			res.status(400)
			throw new Error('Provide sets and reps as valid numbers on all exercises')
		}

		return {
			...exercise,
			calories: exercise.sets * exercise.reps
		}
	})

	// Calculate workout calories
	const workoutCalories = exercisesWithCalories.reduce((acc: number, obj: Exercise) => {
		if (!obj.calories) {
			res.status(400)
			throw new Error('Something is wrong with the provided data')
		}

		return acc + obj.calories
	}, 0)

	// Update the body object with new properties
	req.body = {
		exercises: exercisesWithCalories,
		calories: workoutCalories
	}

	next()
})
