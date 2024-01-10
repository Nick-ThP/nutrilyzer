import mongoose, { Schema } from 'mongoose'
import { IMeal } from '../../app-types'
import { ObjectId } from 'mongodb'

const mealSchema = new Schema<IMeal<ObjectId>>({
	name: {
		type: String,
		required: true
	},
	foodEntry: [
		{
			foodItem: {
				type: Schema.Types.ObjectId,
				ref: 'FoodItem',
				required: true
			},
			grams: {
				type: Number,
				required: true
			}
		}
	],
	isDefault: {
		type: Boolean,
		required: true
	},
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	hiddenByUsers: [
		{
			type: Schema.Types.ObjectId,
			ref: 'User'
		}
	]
})

export const Meal = mongoose.model<IMeal<ObjectId>>('Meal', mealSchema)
