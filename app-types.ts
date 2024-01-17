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

export interface IUserResponse extends Omit<IUser, 'password'> {
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

// Food Submission related types
export type IFoodItemSubmit = Omit<IFoodItem, 'isDefault' | 'hiddenByUsers'>

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

export type IMealSubmit<T extends Create | Update> = Omit<IMeal<ObjectId>, 'isDefault' | 'hiddenByUsers'> &
	(T extends Create ? IMealSubmitCreate : IMealSubmitUpdate)

// Daily Log and Aggregated Log related types
export type Aggregated = 'Aggregated'

export interface IDailyLog<T extends Aggregated | ObjectId> {
	_id?: string
	date: Date
	userId: ObjectId
	meals: Meals<T>
}

type Meals<T> = {
	breakfast: T extends Aggregated ? IMeal<IFoodItem>[] : ObjectId[]
	lunch: T extends Aggregated ? IMeal<IFoodItem>[] : ObjectId[]
	dinner: T extends Aggregated ? IMeal<IFoodItem>[] : ObjectId[]
	snacks: T extends Aggregated ? IMeal<IFoodItem>[] : ObjectId[]
}

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
