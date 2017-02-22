import log from '../common/logger'
import * as errors from '../common/errors'
import db from '../database'

export default {
  async get(id, testId) {
    const question = await db.questionModel
    .findOne({ where: {
      id,
      testModelId: testId,
    } })
    if (!question) {
      throw new errors.NotFoundError('E_NOTFOUND_QUESTION',
      `Question id ${id} not found under test id ${testId}`)
    }
    return question
  },
  async add(testId, question) {
    // todo: spolecne s otazkou se musi vytvorit i sada odpovedi
    const test = await db.testModel.findOne({ where: { id: testId } })
    if (!test) {
      throw new errors.NotFoundError('E_NOTFOUND_TEST', `Test id ${testId} does not exist.`)
    }
    return db.questionModel.create({ ...question, testId: test.id })
  },
}
