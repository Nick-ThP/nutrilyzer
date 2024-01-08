import { configureStore } from '@reduxjs/toolkit'
import { authReducer } from './features/slices/auth-slice'
import { workoutReducer } from './features/slices/workout-slice'

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const store = configureStore({
	reducer: {
		auth: authReducer,
		workouts: workoutReducer
	}
})
