import { Container, Snackbar } from '@mui/material'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Dashboard } from './pages/Dashboard'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { Workout } from './pages/Workout'

export function App() {
	return (
		<>
			<Router>
				<div>
					<Header />
					<Routes>
						<Container>
							<Route path='/' element={<Dashboard />} />
							<Route path='/login' element={<Login />} />
							<Route path='/register' element={<Register />} />
							<Route path='/workout/:id' element={<Workout />} />
						</Container>
					</Routes>
					<Footer />
				</div>
			</Router>
			<Snackbar />
		</>
	)
}
