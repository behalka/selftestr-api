import log from '../common/logger'
import * as errors from '../common/errors'
import db from '../database'

export default {
  getAll() {
    return db.testModel.findAll({ include: [db.questionModel] })
  },
  async get(id) {
    const test = await db.testModel.findOne({
      where: { id },
      include: [db.questionModel],
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
    return db.testModel.create(test, { include: [db.questionModel] })
  },
  async addQuestion(testId, question) {
    // todo: spolecne s otazkou se musi vytvorit i sada odpovedi
    const test = await db.testModel.findOne({ where: { id: testId } })
    if (!test) {
      throw new errors.NotFoundError('E_NOTFOUND_TEST', `Test id ${testId} does not exist.`)
    }
    return db.questionModel.create({ ...question, testId: test.id })
  },
}
