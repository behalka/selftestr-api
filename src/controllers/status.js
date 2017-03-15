const log = require('./../common/logger')
const config = require('./../config')

// This is initialized during server start
const start = new Date()

module.exports = {

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
