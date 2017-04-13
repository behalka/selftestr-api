const expect = require('../common/chai')
const generate = require('../data/generate')
const resetDb = require('../data/cleaner')
const userService = require('../../src/services/user-service')
const errors = require('../../src/common/errors')

describe.skip('userService', () => {

  beforeEach(resetDb)

  it('should create a new user', async () => {
    const login = generate.login()
    const user = await userService.register(login)

    expect(user.id).to.be.a('number')
    expect(user.email).to.equal(login.email)
  })

  it('should not allow creating duplicate user', async () => {
    const login = generate.login()

    // Create first one
    await userService.register(login)

    // Create conflict
    expect(userService.register(login)).to.be.rejectedWith(errors.ConflictError)
  })
})
