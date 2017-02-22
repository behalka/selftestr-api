import compose from 'koa-compose'
import middleware from '../middleware'
import schema from '../validation/schema'
import service from '../services/question-service'

export default {
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
    }
  ]),
  /**
   * Answers will be managed from here
   */
  updateAnswers: compose([]),
}
