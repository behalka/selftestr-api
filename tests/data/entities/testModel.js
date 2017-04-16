/* eslint-disable camelcase */
const db = require('../../../src/database/index')
const userHelper = require('./user')
const log = require('../../../src/common/logger')
const _ = require('lodash')

const user = userHelper.getModelUser()
const modelTest = {
  id: 'e646295e-a5f4-41c4-89ad-6258de0df130',
  name: 'Modelovy test',
  description: 'vysvetleni',
  timeLimit: 5000,
  userId: user.id,
  questionsPerTestInstance: 2,
}
const modelQuestionModels = [
  {
    id: 'd27cab3e-f9de-43e7-ac12-1ab61a440548',
    testModelId: modelTest.id,
    text: 'Zneni otazky..',
    explanation: 'Vysvetleni otazky..',
    type: 'singlechoice',
  },
  {
    id: 'd27cab3e-f9de-43e7-ac12-1ab61a440549',
    testModelId: modelTest.id,
    text: 'Zneni otazky2..',
    explanation: 'Vysvetleni otazky..',
    type: 'singlechoice',
  },
]
const modelAnswerModels = [
  {
    id: '8e5e27e6-14fc-477c-891f-ca178c990f46',
    questionModelId: modelQuestionModels[0].id,
    text: 'ANO',
    correctSolution: null,
    isCorrect: true,
  },
  {
    id: '00aa1e30-0cdf-46bb-ba27-45156ab8c6e7',
    questionModelId: modelQuestionModels[0].id,
    text: 'NE',
    correctSolution: null,
    isCorrect: false,
  },
  {
    id: '00aa1e30-0cdf-46bb-ba27-45156ab8c6e8',
    questionModelId: modelQuestionModels[1].id,
    text: 'NE',
    correctSolution: null,
    isCorrect: false,
  },
]

module.exports = {
  getModelTest: (props = {}) => Object.assign({}, modelTest, props),
  getModelQuestion: () => {
    const question = Object.assign({}, modelQuestionModels[0])
    delete question.testModelId
    let answers = _.cloneDeep(modelAnswerModels)
    answers = answers
      .filter(answer => answer.questionModelId === question.id)
      .map(answer => {
        delete answer.questionModelId
        return answer
      })
    question.answerModels = answers
    return question
  },
  create: async () => {
    try {
      await db.user.create(user)
    } catch (err) {
      // error is swallowed
      log.warn(err, 'did not create user')
    }
    await db.testModel.create(modelTest)
    await db.questionModel.bulkCreate(modelQuestionModels)
    await db.answerModel.bulkCreate(modelAnswerModels)
    return db.testModel.findOne({
      where: { id: modelTest.id },
      include: [{ model: db.questionModel, include: [db.answerModel] }],
    })

  },
  clean: () => db.testModel.sync({ force: true }),
}
