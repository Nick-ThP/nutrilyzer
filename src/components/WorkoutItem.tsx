import { useState } from 'react'
import { FaTimesCircle, FaWrench } from 'react-icons/fa'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { deleteWorkout, getWorkouts } from '../redux/features/workouts/workoutSlice'
import { AppDispatch } from '../redux/store'
import { CreatedWorkout } from '../utils/types'
import { Modal } from './Modal'
import { WorkoutForm } from './WorkoutForm'

type Props = {
	workout: CreatedWorkout
	id: string
}

export const WorkoutItem = (props: Props) => {
	const navigate = useNavigate()
	const dispatch = useDispatch<AppDispatch>()
	const [isModalOpen, setIsModalOpen] = useState(false)

	const changeHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation()
		setIsModalOpen(true)
	}

	const deleteHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation()
		await dispatch(deleteWorkout(props.workout._id))
		dispatch(getWorkouts())
	}

	return (
		<>
			<div className='workout' onClick={() => navigate(`/Workout/${props.id}`)}>
				<div className='date'>{new Date(props.workout.createdAt).toLocaleString('en-GB', { timeZone: 'UTC' })}</div>
				<ul className='flex gap-5'>
					{props.workout.exercises
						.filter((_, idx) => idx < 3)
						.map((exercise, idx) => (
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
					{props.workout.exercises.find((_, idx) => idx >= 3) ? (
						<span>... and {props.workout.exercises.length - 3} more</span>
					) : null}
				</ul>
				<div className='p-5 self-center'>This workout burned {props.workout.calories} calories</div>
				<button onClick={changeHandler} className='change'>
					<FaWrench />
				</button>
				<button onClick={deleteHandler} className='close'>
					<FaTimesCircle />
				</button>
			</div>
			<Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
				<WorkoutForm
					submitType={'putOnSubmit'}
					id={props.id}
					initialState={props.workout}
					closeModal={() => setIsModalOpen(false)}
				/>
			</Modal>
		</>
	)
}
