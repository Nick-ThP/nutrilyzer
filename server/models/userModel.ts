import mongoose, { Schema } from 'mongoose'

const userSchema = new Schema(
	{
		username: {
			type: String,
			required: [true, 'Please add a name']
		},
		email: {
			type: String,
			required: [true, 'Please add an email'],
			unique: true
		},
		password: {
			type: String,
			required: [true, 'Please add a password']
		}
	},
	{
		timestamps: true
	}
)

export default mongoose.model('User', userSchema)
