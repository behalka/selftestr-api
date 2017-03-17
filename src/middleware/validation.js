const joi = require('joi')
const Promise = require('bluebird')
const log = require('../common/logger')
const errors = require('../common/errors')

module.exports = {

  /**
   * Validates request body and fills request
   * @param {Object} schema Joi validation schema used for body validation
   * @returns {void}
   */
  validateBody: schema => {
    return async (ctx, middleware) => {
      log.info({ body: ctx.request.body }, 'Incoming body')

      // Run request validation
      try {
        const result = await Promise.fromCallback(done =>
          joi.validate(ctx.request.body, schema, done))

        ctx.request.validatedBody = result
      } catch (err) {
        log.warn(err, 'Request validation error.')
        throw new errors.ValidationError(err.message)
      }

      // Run next middleware
      await middleware()
    }
  },
}
