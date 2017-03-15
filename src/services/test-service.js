const log = require('../common/logger')
const errors = require('../common/errors')
const db = require('../database')

module.exports = {
  getAll: () => {
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
  get: async id => {
    const test = await db.testModel.findOne({
      where: { id },
      include: [{ model: db.questionModel }],
    })
    if (!test) {
      throw new errors.NotFoundError('E_NOTFOUND_TEST', `Test with id ${id} does not exist.`)
    }
    return test
  },
  createTest: async test => {
    const owner = await db.user.findOne({ id: test.userId })
    if (!owner) {
      throw new errors.NotFoundError('E_NOTFOUND_TEST', `User ${test.userId} does not exist.`)
    }
    return db.testModel.create(test, { include: [db.questionModel] })
  },
  generate: async testModelId => {
    /**
     * generates testInstance from testModel -> copies and prepares everything
     * nutno definovat nejdriv modely...budou tam navic udaje o vysledku
     */
    
  },
}
