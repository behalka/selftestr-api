const questionTypes = require('../enums/questionTypes')

module.exports = (sequelize, DataTypes) => {
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
      type: DataTypes.ENUM(...questionTypes),
      allowNull: false,
      field: 'question_type',
    },
  }, {
    tableName: 'question_model',
    timestamps: true,
    /* tyto fields musi mit underscored notaci aby fungoval autom. update updated_at flagu */
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    classMethods: {
      associate: function(models) {
        this.hasMany(models.answerModel, { foreignKey: 'questionModelId' })
        this.belongsTo(models.testModel)
      },
    },
  })
}
