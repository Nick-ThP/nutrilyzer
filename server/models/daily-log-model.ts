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
	options: Record<string, any>
) {
	try {
		// Perform the bulk update
		await this.updateMany(filter, update, options)

		// Identify logs that could be empty after the update
		// This might require a different filter based on the nature of the update
		const potentiallyEmptyLogs = await this.find({
			/* Adjusted filter */
		})

		// Check each log to see if it should be deleted
		for (const log of potentiallyEmptyLogs) {
			if (isLoggedMealsEmpty(log.meals)) {
				const deleteResult = await this.deleteOne({ _id: log._id })
				if (deleteResult.deletedCount === 0) {
					console.error(`Failed to delete ${log._id} after finding it empty`)
				}
			}
		}

		// Return some status or result if needed
	} catch (error) {
		console.error('Error in updateManyAndDeleteIfEmpty:', error)
		throw error
	}
}

export const DailyLog = mongoose.model<IDailyLog<mongoose.Types.ObjectId>, IDailyLogModel>('DailyLog', dailyLogSchema)
