export default function(sequelize, DataTypes) {
  return sequelize.define('questionModel', {
    id: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    testModelId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'test_model_id',
    },
    text: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'question_text',
    },
    explanation: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'question_type',
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
    tableName: 'question_model',
    classMethods: {
      associate: function(models) {
        this.hasMany(models.answerModel, { foreignKey: 'questionModelId' })
        this.belongsTo(models.testModel)
      },
    },
  })
}
