const request = require('supertest-koa-agent')
const expect = require('../../common/chai').expect

const resetHelper = require('../../data/cleaner')
const authHelper = require('../../data/auth')
const helpers = require('../../data/entities/index')
const app = require('../../../src/app')

describe('POST /tests/models/:test_model_id - generate test instance', () => {
  beforeEach(() => resetHelper.resetDb())
  it('returns a simple generated testInstance', async () => {
    const model = await helpers.testModel.create()
    const token = await authHelper.generateToken()

    const res = await request(app)
    .get(`/tests/models/${model.id}`)
    .set('Authorization', token)
    .expect(200)

    const instance = res.body
    expect(instance).to.contain.all.keys(['id', 'name', 'testModelId', 'created_at', 'updated_at', 'userId'])
    expect(instance.name).to.equal(model.name)
    expect(instance.id).to.not.equal(model.id)
    expect(instance.testModelId).to.equal(model.id)
  })
  it('returns 404 if we are trying to generate from unknown test model', async () => {
    const token = await authHelper.generateToken()
    await request(app)
    .get('tests/models/not-a-testModel-id')
    .set('Authorization', token)
    .expect(404)
  })
})
