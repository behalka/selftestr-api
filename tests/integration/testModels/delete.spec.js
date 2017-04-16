const _ = require('lodash')
const request = require('supertest-koa-agent')
const expect = require('../../common/chai').expect
const db = require('../../../src/database/index')

const resetHelper = require('../../data/cleaner')
const authHelper = require('../../data/auth')
const helpers = require('../../data/entities/index')
const app = require('../../../src/app')

describe('DELETE editor/:test_model_id - deletes testModel', () => {
  let model
  let token
  let user
  beforeEach(async () => {
    await resetHelper.resetDb()
    model = await helpers.testModel.create()
    token = await authHelper.generateToken()
    user = helpers.user.getModelUser()
  })
  it('deletes testModel', async () => {
    await request(app)
    .delete(`/editor/${model.id}`)
    .set({ Authorization: token })
    .expect(200)
    const result = await db.testModel.findOne({ id: model.id })
    expect(result).to.be.null()
  })
  it('returns 404 if testModel does not exist', async () => {
    const fakeModelId = user.id
    await request(app)
    .delete(`/editor/${fakeModelId}`)
    .set({ Authorization: token })
    .expect(404)
  })
})
