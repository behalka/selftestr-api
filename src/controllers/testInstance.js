const compose = require('koa-compose')
const middleware = require('../middleware/index')
const schema = require('../validation/schema/index')
const testService = require('../services/testInstance-service')
const log = require('../common/logger')

module.exports = {
  get: compose([
    async ctx => {
      const id = ctx.params.test_instance_id
      const testInstace = await testService.get(id)
      ctx.status = 200
      ctx.body = testInstace
    },
  ]),
  getResult: compose([
    async ctx => {
      const id = ctx.params.test_instance_id
      const testInstace = await testService.get(id)
      const correct = testInstace.questionInstances.reduce((acc, question) =>
        question.answeredCorrectly ? acc + 1 : acc, 0)
      const failed = testInstace.questionInstances.reduce((acc, question) =>
        question.answeredCorrectly === false || question.answeredCorrectly === null
        ? acc + 1
        : acc,
        0)
      const result = {
        correct,
        failed,
        takenAt: testInstace.updatedAt,
        id: testInstace.id,
        testModelId: testInstace.testModelId,
      }
      ctx.status = 200
      ctx.body = result
    },
  ]),
    /**
     * return resolved tests ---> history
     */
  getByUser: compose([
    /**
     * ....
     */
  ]),
  /*
  * generate a test with given params
  * from a testModel, store it and return it
  */
  generate: compose([
    middleware.validation.validateQs(schema.testInstances.generateInstanceQs),
    async ctx => {
      const testModelId = ctx.params.test_model_id
      const questionsCount = ctx.request.validatedQs.questions
      const user = ctx.request.user
      const instance = await testService
        .generate(testModelId, user ? user.id : null, questionsCount)

      ctx.status = 200
      ctx.body = instance
    },
  ]),
  /*
   * Adds and saves a test instance that was generated via client.
   */
  add: compose([
    middleware.validation.validateBody(schema.testInstances.addTestInstance),
    async ctx => {
      const payload = ctx.request.validatedBody
      const user = ctx.request.user

      const instance = await testService.add(Object.assign({}, payload, {
        userId: user.id ? user.id : null,
      }))
      ctx.status = 201
      ctx.body = instance
    },
  ]),
  /*
   * updates/saves already created test instance
   */
  saveResults: compose([
    middleware.validation.validateBody(schema.testInstances.saveResults),
    async ctx => {
      const user = ctx.request.user
      const updates = ctx.request.validatedBody
      const testId = ctx.params.test_instance_id
      const testUpdates = Object.assign({}, updates, { id: testId })
      const result = await testService.update(testUpdates, user)

      ctx.status = 200
      ctx.body = result
    },
  ]),
  testTimestamps: compose([
    async ctx => {
      // pri save() se updated prepise - MOZNA jsou nutne timestamps: true
      const testInstance = await testService.get(ctx.params.test_instance_id)
      testInstance.changed('updated_at', true)
      await testInstance.save()
      ctx.status = 200
    },
  ]),
}
