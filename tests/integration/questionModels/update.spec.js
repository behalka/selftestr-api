const _ = require('lodash')
const request = require('supertest-koa-agent')
const expect = require('../../common/chai').expect

const resetHelper = require('../../data/cleaner')
const authHelper = require('../../data/auth')
const helpers = require('../../data/entities/index')
const app = require('../../../src/app')
const db = require('../../../src/database/index')

describe('PATCH editor/:test_id/questions/:id - update questionModel', () => {
  let token
  let user
  let testModel
  beforeEach(async () => {
    await resetHelper.resetDb()
    testModel = await helpers.testModel.create()
    token = await authHelper.generateToken()
    user = helpers.user.getModelUser()
  })
  it('updates questionModel fields', async () => {
    // const question = helpers.testModel.getAnotherQuestion()

    const questionId = testModel.questionModels[0].id
    const payload = {
      text: 'hello',
      answerModels: [],
    }
    const res = await request(app)
    .patch(`/editor/${testModel.id}/questions/${questionId}`)
    .set({ Authorization: token })
    .send(payload)
    .expect(200)
    const result = res.body
    expect(result).to.contain.all.keys(['text', 'id', 'type'])
    expect(result.text).to.equal(payload.text)
  })
  it('updates already created answerModel', async () => {
    // const question = helpers.testModel.getAnotherQuestion()
    const questionId = testModel.questionModels[0].id
    const answerId = testModel.questionModels[0].answerModels[0].id
    const payload = {
      answerModels: [{
        id: answerId,
        correctSolution: 'hello',
      }],
    }
    const res = await request(app)
    .patch(`/editor/${testModel.id}/questions/${questionId}`)
    .set({ Authorization: token })
    .send(payload)
    .expect(200)
    const result = res.body
    expect(result.answerModels.length).to.equal(1)
    const answer = result.answerModels[0]
    expect(answer.id).to.equal(payload.answerModels[0].id)
    expect(answer.correctSolution).to.equal(payload.answerModels[0].correctSolution)
  })
  it('creates new answer', async () => {
    // const question = helpers.testModel.getAnotherQuestion()
    const answer = helpers.testModel.getAnotherAnswer()
    const answerId = testModel.questionModels[0].answerModels[0].id
    const questionId = testModel.questionModels[0].id
    const payload = {
      answerModels: [
        answer, // new answer
        { id: answerId },
        { id: testModel.questionModels[0].answerModels[1].id },
      ],
    }
    let inDb = await db.questionModel.findOne({
      where: { id: questionId },
      include: [db.answerModel],
    })
    expect(inDb.answerModels.length).to.equal(2)
    const res = await request(app)
    .patch(`/editor/${testModel.id}/questions/${questionId}`)
    .set({ Authorization: token })
    .send(payload)
    .expect(200)

    const result = res.body
    expect(result.answerModels.length).to.equal(3)
    inDb = await db.questionModel.findOne({
      where: { id: questionId },
      include: [db.answerModel],
    })
    expect(inDb.answerModels.length).to.equal(3)
  })
  it('deletes answers that are not listed in the payload', async () => {
    const answerId = testModel.questionModels[0].answerModels[0].id
    const questionId = testModel.questionModels[0].id
    const payload = {
      answerModels: [
        // only one answer
        { id: answerId },
      ],
    }
    let inDb = await db.questionModel.findOne({
      where: { id: questionId },
      include: [db.answerModel],
    })
    expect(inDb.answerModels.length).to.equal(2)
    const res = await request(app)
    .patch(`/editor/${testModel.id}/questions/${questionId}`)
    .set({ Authorization: token })
    .send(payload)
    .expect(200)

    const result = res.body
    expect(result.answerModels.length).to.equal(1)
    inDb = await db.questionModel.findOne({
      where: { id: questionId },
      include: [db.answerModel],
    })
    expect(inDb.answerModels.length).to.equal(1)
  })
})
