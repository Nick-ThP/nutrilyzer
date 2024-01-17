import { Request } from 'express'
import { ObjectId } from 'mongodb'
import { Date, Model, UpdateWriteOpResult } from 'mongoose'

// User related interfaces
export interface IUser {
	_id?: ObjectId
	username: string
	email: string
	password: string
}

export interface IUserWithToken extends IUser {
	token: string
}

// Nutrition and Food Item related interfaces
export interface INutrition {
	calories: number
	protein: string
	carbs: string
	fat: string
	sodium: string
}

export interface IFoodItem {
	_id?: ObjectId
	name: string
	nutrition: INutrition
	isDefault: boolean
	userId?: ObjectId
	hiddenByUsers: ObjectId[]
}

// Food Item Entry and Meal related interfaces
type FoodTypeUnion = IFoodItem | ObjectId

export interface IFoodItemEntry<T extends FoodTypeUnion> {
	foodItem: T
	grams: number
}

export interface IMeal<T extends FoodTypeUnion> {
	_id?: ObjectId
	name: string
	foodEntries: IFoodItemEntry<T>[]
	isDefault: boolean
	userId?: ObjectId
	hiddenByUsers: ObjectId[]
}

// Meal Submission related types
export type Create = 'Create'
export type Update = 'Update'

interface IMealSubmitCreate {
	isSavedInCollection: boolean
	isRemovedFromCollection: never
}

interface IMealSubmitUpdate {
	isSavedInCollection: never
	isRemovedFromCollection: boolean
}

export type IMealSubmit<T extends Create | Update> = Omit<IMeal<ObjectId>, 'hiddenByUsers' | 'isDefault'> &
	(T extends Create ? IMealSubmitCreate : IMealSubmitUpdate)

// Daily Log and Aggregated Log related types
type MealTypeUnion = IMeal<IFoodItem> | ObjectId

export interface IDailyLog<T extends MealTypeUnion> {
	_id?: string
	date: Date
	userId: ObjectId
	meals: IMealtimes<T>
}

export interface IMealtimes<T> {
	breakfast: T[]
	lunch: T[]
	dinner: T[]
	snacks: T[]
}

export type AggregatedDailyLog = IDailyLog<IMeal<IFoodItem>>

// Database Model and Request Extensions
export interface IDailyLogModel extends Model<IDailyLog<ObjectId>> {
	updateOneAndDeleteIfEmpty(
		filter?: Record<string, any>,
		update?: Record<string, any>,
		options?: Record<string, any>
	): Promise<IDailyLog<ObjectId> | null>

	updateManyAndDeleteIfEmpty(
		filter?: Record<string, any>,
		update?: Record<string, any>,
		options?: Record<string, any>
	): Promise<UpdateWriteOpResult>
}

export interface ExtendedRequest extends Request {
	user?: IUser
}
