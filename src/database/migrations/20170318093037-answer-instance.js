/* eslint-disable camelcase */

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('answer_instance', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      question_instance_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'question_instance',
          key: 'id',
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
      },
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
      is_selected: {
        allowNull: true,
        type: Sequelize.BOOLEAN,
        defaultValue: null,
      },
    })
  },
  down(queryInterface) {
    return queryInterface.dropTable('answer_instance')
  },
}
