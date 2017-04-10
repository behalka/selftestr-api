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
  getDetails: compose([
    async ctx => {
      let test = await testService.get(ctx.params.test_id)
      // todo: remove this
      test = test.get({ plain: true })
      test.review = {
        stars: 4.2,
        count: 123,
      }
      test.comments = [
        {
          text: 'this is a comment',
          author: {
            id: '3e8c384f-2c19-4ea2-bc0b-02f0fe784ba2',
            username: 'behalkar',
            createdAt: new Date(),
          }
        },
        {
          text: 'this is another comment',
          author: {
            id: '3e8c384f-2c19-4ea2-bc0b-02f0fe784ba3',
            username: 'kalinja',
            createdAt: new Date(),
          }
        }
      ]
      ctx.status = 200
      ctx.body = { test }
    }
  ]),
  list: compose([
    async ctx => {
      const { find, sort } = ctx.query
      console.log(find, sort) // query params to perform the search
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
