module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('comment', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      test_model_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'test_model',
          key: 'id',
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'user',
          key: 'id',
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
      },
      text: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
    })
  },
  down(queryInterface) {
    return queryInterface.dropTable('comment')
  },
}
