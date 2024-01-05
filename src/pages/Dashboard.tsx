import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Spinner } from '../components/Spinner'
import { WorkoutForm } from '../components/WorkoutForm'
import { WorkoutItem } from '../components/WorkoutItem'
import { getWorkouts, reset } from '../redux/features/workouts/workoutSlice'
import { AppDispatch, RootState } from '../redux/store'

export const Dashboard = () => {
	const navigate = useNavigate()
	const dispatch = useDispatch<AppDispatch>()
	const { user } = useSelector((state: RootState) => state.auth)
	const { workouts, isLoading, isError, message } = useSelector((state: RootState) => state.workouts)

	useEffect(() => {
		if (isError) {
			toast.error(message)
		}

		if (!user) {
			navigate('/login')
		} else {
			dispatch(getWorkouts())
		}

		return () => {
			dispatch(reset())
		}
	}, [user, navigate, isError, message, dispatch])

	if (isLoading) {
		return <Spinner />
	}

	return (
		<>
			<div className='flex flex-col gap-8'>
				<section className='heading'>
					<h1 className='flex justify-center'>
						Welcome {user && user.username && user.username?.charAt(0).toUpperCase() + user.username?.slice(1)}
					</h1>
					<p>Workouts Dashboard</p>
				</section>
				<WorkoutForm submitType={'createOnSubmit'} />
				<section className='workout-content'>
					{workouts.length > 0 ? (
						<div className='workouts'>
							{workouts.map((workout) => (
								<WorkoutItem key={workout._id} id={workout._id} workout={workout} />
							))}
						</div>
					) : (
						<h3 className='text-center'>You have not archived any workouts</h3>
					)}
				</section>
			</div>
		</>
	)
}
