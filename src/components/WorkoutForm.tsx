import { useState } from 'react'
import { FaTimesCircle } from 'react-icons/fa'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import exercises from '../data/movements.json'
import { createWorkout, getWorkout, getWorkouts, updateWorkout } from '../redux/features/workouts/workoutSlice'
import { AppDispatch } from '../redux/store'
import { CreatedWorkout, Exercise, ExerciseForm, Movement } from '../utils/types'
import Modal from './Modal'

type CreateProps = {
	submitType: 'createOnSubmit'
}

type PutProps = {
	submitType: 'putOnSubmit'
	id: string
	initialState: CreatedWorkout
	closeModal: () => void
}

export const WorkoutForm = (props: CreateProps | PutProps) => {
	const dispatch = useDispatch<AppDispatch>()
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
	const [workout, setWorkout] = useState<Exercise[]>(props.submitType === 'putOnSubmit' ? props.initialState.exercises : [])
	const [exerciseForm, setExerciseForm] = useState<ExerciseForm>({
		movementName: '',
		sets: 0,
		reps: 0
	})

	const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		setExerciseForm((prevState) => ({
			...prevState,
			[e.target.name]: e.target.value
		}))
	}

	const archiveWorkout = async () => {
		if (workout.length !== 0) {
			if (props.submitType === 'putOnSubmit') {
				await dispatch(updateWorkout({ workoutId: props.id, workoutData: { exercises: workout } }))
				props.closeModal()
				dispatch(getWorkout(props.id))
			}

			if (props.submitType === 'createOnSubmit') {
				await dispatch(createWorkout({ exercises: workout }))
				setWorkout([])
			}

			dispatch(getWorkouts())
			return
		}

		toast.error('Please include exercises in your workout')
	}

	const exerciseSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (Object.values(exerciseForm).some((value) => value === 0 || '')) {
			return toast.error('Fill out all fields before adding an exercise')
		}

		if (workout.find((exercise) => exercise.movement.name === exerciseForm?.movementName)) {
			return toast.error('You cannot add the same exercise twice')
		}

		const foundMovement = exercises.find((exercise) => exercise.name === exerciseForm.movementName)
		if (!foundMovement) return toast.error('You need an eligible movement to continue')

		const assembledExercise: Exercise = {
			sets: exerciseForm.sets,
			reps: exerciseForm.reps,
			movement: foundMovement as Movement
		}

		setWorkout((prevState) => [...prevState, assembledExercise])
		closeAndInitializeExerciseModal()
	}

	const removeExercise = (name: string) => {
		setWorkout((prev) => prev.filter((exercise) => exercise.movement.name !== name))
	}

	const closeAndInitializeExerciseModal = () => {
		setIsModalOpen(false)
		setExerciseForm({
			movementName: '',
			sets: 0,
			reps: 0
		})
	}

	return (
		<>
			<section className='flex justify-center items-center flex-col gap-4'>
				<h2>{props.submitType === 'createOnSubmit' ? 'Create a new workout' : 'Edit workout'}</h2>
				<ul className='flex gap-5'>
					{workout.map((exercise, idx) => (
						<li key={idx} className='bg-yellow-100 p-8 flex justify-center items-start flex-col gap text-start relative'>
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
							<button onClick={() => removeExercise(exercise.movement.name)} className='close'>
								<FaTimesCircle />
							</button>
						</li>
					))}
				</ul>
				<div className='flex gap-5'>
					<button className='btn' onClick={() => setIsModalOpen(true)}>
						Add Exercise
					</button>
					<button className='btn' onClick={archiveWorkout}>
						Archive Workout
					</button>
				</div>
			</section>
			<Modal isOpen={isModalOpen} onClose={closeAndInitializeExerciseModal}>
				<section className='form'>
					<form onSubmit={exerciseSubmitHandler} method='dialog'>
						<div className='form-group'>
							<select
								id='muscle-group'
								name='movementName'
								placeholder='Choose a muscle group'
								onChange={onChange}
								value={exerciseForm.movementName}
							>
								<option value='' disabled selected>
									Choose a muscle group
								</option>
								{exercises
									.filter((exercise) => !workout.find((addedExercise) => exercise.name === addedExercise.movement.name))
									.map((exercise, index) => (
										<option key={index} value={exercise.name}>
											{exercise.name}
										</option>
									))}
							</select>
						</div>
						<div className='form-group'>
							<input
								type='number'
								name='sets'
								id='sets'
								placeholder='Specify how many sets'
								value={exerciseForm.sets}
								onChange={onChange}
							/>
						</div>
						<div className='form-group'>
							<input
								type='number'
								name='reps'
								id='reps'
								placeholder='Specify how many reps per set'
								value={exerciseForm.reps}
								onChange={onChange}
							/>
						</div>
						<div className='form-group'>
							<button className='btn btn-block' type='submit'>
								Archive workout
							</button>
						</div>
					</form>
				</section>
			</Modal>
		</>
	)
}
