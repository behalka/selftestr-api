/* eslint-disable camelcase */
const db = require('../../../src/database/index')
const testModelHelper = require('./testModel')

const testModel = testModelHelper.getModelTest()

const modelTestInstance = {
  id: 'e7507e80-cb96-4db4-b1a3-0260560a1d6a',
  testModelId: testModel.id,
  name: 'Vygenerovany test 1',
  description: 'vysvetleni',
}
const modelQuestionInstance = {
  id: 'd27cab3e-f9de-43e7-ac12-1ab61a440548',
  testInstanceId: modelTestInstance.id,
  text: 'Zneni otazky..',
  explanation: 'Vysvetleni otazky..',
  type: 'singlechoice',
  answeredCorrectly: null,
}
const modelQuestionInstance2 = {
  id: 'd27cab3e-f9de-43e7-ac12-1ab61a440549',
  testInstanceId: modelTestInstance.id,
  text: 'Zneni otazky2..',
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
    userInput: null,
    isCorrect: true,
  },
  {
    id: '00aa1e30-0cdf-46bb-ba27-45156ab8c6e7',
    questionInstanceId: modelQuestionInstance.id,
    text: 'NE',
    correctSolution: null,
    isSelected: null,
    userInput: null,
    isCorrect: false,
  },
  {
    id: '00aa1e30-0cdf-46bb-ba27-45156ab8c6e8',
    questionInstanceId: modelQuestionInstance2.id,
    text: 'NE',
    correctSolution: null,
    isSelected: null,
    userInput: null,
    isCorrect: false,
  },
]

module.exports = {
  getModelTest: (props = {}) => Object.assign({}, modelTestInstance, props),
  getQuestions: () => [Object.assign({}, modelQuestionInstance), Object.assign({}, modelQuestionInstance2)],
  getAnswers: () => modelAnswerInstances.map(answer => Object.assign({}, answer)),
  create: async () => {
    await testModelHelper.create()
    await db.testInstance.create(modelTestInstance)
    await db.questionInstance.create(modelQuestionInstance)
    await db.questionInstance.create(modelQuestionInstance2)
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
