/* eslint-disable camelcase */
const db = require('../../../src/database/index')
const userHelper = require('./user')

const user = userHelper.getModelUser()
const modelTest = {
  id: 'e646295e-a5f4-41c4-89ad-6258de0df130',
  name: 'Modelovy test',
  timeLimit: 5000,
  userId: user.id,
  questionsPerTestInstance: 2,
}

module.exports = {
  getModelTest: (props = {}) => Object.assign({}, modelTest, props),
  create: async (props = {}) => {
    await db.user.create(user)
    return db.testModel.create(Object.assign({}, modelTest, props))
  },
  clean: () => db.testModel.sync({ force: true }),
}
