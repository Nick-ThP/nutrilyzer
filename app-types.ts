import { Request } from 'express'
import { ObjectId } from 'mongodb'
import { Date } from 'mongoose'

// Core application types

export interface IUser {
	_id?: ObjectId
	username: string
	email: string
	password: string
}

export interface IFoodItem {
	_id?: ObjectId
	name: string
	calories: number
	carbs: string
	fiber: string
	fat: string
	protein: string
	sodium: string
	isDefault: boolean
	userId?: ObjectId
	hiddenByUsers: ObjectId[]
}

export interface IFoodItemEntry {
	id: ObjectId
	grams: number
}

export interface IMeal {
	_id?: ObjectId
	name: string
	foodItems: IFoodItemEntry[]
	isDefault: boolean
	userId?: ObjectId
	hiddenByUsers: ObjectId[]
}

export interface IDailyLogMealEntry {
	meal: ObjectId[]
}

export interface IDailyLog {
	_id?: string
	date: Date
	userId: ObjectId
	meals: {
		breakfast: IDailyLogMealEntry[]
		lunch: IDailyLogMealEntry[]
		dinner: IDailyLogMealEntry[]
		snacks: IDailyLogMealEntry[]
	}
}

// Modified types

export interface ExtendedRequest extends Request {
	user?: IUser
}

export interface UserWithToken extends IUser {
	token: string
}
