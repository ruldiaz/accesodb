const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
   `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@localhost:5432/accesodb`,{
   logging: false,
   native: false
})

module.exports = sequelize;