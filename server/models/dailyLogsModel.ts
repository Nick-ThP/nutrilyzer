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

// Pre middleware to check and delete if all mealtimes are empty
dailyLogSchema.pre('save', async function (next) {
	const dailyLog = this
	const isEmpty = Object.values(dailyLog.meals).every(mealtime => mealtime.length === 0)

	if (isEmpty) {
		await DailyLog.deleteOne({ _id: dailyLog._id })
	}

	next()
})

export const DailyLog = mongoose.model<IDailyLog>('DailyLog', dailyLogSchema)
