const request = require('supertest-koa-agent')
const app = require('../../../src/app')
const expect = require('../../common/chai').expect

describe('status', () => {
  it('should return version of the app', async () => {
    const res = await request(app)
      .get('/')
      .expect(200)

    expect(res.body).to.have.keys(['start', 'version'])
  })
})
