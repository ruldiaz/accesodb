const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const {validationResult} = require('express-validator');
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { Op } = require("sequelize");


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

const forgotPassword = async (req, res) => {
   try {
     const { email } = req.body;
 
     const user = await User.findOne({ where: { email } });
     if (!user) {
       return res.status(400).json({ message: "No existe una cuenta con ese correo." });
     }
 
     const resetToken = crypto.randomBytes(32).toString("hex");
     user.resetToken = resetToken;
     user.resetTokenExpires = new Date(Date.now() + 3600000); // 1 hora
     await user.save();
 
     const transporter = nodemailer.createTransport({
       service: "gmail",
       auth: {
         user: process.env.EMAIL_USER,
         pass: process.env.EMAIL_PASS,
       },
     });
 
     // url para restablecer contraseña
     const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
 
     // Enviar el correo de recuperacion
     const mailOptions = {
       from: process.env.EMAIL_USER,
       to: email,
       subject: "Recuperación de contraseña",
       html: `<p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
              <a href="${resetUrl}">${resetUrl}</a>
              <p>Si no solicitaste este cambio, ignora este mensaje.</p>`,
     };
 
     // Enviar correo
     await transporter.sendMail(mailOptions);
 
     res.json({ message: "Correo de recuperación enviado con éxito." });
 
   } catch (error) {
     console.error("Error en forgotPassword:", error);
     res.status(500).json({ message: "Error en el servidor." });
   }
 };

 const resetPassword = async (req, res) => {
   try {
     const { token } = req.params;
     const { password } = req.body;
 
     // Buscar usuario con el token valido
     const user = await User.findOne({ where: { resetToken: token, resetTokenExpires: { [Op.gt]: new Date() } } });
 
     if (!user) {
       return res.status(400).json({ message: "El enlace ha expirado o es inválido." });
     }
 
     // Hash a la nueva contraseña
     const hashedPassword = await bcrypt.hash(password, 10);
     user.password = hashedPassword;
 
     // Eliminar el token de recuperacion
     user.resetToken = null;
     user.resetTokenExpires = null;
     await user.save();
 
     res.json({ message: "Contraseña restablecida con éxito." });
 
   } catch (error) {
     console.error("Error en resetPassword:", error);
     res.status(500).json({ message: "Error en el servidor." });
   }
 };
 

module.exports = {
   loginUser,
   registerUser,
   getAllUsers,
   updateUser,
   getUserDashboard,
   forgotPassword,
   resetPassword
}