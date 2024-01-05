import { connect } from 'mongoose'

export const connectDb = async () => {
	if (process.env.CONNECTION_STRING) {
		try {
			const connection = await connect(process.env.CONNECTION_STRING)
			console.log('Database succesfully connected -', 'host:', connection.connection.host, '- name:', connection.connection.name)
		} catch (err) {
			console.error(err)
			process.exit(1)
		}
	} else {
		console.error('No valid connection string')
	}
}
