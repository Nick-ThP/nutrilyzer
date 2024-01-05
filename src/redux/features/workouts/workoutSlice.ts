import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { CreatedWorkout, Workout, WorkoutPutPackage } from '../../../utils/types'
import { RootState } from '../../store'
import { workoutService } from './workoutService'

interface WorkoutState {
	workouts: CreatedWorkout[]
	workout: CreatedWorkout | null
	isError: boolean
	isSuccess: boolean
	isLoading: boolean
	message: string
}

const initialState: WorkoutState = {
	workouts: [],
	workout: null,
	isError: false,
	isSuccess: false,
	isLoading: false,
	message: ''
}

// Get user workouts
export const getWorkouts = createAsyncThunk<CreatedWorkout[], void, { rejectValue: string }>('workouts/getAll', async (_, thunkAPI) => {
	try {
		const token: string | undefined = (thunkAPI.getState() as RootState).auth.user?.token
		if (token) {
			return await workoutService.getWorkouts(token)
		}
		throw new Error('No token available')
	} catch (error: any) {
		const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
		return thunkAPI.rejectWithValue(message)
	}
})

// Get user workouts
export const getWorkout = createAsyncThunk<CreatedWorkout, string, { rejectValue: string }>(
	'workout/getOne',
	async (workoutId, thunkAPI) => {
		try {
			const token: string | undefined = (thunkAPI.getState() as RootState).auth.user?.token
			if (token) {
				return await workoutService.getWorkout(workoutId, token)
			}
			throw new Error('No token available')
		} catch (error: any) {
			const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
			return thunkAPI.rejectWithValue(message)
		}
	}
)

// Create new workout
export const createWorkout = createAsyncThunk<CreatedWorkout, Workout, { rejectValue: string }>(
	'workouts/create',
	async (workout: Workout, thunkAPI) => {
		try {
			const token: string | undefined = (thunkAPI.getState() as RootState).auth.user?.token
			if (token) {
				return await workoutService.createWorkout(workout, token)
			}
			throw new Error('No token available')
		} catch (error: any) {
			const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
			return thunkAPI.rejectWithValue(message)
		}
	}
)

// Update workout
export const updateWorkout = createAsyncThunk<Workout, WorkoutPutPackage, { rejectValue: string }>(
	'workouts/update',
	async ({ workoutId, workoutData }: WorkoutPutPackage, thunkAPI) => {
		try {
			const token: string | undefined = (thunkAPI.getState() as RootState).auth.user?.token
			if (token) {
				return await workoutService.updateWorkout(workoutId, workoutData, token)
			}
			throw new Error('No token available')
		} catch (error: any) {
			const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
			return thunkAPI.rejectWithValue(message)
		}
	}
)

// Delete workout
export const deleteWorkout = createAsyncThunk<string, string, { rejectValue: string }>(
	'workouts/delete',
	async (workoutId: string, thunkAPI) => {
		try {
			const token: string | undefined = (thunkAPI.getState() as RootState).auth.user?.token
			if (token) {
				return await workoutService.deleteWorkout(workoutId, token)
			}
			throw new Error('No token available')
		} catch (error: any) {
			const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
			return thunkAPI.rejectWithValue(message)
		}
	}
)

export const workoutSlice = createSlice({
	name: 'workout',
	initialState,
	reducers: {
		reset: (state) => initialState
	},
	extraReducers: (builder) => {
		builder

			// Read
			.addCase(getWorkouts.pending, (state) => {
				state.isLoading = true
			})
			.addCase(getWorkouts.fulfilled, (state, action) => {
				state.isLoading = false
				state.isSuccess = true
				state.workouts = action.payload
			})
			.addCase(getWorkouts.rejected, (state, action) => {
				state.isLoading = false
				state.isError = true
				state.message = action.payload as string
			})

			// Read specific
			.addCase(getWorkout.pending, (state) => {
				state.isLoading = true
			})
			.addCase(getWorkout.fulfilled, (state, action) => {
				state.isLoading = false
				state.isSuccess = true
				state.workout = action.payload
			})
			.addCase(getWorkout.rejected, (state, action) => {
				state.isLoading = false
				state.isError = true
				state.message = action.payload as string
			})

			// Create
			.addCase(createWorkout.pending, (state) => {
				state.isLoading = true
			})
			.addCase(createWorkout.fulfilled, (state, action) => {
				state.isLoading = false
				state.isSuccess = true
				state.workouts.push(action.payload)
			})
			.addCase(createWorkout.rejected, (state, action) => {
				state.isLoading = false
				state.isError = true
				state.message = action.payload as string
			})

			// Update
			.addCase(updateWorkout.pending, (state) => {
				state.isLoading = true
			})
			.addCase(updateWorkout.fulfilled, (state, action) => {
				state.isLoading = false
				state.isSuccess = true
				state.workouts = state.workouts.map((workout) =>
					workout._id !== action.payload.id ? { ...workout, text: action.payload } : workout
				)
			})
			.addCase(updateWorkout.rejected, (state, action) => {
				state.isLoading = false
				state.isError = true
				state.message = action.payload as string
			})

			// Delete
			.addCase(deleteWorkout.pending, (state) => {
				state.isLoading = true
			})
			.addCase(deleteWorkout.fulfilled, (state, action) => {
				state.isLoading = false
				state.isSuccess = true
				state.workouts = state.workouts.filter((workout) => workout._id !== action.payload)
			})
			.addCase(deleteWorkout.rejected, (state, action) => {
				state.isLoading = false
				state.isError = true
				state.message = action.payload as string
			})
	}
})

export const { reset } = workoutSlice.actions
export const workoutReducer = workoutSlice.reducer
