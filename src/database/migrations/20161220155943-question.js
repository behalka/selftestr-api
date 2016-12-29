/* eslint-disable camelcase */

export default {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('question_models', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      test_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'test_models',
          key: 'id',
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
      },
      question_text: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      explanation: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      /* todo: ciselnik s typy nekam bokem */
      /* pres datovy typ enum nebo zvlast tabulku */
      question_type: {
        allowNull: false,
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
  },
  down(queryInterface) {
    return queryInterface.dropTable('question_models')
  },
}
