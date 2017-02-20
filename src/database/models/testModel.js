export default function(sequelize, DataTypes) {
  return sequelize.define('testModel', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id',
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
