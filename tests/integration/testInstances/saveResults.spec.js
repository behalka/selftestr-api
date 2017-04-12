const _ = require('lodash')
const request = require('supertest-koa-agent')
const expect = require('../../common/chai').expect

const resetHelper = require('../../data/cleaner')
const authHelper = require('../../data/auth')
const helpers = require('../../data/entities/index')
const app = require('../../../src/app')

function generatePayload(instance) {
  const payload = {
    questionInstances: instance
      .get('questionInstances', { plain: true })
      .map(question => ({
        id: question.id,
        answeredCorrectly: false,
        answerInstances: question.answerInstances.map(answer => ({
          id: answer.id,
          isSelected: true,
        })),
      })),
  }
  return payload
}

describe('PUT /tests/:test_instance_id - save testInstance result', () => {
  let instance
  let token
  beforeEach(async () => {
    await resetHelper.resetDb()
    instance = await helpers.testInstance.create()
    token = await authHelper.generateToken()
  })
  it('saves correctly testInstance results', async () => {
    const payload = generatePayload(instance)
    const res = await request(app)
                .put(`/tests/${instance.id}`)
                .set('Authorization', token)
                .send(payload)
                .expect(200)
    const result = res.body
    expect(result).to.include.keys(['id', 'name', 'questionInstances'])
    expect(result.questionInstances[0].answeredCorrectly).to.equal(false)
    expect(result.questionInstances[0].answerInstances[0].isSelected).to.equal(true)
    expect(result.questionInstances[0].answerInstances[1].isSelected).to.equal(true)
  })
  it('returns validation error when fields are missing', async () => {
    const payload = generatePayload(instance)
    _.unset(payload, 'questionInstances[0].id')

    await request(app)
    .put(`/tests/${instance.id}`)
    .set('Authorization', token)
    .send(payload)
    .expect(400)
  })
  it('returns validation error when there are unknown fields', async () => {
    const payload = generatePayload(instance)
    payload.foo = 'bar'

    await request(app)
    .put(`/tests/${instance.id}`)
    .set('Authorization', token)
    .send(payload)
    .expect(400)
  })
  it('returns validation error when answeredCorrectly is missing', async () => {
    const payload = generatePayload(instance)
    _.unset(payload, 'questionInstances[0].answeredCorrectly')

    await request(app)
    .put(`/tests/${instance.id}`)
    .set('Authorization', token)
    .send(payload)
    .expect(400)
  })
  it('returns validation error when answeredCorrectly is not boolean', async () => {
    const payload = generatePayload(instance)
    payload.questionInstances[0].answeredCorrectly = null

    await request(app)
    .put(`/tests/${instance.id}`)
    .set('Authorization', token)
    .send(payload)
    .expect(400)
  })
  it('doesn\'t update results when isSelected/userInput is missing', async () => {
    const payload = generatePayload(instance)
    _.unset(payload, 'questionInstances[0].answerInstances[0].isSelected')
    _.unset(payload, 'questionInstances[0].answerInstances[1].isSelected')

    const res = await request(app)
                .put(`/tests/${instance.id}`)
                .set('Authorization', token)
                .send(payload)
                .expect(200)
    const result = res.body
    expect(result).to.include.keys(['id', 'name', 'questionInstances'])
    expect(result.questionInstances[0].answerInstances[0].isSelected).to.equal(null)
    expect(result.questionInstances[0].answerInstances[1].isSelected).to.equal(null)
  })
  it('doesn\'t update results when isSelected/userInput is set to null', async () => {
    const payload = generatePayload(instance)
    payload.questionInstances[0].answerInstances[0].isSelected = null
    payload.questionInstances[0].answerInstances[1].isSelected = null
    payload.questionInstances[0].answerInstances[1].userInput = null

    const res = await request(app)
                .put(`/tests/${instance.id}`)
                .set('Authorization', token)
                .send(payload)
                .expect(200)
    const result = res.body

    expect(result).to.include.keys(['id', 'name', 'questionInstances'])
    expect(result.questionInstances[0].answeredCorrectly).to.equal(false)
    expect(result.questionInstances[0].answerInstances[0].isSelected).to.equal(null)
    expect(result.questionInstances[0].answerInstances[1].isSelected).to.equal(null)
    expect(result.questionInstances[0].answerInstances[1].userInput).to.equal(null)
  })
})
