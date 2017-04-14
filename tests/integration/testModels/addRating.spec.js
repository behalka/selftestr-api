const _ = require('lodash')
const request = require('supertest-koa-agent')
const expect = require('../../common/chai').expect

const resetHelper = require('../../data/cleaner')
const authHelper = require('../../data/auth')
const helpers = require('../../data/entities/index')
const app = require('../../../src/app')

describe('POST testModels/:id/ratings - add testModel rating', () => {
  let token
  let model
  beforeEach(async () => {
    await resetHelper.resetDb()
    token = await authHelper.generateToken()
    model = await helpers.testModel.create()
  })
  after(() => resetHelper.resetDb)
  it('adds a rating to a testModel with anonymous user', async () => {
    const testModelId = model.id
    const payload = {
      rating: 3,
    }
    const res = await request(app)
    .post(`/testModels/${testModelId}/ratings`)
    .send(payload)
    .expect(201)

    const response = res.body
    expect(response).to.contain.all.keys(['id', 'testModelId', 'userId', 'rating', 'created_at', 'updated_at'])
    expect(response.rating).to.equal(3)
    expect(response.testModelId).to.equal(testModelId)
    expect(response.userId).to.be.null()
  })
  it('adds a rating to a testModel with logged user', async () => {
    const testModelId = model.id
    const userId = helpers.user.getModelUser().id
    const payload = {
      rating: 3,
    }
    const res = await request(app)
    .post(`/testModels/${testModelId}/ratings`)
    .set({ Authorization: token })
    .send(payload)
    .expect(201)

    const response = res.body
    expect(response.userId).to.equal(userId)
  })
  it('returns 404 when testModel does not exist', async () => {
    const userId = helpers.user.getModelUser().id
    const payload = {
      rating: 3,
    }
    const res = await request(app)
    .post(`/testModels/${userId}/ratings`)
    .set({ Authorization: token })
    .send(payload)
    .expect(404)

    const response = res.body
    expect(response.type).to.equal('E_NOTFOUND_TEST')
  })
  it('returns 400 when rating is of invalid type', async () => {
    const testModelId = model.id
    const payload = {
      rating: 'abc',
    }
    await request(app)
    .post(`/testModels/${testModelId}/ratings`)
    .send(payload)
    .expect(400)
  })
  it('returns 400 when rating is bigger than 5', async () => {
    const testModelId = model.id
    const payload = {
      rating: 6,
    }
    await request(app)
    .post(`/testModels/${testModelId}/ratings`)
    .send(payload)
    .expect(400)
  })
  it('returns 400 when rating is less than 0', async () => {
    const testModelId = model.id
    const payload = {
      rating: -1,
    }
    await request(app)
    .post(`/testModels/${testModelId}/ratings`)
    .send(payload)
    .expect(400)
  })
})
