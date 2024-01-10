import { Request } from 'express'
import { ObjectId } from 'mongodb'
import { Date, Model } from 'mongoose'

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

export interface IFoodItemEntry<FoodType> {
	foodItem: FoodType
	grams: number
}

export interface IMeal<FoodType> {
	_id?: ObjectId
	name: string
	foodEntry: IFoodItemEntry<FoodType>[]
	isDefault: boolean
	userId?: ObjectId
	hiddenByUsers: ObjectId[]
}

export interface IDailyLog<MealType> {
	_id?: string
	date: Date
	userId: ObjectId
	meals: {
		breakfast: MealType[]
		lunch: MealType[]
		dinner: MealType[]
		snacks: MealType[]
	}
}

// Modified types

export interface IDailyLogModel extends Model<IDailyLog<ObjectId>> {
	customUpdate(
		filter: Record<string, any>,
		update: Record<string, any>,
		options: Record<string, any>
	): Promise<IDailyLog<ObjectId> | null>
}

export interface ExtendedRequest extends Request {
	user?: IUser
}

export interface UserWithToken extends IUser {
	token: string
}
