const _ = require('lodash')
const request = require('supertest-koa-agent')
const expect = require('../../common/chai').expect

const resetHelper = require('../../data/cleaner')
const authHelper = require('../../data/auth')
const helpers = require('../../data/entities/index')
const app = require('../../../src/app')

describe('POST editor/:test_id/questions - create questionModel', () => {
  let token
  let user
  let testModel
  beforeEach(async () => {
    await resetHelper.resetDb()
    testModel = await helpers.testModel.create()
    token = await authHelper.generateToken()
    user = helpers.user.getModelUser()
  })
  it('creates simple questionModel with basic properties', async () => {
    const question = helpers.testModel.getAnotherQuestion()
    const res = await request(app)
    .post(`/editor/${testModel.id}/questions`)
    .set({ Authorization: token })
    .send(question)
    .expect(201)
    const result = res.body
    const answerIds = result.answerModels.map(qs => qs.id)
    expect(answerIds.length).to.equal(1)
    expect(answerIds).to.include(question.answerModels[0].id)
  })
})
