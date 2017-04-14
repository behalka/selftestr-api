const _ = require('lodash')
const request = require('supertest-koa-agent')
const expect = require('../../common/chai').expect

const resetHelper = require('../../data/cleaner')
const authHelper = require('../../data/auth')
const helpers = require('../../data/entities/index')
const app = require('../../../src/app')

describe('POST testModels/:id/comments - add testModel comment', () => {
  let token
  let model
  let user
  beforeEach(async () => {
    await resetHelper.resetDb()
    token = await authHelper.generateToken()
    model = await helpers.testModel.create()
    user = helpers.user.getModelUser()
  })
  after(() => resetHelper.resetDb)
  it('adds a comment to a testModel with logged user', async () => {
    const testModelId = model.id
    const payload = {
      text: 'comment',
    }
    const res = await request(app)
    .post(`/testModels/${testModelId}/comments`)
    .set({ Authorization: token })
    .send(payload)
    .expect(201)

    const response = res.body
    expect(response).to.contain.all.keys(['id', 'testModelId', 'userId', 'text', 'created_at', 'updated_at'])
    expect(response.text).to.equal('comment')
    expect(response.testModelId).to.equal(testModelId)
    expect(response.userId).to.equal(user.id)
  })
  it('returns 401 when user is not logged', async () => {
    const testModelId = model.id
    const payload = {
      text: 'comment',
    }
    await request(app)
    .post(`/testModels/${testModelId}/comments`)
    .send(payload)
    .expect(401)
  })
  it('returns 400 on invalid body payload', async () => {
    const testModelId = model.id
    const payload = {
      unknownField: 'comment',
    }
    await request(app)
    .post(`/testModels/${testModelId}/comments`)
    .set({ Authorization: token })
    .send(payload)
    .expect(400)
  })
  it('returns 404 on unknown testModel', async () => {
    const anotherId = user.id
    const payload = {
      text: 'comment',
    }
    await request(app)
    .post(`/testModels/${anotherId}/comments`)
    .set({ Authorization: token })
    .send(payload)
    .expect(404)
  })
})
