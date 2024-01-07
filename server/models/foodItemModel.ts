import mongoose, { Schema } from 'mongoose'
import { IFoodItem } from '../../app-types'

const foodItemSchema = new Schema<IFoodItem>({
	name: {
		type: String,
		required: true
	},
	calories: {
		type: Number,
		required: true
	},
	carbs: {
		type: String,
		required: true
	},
	fiber: {
		type: String,
		required: true
	},
	fat: {
		type: String,
		required: true
	},
	protein: {
		type: String,
		required: true
	},
	sodium: {
		type: String,
		required: true
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
})

export default mongoose.model<IFoodItem>('FoodItem', foodItemSchema)
