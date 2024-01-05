import { useEffect, useState } from 'react'
import { FaArrowAltCircleLeft, FaTimesCircle, FaWrench } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import Modal from '../components/Modal'
import { Spinner } from '../components/Spinner'
import { WorkoutForm } from '../components/WorkoutForm'
import { deleteWorkout, getWorkout } from '../redux/features/workouts/workoutSlice'
import { AppDispatch, RootState } from '../redux/store'

type Props = {}

export function Workout(props: Props) {
	const [isModalOpen, setIsModalOpen] = useState(false)
	const navigate = useNavigate()
	const { id } = useParams()
	const { workout, isLoading } = useSelector((state: RootState) => state.workouts)
	const dispatch = useDispatch<AppDispatch>()

	useEffect(() => {
		if (id) {
			dispatch(getWorkout(id))
		}
	}, [id, dispatch])

	const deleteHandler = async () => {
		if (id) {
			await dispatch(deleteWorkout(id))
			toast.info('Workout deleted')
			return navigate('/')
		}

		return toast.error('There is no ID')
	}

	if (isLoading) {
		return <Spinner />
	}

	return (
		<>
			{workout && id && (
				<div className='workout'>
					<div className='date'>{new Date(workout.createdAt).toLocaleString('en-GB', { timeZone: 'UTC' })}</div>
					<ul className='flex gap-5'>
						{workout.exercises.map((exercise, idx) => (
							<li key={idx} className='bg-teal-100 p-8 flex justify-center items-start flex-col gap text-start relative'>
								<div>
									Exercise name: <b>{exercise.movement.name}</b>
								</div>
								<div>
									Targeted area: <b>{exercise.movement.area}</b>
								</div>
								<div>
									Amount of reps: <b>{exercise.reps}</b>
								</div>
								<div>
									Amount of sets: <b>{exercise.sets}</b>
								</div>
								<div>
									Burned calories: <b>{exercise.calories}</b>
								</div>
							</li>
						))}
					</ul>
					<div className='p-5 self-center'>This workout burned {workout.calories} calories</div>
					<button onClick={() => setIsModalOpen(true)} className='change'>
						<FaWrench />
					</button>
					<button onClick={deleteHandler} className='close'>
						<FaTimesCircle />
					</button>
					<button onClick={() => navigate('/')} className='back'>
						<FaArrowAltCircleLeft />
					</button>
					<Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
						<WorkoutForm submitType={'putOnSubmit'} id={id} initialState={workout} closeModal={() => setIsModalOpen(false)} />
					</Modal>
				</div>
			)}
		</>
	)
}
