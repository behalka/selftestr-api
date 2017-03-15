/* eslint-disable camelcase */
import { nextUuid } from '../helper'

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('user', [
      {
        username: 'tester',
        email: 'test@test.com',
        id: nextUuid('user'),
      },
    ], {})
  },
  down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('user', null, {})
  },
}
