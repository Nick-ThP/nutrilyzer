import mongoose, { Schema } from 'mongoose'
import { IDailyLog, IDailyLogModel } from '../../app-types'
import { isLoggedMealsEmpty } from '../utils/helper-functions'

const dailyLogSchema = new Schema<IDailyLog<mongoose.Types.ObjectId>>(
	{
		date: {
			type: String,
			required: true
		},
		userId: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true
		},
		meals: {
			breakfast: [
				{
					type: Schema.Types.ObjectId,
					ref: 'Meal'
				}
			],
			lunch: [
				{
					type: Schema.Types.ObjectId,
					ref: 'Meal'
				}
			],
			dinner: [
				{
					type: Schema.Types.ObjectId,
					ref: 'Meal'
				}
			],
			snacks: [
				{
					type: Schema.Types.ObjectId,
					ref: 'Meal'
				}
			]
		}
	},
	{
		timestamps: true
	}
)

// Custom static method for updating and handling post-update logic for a single log
dailyLogSchema.statics.updateOneAndDeleteIfEmpty = async function (
	filter: Record<string, any>,
	update: Record<string, any>,
	options: Record<string, any>
) {
	try {
		// Perform the update
		const updatedLog = await this.findOneAndUpdate(filter, update, options)

		// Check if the update was successful and if the updated log has empty meals
		if (updatedLog && isLoggedMealsEmpty(updatedLog.meals)) {
			const deleteResult = await this.deleteOne({ _id: updatedLog._id })

			if (deleteResult.deletedCount === 0) {
				console.error(`Failed to delete ${updatedLog._id} after finding it empty`)
			}
		}

		return updatedLog
	} catch (error) {
		console.error('Error in singleUpdateAndDeleteIfEmpty:', error)
		throw error
	}
}

// Custom static method for updating and handling post-update logic in bulk
dailyLogSchema.statics.updateManyAndDeleteIfEmpty = async function (
	filter: Record<string, any>,
	update: Record<string, any>,
	options: Record<string, any> = {},
	session = null
) {
	try {
		const sessionOptions = session ? { ...options, session } : options

		// Perform the bulk update
		const updateResult = await this.updateMany(filter, update, sessionOptions)
		console.log(`Update result: ${JSON.stringify(updateResult)}`)

		if (updateResult.modifiedCount === 0) {
			console.log('No documents were updated, so no need to check for deletion.')
			return
		}

		// Retrieve all logs that were potentially affected by the update
		const potentiallyEmptyLogs = await this.find(filter).session(session)

		// Detailed logging and deletion
		for (const log of potentiallyEmptyLogs) {
			console.log(`Checking log ${log._id} for emptiness.`)
			if (isLoggedMealsEmpty(log.meals)) {
				console.log(`Log ${log._id} is empty. Attempting deletion.`)
				const deleteResult = await this.deleteOne({ _id: log._id }, { session })
				if (deleteResult.deletedCount === 0) {
					console.error(`Failed to delete empty log with ID: ${log._id}`)
				} else {
					console.log(`Successfully deleted empty log with ID: ${log._id}`)
				}
			} else {
				console.log(`Log ${log._id} is not empty. No deletion needed.`)
			}
		}
	} catch (error) {
		console.error('Error in updateManyAndDeleteIfEmpty:', error)
		throw error
	}
}

export const DailyLog = mongoose.model<IDailyLog<mongoose.Types.ObjectId>, IDailyLogModel>('DailyLog', dailyLogSchema)
