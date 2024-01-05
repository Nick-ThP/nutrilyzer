import { configureStore } from '@reduxjs/toolkit'
import { authReducer } from './features/auth/authSlice'
import { workoutReducer } from './features/workouts/workoutSlice'

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const store = configureStore({
	reducer: {
		auth: authReducer,
		workouts: workoutReducer
	}
})
