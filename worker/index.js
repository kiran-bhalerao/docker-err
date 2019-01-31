const redis = require('redis')

const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  retry_strategy: () => 1000
})

const subscriber = redisClient.duplicate()

function fib(index) {
  if (index < 2) return 1
  return fib(index - 1) + fib(index - 2)
}

subscriber.on('message', (channel, message) => {
  let value = fib(parseInt(message))
  redisClient.hset('values', message, value)
})

subscriber.subscribe('insert')
