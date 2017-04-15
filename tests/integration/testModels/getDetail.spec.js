const _ = require('lodash')
const request = require('supertest-koa-agent')
const expect = require('../../common/chai').expect

const resetHelper = require('../../data/cleaner')
const helpers = require('../../data/entities/index')
const app = require('../../../src/app')

describe('GET testModels/:id - get testModel', () => {
  let model
  beforeEach(async () => {
    await resetHelper.resetDb()
    model = await helpers.testModel.create()
  })
  it('returns testModel with basic properties', async () => {
    const id = model.id
    const res = await request(app)
    .get(`/testModels/${id}`)
    .expect(200)

    const test = res.body
    expect(test).to.contain.all.keys(
      ['id', 'questionModels', 'comments', 'name', 'userId',
        'questionsPerTestInstance', 'timeLimit', 'updated_at', 'created_at',
        'ratingValue', 'ratingCount', 'description', 'comments'])
    expect(test.name).to.equal(model.name)
    expect(test.timeLimit).to.equal(model.timeLimit)
    expect(test.questionsPerTestInstance).to.equal(model.questionsPerTestInstance)
    expect(test.comments).to.be.a('array')
    expect(test.questionModels).to.be.a('array')
    expect(test.questionModels.length).to.equal(2)
  })
  it('returns testModel with computed ranking', async () => {
    const id = model.id
    await helpers.rating.addRating(5, id)
    await helpers.rating.addRating(1, id)
    const res = await request(app)
    .get(`/testModels/${id}`)
    .expect(200)

    const test = res.body
    expect(test).to.contain.all.keys(['ratingValue', 'ratingCount'])
    expect(test.ratingCount).to.equal(2)
    expect(test.ratingValue).to.equal((5 + 1) / 2)
  })
})
