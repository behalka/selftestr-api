import log from '../common/logger'
import * as errors from '../common/errors'
import db from '../database'

export default {
  getAll() {
    return db.testModel.findAll({
      include: [{ model: db.questionModel, attributes: [] }],
      group: ['testModel.id'],
      attributes: {
        include: [[db.sequelize.fn('COUNT',
          db.sequelize.col('questionModels.id')),
          'questionsCount',
        ]],
      },
    })
  },
  async get(id) {
    const test = await db.testModel.findOne({
      where: { id },
      include: [{ model: db.questionModel }],
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
}
