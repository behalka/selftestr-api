const request = require('supertest-koa-agent')
const resetHelper = require('../../data/cleaner')
const authHelper = require('../../data/auth')
const helpers = require('../../data/entities/index')
const app = require('../../../src/app')

describe('DELETE comments/:id - delete user comment', () => {
  let token
  let model
  let user
  let comment
  beforeEach(async () => {
    await resetHelper.resetDb()
    token = await authHelper.generateToken()
    model = await helpers.testModel.create()
    user = helpers.user.getModelUser()
    comment = await helpers.comment.addComment('comment', model.id, user.id)
  })
  after(() => resetHelper.resetDb)
  it('deletes a previously created comment', async () => {
    const commentId = comment.id
    await request(app)
    .delete(`/comments/${commentId}`)
    .set({ Authorization: token })
    .expect(200)
  })
  it('sends 401 on missing user', async () => {
    const commentId = comment.id
    await request(app)
    .delete(`/comments/${commentId}`)
    .expect(401)
  })
  it('sends 404 on missing comment', async () => {
    const falseCommentId = user.id
    await request(app)
    .delete(`/comments/${falseCommentId}`)
    .set({ Authorization: token })
    .expect(404)
  })
  it('sends 403 on user that is not the owner comment', async () => {
    const commentId = comment.id
    const newUser = await helpers.user.createAnother()
    const newToken = await authHelper.generateTokenFrom(newUser)

    await request(app)
    .delete(`/comments/${commentId}`)
    .set({ Authorization: newToken })
    .expect(403)
  })
})
