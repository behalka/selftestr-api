const compose = require('koa-compose')
const _ = require('lodash')

const log = require('../common/logger')
const middleware = require('../middleware/index')
const errors = require('../common/errors')
const schema = require('../validation/schema/index')
const crypto = require('../utils/crypto')
const userService = require('../services/user-service')

module.exports = {
  login: compose([
    middleware.validation.validateBody(schema.users.login),
    async ctx => {
      const { username, password } = ctx.request.validatedBody
      const user = await userService.getByUsername(username)
      if (!await crypto.comparePasswords(password, user.password)) {
        throw new errors.UnauthorizedError(`Incorrect password for ${username}`)
      }
      const token = await crypto.generateAccessToken(user.id, username)
      ctx.status = 200
      ctx.body = { token }
    },
  ]),
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
      let profile = await userService.register(body)
      // todo: zakodovat do tokenu vse potrebne -> min db calls
      const token = crypto.generateAccessToken(profile.id)
      profile = _.omit(profile.get({ plain: true }), 'password')
      log.info({ id: profile.id }, 'User successfully created.')

      // Send response
      ctx.status = 201
      ctx.body = {
        token,
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
