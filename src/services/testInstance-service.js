const log = require('../common/logger')
const errors = require('../common/errors')
const db = require('../database')
const testModelService = require('./test-service')

async function getById(id) {
  const instance = await db.testInstance.findOne({
    where: { id },
    include: [{ model: db.questionInstance, include: [db.answerInstance] }],
  })
  return instance
}

module.exports = {
  get: getById,
  generate: async (testModelId, userId) => {
    const testModel = await testModelService.get(testModelId)
    /* data neccessary for test instance entity */
    const { name } = testModel
    const instance = await db.testInstance.create({
      testModelId,
      name,
      userId,
    })
    const completeInstance = await getById(instance.id)
    return completeInstance
  },
}
