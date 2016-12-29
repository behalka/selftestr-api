import compose from 'koa-compose'
import middleware from '../middleware'
import schema from '../validation/schema'
import testService from '../services/test-service'

export default {
  get: compose([
    async ctx => {
      const test = await testService.get(ctx.params.test_id)

      ctx.status = 200
      ctx.body = { test }
    },
  ]),
  list: compose([
    async ctx => {
      const tests = await testService.getAll()
      ctx.status = 200
      ctx.body = tests
    },
  ]),
  create: compose([
    async ctx => {
      const body = ctx.request.body
      const test = await testService.createTest(body)

      ctx.status = 201
      ctx.body = {
        test,
      }
    },
  ]),
  addQuestion: compose([
    async ctx => {
      const body = ctx.request.body
      const testId = ctx.params.test_id
      const question = await testService.addQuestion(testId, body)
      ctx.status = 201
      ctx.body = {
        question,
      }
    },
  ]),
  updateQuestion: compose([
    async ctx => {
      console.log('todo')
      ctx.status = 200
    },
  ]),
  deleteQuestion: compose([
    async ctx => {
      console.log('todo')
      ctx.status = 200
    },
  ]),
}
