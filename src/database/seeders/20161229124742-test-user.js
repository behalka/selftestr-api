/* eslint-disable camelcase */
import { nextUuid } from '../helper'

export default {
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
