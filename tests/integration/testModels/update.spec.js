const _ = require('lodash')
const request = require('supertest-koa-agent')
const expect = require('../../common/chai').expect

const resetHelper = require('../../data/cleaner')
const authHelper = require('../../data/auth')
const helpers = require('../../data/entities/index')
const app = require('../../../src/app')

describe('PATCH editor/:test_model_id - updates testModel', () => {
  let model
  let token
  let user
  beforeEach(async () => {
    await resetHelper.resetDb()
    model = await helpers.testModel.create()
    token = await authHelper.generateToken()
    user = helpers.user.getModelUser()
  })
  it('updates testModel with basic properties', async () => {
    const payload = {
      description: 'nova',
      timeLimit: 6666,
    }
    const res = await request(app)
    .patch(`/editor/${model.id}`)
    .set({ Authorization: token })
    .send(payload)
    .expect(200)

    const result = res.body
    expect(result).to.contain.all.keys(['id', 'description', 'timeLimit'])
    expect(result).to.not.contain.all.keys(['questionModels'])
    expect(result.description).to.equal(payload.description)
    expect(result.timeLimit).to.equal(payload.timeLimit)
  })
  it('returns 404 if testModel does not exist', async () => {
    const payload = {
      name: 'foo',
    }
    const fakeModelId = user.id
    await request(app)
    .patch(`/editor/${fakeModelId}`)
    .set({ Authorization: token })
    .send(payload)
    .expect(404)
  })
  it('returns 401 if user is not found', async () => {
    const payload = {
      name: 'foo',
    }
    await request(app)
    .patch(`/editor/${model.id}`)
    .send(payload)
    .expect(401)
  })
  it('returns 400 on invalid payload', async () => {
    const payload = {
      bar: 'foo',
    }
    await request(app)
    .patch(`/editor/${model.id}`)
    .set({ Authorization: token })
    .send(payload)
    .expect(400)
  })
  it('returns 403 if user is not the owner', async () => {
    const payload = {
      name: 'foo',
    }
    const newUser = await helpers.user.createAnother()
    const newToken = await authHelper.generateTokenFrom(newUser)
    await request(app)
    .patch(`/editor/${model.id}`)
    .set({ Authorization: newToken })
    .send(payload)
    .expect(403)
  })
})
