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

    expect(res.body).to.have.keys(['accessToken', 'profile'])
    expect(res.body.profile).to.include.keys(['id', 'email', 'createdAt', 'updatedAt', 'username'])
    expect(res.body.profile).to.not.include.keys(['password'])
    expect(res.body.profile.email).to.equal(user.email)
    expect(res.body.profile.username).to.equal(user.username)
  })
  it('should return 400 when user payload is not valid', () => {
    const user = _.omit(helpers.user.getModelUser(), ['id', 'password'])
    return request(app)
      .post('/users')
      .send(user)
      .expect(400)
  })
})
