const compose = require('koa-compose')
const middleware = require('../middleware')
const schema = require('../validation/schema')
const testService = require('../services/test-service')

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
  create: compose([
    /** 
    * generate a test with given params
    * from a testModel, store it and return it
    */
  ]),
  evaluate: compose([
    /**
     * get results for a test and send them back
     */
  ]),
}
