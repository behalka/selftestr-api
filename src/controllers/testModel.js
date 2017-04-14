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
  /*
   * Tohle je kompletni detail testModelu se vsim vsudy
   */
  getDetails: compose([
    async ctx => {
      let test = await testService.get(ctx.params.test_id)
      // we expect only one result due to the query content
      const { sum, count } = (await testService.getTestRanking(test.id))[0]
      test.ratingValue = sum / count
      test.ratingCount = count
      test = test.get({ plain: true })
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
      ctx.body = test
    },
  ]),
  list: compose([
    async ctx => {
      // todo: query validation - custom middleware
      const { find, sort } = ctx.query
      console.log(find, sort) // query params to perform the search
      const tests = await testService.getAll()
      for (const test of tests) {
        const { sum, count } = (await testService.getTestRanking(test.id))[0]
        test.ratingValue = sum / count
        test.ratingCount = count
      }
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
  addRating: compose([
    middleware.validation.validateBody(schema.testModels.addRating),
    async ctx => {
      const testId = ctx.params.test_id
      const user = ctx.request.user || null
      const payload = ctx.request.validatedBody
      const result = await testService.addRating(testId, user, payload.rating)

      ctx.status = 201
      ctx.body = result
    },
  ]),
  addComment: compose([
    async ctx => {
      const testId = ctx.params.test_id
      ctx.status = 200
      // fixme: return comment
      ctx.body = {
        testId,
      }
    },
  ]),
}
