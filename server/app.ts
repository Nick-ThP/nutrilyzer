import compression from 'compression'
import cors from 'cors'
import dotenv from 'dotenv'
import express, { Application } from 'express'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import morgan from 'morgan'
import { createHttpErrorResponse } from './middlewares/http-error-middleware'
import { dailyLogRouter } from './routes/daily-log-router'
import { foodItemRouter } from './routes/food-item-router'
import { mealRouter } from './routes/meal-router'
import { userRouter } from './routes/user-router'
import { corsOptions } from './options/cors-options'
import { connectDb } from './utils/db-connection'
import { helmetOptions } from './options/helmet-options'
import { limitOptions } from './options/rate-limit-options'

// Initialization
const app: Application = express()

// Environment variables
dotenv.config({ path: './server/.env' })

// Database connection
connectDb()

// Security measures
app.use(cors(corsOptions))
app.use(helmet(helmetOptions))
app.use(rateLimit(limitOptions))

// Morgan for logging
app.use(morgan('dev'))

// Compress requests
app.use(compression())

// Parsing
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Endpoints
app.use('/api/users', userRouter)
app.use('/api/foodItems', foodItemRouter)
app.use('/api/meals', mealRouter)
app.use('/api/dailyLogs', dailyLogRouter)

// Middleware if async handler catches error
app.use(createHttpErrorResponse)

// Spin-up
const port = process.env.PORT || 5000
app.listen(port, () => {
	console.log(`Server running on port ${port}`)
})
