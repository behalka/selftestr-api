module.exports = (sequelize, DataTypes) => {
  return sequelize.define('testModel', {
    id: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },    
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'user_id',
    },
    questionsPerTestInstance: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10,
      field: 'questions_per_test_instance',
    },
    timeLimit: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      field: 'time_limit',
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
    tableName: 'test_model',
    classMethods: {
      associate: function(models) {
        this.hasMany(models.questionModel, { foreignKey: 'testModelId' })
        this.belongsTo(models.user)
      },
    },
  })
}
