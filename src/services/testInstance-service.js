const log = require('../common/logger')
const errors = require('../common/errors')
const db = require('../database')
const testModelService = require('./test-service')

module.exports = {
  get: async id => {
    const instance = await db.testInstance.findOne({
      where: { id },
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
      userId: '73ccd9e5-c019-410b-80b9-daaded0abb5a',
    })
    return instance
  },
}
