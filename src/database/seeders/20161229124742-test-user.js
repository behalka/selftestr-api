/* eslint-disable camelcase */

export default {
  up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('users', [
      {
        username: 'tester',
        email: 'test@test.com',
        id: 1,
      },
    ], {})
  },
  down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('test_model', null, {})
  },
}
