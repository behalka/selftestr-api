import log from '../common/logger'
import * as errors from '../common/errors'
import db from '../database'

export default {
  getAll() {
    return db.test.findAll()
  },
  async get(id) {
    const test = await db.test.findOne({
      where: { id },
    })
    if (!test) {
      throw new errors.NotFoundError('E_NOTFOUND_TEST', `Test with id ${id} does not exist.`)
    }
    return test
  },
  async createTest(test) {
    const owner = await db.user.findOne({ id: test.userId })
    if (!owner) {
      throw new errors.NotFoundError('E_NOTFOUND_TEST', `User ${test.userId} does not exist.`)
    }
    return db.test.create(test)
  },
}
