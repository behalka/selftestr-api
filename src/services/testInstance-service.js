const log = require('../common/logger')
const errors = require('../common/errors')
const db = require('../database')
const testModelService = require('./test-service')

module.exports = {
  get: async id => {
    const instance = await db.testInstance.findOne({
      where: { id },
      include: [{ model: db.questionInstance, include: [db.answerInstance] }],
    })
    return instance
  },
  generate: async testModelId => {
    const testModel = await testModelService.get(testModelId)
    /* data neccessary for test instance entity */
    const { name } = testModel
    const instance = await db.testInstance.create({
      testModelId,
      name,
      userId: 'feb794de-c6c0-4b35-92f7-37aee0890b75',
    })
    return instance
  },
}
