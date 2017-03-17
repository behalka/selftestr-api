module.exports = (sequelize, DataTypes) =>
  sequelize.define('testInstance', {
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
    testModelId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'test_model_id',
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
    tableName: 'test_instance',
    classMethods: {
      associate: function(models) {
        // this.hasMany(models.questionModel, { foreignKey: 'testModelId' })
        this.belongsTo(models.testModel)
      },
    },
  })

