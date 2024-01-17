import mongoose, { Schema } from 'mongoose'
import { IFoodItem } from '../../app-types'

const foodItemSchema = new Schema<IFoodItem>(
	{
		name: {
			type: String,
			required: true
		},
		nutrition: {
			calories: {
				type: Number,
				required: true
			},
			protein: {
				type: String,
				required: true
			},
			carbs: {
				type: String,
				required: true
			},
			fat: {
				type: String,
				required: true
			},
			sodium: {
				type: String,
				required: true
			}
		},
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

export const FoodItem = mongoose.model<IFoodItem>('FoodItem', foodItemSchema)
