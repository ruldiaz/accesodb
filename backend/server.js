const express = require('express');
const sequelize = require('./config/sequelize');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const cors = require('cors');

dotenv.config(); // Se cargan variables de entorno

const corsOptions = {
   origin: ['http://localhost:3000','https://accesodb.onrender.com', "https://accesodb-frontend.onrender.com"],
   credentials: true,
   methods: ['GET', 'POST'],
   allowHeaders: ['Content-Type', 'Authorization']
}

const app = express();

app.use(cors(corsOptions));
app.use(express.json());

sequelize.sync()
   .then(()=>console.log('Database connected and synchronized'))
   .catch((error)=>console.log('Error synchronizing to db', error));

app.use(express.json());

app.use('/api/users', userRoutes);

app.listen(5000, ()=>{
   console.log("Server running on port 5000, on http://localhost:5000");
})