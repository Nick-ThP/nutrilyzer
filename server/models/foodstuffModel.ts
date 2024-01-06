import mongoose, { Schema } from 'mongoose'
import { Foodstuff } from '../utils/types'

export const foodstuffSchema = new Schema<Foodstuff>({
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
	}
})

const foodstuffListSchema = new Schema(
	{
		foodstuffs: {
			type: [foodstuffSchema],
			required: true
		},
		user_id: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'User'
		}
	},
	{
		timestamps: true
	}
)

export default mongoose.model('FoodstuffList', foodstuffListSchema)
