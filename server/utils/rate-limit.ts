import rateLimit from 'express-rate-limit'
import RedisStore from 'rate-limit-redis'
import { redisClient } from './redis-client'

export const limitOptions = {
	store: new RedisStore({ client: redisClient } as any),
	windowMs: 15 * 60 * 1000,
	max: 100
}
