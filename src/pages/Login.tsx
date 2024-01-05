import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Spinner } from '../components/Spinner'
import { login, reset } from '../redux/features/auth/authSlice'
import { AppDispatch, RootState } from '../redux/store'

export const Login = () => {
	const navigate = useNavigate()
	const dispatch = useDispatch<AppDispatch>()
	const { user, isLoading, isError, isSuccess, message } = useSelector((state: RootState) => state.auth)

	const [formData, setFormData] = useState({
		email: '',
		password: ''
	})
	const { email, password } = formData

	useEffect(() => {
		if (isError) {
			toast.error(message)
		}

		if (isSuccess || user) {
			navigate('/')
		}

		dispatch(reset())
	}, [user, isError, isSuccess, message, navigate, dispatch])

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData((prevState) => ({
			...prevState,
			[e.target.name]: e.target.value
		}))
	}

	const onSubmit = (e: React.FormEvent<HTMLElement>) => {
		e.preventDefault()
		const userData = {
			email,
			password
		}
		dispatch(login(userData))
	}

	if (isLoading) {
		return <Spinner />
	}

	return (
		<>
			<section className='heading'>
				<h1 className='flex'>Log in</h1>
				<p>Log in to start tracking your workouts</p>
			</section>
			<section className='form'>
				<form onSubmit={onSubmit}>
					<div className='form-group'>
						<input
							type='email'
							className='form-control'
							id='email'
							name='email'
							value={email}
							placeholder='Enter your email'
							onChange={onChange}
						/>
					</div>
					<div className='form-group'>
						<input
							type='password'
							className='form-control'
							id='password'
							name='password'
							value={password}
							placeholder='Enter password'
							onChange={onChange}
						/>
					</div>
					<div className='form-group'>
						<button type='submit' className='btn btn-block'>
							Submit
						</button>
					</div>
				</form>
			</section>
		</>
	)
}
