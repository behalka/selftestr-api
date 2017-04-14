module.exports = (sequelize, DataTypes) => {
  return sequelize.define('comment', {
    id: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    text: {
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
    tableName: 'comment',
    classMethods: {
      associate: function(models) {
        this.belongsTo(models.user)
        this.belongsTo(models.testModel)
      },
    },
  })
}
