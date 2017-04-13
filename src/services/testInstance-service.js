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

async function saveTestInstanceResults(testUpdates) {
  const result = await db.sequelize.transaction(async trans => {
    /* update all questions */
    for (const question of testUpdates.questionInstances) {
      /* update all answers */
      for (const answer of question.answerInstances) {
        await db.answerInstance.update(answer, {
          where: { id: answer.id },
          transaction: trans,
        })
      }
      await db.questionInstance.update(question, {
        where: { id: question.id },
        transaction: trans,
      })
    }
    /* update the test itself if needed */
    const testInstance = await db.testInstance.findOne({
      where: { id: testUpdates.id },
      include: [{ model: db.questionInstance, include: [db.answerInstance] }],
      transaction: trans,
    })
    testInstance.changed('updated_at', true)
    await testInstance.save({
      transaction: trans,
    })
    return testInstance
  })
  return result
}

module.exports = {
  get: getById,
  update: async updates => {
    const instance = await saveTestInstanceResults(updates)
    // const instance = await getById(updates.id)
    // log.info(instance.get({ plain: true }))
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
