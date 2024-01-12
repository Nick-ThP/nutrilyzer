import jwt from 'jsonwebtoken'
import { IUser } from '../../app-types'

export const generateToken = (user: Omit<IUser, 'email' | 'password'>) => {
	return jwt.sign({ user }, process.env.JWT_SECRET as string, { expiresIn: '30d' })
}
