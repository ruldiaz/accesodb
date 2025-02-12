const express = require('express');
const { loginUser, registerUser, getAllUsers, updateUser, getUserDashboard, forgotPassword, resetPassword } = require('../controllers/userController');
const authenticateToken = require('../middlewares/authMiddleware');
const {check} = require('express-validator');

const router = express.Router();

// login
router.post('/login', loginUser);

// registro usuario nuevo
router.post('/register', [
  check('name', 'El nombre es obligatorio.')
    .not().isEmpty(),
  check('email', 'El correo no es válido.').isEmail(),
  check('password','La contraseña debe tener al menos 6 caracteres.')
    .isLength({min: 6}),
],registerUser);

// mostrar todos los usuarios, esta ruta no esta en el frontend aun, prueba en postman
router.get('/list', getAllUsers);

// Editar datos de usuario
router.put('/update', authenticateToken, updateUser);

// Ruta con proteccion
router.get('/dashboard', authenticateToken, getUserDashboard);

// recuperar contraseña
router.post('/forgot-password', forgotPassword);

// resetear contraseña
router.post('/reset-password/:token', resetPassword);

module.exports = router;