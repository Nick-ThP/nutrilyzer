import mongoose, { Schema } from 'mongoose'
import { IDailyLog } from '../../app-types'

const dailyLogSchema = new Schema<IDailyLog>(
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

// Post middleware to check and delete stored log if all mealtimes are empty after an update
dailyLogSchema.post('save', async function () {
	try {
		const isEmpty = Object.values(this.meals).every(mealtime => mealtime.length === 0)

		if (isEmpty) {
			await DailyLog.deleteOne({ _id: this._id })
		}
	} catch (error) {
		console.error('Error in dailyLog post-save middleware:', error)
	}
})

export const DailyLog = mongoose.model<IDailyLog>('DailyLog', dailyLogSchema)
