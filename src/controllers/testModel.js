const compose = require('koa-compose')
const middleware = require('../middleware/index')
const schema = require('../validation/schema/index')
const testService = require('../services/test-service')
const service = require('../services/comment-service')
const log = require('../common/logger')

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
      test = (await testService.setRatings([test]))[0]

      ctx.status = 200
      ctx.body = test
    },
  ]),
  list: compose([
    middleware.validation.validateQs(schema.testModels.findSortQuery),
    async ctx => {
      const { find, sort } = ctx.query
      let tests = await testService.getAll(find, sort)
      tests = await testService.setRatings(tests)
      ctx.status = 200
      ctx.body = tests
    },
  ]),
  create: compose([
    middleware.validation.validateBody(schema.testModels.create),
    async ctx => {
      const body = ctx.request.validatedBody
      const test = await testService.createTest(body, ctx.request.user)

      ctx.status = 201
      ctx.body = test
    },
  ]),
  update: compose([
    middleware.validation.validateBody(schema.testModels.update),
    middleware.auth.userIsOwner('testModel', 'test_model_id'),
    async ctx => {
      const payload = ctx.request.validatedBody
      const testModel = ctx.request.entity

      const result = await testService.update(testModel, payload)
      ctx.status = 200
      ctx.body = result
    },
  ]),
  delete: compose([
    middleware.auth.userIsOwner('testModel', 'test_model_id'),
    async ctx => {
      const testModel = ctx.request.entity
      await testModel.destroy()
      ctx.status = 200
    },
  ]),
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
  /*
   * Potrebuje params: test_model_id a uzivatele (token) 
   */
  addComment: compose([
    middleware.validation.validateBody(schema.testModels.addComment),
    async ctx => {
      const testId = ctx.params.test_id
      const user = ctx.request.user
      const payload = ctx.request.validatedBody
      const comment = await service.add(payload, user, testId)

      ctx.status = 201
      ctx.body = comment
    },
  ]),
  /*
   * Potrebuje params: comment_id a uzivatele
   * Uzivatel musi byt autor komentare
   */
  deleteComment: compose([
    middleware.auth.userIsOwner('comment', 'comment_id'),
    async ctx => {
      const comment = ctx.request.entity
      await comment.destroy()
      ctx.status = 200
    },
  ]),
}
