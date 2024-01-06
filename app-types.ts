import { Request } from 'express'
import { ObjectId } from 'mongodb'
import { Date } from 'mongoose'

export interface User {
	username?: string
	email?: string
	password?: string
	id?: ObjectId
}

export interface ExtendedRequest extends Request {
	user?: User
}

export interface Foodstuff {
	name: string
	calories: number
	carbs: string
	fiber: string
	fat: string
	protein: string
	sodium: string
}

export interface Meal {
	foodstuffs: Foodstuff[]
	datesEaten: Date[]
	id?: ObjectId
}

export interface Workout {
	exercises: Exercise[]
	id?: string
}

export interface Exercise {
	movement: Movement
	reps: number
	sets: number
	calories?: number
}

export interface ExerciseForm extends Omit<Exercise, 'movement'> {
	movementName: string
}

export interface Movement {
	name: string
	area: ['Chest' | 'Shoulders' | 'Back' | 'Arms' | 'Legs' | 'Core']
	targetedMuscle: string[]
}

export interface CreatedWorkout extends Workout {
	_id: string
	user_id?: string
	createdAt: Date
	updatedAt?: Date
	calories: number
}

export interface User {
	username?: string
	email?: string
	password?: string
	id?: ObjectId
	token?: string
}

export interface WorkoutPutPackage {
	workoutData: Workout
	workoutId: string
}
