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
   allowedHeaders: ['Authorization', 'Content-Type']
}

const app = express();

app.use(cors(corsOptions));
app.use(express.json());

sequelize.sync()
   .then(()=>console.log('Database connected and synchronized'))
   .catch((error)=>console.log('Error synchronizing to db', error));

app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
   console.log(`Server running on port ${PORT}`);
})