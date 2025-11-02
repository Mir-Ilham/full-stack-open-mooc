const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const morgan = require('morgan')
const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')

const app = express()

const mongoUrl = config.MONGODB_URI

mongoose.set('strictQuery', false)

mongoose.connect(mongoUrl)
  .then(result => {
    logger.info('Connected to MongoDB.')
  })
  .catch(error => {
    logger.error('Error connecting to MongoDB:', error.message)
  })

app.use(express.json())
app.use(cors())

if (process.env.NODE_ENV !== 'test') {
  morgan.token('post-data', (request) => {
    if (request.method === 'POST') {
      return JSON.stringify(request.body)
    }
    return ' '
  })

  const format = ':method :url :status :res[content-length] - :response-time ms :post-data'

  app.use(morgan(format))
}

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app