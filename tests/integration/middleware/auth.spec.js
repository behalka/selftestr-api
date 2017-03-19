const request = require('supertest-koa-agent')
const resetHelper = require('../../data/cleaner')
const helpers = require('../../data/entities/index')
const app = require('../../../src/app')
const crypto = require('../../../src/utils/crypto')

describe('auth middleware - editor/:test_model_id endpoint', () => {
  let test
  let accessToken
  beforeEach(async () => {
    test = await helpers.testModel.create()
    accessToken = crypto.generateAccessToken(test.userId, 'behalkar')
  })
  afterEach(() => resetHelper.resetDb())
  it('returns 401 on missing authorization header', () =>
    request(app)
    .get(`/tests/${test.id}`)
    .expect(401)
  )
  it('returns 401 on malformed authorization header', () =>
    request(app)
    .get(`/tests/${test.id}`)
    .set('Authorization', 'not_a_token')
    .expect(401)
  )
  it('returns 401 on a token with unknown user id', async () => {
    const token = await crypto.generateAccessToken(test.id, 'fake_username')
    request(app)
    .get(`/tests/${test.id}`)
    .set('Authorization', token)
    .expect(401)
  })
  it('returns 401 on a malformed token', async () => {
    let token = await crypto.generateAccessToken(test.userId, 'behalkar')
    token = token.concat('abc')
    request(app)
    .get(`/tests/${test.id}`)
    .set('Authorization', token)
    .expect(401)
  })
  // eslint-disable-next-line func-names
  it('returns 401 on an expired token', function(done) {
    this.timeout(7000)
    setTimeout(() => {
      request(app)
      .get(`/tests/${test.id}`)
      .set('Authorization', accessToken)
      .expect(401)
      .then(() => {
        done()
      })
    }, 5000)
  })
  it('returns 200 with a valid token', async () => {
    const token = await crypto.generateAccessToken(test.userId, 'behalkar')
    request(app)
    .get(`/tests/${test.id}`)
    .set('Authorization', token)
    .expect(200)
  })
})
