const { Sequelize } = require('sequelize');
require("dotenv").config();

//const sql = neon(process.env.DATABASE_URL);

/*
const sequelize = new Sequelize(
   `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@localhost:5432/accesodb`,{
   logging: false,
   native: false
})
*/
const sequelize = new Sequelize(
   process.env.DATABASE_URL,{
   logging: false,
   native: false
})



module.exports = sequelize;







