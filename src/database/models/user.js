const crypto = require('../../utils/crypto')

module.exports = (sequelize, DataTypes) =>
  sequelize.define('user', {
    id: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      allowNull: true,
      type: DataTypes.STRING,
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
    tableName: 'user',
    classMethods: {
      associate: function(models) {
        this.hasMany(models.testModel)
      },
    },
    hooks: {
      async beforeCreate(user) {
        user.password = await crypto.hashPassword(user.password)
      },
    },
  })
