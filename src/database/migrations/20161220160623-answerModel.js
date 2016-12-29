/* eslint-disable camelcase */

export default {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('answer_models', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      question_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'question_models',
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
    return queryInterface.dropTable('answer_models')
  },
}
