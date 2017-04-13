/* eslint-disable camelcase */
const uuidHelper = require('./helper')

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('test_model', [
      {
        id: uuidHelper.nextUuid('testModel'),
        name: 'test 1',
        description: 'lorem ipsum',
        questions_per_test_instance: 2,
        user_id: uuidHelper.getUuid('user', 0),
      },
      {
        id: uuidHelper.nextUuid('testModel'),
        name: 'test 2',
        description: 'lorem ipsum dolor sit amet',
        questions_per_test_instance: 3,
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
      {
        id: uuidHelper.nextUuid('questionModel'),
        test_model_id: uuidHelper.getUuid('testModel', 0),
        question_text: 'Kolik ma pes nohou?',
        explanation: 'aletak',
        question_type: 'singlechoice',
      },
      {
        id: uuidHelper.nextUuid('questionModel'),
        test_model_id: uuidHelper.getUuid('testModel', 0),
        question_text: 'Kolik je 1+1?',
        explanation: 'aletak',
        question_type: 'singlechoice',
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
      {
        id: uuidHelper.nextUuid('answerModel'),
        question_model_id: uuidHelper.getUuid('questionModel', 1),
        answer_text: '4 nohy',
        is_correct: true,
      },
      {
        id: uuidHelper.nextUuid('answerModel'),
        question_model_id: uuidHelper.getUuid('questionModel', 1),
        answer_text: '1 nohu',
        is_correct: false,
      },
      {
        id: uuidHelper.nextUuid('answerModel'),
        question_model_id: uuidHelper.getUuid('questionModel', 2),
        answer_text: '11',
        is_correct: false,
      },
      {
        id: uuidHelper.nextUuid('answerModel'),
        question_model_id: uuidHelper.getUuid('questionModel', 2),
        answer_text: '2',
        is_correct: true,
      },
    ], {}))
  },
  down(queryInterface) {
    return queryInterface.bulkDelete('test_model', null, {})
    .then(() => queryInterface.bulkDelete('question_model'), null, {})
    .then(() => queryInterface.bulkDelete('answer_model'), null, {})
  },
}
