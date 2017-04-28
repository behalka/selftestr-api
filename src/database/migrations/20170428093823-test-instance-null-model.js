/* eslint-disable camelcase */

module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.resolve()
    // fixme: napsat pomoci sql
    // return queryInterface.changeColumn('test_instance', 'test_model_id', {
    //   type: Sequelize.UUID,
    //   allowNull: true,
    // })
  },
  down(queryInterface) {
    return queryInterface.dropTable('test_instance')
  },
}
