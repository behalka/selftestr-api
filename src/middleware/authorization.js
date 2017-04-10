const jwt = require('jsonwebtoken')
const config = require('../config')
const errors = require('../common/errors')
const db = require('../database')

function parseToken(ctx, authorization) {
  // Pokud tam hlavicka je, tak musi byt validni
  let payload
  try {
    payload = jwt.verify(authorization, config.auth.tokenSecret, { ignoreExpiration: false })
  } catch (err) {
    throw new errors.UnauthorizedError('Invalid access token')
  }
  return payload
}

async function setUser(payload) {
  const user = await db.user.findOne({ where: {
    id: payload.userId,
  } })
  if (!user) {
    throw new errors.UnauthorizedError()
  }
  return user
}

module.exports = {
  /*
   * Populates ctx.request.user field
   */
  fetchUser: () =>
    async (ctx, middleware) => {
      const authorization = ctx.headers.authorization
      if (!authorization) {
        return middleware()
      }
      const payload = await parseToken(ctx, authorization)
      ctx.request.user = await setUser(payload)
      await middleware()
    },
  /*
   * Populates ctx.request.user field
   * Throws error if user is not found 
   */
  isLogged: () =>
    async (ctx, middleware) => {
      const authorization = ctx.headers.authorization
      if (!authorization) {
        throw new errors.UnauthorizedError('Authorization header information missing')
      }
      const payload = await parseToken(ctx, authorization)
      ctx.request.user = await setUser(payload)
      await middleware()
    },
}
