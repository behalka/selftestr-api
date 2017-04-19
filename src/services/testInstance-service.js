const log = require('../common/logger')
const errors = require('../common/errors')
const db = require('../database')
const testModelService = require('./test-service')
const rand = require('../utils/randomIndices')

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
    if (!testInstance) {
      throw new errors.NotFoundError(`Test instance ${testUpdates.id} does not exist.`)
    }
    testInstance.changed('updated_at', true)
    await testInstance.save({
      transaction: trans,
    })
    return testInstance
  })
  return result
}

function questionModelToInstance(question) {
  const questionData = Object.assign({}, question)
  delete questionData.id
  questionData.answerInstances = questionData.answerModels.map(answer => {
    const answerData = Object.assign({}, answer)
    delete answerData.id
    return answerData
  })
  delete questionData.answerModels
  return questionData
}

module.exports = {
  get: getById,
  update: async updates => {
    const instance = await saveTestInstanceResults(updates)
    return instance
  },
  add: async input => {
    const instance = await db.testInstance.create(input, {
      include: [{ model: db.questionInstance, include: [db.answerInstance] }],
    })
    const completeInstance = await getById(instance.id)
    return completeInstance
  },
  generate: async (testModelId, userId, inputQuestionsCnt) => {
    const testModel = await testModelService.getWithQuestions(testModelId)
    let questionsCount
    if (inputQuestionsCnt && testModel.questionModels.length >= inputQuestionsCnt) {
      questionsCount = inputQuestionsCnt
      log.warn('requested more questions than is stored')
    } else if (testModel.questionsPerTestInstance <= testModel.questionModels.length) {
      questionsCount = testModel.questionsPerTestInstance
      log.warn('questionsPerInstance is bigger than actual count that is stored')
    } else {
      // fallback ke VSEM otazkam v testu
      questionsCount = testModel.questionModels.length
    }
    const testInstanceData = Object.assign({},
      testModel.get({ plain: true }),
      {
        userId,
        testModelId,
      })
    const questionIndices = rand.randomUniqueIndices(testInstanceData.questionModels.length, questionsCount)
    testInstanceData.questionInstances = questionIndices
      .map(index => questionModelToInstance(testInstanceData.questionModels[index]))
    delete testInstanceData.id
    delete testInstanceData.questionModels

    const testInstance = await db.testInstance.create(testInstanceData, {
      include: [{ model: db.questionInstance, include: [db.answerInstance] }],
      returning: true,
    })
    const completeInstance = await getById(testInstance.id)
    return completeInstance
  },
}
