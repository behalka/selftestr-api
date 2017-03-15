/* eslint-disable camelcase */

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('question_model', {
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
    return queryInterface.dropTable('question_model')
  },
}
