import mongoose, { Schema } from 'mongoose'
import { movementSchema } from './movementModel'

const exerciseSchema = new Schema({
	movement: {
		type: movementSchema,
		required: true
	},
	reps: {
		type: Number,
		required: true
	},
	sets: {
		type: Number,
		required: true
	},
	calories: {
		type: Number,
		required: true
	}
})

const workoutSchema = new Schema(
	{
		exercises: {
			type: [exerciseSchema],
			required: true
		},
		user_id: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'User'
		},
		calories: {
			type: Number,
			required: true
		}
	},
	{
		timestamps: true
	}
)

export default mongoose.model('Workout', workoutSchema)
