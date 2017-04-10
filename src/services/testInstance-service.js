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
    const testInstance = Object.assign({}, testModel.get({ plain: true }))
    testInstance.questionInstances = testInstance.questionModels.map(question => {
      delete question.id
      question.answerInstances = question.answerModels.map(answer => {
        delete answer.id
        return answer
      })
      delete question.answerModels
      return question
    })
    delete testInstance.questionModels
    delete testInstance.id
    const instance = await db.testInstance.create(Object.assign({}, testInstance, {
      testModelId,
      userId,
    }), {
      include: [{ model: db.questionInstance, include: [db.answerInstance] }],
    })
    const completeInstance = await getById(instance.id)
    return completeInstance
  },
}
