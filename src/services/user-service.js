import log from '../common/logger'
import * as errors from '../common/errors'
import db from '../database'

export default {

  /**
   * Creates user record within database.
   * @param {Object} user - Data of the user.
   * @returns {Object} Database user record.
   */
  async register(user) {

    // Verify that the user does not already exist
    const conflictUser = await db.User.findOne({ where: { email: user.email } })
    if (conflictUser) {
      log.warn({ conflictUserId: conflictUser.id }, 'User conflict appeared during sign up.')
      throw new errors.ConflictError('E_CONFLICT_USER')
    }

    // Create database record
    return db.User.create(user)
  },

}
