const _ = require('lodash')
const request = require('supertest-koa-agent')
const expect = require('../../common/chai').expect

const resetHelper = require('../../data/cleaner')
const authHelper = require('../../data/auth')
const helpers = require('../../data/entities/index')
const app = require('../../../src/app')
const db = require('../../../src/database/index')

describe('DELETE editor/:test_id/questions/:id - delete questionModel', () => {
  let token
  let user
  let testModel
  beforeEach(async () => {
    await resetHelper.resetDb()
    testModel = await helpers.testModel.create()
    token = await authHelper.generateToken()
    user = helpers.user.getModelUser()
  })
  it('deletes questionModel', async () => {
    const questionId = testModel.questionModels[0].id
    let inDb = await db.questionModel.findOne({
      where: { id: questionId },
      include: [db.answerModel],
    })
    expect(inDb.answerModels.length).to.equal(2)
    await request(app)
    .delete(`/editor/${testModel.id}/questions/${questionId}`)
    .set({ Authorization: token })
    .expect(200)

    inDb = await db.questionModel.findOne({
      where: { id: questionId },
      include: [db.answerModel],
    })
    expect(inDb).to.be.null()
  })
  it('returns 404 when testModel is unknown', async () => {
    const questionId = testModel.questionModels[0].id
    await request(app)
    .delete(`/editor/${user.id}/questions/${questionId}`)
    .set({ Authorization: token })
    .expect(404)
  })
  it('returns 404 when questionModel is unknown', async () => {
    const questionId = testModel.id
    await request(app)
    .delete(`/editor/${testModel.id}/questions/${questionId}`)
    .set({ Authorization: token })
    .expect(404)
  })
})
