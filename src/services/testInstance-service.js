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

function saveTestInstanceResults(testUpdates) {
  return db.sequelize.transaction(async trans => {
    /* update all questions */
    for (const question of testUpdates.questionInstances) {
      /* update all answers */
      for (const answer of question.answerInstances) {
        log.info(answer)
        await db.answerInstance.update(answer, {
          where: { id: answer.id },
          transaction: trans,
        })
      }
      log.info(question)
      await db.questionInstance.update(question, {
        where: { id: question.id },
        transaction: trans,
      })
    }
    /* update the test itself if needed */
  })
}

module.exports = {
  get: getById,
  update: async updates => {
    await saveTestInstanceResults(updates)
    const instance = await getById(updates.id)
    return instance
  },
  add: async input => {
    const instance = await db.testInstance.create(input, {
      include: [{ model: db.questionInstance, include: [db.answerInstance] }],
    })
    const completeInstance = await getById(instance.id)
    return completeInstance
  },
  generate: async (testModelId, userId, questionsCount) => {
    const testModel = await testModelService.get(testModelId)
    /* todo -> questionsCount param will override default that is set in the testModel */
    log.info(questionsCount, 'override this')
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
