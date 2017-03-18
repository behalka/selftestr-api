const log = require('../common/logger')
const errors = require('../common/errors')
const db = require('../database')

module.exports = {
  /**
   * Creates user record within database.
   * @param {Object} user - Data of the user.
   * @returns {Object} Database user record.
   */
  register: async user => {
    const conflictUser = await db.user.findOne({ where: { email: user.email } })
    if (conflictUser) {
      log.warn({ conflictUserId: conflictUser.id }, 'User conflict appeared during sign up.')
      throw new errors.ConflictError('E_CONFLICT_USER')
    }
    // Create database record
    return db.user.create(user)
  },
  getByUsername: async username => {
    const user = await db.user.findOne({ where: { username } })
    if (!user) {
      throw new errors.NotFoundError(`Username ${username} not found.`)
    }
    return user
  },
}
