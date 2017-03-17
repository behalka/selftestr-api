const compose = require('koa-compose')
const middleware = require('../middleware/index')
const schema = require('../validation/schema/index')
const testService = require('../services/test-service')

/**
 * todo:
 * pristupova prava
 * zamykani editace
 * pagination
 */
module.exports = {
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
    middleware.validation.validateBody(schema.testModels.create),
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
