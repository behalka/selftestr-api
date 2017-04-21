const _ = require('lodash')
const log = require('../common/logger')
const errors = require('../common/errors')
const db = require('../database')

module.exports = {
  get: async (id, testId) => {
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
  getAllPerTest: async testId => {
    const questions = await db.questionModel
    .findAll({
      where: {
        testModelId: testId,
      },
    })
    return questions
  },
  update: async (question, payload) => {
    /* vraci elementy z payload */
    const updateAnswers = _.intersectionBy(payload.answerModels, question.answerModels, 'id')
    /* vraci elementy z payload */
    const newAnswers = _.differenceBy(payload.answerModels, question.answerModels, 'id')
    /* vraci elementy z db */
    const deletedAnswers = _.differenceBy(question.answerModels, payload.answerModels, 'id')

    const result = await db.sequelize.transaction(async transaction => {
      for (const answer of updateAnswers) {
        log.debug(answer, 'answer to update')
        await db.answerModel.update(answer, {
          where: {
            id: answer.id,
          },
          transaction,
        })
      }
      for (const answer of newAnswers) {
        log.debug(answer, 'answer to create')
        try {
          await db.answerModel.create(Object.assign({}, answer, {
            questionModelId: question.id,
          }), {
            transaction,
          })
        } catch (err) {
          log.error(err, 'answer failed to create')
          if (err instanceof db.sequelize.ValidationError) {
            throw new errors.ValidationError(`Answer failed to create - ${err.message}`)
          } else {
            throw new errors.ApiError(`Answer failed to create - ${err.message}`)
          }
        }
      }
      for (const answer of deletedAnswers) {
        log.debug(answer.get({ plain: true }), 'answer to delete')
        await answer.destroy({ transaction })
      }
      delete payload.answerModels
      const questionModel = await db.questionModel.findOne({
        where: { id: question.id },
        include: [db.answerModel],
        transaction,
      })
      if (Object.keys(payload).length > 0) {
        const updatedQuestion = await questionModel.update(payload, {
          transaction,
          where: { id: question.id },
        })
        Object.assign(questionModel, updatedQuestion)
      } else {
        questionModel.changed('updated_at', true)
        await questionModel.save({ transaction })
      }
      return questionModel
    })
    return result
  },
  add: async (testId, question) => {
    const test = await db.testModel.findOne({ where: { id: testId } })
    if (!test) {
      throw new errors.NotFoundError('E_NOTFOUND_TEST', `Test id ${testId} does not exist.`)
    }
    const result = await db.questionModel.create(Object.assign(question, { testModelId: test.id }), {
      include: [db.answerModel],
    })
    return db.questionModel.findOne({
      where: { id: result.id },
      include: [db.answerModel],
    })
  },
  delete: async (id, testId) => {
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
}
