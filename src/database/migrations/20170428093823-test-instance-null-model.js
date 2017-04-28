/* eslint-disable camelcase */

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.changeColumn('test_instance', 'test_model_id', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'test_model',
        key: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    })
  },
  down(queryInterface) {
    return queryInterface.dropTable('test_instance')
  },
}
