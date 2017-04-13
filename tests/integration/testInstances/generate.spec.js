const request = require('supertest-koa-agent')
const expect = require('../../common/chai').expect

const resetHelper = require('../../data/cleaner')
const authHelper = require('../../data/auth')
const helpers = require('../../data/entities/index')
const app = require('../../../src/app')

describe('POST /tests/models/:test_model_id - generate test instance', () => {
  beforeEach(() => resetHelper.resetDb())
  it('returns testInstance with default number of questions', async () => {
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
    expect(instance.questionInstances).to.be.a('array')
    expect(instance.questionInstances.length).to.equal(2)
  })
  it('returns testInstance with selected number of questions', async () => {
    const model = await helpers.testModel.create()
    const token = await authHelper.generateToken()

    const res = await request(app)
    .get(`/tests/models/${model.id}`)
    .query({ questions: 1 })
    .set('Authorization', token)
    .expect(200)

    const instance = res.body
    expect(instance.questionInstances).to.be.a('array')
    expect(instance.questionInstances.length).to.equal(1)

  })
  it('falls back to default when query param is more than total count', async () => {
    const model = await helpers.testModel.create()
    const token = await authHelper.generateToken()

    const res = await request(app)
    .get(`/tests/models/${model.id}`)
    .query({ questions: 55 })
    .set('Authorization', token)
    .expect(200)

    const instance = res.body
    expect(instance.questionInstances).to.be.a('array')
    expect(instance.questionInstances.length).to.equal(2)
  })
  it('falls back to total count when default is more than total count', async () => {
    const model = await helpers.testModel.create()
    const token = await authHelper.generateToken()
    await model.update({
      questionsPerTestInstance: 55,
    })
    const res = await request(app)
    .get(`/tests/models/${model.id}`)
    .set('Authorization', token)
    .expect(200)

    const instance = res.body
    expect(instance.questionInstances).to.be.a('array')
    expect(instance.questionInstances.length).to.equal(2)
  })
  it('returns 404 if we are trying to generate from unknown test model', async () => {
    const token = await authHelper.generateToken()
    await request(app)
    .get('tests/models/not-a-testModel-id')
    .set('Authorization', token)
    .expect(404)
  })
})
