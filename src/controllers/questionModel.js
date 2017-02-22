import compose from 'koa-compose'
import middleware from '../middleware'
import schema from '../validation/schema'
import service from '../services/question-service'

export default {
  get: compose([
    async ctx => {
      const body = ctx.request.body
      const questionId = ctx.params.questionId
      console.log(questionId)
      // const question = await service.add(testId, body)
      ctx.status = 201
      ctx.body = {
        foo: 4
        // question,
      }
    }
  ]),
  list: compose([]),
  add: compose([
    async ctx => {
      const body = ctx.request.body
      const testId = ctx.params.test_id
      console.log(testId)
      const question = await service.add(testId, body)
      ctx.status = 201
      ctx.body = {
        question,
      }
    },
  ]),
  update: compose([]),
  delete: compose([]),
  /**
   * Answers will be managed from here
   */
  updateAnswers: compose([]),
}
