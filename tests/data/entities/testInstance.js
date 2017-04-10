/* eslint-disable camelcase */
const db = require('../../../src/database/index')
const testModelHelper = require('./testModel')

const testModel = testModelHelper.getModelTest()

const modelTestInstance = {
  id: 'e7507e80-cb96-4db4-b1a3-0260560a1d6a',
  testModelId: testModel.id,
  name: 'Vygenerovany test 1',
}
const modelQuestionInstance = {
  id: 'd27cab3e-f9de-43e7-ac12-1ab61a440548',
  testInstanceId: modelTestInstance.id,
  text: 'Zneni otazky..',
  explanation: 'Vysvetleni otazky..',
  type: 'singlechoice',
  answeredCorrectly: null,
}
const modelAnswerInstances = [
  {
    id: '8e5e27e6-14fc-477c-891f-ca178c990f46',
    questionInstanceId: modelQuestionInstance.id,
    text: 'ANO',
    correctSolution: null,
    isSelected: null,
    isCorrect: true,
  },
  {
    id: '00aa1e30-0cdf-46bb-ba27-45156ab8c6e7',
    questionInstanceId: modelQuestionInstance.id,
    text: 'NE',
    correctSolution: null,
    isSelected: null,
    isCorrect: false,
  },
]

module.exports = {
  getModelTest: (props = {}) => Object.assign({}, modelTestInstance, props),
  getQuestions: () => [modelQuestionInstance],
  getAnswers: () => modelAnswerInstances,
  create: async () => {
    await testModelHelper.create()
    await db.testInstance.create(modelTestInstance)
    await db.questionInstance.create(modelQuestionInstance)
    await db.answerInstance.bulkCreate(modelAnswerInstances)
    return db.testInstance.findOne({
      where: { id: modelTestInstance.id },
      include: [{ model: db.questionInstance, include: [db.answerInstance] }],
    })
  },
  clean: async () => {
    await db.testInstance.sync({ force: true })
  },
}
