import mongoose, { Schema } from 'mongoose'
import { IMeal } from '../../app-types'

const mealSchema = new Schema<IMeal>({
	name: {
		type: String,
		required: true
	},
	foodItems: [
		{
			id: {
				type: Schema.Types.ObjectId,
				ref: 'FoodItem'
			},
			grams: Number
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

export default mongoose.model<IMeal>('Meal', mealSchema)
