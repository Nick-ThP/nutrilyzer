import { Request } from 'express'
import { ObjectId } from 'mongodb'

export interface User {
	username?: string
	email?: string
	password?: string
	id?: ObjectId
}

export interface ExtendedRequest extends Request {
	user?: User
}

export interface Exercise {
	movement: Movement
	reps: number
	sets: number
	calories?: number
}

export interface Movement {
	name: string
	area: ['Chest' | 'Shoulders' | 'Back' | 'Arms' | 'Legs' | 'Core']
	targetedMuscle: string[]
}

export interface MovementList {
	movements: Movement[]
	user_id: string
}
