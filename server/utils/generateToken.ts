import jwt from 'jsonwebtoken'
import { User } from './types'

export const generateToken = (user: User) => {
	return jwt.sign(
		{
			user
		},
		process.env.JWT_SECRET as string,
		{
			expiresIn: '30d'
		}
	)
}
