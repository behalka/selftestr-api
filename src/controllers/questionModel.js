const compose = require('koa-compose')
const middleware = require('../middleware/index')
const schema = require('../validation/schema/index')
const service = require('../services/question-service')
const errors = require('../common/errors')
const log = require('../common/logger')

module.exports = {
  get: compose([
    async ctx => {
      const questionId = ctx.params.question_id
      const testId = ctx.params.test_model_id

      const question = await service.get(questionId, testId)
      ctx.status = 201
      ctx.body = question
    },
  ]),
  list: compose([
    async ctx => {
      const testId = ctx.params.test_model_id

      const questionsPerTest = await service.getAllPerTest(testId)
      ctx.status = 200
      ctx.body = questionsPerTest
    },
  ]),
  add: compose([
    middleware.validation.validateBody(schema.questionModels.addQuestion),
    middleware.auth.userIsOwner('testModel', 'test_model_id'),
    async ctx => {
      const body = ctx.request.body
      const testId = ctx.params.test_model_id

      const question = await service.add(testId, body)
      ctx.status = 201
      ctx.body = question
    },
  ]),
  update: compose([
    middleware.validation.validateBody(schema.questionModels.updateQuestion),
    middleware.auth.userIsOwner('testModel', 'test_model_id'),
    async ctx => {
      const payload = ctx.request.validatedBody
      const testModel = ctx.request.entity
      const questionId = ctx.params.question_model_id
      const question = await service.get(questionId, testModel.id)

      const result = await service.update(question, payload)
      ctx.status = 200
      ctx.body = result
    },
  ]),
  delete: compose([
    middleware.auth.userIsOwner('testModel', 'test_model_id'),
    async ctx => {
      const questionId = ctx.params.question_model_id
      const testId = ctx.params.test_model_id

      const res = await service.delete(questionId, testId)
      ctx.status = 200
    },
  ]),
}
