export default function(sequelize, DataTypes) {
  return sequelize.define('Test', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // wtf velkym pismenem??
    // prozkoumat express priklad od nich - kdy/jak cizi klice vznikaji
    // nemaji je v migraci a pouzivaji sync
    // jak to omezit - mit to v migraci ale ne tady ..
    // vytvorit nejaky seeders
    UserId: {
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
    tableName: 'tests',
    classMethods: {
      associate: function(models) {
        this.belongsTo(models.User)
      },
    },
  })
}
