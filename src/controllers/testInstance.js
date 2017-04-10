const compose = require('koa-compose')
const middleware = require('../middleware')
const schema = require('../validation/schema')
const testService = require('../services/testInstance-service')
const log = require('../common/logger')

const data = require('../utils/data/testInstance')

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
    async ctx => {
      const testModelId = ctx.params.test_model_id
      const user = ctx.request.user
      const instance = await testService.generate(testModelId, user ? user.id : null)

      ctx.status = 200
      ctx.body = instance
    },
  ]),
  /*
   * Adds and saves a test instance that was generated via client.
   */
  add: compose([
    ctx => {
      const testInstance = ctx.request.body
      log.debug(testInstance, 'saving generated')
      ctx.status = 201
    },
  ]),
  /*
   * updates/saves already created test instance
   */
  save: compose([
    ctx => {
      log.debug('test instance saved')
      ctx.status = 200
    },
  ]),
  evaluate: compose([
    /**
     * get results for a test and send them back
     */
  ]),
}
