const _ = require('lodash')
const request = require('supertest-koa-agent')
const expect = require('../../common/chai').expect

const resetHelper = require('../../data/cleaner')
const authHelper = require('../../data/auth')
const helpers = require('../../data/entities/index')
const app = require('../../../src/app')

function generate(model) {
  const test = helpers.testInstance.getModelTest()
  test.testModelId = model.id
  delete test.id
  const questions = helpers.testInstance.getQuestions()
  .map(question => {
    delete question.id
    delete question.testInstanceId
    return question
  })
  const answers = helpers.testInstance.getAnswers()
  .map(answer => {
    delete answer.id
    delete answer.questionInstanceId
    return answer
  })
  questions[0].answerInstances = answers
  test.questionInstances = questions
  return test
}

describe('/POST tests/ - add test instance', () => {
  let token
  let model
  beforeEach(async () => {
    await resetHelper.resetDb()
    token = await authHelper.generateToken()
    model = await helpers.testModel.create()
  })
  after(() => resetHelper.resetDb)
  it('creates a test instance', async () => {
    const payload = generate(model)
    const res = await request(app)
                .post('/tests')
                .set('Authorization', token)
                .send(payload)
                .expect(201)
    const test = res.body
    expect(test).to.contain.keys(['id', 'name', 'questionInstances'])
    expect(test.questionInstances).to.be.a('array')
    expect(test.questionInstances.length).to.equal(1)
    expect(test.questionInstances[0]).to.contain.keys(['answeredCorrectly', 'answerInstances', 'testInstanceId'])
    expect(test.questionInstances[0].answerInstances).to.be.a('array')
    expect(test.questionInstances[0].answerInstances.length).to.equal(2)
  })
  it('returns 400 when testModelId is missing', async () => {
    const payload = generate(model)
    delete payload.testModelId
    await request(app)
    .post('/tests')
    .set('Authorization', token)
    .send(payload)
    .expect(400)
  })
  it('creates testInstance when userId is missing', async () => {
    const payload = generate(model)
    delete payload.userId
    await request(app)
    .post('/tests')
    .set('Authorization', token)
    .send(payload)
    .expect(201)
  })
  it('creates testInstance when userId is null', async () => {
    const payload = generate(model)
    payload.userId = null
    await request(app)
    .post('/tests')
    .set('Authorization', token)
    .send(payload)
    .expect(201)
  })
})
