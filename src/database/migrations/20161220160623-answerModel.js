/* eslint-disable camelcase */

export default {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('answer_model', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      question_model_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'question_model',
          key: 'id',
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
      },
      /* tohle bude label proste */
      /* v pripade text input tam nic byt nemusi */
      answer_text: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      is_correct: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
      },
      correct_solution: {
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
  },
  down(queryInterface) {
    return queryInterface.dropTable('answer_model')
  },
}
