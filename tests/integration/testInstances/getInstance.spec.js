const _ = require('lodash')
const request = require('supertest-koa-agent')
const expect = require('../../common/chai').expect

const resetHelper = require('../../data/cleaner')
const authHelper = require('../../data/auth')
const helpers = require('../../data/entities/index')
const app = require('../../../src/app')

describe('GET /tests/:test_instance_id - get test instance', () => {
  beforeEach(() => resetHelper.resetDb())
  it('returns a testInstance', async () => {
    const instanceModel = await helpers.testInstance.create()
    const token = await authHelper.generateToken()

    const res = await request(app)
    .get(`/tests/${instanceModel.id}`)
    .set('Authorization', token)
    .expect(200)

    const instance = res.body

    expect(instance).to.contain.all
      .keys(['id', 'name', 'testModelId', 'createdAt', 'updatedAt', 'userId', 'questionInstances'])
    const questions = instance.questionInstances
    expect(questions).to.be.instanceof(Array)
    expect(questions.length).to.equal(1)
    expect(questions[0]).to.contain.all
      .keys(['id', 'text', 'explanation', 'testInstanceId', 'type', 'answerInstances', 'answeredCorrectly'])
    expect(_.omit(questions[0], 'answerInstances')).to.eql(helpers.testInstance.getQuestions()[0])
    const answers = questions[0].answerInstances
    expect(answers).to.be.instanceof(Array)
    expect(answers.length).to.equal(2)
    expect(answers[0]).to.contain.all.keys(['id', 'questionInstanceId', 'text', 'isSelected', 'isCorrect', 'userInput'])
    expect(answers).to.eql(helpers.testInstance.getAnswers())
  })
  it('returns 404 if we are trying to generate from unknown test model', async () => {
    const token = await authHelper.generateToken()
    await request(app)
    .get('tests/not-a-testModel-id')
    .set('Authorization', token)
    .expect(404)
  })
})
