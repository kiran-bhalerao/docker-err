const keys = require('./keys')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { Pool } = require('pg')
const app = express()
const redis = require('redis')

// BODY-PARSER MIDDLEWARE
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true
  })
)
// CORS MIDDLEWARE
app.use(cors())

// Postgress setup
const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort
})

pgClient.on('error', () => console.log('PG error'))
pgClient
  .query('CREATE TABLE IF NOT EXISTS values(number INT)')
  .catch(e => console.log(e.message))

// Redis client setup
const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000
})

const redisPublisher = redisClient.duplicate()

// Express routes
app.get('/', (req, res) => {
  res.send('hi')
})

app.get('/values/all', async (req, res) => {
  const values = await pgClient.query('SELECT * FROM VALUES')
  res.send(values.rows)
})

app.get('/values/current', async (req, res) => {
  redisClient.hgetall('values', (err, values) => {
    res.send(values)
  })
})

app.post('/values', async (req, res) => {
  const index = req.body.index
  if (index > 40) return res.status(422).send('Index too high')
  redisClient.hset('values', index, 'Nothing Yet')
  redisPublisher.publish('insert', index)

  pgClient.query('INSERT INTO VALUES(number) VALUES($1)', [index])
  res.send({ working: true })
})

app.listen(5000, err => {
  console.log('Listening at 5000')
})
