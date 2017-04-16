const jwt = require('jsonwebtoken')
const config = require('../config')
const errors = require('../common/errors')
const db = require('../database')
const log = require('../common/logger')

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
  /**
   * @param {string} entityModel name of db model we want to check
   * @param {strin} paramsField - UUID of the entity we want to check.
   *  It is ALWAYS retrieved from ctx.params
   * @returns {Promise} middleware
   */
  userIsOwner: (entityModel, paramsField) =>
    async (ctx, middleware) => {
      const entityId = ctx.params[paramsField]
      const user = ctx.request.user
      if (!user) {
        throw new errors.UnauthorizedError('Cannot process middleware - user is not set.')
      }
      /* istanbul ignore if */
      if (!entityId) {
        throw new errors.ApiError('Entity id is not provided.')
      }
      /* istanbul ignore if */
      if (!db[entityModel]) {
        throw new errors.NotFoundError('E_ENTITY_NOTFOUND', `Db model ${entityModel} not found.`)
      }
      /* istanbul ignore if */
      if (!db[entityModel].attributes.userId) {
        throw new errors.ApiError('Entity does not include userId field.')
      }
      log.debug({ user, entityId, entityModel }, 'owner payload')
      const result = await db[entityModel].findOne({
        where: {
          id: entityId,
        },
      })
      if (!result) {
        throw new errors.NotFoundError(`Resource ${entityId} (${entityModel}) does not exist.`)
      } else if (result.userId !== user.id) {
        throw new errors.ForbiddenError(`User ${user.id} cannot access this resource.`)
      } else {
        ctx.request.entity = result
      }
      await middleware()
    },
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
