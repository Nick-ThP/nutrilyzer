// For combining error messages and their respective HTTP codes in async handlers

export class ServiceError extends Error {
	statusCode: number

	constructor(message: string, statusCode: number) {
		super(message)
		this.statusCode = statusCode
		Object.setPrototypeOf(this, ServiceError.prototype)
	}
}