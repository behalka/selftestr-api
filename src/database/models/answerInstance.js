module.exports = (sequelize, DataTypes) =>
  sequelize.define('answerInstance', {
    id: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    questionInstanceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'question_instance_id',
    },
    text: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'answer_text',
    },
    isCorrect: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: 'is_correct',
    },
    correctSolution: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'correct_solution',
    },
    isSelected: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: null,
      field: 'is_selected',
    },
  }, {
    timestamps: false,
    tableName: 'answer_instance',
    classMethods: {
      associate: function(models) {
        this.belongsTo(models.questionInstance)
      },
    },
  })
