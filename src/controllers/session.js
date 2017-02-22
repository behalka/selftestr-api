import compose from 'koa-compose'
import middleware from '../middleware'
import schema from '../validation/schema'

export default {

  /**
   * Creates a new user access token.
   * @param {Object} ctx Koa context
   * @returns {Function} Koa middleware
   */
  create: compose([
    middleware.validation.validateBody(schema.sessions.create),
    ctx => {
      // TODO: implement session create logic
      ctx.status = 201
    },
  ]),
  revalidate: compose([
    // provide revalidated token
  ]),
  destroy: compose([
    // logout the user
  ]),
}
