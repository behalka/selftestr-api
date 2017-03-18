/* eslint-disable camelcase */

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('user', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      username: { allowNull: false, type: Sequelize.STRING, unique: true },
      email: { allowNull: false, type: Sequelize.STRING, unique: true },
      password: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    })
    .then(() => queryInterface.createTable('test_model', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      description: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      time_limit: {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.INTEGER,
      },
      questions_per_test_instance: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 10,
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
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    }))
  },
  down(queryInterface) {
    return queryInterface.dropTable('test_model')
    .then(() => queryInterface.dropTable('user'))
  },
}
