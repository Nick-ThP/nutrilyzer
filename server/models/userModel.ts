import mongoose, { Schema } from 'mongoose'
import { IUser } from '../../app-types'

const userSchema = new Schema<IUser>(
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

export default mongoose.model<IUser>('User', userSchema)
