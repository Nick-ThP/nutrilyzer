import asyncHandler from 'express-async-handler'
import { ExtendedRequest, Foodstuff } from '../../app-types'
import FoodstuffList from '../models/foodItemModel'
import User from '../models/userModel'
import { ServiceError } from '../utils/ServiceError'
import { constants } from '../utils/constants'

//@desc Get list of foodstuffs
//@route GET /api/foodstuffs/:userId
//@access private
export const getFoodstuffList = asyncHandler(async (req: ExtendedRequest, res) => {
	const user = await User.findById(req.params.userId)
	if (!user) {
		throw new ServiceError('User not found', constants.NOT_FOUND)
	}

	const foodstuffList = await FoodstuffList.findOne({ userId: user._id })
	if (!foodstuffList) {
		throw new ServiceError('Foodstuff list not found', constants.NOT_FOUND)
	}

	res.status(200).json(foodstuffList)
})

//@desc Update list of foodstuffs
//@route PUT /api/foodstuffs/:userId
//@access private
export const updateFoodstuffList = asyncHandler(async (req: ExtendedRequest, res) => {
	const user = await User.findById(req.params.userId)
	if (!user) {
		throw new ServiceError('User not found', constants.NOT_FOUND)
	}

	const foodstuffs: Foodstuff[] = req.body
	if (foodstuffs.length === 0) {
		throw new ServiceError('Provide at least one food item', constants.VALIDATION_ERROR)
	}

	for (const foodstuff of foodstuffs) {
		const { name, calories, carbs, fiber, fat, protein, sodium } = foodstuff
		if (!name || !calories || !carbs || !fiber || !fat || !protein || !sodium) {
			throw new ServiceError(`Missing required properties in ${name || 'a food item'}`, constants.VALIDATION_ERROR)
		}
	}

	const updatedFoodstuffList = await FoodstuffList.findOneAndUpdate(
		{ userId: user._id },
		{ $set: { foodstuffs: foodstuffs } },
		{ new: true }
	)

	if (!updatedFoodstuffList) {
		throw new ServiceError('Could not update the foodstuff list', constants.SERVER_ERROR)
	}

	res.status(200).json(updatedFoodstuffList)
})
