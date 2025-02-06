const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

class User extends Model {}

User.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value) {
        this.setDataValue('name', value.toLowerCase());
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'User', // El nombre del modelo en Sequelize
    tableName: 'users', // El nombre real de la tabla en la base de datos de postgres
    hooks: {
      beforeValidate: (user) => {
        if (user.name) {
          user.name = user.name.toLowerCase();
        }
      },
    },
  }
);

module.exports = User;
