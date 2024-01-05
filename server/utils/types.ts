import { Request } from 'express'
import { ObjectId } from 'mongodb'

export interface User {
	username?: string
	email?: string
	password?: string
	id?: ObjectId
}

export interface ExtendedRequest extends Request {
	user?: User
}
