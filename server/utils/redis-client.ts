import { createClient } from 'redis'

export const redisClient = createClient({
	url: process.env.NODE_ENV === 'production' ? process.env.REDIS_URL : 'redis://localhost:6379'
})

redisClient.on('error', err => console.error('Redis client error', err))
redisClient.connect()
