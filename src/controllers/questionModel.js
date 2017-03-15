const compose = require('koa-compose')
const middleware = require('../middleware')
const schema = require('../validation/schema')
const service = require('../services/question-service')

module.exports = {
  get: compose([
    async ctx => {
      const questionId = ctx.params.question_id
      const testId = ctx.params.test_id

      const question = await service.get(questionId, testId)
      ctx.status = 201
      ctx.body = {
        question,
      }
    },
  ]),
  list: compose([
    async ctx => {
      const testId = ctx.params.test_id

      const questionsPerTest = await service.getAllPerTest(testId)
      ctx.status = 200
      ctx.body = questionsPerTest
    },
  ]),
  add: compose([
    async ctx => {
      const body = ctx.request.body
      const testId = ctx.params.test_id

      const question = await service.add(testId, body)
      ctx.status = 201
      ctx.body = {
        question,
      }
    },
  ]),
  update: compose([]),
  delete: compose([
    async ctx => {
      const questionId = ctx.params.question_id
      const testId = ctx.params.test_id

      const res = await service.delete(questionId, testId)
      ctx.status = 200
    },
  ]),
  setAnswers: compose([
    async ctx => {
      const body = ctx.request.body
      const questionId = ctx.params.question_id

      // todo: resolve deleted answers ..
      const answersToUpdate = body.filter(answer => answer.id)
      const answersToAdd = body.filter(answer => !answer.id)

      const created = await service.createAnswers(questionId, answersToAdd)
      const res = await service.updateAnswers(questionId, answersToUpdate)
      const updated = res[0][1]
      ctx.status = 201
      ctx.body = created.concat(updated)
    },
  ]),
  /**
   * Answers will be managed from here
   */
  updateAnswers: compose([]),
}
