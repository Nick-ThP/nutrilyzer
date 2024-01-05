import mongoose, { Schema } from 'mongoose'

export const movementSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	area: {
		type: [String],
		enum: ['Chest', 'Shoulders', 'Back', 'Arms', 'Legs', 'Core'],
		required: true
	},
	targetedMuscle: {
		type: [String],
		required: true
	}
})

const movementListSchema = new Schema(
	{
		movements: {
			type: [movementSchema],
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

export default mongoose.model('MovementList', movementListSchema)
