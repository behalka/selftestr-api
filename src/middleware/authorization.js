const jwt = require('jsonwebtoken')
const config = require('../config')
const errors = require('../common/errors')
const db = require('../database')

module.exports = {
  isLogged: async (ctx, middleware) => {
    // Get auth header
    const authorization = ctx.headers.authorization
    if (!authorization) {
      throw new errors.UnauthorizedError()
    }
    // Try to decode token
    let payload
    try {
      payload = jwt.verify(authorization, config.auth.pepper)
    } catch (err) {
      throw new errors.UnauthorizedError()
    }
    // Find user in the database
    const user = await db.User.findById(payload.userId)
    if (!user) {
      throw new errors.UnauthorizedError()
    }
    // Add user record to the current request instance
    ctx.request.user = user
    await middleware()
  },

}
