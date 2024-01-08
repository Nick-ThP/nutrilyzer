import express from 'express'
import { createWorkout, deleteWorkout, getWorkout, getWorkouts, updateWorkout } from '../controllers/meal-controller'
import { authMiddleware } from '../middlewares/auth-middleware'
import { calorieMiddleware } from '../middlewares/calorie-middleware'

export const workoutRouter = express.Router()

workoutRouter.use(authMiddleware)
workoutRouter.route('/').get(getWorkouts).post(calorieMiddleware, createWorkout)

workoutRouter.route('/:id').get(getWorkout).put(calorieMiddleware, updateWorkout).delete(deleteWorkout)
