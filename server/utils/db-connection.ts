import mongoose from 'mongoose'

const MAX_TRIES = 3
let connectTries = 0

export async function connectDb() {
	connectTries++
	if (!process.env.CONNECTION_STRING) {
		console.error('Database connection string is not set')
		return
	}

	try {
		await mongoose.connect(process.env.CONNECTION_STRING)
		console.log('Database connected successfully')
	} catch (err) {
		console.error(`Database connection attempt ${connectTries} failed. Retrying...`, err.message)
		if (connectTries < MAX_TRIES) {
			setTimeout(connectDb, 5000)
		} else {
			console.error('Failed to connect to the database after several attempts')
		}
	}
}
