const _ = require('lodash')
const request = require('supertest-koa-agent')
const expect = require('../../common/chai').expect

const resetHelper = require('../../data/cleaner')
const helpers = require('../../data/entities/index')
const app = require('../../../src/app')

describe('GET testModels/ - list testModel', () => {
  let model
  beforeEach(async () => {
    await resetHelper.resetDb()
    model = await helpers.testModel.create()
  })
  it('returns testModels with basic properties', async () => {
    const res = await request(app)
    .get('/testModels')
    .expect(200)
    const tests = res.body
    expect(tests).to.be.a('array')
    expect(tests.length).to.equal(1)
    const test = tests[0]
    expect(test).to.contain.all.keys(['id', 'name', 'created_at', 'updated_at',
      'questionsPerTestInstance', 'timeLimit', 'userId',
      'ratingCount', 'ratingValue', 'comments'])
    expect(test.name).to.equal(model.name)
  })
  // todo: sorts
  it('returns testModels that contain provided query in name', async () => {
    const res = await request(app)
    .get('/testModels')
    .query({ find: 'model' })
    .expect(200)
    const tests = res.body
    expect(tests).to.be.a('array')
    expect(tests.length).to.equal(1)
  })
})
