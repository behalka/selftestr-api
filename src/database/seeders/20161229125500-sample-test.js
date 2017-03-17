/* eslint-disable camelcase */
const uuidHelper = require('../helper')

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('test_model', [
      {
        id: uuidHelper.nextUuid('testModel'),
        name: 'test 1',
        user_id: uuidHelper.getUuid('user', 0),
      },
      {
        id: uuidHelper.nextUuid('testModel'),
        name: 'test 2',
        user_id: uuidHelper.getUuid('user', 0),
      },
    ], {})
    .then(() => queryInterface.bulkInsert('question_model', [
      {
        id: uuidHelper.nextUuid('questionModel'),
        test_model_id: uuidHelper.getUuid('testModel', 0),
        question_text: 'how many ..?',
        explanation: 'I am an explanation',
        question_type: 'text_input',
      },
    ], {}))
    .then(() => queryInterface.bulkInsert('answer_model', [
      {
        id: uuidHelper.nextUuid('answerModel'),
        question_model_id: uuidHelper.getUuid('questionModel', 0),
        answer_text: 'YES',
        is_correct: true,
        correct_solution: 'foo',
      },
    ], {}))
  },
  down(queryInterface) {
    return queryInterface.bulkDelete('test_model', null, {})
    .then(() => queryInterface.bulkDelete('question_model'), null, {})
    .then(() => queryInterface.bulkDelete('answer_model'), null, {})
  },
}
