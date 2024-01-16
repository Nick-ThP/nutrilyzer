import mongoose, { Schema } from 'mongoose'
import { IUser } from '../../app-types'

const userSchema = new Schema<IUser>(
	{
		username: {
			type: String,
			required: true,
			unique: true
		},
		email: {
			type: String,
			required: true,
			unique: true
		},
		password: {
			type: String,
			required: true
		}
	},
	{
		timestamps: true
	}
)

export const User = mongoose.model<IUser>('User', userSchema)
