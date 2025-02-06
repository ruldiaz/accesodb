const express = require('express');
const sequelize = require('./config/sequelize');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');

dotenv.config(); // Se cargan variables de entorno

const app = express();

sequelize.sync()
   .then(()=>console.log('Database connected and synchronized'))
   .catch((error)=>console.log('Error synchronizing to db', error));

app.use(express.json());

app.use('/api/users', userRoutes);

app.listen(5000, ()=>{
   console.log("Server running on port 5000, on http://localhost:5000");
})