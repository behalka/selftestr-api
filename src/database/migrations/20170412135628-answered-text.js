/* eslint-disable camelcase */

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.addColumn('answer_instance', 'user_input', {
      type: Sequelize.STRING,
      allowNull: true,
    })
  },
  down(queryInterface) {
    return queryInterface.dropTable('answer_instance')
  },
}
