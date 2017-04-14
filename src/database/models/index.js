const user = require('./user')
const testModel = require('./testModel')
const questionModel = require('./questionModel')
const answerModel = require('./answerModel')
const testInstance = require('./testInstance')
const questionInstance = require('./questionInstance')
const answerInstance = require('./answerInstance')
const rating = require('./rating')
const comment = require('./comment')

module.exports = {
  answerInstance,
  answerModel,
  comment,
  user,
  questionInstance,
  questionModel,
  rating,
  testInstance,
  testModel,
}
