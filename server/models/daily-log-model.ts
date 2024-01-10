import mongoose, { ObjectId, Schema } from 'mongoose'
import { IDailyLog, IDailyLogModel } from '../../app-types'

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

function isEmptyMeals(meals: ObjectId[][]) {
	return Object.values(meals).every(mealArray => mealArray.length === 0)
}

// Custom static method for updating and handling post-update logic
dailyLogSchema.statics.customUpdate = async function (
	filter: Record<string, any>,
	update: Record<string, any>,
	options: Record<string, any>
) {
	// Perform the update
	const result = await this.findOneAndUpdate(filter, update, options)

	// Check if the updated log has empty meals and delete if necessary
	if (result && isEmptyMeals(result.meals)) {
		await this.deleteOne({ _id: result._id })
	}

	return result
}

export const DailyLog = mongoose.model<IDailyLog<ObjectId>, IDailyLogModel>('DailyLog', dailyLogSchema)
