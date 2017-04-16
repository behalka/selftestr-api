/* eslint-disable camelcase */

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.addColumn('test_instance', 'description', {
      type: Sequelize.TEXT,
      allowNull: false,
      defaultValue: 'test desc',
    })
  },
  down(queryInterface) {
    return queryInterface.dropTable('test_instance')
  },
}
