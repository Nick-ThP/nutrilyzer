export const corsOptions = {
	origin: process.env.NODE_ENV === 'production' ? process.env.PROD_ORIGIN : 'http://localhost:5173'
}
