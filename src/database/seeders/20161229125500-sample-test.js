/* eslint-disable camelcase */
import { nextUuid, getUuid } from '../helper'

export default {
  up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('test_model', [
      {
        id: nextUuid('testModel'),
        name: 'test 1',
        user_id: getUuid('user', 0),
      },
      {
        id: nextUuid('testModel'),
        name: 'test 2',
        user_id: getUuid('user', 0),
      },
    ], {})
    .then(() => queryInterface.bulkInsert('question_model', [
      {
        id: nextUuid('questionModel'),
        test_model_id: getUuid('testModel', 0),
        question_text: 'how many ..?',
        explanation: 'I am an explanation',
        question_type: 'textInput',
      },
    ], {}))
    .then(() => queryInterface.bulkInsert('answer_model', [
      {
        id: nextUuid('answerModel'),
        question_model_id: getUuid('questionModel', 0),
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
