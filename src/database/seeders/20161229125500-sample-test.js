/* eslint-disable camelcase */

export default {
  up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('test_models', [
      {
        id: 1,
        name: 'test 1',
        user_id: 1,
      },
      {
        id: 2,
        name: 'test 2',
        user_id: 1,
      },
    ], {})
    .then(() => queryInterface.bulkInsert('question_models', [
      {
        id: 1,
        test_id: 1,
        question_text: 'how many ..?',
        explanation: 'I am an explanation',
        question_type: 'textInput',
      },
    ], {}))
    .then(() => queryInterface.bulkInsert('answer_models', [
      {
        id: 1,
        question_id: 1,
        is_correct: true,
        correct_solution: 'foo',
      },
    ], {}))
  },
  down(queryInterface) {
    return queryInterface.bulkDelete('test_models', { user_id: 1 }, {})
    .then(() => queryInterface.bulkDelete('question_models'), { id: 1 }, {})
    .then(() => queryInterface.bulkDelete('answer_models'), { id: 1 }, {})
  },
}
