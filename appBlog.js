const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
// this handle try, catch blocks automatically in async function
const appBlog = express()
const cors = require('cors')

const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
if (process.env.NODE_ENV === 'test') {
    const testingRouter = require('./controllers/testing')
    appBlog.use('/api/testing', testingRouter)
}

const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
    .then(() => {
        logger.info('connected to MongoDB')
    })
    .catch((error) => {
        logger.error('error connecting to MongoDB:', error.message)
    })

appBlog.use(cors())
appBlog.use(express.static('dist'))

appBlog.use(express.json())
appBlog.use(middleware.requestLogger)
appBlog.use(middleware.userExtractor)

appBlog.use('/api/blogs', blogsRouter)
appBlog.use('/api/users', usersRouter)
appBlog.use('/api/login', loginRouter)

appBlog.use(middleware.unknownEndpoint)
appBlog.use(middleware.errorHandler)

module.exports = appBlog