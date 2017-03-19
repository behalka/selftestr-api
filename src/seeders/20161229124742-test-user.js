/* eslint-disable camelcase */
const uuidHelper = require('./helper')

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('user', [
      {
        username: 'tester',
        email: 'test@test.com',
        password: 'password',
        id: uuidHelper.nextUuid('user'),
      },
    ], {})
  },
  down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('user', null, {})
  },
}
