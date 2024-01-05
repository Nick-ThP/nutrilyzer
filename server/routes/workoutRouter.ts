import express from 'express'
import { createWorkout, deleteWorkout, getWorkout, getWorkouts, updateWorkout } from '../controllers/mealController'
import { authMiddleware } from '../middlewares/authMiddleware'
import { calorieMiddleware } from '../middlewares/calorieMiddleware'

export const workoutRouter = express.Router()

workoutRouter.use(authMiddleware)
workoutRouter.route('/').get(getWorkouts).post(calorieMiddleware, createWorkout)

workoutRouter.route('/:id').get(getWorkout).put(calorieMiddleware, updateWorkout).delete(deleteWorkout)
