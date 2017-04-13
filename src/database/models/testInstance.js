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
      allowNull: true,
      field: 'user_id',
    },
    testModelId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'test_model_id',
    },
  }, {
    timestamps: true,
    /* tyto fields musi mit underscored notaci aby fungoval autom. update updated_at flagu */
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'test_instance',
    classMethods: {
      associate: function(models) {
        this.hasMany(models.questionInstance, { foreignKey: 'testInstanceId' })
        this.belongsTo(models.testModel)
      },
    },
  })


