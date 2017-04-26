const _ = require('lodash')
const request = require('supertest-koa-agent')
const expect = require('../../common/chai').expect
const resetHelper = require('../../data/cleaner')
const helpers = require('../../data/entities/index')
const app = require('../../../src/app')

describe('POST /users - register a user', () => {
  beforeEach(() => resetHelper.resetDb())
  it('creates a new user', async () => {
    const user = _.omit(helpers.user.getModelUser(), 'id')
    const res = await request(app)
    .post('/users')
    .send(user)
    .expect(201)

    expect(res.body).to.have.keys(['token', 'user'])
    expect(res.body.user).to.include.keys(['id', 'email', 'createdAt', 'updatedAt', 'username'])
    expect(res.body.user).to.not.include.keys(['password'])
    expect(res.body.user.email).to.equal(user.email)
    expect(res.body.user.username).to.equal(user.username)
  })
  it('should return 400 when user payload is not valid', () => {
    const user = _.omit(helpers.user.getModelUser(), ['id', 'password'])
    return request(app)
      .post('/users')
      .send(user)
      .expect(400)
  })
})
