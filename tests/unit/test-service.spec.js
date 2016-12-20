import { expect } from '../common/chai'
import generate from '../data/generate'
import { resetDb } from '../data/cleaner'
import testService from '../../src/services/test-service'
import userService from '../../src/services/user-service'
import * as errors from '../../src/common/errors'

describe('testService', () => {

  beforeEach(resetDb)

  it('should create a test', async () => {
    // @todo: refactor user setup for tests/other entities
    const user = await userService.register(generate.user())
    const id = user.get('id')
    const test = (await testService.createTest(Object.assign(generate.test(), { userId: id })))
      .get({ plain: true })
    expect(test).to.contain.all.keys(['id', 'userId', 'name'])
    expect(test.userId).to.eql(id)
  })

  it('should not create a test with an unknown user', async () => {
    expect(testService.createTest(Object.assign(generate.test(), { userId: 11 })))
      .to.be.rejectedWith(errors.NotFoundError)
  })

  it('should return one test based on id', async () => {
    const user = await userService.register(generate.user())
    const id = user.get('id')
    const test = await testService.createTest(Object.assign(generate.test(), { userId: id }))

    // returns values of the entity
    const found = (await testService.get(test.id)).get({ plain: true })
    expect(found).to.not.be.a('null')
    expect(found).to.contain.all.keys(['name', 'id', 'userId'])
    expect(found.name).to.eql(test.name)
  })

  it('should throw NotFound error when asking for unknown user id', async () => {
    expect(testService.get(111)).to.be.rejectedWith(errors.NotFoundError)
  })

  it('should return all tests as an array', async () => {
    const user = await userService.register(generate.user())
    const id = user.get('id')
    await testService.createTest(Object.assign(generate.test(), { userId: id }))
    await testService.createTest(Object.assign(generate.test(), { userId: id }))
    const tests = await testService.getAll()

    expect(tests).to.be.instanceOf(Array)
    expect(tests.length).to.be.equal(2)
  })
})
