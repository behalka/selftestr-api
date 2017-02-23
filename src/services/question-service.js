import log from '../common/logger'
import * as errors from '../common/errors'
import db from '../database'

export default {
  async get(id, testId) {
    const question = await db.questionModel
    .findOne({
      where: {
        id,
        testModelId: testId,
      },
      include: [{ model: db.answerModel }],
    })
    if (!question) {
      throw new errors.NotFoundError('E_NOTFOUND_QUESTION',
      `Question id ${id} not found under test id ${testId}`)
    }
    return question
  },
  async getAllPerTest(testId) {
    const questions = await db.questionModel
    .findAll({
      where: {
        testModelId: testId,
      },
      // todo: this might be useful in CRUD-only operations
      raw: true,
    })
    return questions
  },
  async add(testId, question) {
    // todo: spolecne s otazkou se musi vytvorit i sada odpovedi
    const test = await db.testModel.findOne({ where: { id: testId } })
    if (!test) {
      throw new errors.NotFoundError('E_NOTFOUND_TEST', `Test id ${testId} does not exist.`)
    }
    return db.questionModel.create({ ...question, testModelId: test.id })
  },
  async delete(id, testId) {
    const cnt = await db.questionModel.destroy({
      where: {
        id,
        testModelId: testId,
      },
    })
    if (cnt < 1) {
      throw new
        errors.NotFoundError('E_NOTFOUND_QUESTION', `Question id ${id} not found in test ${testId}`)
    }
  },
  async createAnswers(id, answers) {
    const question = await db.questionModel.findOne({ where: { id }})
    if (!question) {
      throw new errors.NotFoundError('E_NOTFOUND_QUESTION', `Question id ${id} was not found`)
    }
    // todo: this does not work - a bug with fields renaming
    // return db.answerModel.bulkCreate(input)
    // this is all a workaround - or we can remove the timestamps..
    const input = answers.map(answer => ({ ...answer, questionModelId: id }))
    return Promise.all(input.map(async answer => {
      const prom = await db.answerModel.create(answer)
      return prom
    }))
  },
  async updateAnswers(id, answers) {
    const question = await db.questionModel.findOne({ where: { id }})
    if (!question) {
      throw new errors.NotFoundError('E_NOTFOUND_QUESTION', `Question id ${id} was not found`)
    }
    const input = answers.map(answer => ({ ...answer, questionModelId: id }))
    return Promise.all(input.map(async answer => {
      const prom = await db.answerModel.update(answer, {
        where: { id: answer.id },
        returning: true,
      })
      return prom
    }))
  },
}
