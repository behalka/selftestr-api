const Koa = require('koa')
const koaBody = require('koa-body')
const koaCompress = require('koa-compress')
const koaCors = require('kcors')
const koaQs = require('koa-qs')

const config = require('./config')
const log = require('./common/logger')
const routes = require('./routes/index')
const middleware = require('./middleware/index')

const app = new Koa()

// Setup middleware
app.use(koaCompress())
app.use(koaBody({ multipart: true }))
app.use(koaCors({ origin: '*' }))
app.use(middleware.errors.handleErrors)
// query string parser
koaQs(app)

// Serve documentation
if (config.env !== 'production') {
  app.use(middleware.docs)
}

// Setup routes
app.use(routes)

// Start method
app.start = () => {
  log.info('Starting server ...')
  return app.listen(config.port, () => {
    log.info(`==> 🌎  Server listening on port ${config.port}.`)
  })
}

module.exports = app
