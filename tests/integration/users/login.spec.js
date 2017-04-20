const _ = require('lodash')
const request = require('supertest-koa-agent')
const expect = require('../../common/chai').expect
const resetHelper = require('../../data/cleaner')
const helpers = require('../../data/entities/index')
const app = require('../../../src/app')

describe('POST /login', () => {
  beforeEach(() => resetHelper.resetDb())
  it('logs in - sends access token', async () => {
    await helpers.user.create()
    const user = _.pick(helpers.user.getModelUser(), ['username', 'password'])
    const res = await request(app)
    .post('/login')
    .send(user)
    .expect(200)

    expect(res.body).to.have.keys(['token', 'user'])
  })
  it('should return 400 when user payload is not valid', () => {
    const user = _.pick(helpers.user.getModelUser(), ['email', 'password'])
    return request(app)
      .post('/login')
      .send(user)
      .expect(400)
  })
})
