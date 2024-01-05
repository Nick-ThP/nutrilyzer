import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { Header } from './components/Header'
import { Dashboard } from './pages/Dashboard'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { Workout } from './pages/Workout'
import { Snackbar, ThemeProvider } from '@mui/material'
import { theme } from './theme/material-theme'

export function App() {
	return (
		<>
			<ThemeProvider theme={theme}>
				<Router>
					<div>
						<Header />
						<Routes>
							<Route path='/' element={<Dashboard />} />
							<Route path='/login' element={<Login />} />
							<Route path='/register' element={<Register />} />
							<Route path='/workout/:id' element={<Workout />} />
						</Routes>
					</div>
				</Router>
				<Snackbar />
			</ThemeProvider>
		</>
	)
}
