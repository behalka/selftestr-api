module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('question_instance', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      question_text: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      explanation: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      question_type: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      test_instance_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'test_instance',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    }),
  down: queryInterface => queryInterface.dropTable('question_instance'),
}
