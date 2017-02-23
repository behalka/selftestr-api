export default function(sequelize, DataTypes) {
  return sequelize.define('answerModel', {
    id: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },    
    questionModelId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'question_model_id',
    },
    text: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'answer_text',
    },
    isCorrect: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'is_correct',
    },
    correctSolution: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'correct_solution',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: new Date(),      
      field: 'created_at',
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: new Date(),      
      field: 'updated_at',
    },
  }, {
    tableName: 'answer_model',
    classMethods: {
      associate: function(models) {
        this.belongsTo(models.questionModel)
      },
    },
  })
}
