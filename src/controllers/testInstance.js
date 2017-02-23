import compose from 'koa-compose'
import middleware from '../middleware'
import schema from '../validation/schema'
import testService from '../services/test-service'

export default {
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
