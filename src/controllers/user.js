const compose = require('koa-compose')
const log = require('../common/logger')
const middleware = require('../middleware')
const schema = require('../validation/schema')
const crypto = require('../utils/crypto')
const userService = require('../services/user-service')

module.exports = {
  /**
   * Creates a new user account based on sent credentials.
   * @param {Object} ctx Koa context
   * @returns {Function} Koa middleware
   */
  register: compose([
    middleware.validation.validateBody(schema.users.register),
    async ctx => {
      const body = ctx.request.validatedBody
      log.info({ email: body.email }, 'Registering a new user account.')

      // Create user record
      const profile = await userService.register(body)
      const accessToken = crypto.generateAccessToken(profile.id)
      log.info({ id: profile.id }, 'User successfully created.')

      // Send response
      ctx.status = 201
      ctx.body = {
        accessToken,
        profile,
      }
    },
  ]),

  /**
   * Sets reset password token and sends an email with the reset password link.
   * @param {Object} ctx Koa context
   * @returns {Function} Koa middleware
   */
  resetPassword: compose([
    middleware.validation.validateBody(schema.users.resetPassword),
    ctx => {
      // TODO: reset password logic
      ctx.status = 200
    },
  ]),

}
