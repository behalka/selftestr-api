const joi = require('joi')
const questionTypes = require('../../database/enums/questionTypes')

const answerInstance = joi.object().keys({
  text: joi.string(),
  isCorrect: joi.boolean().required(),
  correctSolution: joi.string().allow(null),
  isSelected: joi.boolean().allow(null),
  userInput: joi.string().allow(null),
})

const questionInstance = joi.object().keys({
  text: joi.string().required(),
  explanation: joi.string(),
  type: joi.any().required().allow(...questionTypes),
  answeredCorrectly: joi.boolean().allow(null),
  answerInstances: joi.array().items(answerInstance),
})

module.exports = {
  addTestInstance: joi.object().keys({
    userId: joi.string().guid().allow(null),
    testModelId: joi.string().guid().required(),
    name: joi.string().required(),
    questionInstances: joi.array().items(questionInstance),
  }),
  saveResults: joi.object().keys({
    questionInstances: joi.array().items(joi.object().keys({
      id: joi.string().guid().required(),
      answeredCorrectly: joi.boolean().required(),
      answerInstances: joi.array().items(joi.object().keys({
        id: joi.string().guid().required(),
        isSelected: joi.boolean().allow(null),
        userInput: joi.string().allow(null),
      })),
    })),
  }),
}