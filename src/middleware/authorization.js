const jwt = require('jsonwebtoken')
const config = require('../config')
const errors = require('../common/errors')
const db = require('../database')

function parseToken(ctx, authorization) {
  // Pokud tam hlavicka je, tak musi byt validni
  let payload
  try {
    payload = jwt.verify(authorization, config.auth.tokenSecret)
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
  fetchUser: () =>
    async (ctx, middleware) => {
      const authorization = ctx.headers.authorization
      if (!authorization) {
        await middleware()
      }
      const payload = await parseToken(ctx, authorization)
      ctx.request.user = await setUser(payload)
      await middleware()
    },
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
