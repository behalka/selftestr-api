const questionTypes = require('../enums/questionTypes')

module.exports = (sequelize, DataTypes) =>
  sequelize.define('questionInstance', {
    id: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    testInstanceId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'test_instance_id',
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
    answeredCorrectly: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: null,
      field: 'answered_correctly',
    },
    type: {
      type: DataTypes.ENUM(...questionTypes),
      allowNull: false,
      field: 'question_type',
    },
  }, {
    timestamps: false,
    tableName: 'question_instance',
    classMethods: {
      associate: function(models) {
        this.hasMany(models.answerInstance, { foreignKey: 'questionInstanceId' })
        this.belongsTo(models.testInstance)
      },
    },
  })
