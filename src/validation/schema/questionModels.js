const joi = require('joi')

const answerSchema = joi.object().keys({
  text: joi.string().required(),
  isCorrect: joi.boolean().required(),
  correctSolution: joi.string(),
})

module.exports = {
  addQuestion: joi.object().keys({
    text: joi.string().required(),
    type: joi.string().required(),
    explanation: joi.string(),
  }),
  setAnswers: joi.array().items(answerSchema),
}
