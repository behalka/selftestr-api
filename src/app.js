import Koa from 'koa'
import koaBody from 'koa-body'
import koaCompress from 'koa-compress'
import koaCors from 'kcors'

import config from './config'
import log from './common/logger'
import routes from './routes/index'
import middleware from './middleware'

const app = new Koa()

// Setup middleware
app.use(koaCompress())
app.use(koaBody({ multipart: true }))
app.use(koaCors({ origin: '*' }))
app.use(middleware.errors.handleErrors)

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

export default app
