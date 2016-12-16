import log from './../common/logger'
import config from './../config'

// This is initialized during server start
const start = new Date()

export default {

  /**
   * Sends info about status of the server.
   * @param {Object} ctx Koa context
   * @returns {Function} Koa middleware
   */
  getStatus(ctx) {
    log.info('Status route hit.')
    ctx.status = 200
    ctx.body = {
      start,
      version: config.version,
    }
  },

}
