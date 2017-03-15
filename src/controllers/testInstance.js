const compose = require('koa-compose')
const middleware = require('../middleware')
const schema = require('../validation/schema')
const testService = require('../services/test-service')

const data = require('../utils/data/testInstance')

module.exports = {
  get: compose([
    /**
     * return resolved tests ---> history
     */
  ]),
  getByUser: compose([
    /**
     * ....
     */
  ]),
  /*
  * generate a test with given params
  * from a testModel, store it and return it
  */
  create: compose([
    ctx => {
      const testModelId = ctx.params.test_model_id
      // params: test na okopirovani, auth
      ctx.status = 200
      ctx.body = Object.assign({}, data.test, { testModelId })
    },
  ]),
  evaluate: compose([
    /**
     * get results for a test and send them back
     */
  ]),
}
