const joi = require('joi')
const questionTypes = require('../../database/enums/questionTypes')

const answerSchema = joi.object().keys({
  id: joi.string().guid(),
  text: joi.string().required(),
  isCorrect: joi.boolean().required(),
  correctSolution: joi.string(),
})
const updateAnswerSchema = joi.object().keys({
  id: joi.string().guid().required(),
  text: joi.string(),
  isCorrect: joi.boolean(),
  correctSolution: joi.string(),
})

module.exports = {
  addQuestion: joi.object().keys({
    id: joi.string().guid(),
    text: joi.string().required(),
    type: joi.string().allow(...questionTypes).required(),
    explanation: joi.string(),
    answerModels: joi.array().items(answerSchema).required(),
  }),
  setAnswers: joi.array().items(answerSchema),
  updateQuestion: joi.object().keys({
    text: joi.string(),
    type: joi.string().allow(...questionTypes),
    explanation: joi.string(),
    answerModels: joi.array().items(updateAnswerSchema).required(),
  }),
}
