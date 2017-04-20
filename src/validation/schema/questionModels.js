const joi = require('joi')
const questionTypes = require('../../database/enums/questionTypes')

const answerSchema = joi.object().keys({
  id: joi.string().guid(),
  text: joi.string().allow(null),
  isCorrect: joi.boolean().required(),
  correctSolution: joi.string().allow(null),
})
const updateAnswerSchema = joi.object().keys({
  id: joi.string().guid().required(),
  text: joi.string().allow(null),
  isCorrect: joi.boolean(),
  correctSolution: joi.string().allow(null),
})

module.exports = {
  addQuestion: joi.object().keys({
    id: joi.string().guid(),
    text: joi.string().required(),
    type: joi.string().allow(...questionTypes).required(),
    explanation: joi.string().allow(null),
    answerModels: joi.array().items(answerSchema).required(),
  }),
  setAnswers: joi.array().items(answerSchema),
  updateQuestion: joi.object().keys({
    id: joi.string().guid(),
    text: joi.string(),
    type: joi.string().allow(...questionTypes),
    explanation: joi.string().allow(null),
    answerModels: joi.array().items(updateAnswerSchema).required(),
  }),
}
