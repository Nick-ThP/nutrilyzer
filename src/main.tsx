import { CssBaseline, ThemeProvider } from '@mui/material'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { App } from './App'
import { store } from './redux/store'
import './tailwind'
import { theme } from './theme/material-theme'

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<ThemeProvider theme={theme}>
			<Provider store={store}>
				<CssBaseline />
				<App />
			</Provider>
		</ThemeProvider>
	</React.StrictMode>
)
