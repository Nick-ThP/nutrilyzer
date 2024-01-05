import { FaSignInAlt, FaSignOutAlt, FaUser } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { logout, reset } from '../redux/features/auth/authSlice'
import { AppDispatch, RootState } from '../redux/store'

export const Header = () => {
	const navigate = useNavigate()
	const dispatch = useDispatch<AppDispatch>()
	const { user } = useSelector((state: RootState) => state.auth)

	const onLogout = () => {
		dispatch(logout())
		dispatch(reset())
		navigate('/')
	}

	return (
		<header className='header'>
			<div className='logo'>
				<Link to='/'>Workout Archive</Link>
			</div>
			<ul>
				{user ? (
					<li className='flex'>
						<button className='btn' onClick={onLogout}>
							<FaSignOutAlt /> Log out
						</button>
					</li>
				) : (
					<>
						<li>
							<Link to='/login' className='flex'>
								<button className='btn'>
									<FaSignInAlt /> Log in
								</button>
							</Link>
						</li>
						<li>
							<Link to='/register' className='flex'>
								<button className='btn'>
									<FaUser /> Register
								</button>
							</Link>
						</li>
					</>
				)}
			</ul>
		</header>
	)
}
