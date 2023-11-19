
const appBlog = require('./appBlog')
const app = require('./app')
const config = require('./utils/config')
const logger = require('./utils/logger')

appBlog.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})

app.listen(3001, () => {
  logger.info(`Server running on port ${3001}`)
})



