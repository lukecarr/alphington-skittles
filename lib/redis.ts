import Redis from 'ioredis'

export const $redis = () => new Redis(process.env.SKITTLES_REDIS_URL)
