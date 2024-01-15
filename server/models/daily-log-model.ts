import mongoose, { ObjectId, Schema } from 'mongoose'
import { IDailyLog, IDailyLogModel } from '../../app-types'
import { isLoggedMealsEmpty } from '../utils/helper-functions'

const dailyLogSchema = new Schema<IDailyLog<ObjectId>>(
	{
		date: {
			type: Date,
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
	options: Record<string, any>
) {
	try {
		// Perform the bulk update
		const updatedLogs = await this.updateMany(filter, update, options)

		// Find all logs that match the filter after the update
		const foundLogs = await this.find(filter)

		// Check each log to see if it should be deleted
		for (const log of foundLogs) {
			if (isLoggedMealsEmpty(log.meals)) {
				const deleteResult = await this.deleteOne({ _id: log._id })

				if (deleteResult.deletedCount === 0) {
					console.error(`Failed to delete ${log._id} after finding it empty`)
				}
			}
		}

		return updatedLogs
	} catch (error) {
		console.error('Error in bulkUpdateAndDeleteIfEmpty:', error)
		throw error
	}
}

export const DailyLog = mongoose.model<IDailyLog<ObjectId>, IDailyLogModel>('DailyLog', dailyLogSchema)
