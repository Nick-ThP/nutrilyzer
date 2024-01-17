import { ObjectId } from 'mongodb'
import mongoose, { Schema } from 'mongoose'
import { IMeal } from '../../app-types'

const mealSchema = new Schema<IMeal<ObjectId>>(
	{
		name: {
			type: String,
			required: true
		},
		foodEntries: [
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
	},
	{
		timestamps: true
	}
)

export const Meal = mongoose.model<IMeal<ObjectId>>('Meal', mealSchema)
