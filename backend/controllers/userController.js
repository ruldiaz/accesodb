const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const {validationResult} = require('express-validator');

const loginUser =  async(req, res) => {
   try {
      const {email, password} = req.body;
      const user = await User.findOne({where: {email}});
      if(!user || !(await bcrypt.compare(password, user.password))){
         return res.status(400).json({message: 'Usuario  o contraseña incorrecta'});
      }

      // Genera JWT
      const token = jwt.sign({id: user.id, email: user.email}, process.env.JWT_SECRET, {expiresIn: '1h'});

      // Envia el token a traves de cookies para frontend
      res.cookie('token', token, {
         httpOnly: true,
         secure: true,
         sameSite: 'none',
         domain: 'accesodb.onrender.com',
         maxAge: 60 * 60 * 1000 // 1h
      })
      res.json({message: 'Login correcto.', token});

   } catch (error) {
      console.error('Error de login: ', error);
      res.status(500).json({message: error.message});
   }
}

const getAllUsers = async (req, res) => {
   try {
      const users = await User.findAll({attributes: {exclude: ['password']}});
      res.status(200).json(users.length > 0 ? users : {message: 'No hay usuarios registrados.'});   
   }catch(error) {
      console.error('Error al mostrar usuarios.');
      res.status(500).json({message: error.message});
   }  
}

const registerUser = async (req, res) => {
   try {
      const errors = validationResult(req);
      if(!errors.isEmpty()){
         return res.status(400).json({errors: errors.array()});
      }
      const {name, email, password} = req.body;

      // Validar la existencia previa del usuario
      const userExists = await User.findOne({where: {email}});
      if(userExists){
         return res.status(400).json({message: 'Usuario ya existe en la base de datos.'})
      }

      // Encriptar con bcrypt la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      // Guardar en db
      const newUser = await User.create({name, email, password: hashedPassword})

      res.status(201).json({message: 'Usuario guardado de manera exitosa.', user: newUser})
   } catch (error) {
      console.error('Error registrando usuario: ', error);
      res.status(500).json({message: error.message});
   }
}

const updateUser = async (req, res) => {
   try {
      const {name, email} = req.body;
  
      if(!name || !email){
        return res.status(400).json({message: "El nombre y el correo son obligatorios."});
      }
  
      const user = await User.findByPk(req.user.id, {
        attributes: {exclude: ['password']}
      });
  
      if(!user){
        return res.status(401).json({message: "Usuario no encontrado."})
      }
  
      if(user.email !== email.toLowerCase()){
        const existingEmailUser = await User.findOne({where: {email}});
   
        if(existingEmailUser && existingEmailUser.id !== user.id){
          return res.status(400).json({message: "El correo que ingresaste no está disponible."});
        }
      }
  
      await user.update({name, email});
  
      return res.json({message: "Usuario actualizado correctamente.", user});
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({ message: "El correo ya está registrado." });
      }
      
      console.error(error);
      res.status(500).json({ message: "Hubo un problema al actualizar el usuario." });
    }
}

const getUserDashboard = async (req, res) => {
   try {
      const user = await User.findByPk(req.user.id, {
        attributes: {exclude: ['password']}
      }); 
      if (!user) {
        return res.status(401).json({ message: "Usuario no encontrado" });
      }
      res.json({user});
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error en el servidor" });
    }
}

module.exports = {
   loginUser,
   registerUser,
   getAllUsers,
   updateUser,
   getUserDashboard
}