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
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'user_id',
    },
    questionsPerTestInstance: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      field: 'questions_per_test_instance',
    },
    timeLimit: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      field: 'time_limit',
    },
    ratingValue: {
      type: DataTypes.VIRTUAL,
    },
    ratingCount: {
      type: DataTypes.VIRTUAL,
    },
  }, {
    timestamps: true,
    /* tyto fields musi mit underscored notaci aby fungoval autom. update updated_at flagu */
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'test_model',
    classMethods: {
      associate: function(models) {
        this.hasMany(models.questionModel, {
          foreignKey: 'testModelId',
        })
        this.hasMany(models.comment, { foreignKey: 'testModelId' })
        this.belongsTo(models.user)
      },
    },
  })
}
