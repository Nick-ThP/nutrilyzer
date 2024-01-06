export const corsOptions = {
	origin: process.env.NODE_ENV === 'production' ? 'https://your-production-frontend-url.com' : 'http://localhost:5173'
}
