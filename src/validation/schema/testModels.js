const joi = require('joi')
const sortTypes = require('../../database/enums/sortTypes')
const questionTypes = require('../../database/enums/questionTypes')

const answerModel = joi.object().keys({
  id: joi.string().guid(),
  text: joi.string(),
  isCorrect: joi.boolean().required(),
  correctSolution: joi.string().allow(null),
})

const questionModel = joi.object().keys({
  id: joi.string().guid(),
  text: joi.string().required(),
  explanation: joi.string(),
  type: joi.any().required().allow(...questionTypes),
  answerModels: joi.array().items(answerModel),
})

module.exports = {
  update: joi.object().keys({
    name: joi.string(),
    description: joi.string(),
    questionsPerTestInstance: joi.number().integer().min(0),
    timeLimit: joi.number().integer().min(0),
  }),
  create: joi.object().keys({
    id: joi.string().guid(),
    name: joi.string().required(),
    description: joi.string().required(),
    questionsPerTestInstance: joi.number().integer().min(0).required(),
    timeLimit: joi.number().integer().min(0).required(),
    questionModels: joi.array().items(questionModel).allow(null),
  }),
  addRating: joi.object().keys({
    rating: joi.number().integer().min(0).max(5).required(),
  }),
  addComment: joi.object().keys({
    text: joi.string().max(255).required(),
  }),
  findSortQuery: joi.object().keys({
    find: joi.string().max(20),
    sort: joi.string().allow(...Object.keys(sortTypes)),
  }),
}
