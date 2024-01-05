import { axiosConfigured } from '../../../utils/axios'
import { Workout } from '../../../utils/types'

// Get user workouts
const getWorkouts = async (token: string) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`
		}
	}
	const response = await axiosConfigured.get('/api/workouts/', config)
	return response.data
}

// Get specific workout
const getWorkout = async (id: string, token: string) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`
		}
	}
	const response = await axiosConfigured.get(`/api/workouts/${id}`, config)
	return response.data
}

// Create new workout
const createWorkout = async (workoutData: Workout, token: string) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`
		}
	}
	const response = await axiosConfigured.post('/api/workouts/', workoutData, config)
	return response.data
}

// Update workout
const updateWorkout = async (workoutId: string, workoutData: Workout, token: string) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`
		}
	}
	const response = await axiosConfigured.put('/api/workouts/' + workoutId, workoutData, config)
	return response.data
}

// Delete user workout
const deleteWorkout = async (workoutId: string, token: string) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`
		}
	}
	const response = await axiosConfigured.delete('/api/workouts/' + workoutId, config)
	return response.data
}

export const workoutService = {
	getWorkouts,
	getWorkout,
	createWorkout,
	updateWorkout,
	deleteWorkout
}
