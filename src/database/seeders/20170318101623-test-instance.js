/* eslint-disable camelcase */
const uuidHelper = require('../helper')

module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('test_model', [
      {
        id: uuidHelper.nextUuid('testModel'),
        name: 'Predloha testu 1',
        time_limit: 60000,
        description: 'dolor sit amet',
        user_id: uuidHelper.getUuid('user', 0),
      },
    ], {})
    .then(() => queryInterface.bulkInsert('test_instance', [
      {
        id: uuidHelper.nextUuid('testInstance'),
        test_model_id: uuidHelper.getUuid('testModel', 2),
        name: 'test instance 1',
        user_id: uuidHelper.getUuid('user', 0),
      },
    ], {}))
    .then(() => queryInterface.bulkInsert('question_instance', [
      {
        id: uuidHelper.nextUuid('questionInstance'),
        test_instance_id: uuidHelper.getUuid('testInstance', 0),
        question_text: '42?',
        explanation: 'I am an explanation',
        question_type: 'singlechoice',
      },
      {
        id: uuidHelper.nextUuid('questionInstance'),
        test_instance_id: uuidHelper.getUuid('testInstance', 0),
        question_text: 'Kolik řidičů má auto?',
        explanation: 'huehuehue',
        question_type: 'text_input',
      },
    ], {}))
    .then(() => queryInterface.bulkInsert('answer_instance', [
      {
        id: uuidHelper.nextUuid('answerInstance'),
        question_instance_id: uuidHelper.getUuid('questionInstance', 0),
        answer_text: 'Ano.',
        is_correct: true,
      },
      {
        id: uuidHelper.nextUuid('answerInstance'),
        question_instance_id: uuidHelper.getUuid('questionInstance', 0),
        answer_text: 'Ne.',
        is_correct: false,
      },
      {
        id: uuidHelper.nextUuid('answerInstance'),
        question_instance_id: uuidHelper.getUuid('questionInstance', 0),
        answer_text: 'Možná.',
        is_correct: false,
      },
      {
        id: uuidHelper.nextUuid('answerInstance'),
        question_instance_id: uuidHelper.getUuid('questionInstance', 1),
        answer_text: null,
        correct_solution: '1',
        is_correct: true,
      },
    ], {}))
  },
  down(queryInterface) {
    return queryInterface.bulkDelete('test_instance', null, {})
    .then(() => queryInterface.bulkDelete('question_instance'), null, {})
    .then(() => queryInterface.bulkDelete('answer_instance'), null, {})
  },
}
