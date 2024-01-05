import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
	palette: {
		mode: 'dark',
		primary: {
			main: '#333333',
			light: '#474747',
			dark: '#1f1f1f',
			contrastText: '#ffffff'
		},
		secondary: {
			main: '#4caf50',
			light: '#80e27e',
			dark: '#087f23',
			contrastText: '#ffffff'
		},
		background: {
			default: '#202020',
			paper: '#282828'
		},
		text: {
			primary: '#ffffff',
			secondary: '#aaaaaa'
		}
	},
	typography: {
		fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
		h1: { color: '#ffffff' },
		h2: { color: '#ffffff' }
	},
	components: {
		MuiButton: {
			styleOverrides: {
				root: {
					borderRadius: 8,
					padding: '8px 15px',
					textTransform: 'none'
				}
			}
		},
		MuiCard: {
			styleOverrides: {
				root: {
					borderRadius: 15
				}
			}
		},
		MuiTextField: {
			styleOverrides: {
				root: {
					margin: '8px'
				}
			}
		}
	}
})
