/* eslint-disable camelcase */

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.changeColumn('test_model', 'questions_per_test_instance', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: null,
    })
  },
  down(queryInterface) {
    return queryInterface.dropTable('test_model')
  },
}
