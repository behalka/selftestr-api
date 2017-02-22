import compose from 'koa-compose'
import middleware from '../middleware'
import schema from '../validation/schema'
import testService from '../services/test-service'

/**
 * todo:
 * pristupova prava
 * zamykani editace
 * pagination
 */
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
  update: compose([]),
  getMetadata: compose([
    // returns description, metadata of an test
  ]),
  getComments: compose([
    // ...
  ]),
}
