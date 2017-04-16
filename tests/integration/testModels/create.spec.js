const _ = require('lodash')
const request = require('supertest-koa-agent')
const expect = require('../../common/chai').expect

const resetHelper = require('../../data/cleaner')
const authHelper = require('../../data/auth')
const helpers = require('../../data/entities/index')
const app = require('../../../src/app')

describe('POST editor/ - create testModel', () => {
  let token
  let user
  beforeEach(async () => {
    await resetHelper.resetDb()
    token = await authHelper.generateToken()
    user = helpers.user.getModelUser()
  })
  it('creates simple testModel with basic properties', async () => {
    const model = helpers.testModel.getModelTest()
    delete model.userId
    const res = await request(app)
    .post('/editor')
    .set({ Authorization: token })
    .send(model)
    .expect(201)
    const test = res.body
    expect(test).to.contain.all.keys(['id', 'updated_at', 'created_at', 'name',
      'description', 'userId'])
    expect(test.userId).to.equal(user.id)
    expect(test.name).to.equal(model.name)
    expect(test.id).to.equal(model.id)
  })
  it('creates testModel with question', async () => {
    const model = helpers.testModel.getModelTest()
    const questionModel = helpers.testModel.getModelQuestion()
    model.questionModels = [questionModel]
    delete model.userId

    const res = await request(app)
    .post('/editor')
    .set({ Authorization: token })
    .send(model)
    const test = res.body
    expect(test).to.contain.all.keys(['id', 'updated_at', 'created_at', 'name',
      'description', 'userId', 'questionModels'])
    expect(test.questionModels).to.be.a('array')
    expect(test.questionModels.length).to.equal(1)
    const question = test.questionModels[0]
    expect(question).to.contain.keys(['id', 'answerModels'])
    expect(question.id).to.equal(questionModel.id)
    expect(question.answerModels).to.be.a('array')
    expect(question.answerModels.length).to.equal(2)
    expect(question.answerModels[0].id).to.equal(questionModel.answerModels[0].id)
    expect(question.answerModels[1].id).to.equal(questionModel.answerModels[1].id)
  })
  it('returns 400 on invalid input', async () => {
    const model = helpers.testModel.getModelTest()
    delete model.userId
    model.foo = 'bar'

    await request(app)
    .post('/editor')
    .set({ Authorization: token })
    .send(model)
    .expect(400)
  })
})
