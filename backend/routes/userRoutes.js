const express = require('express');
const { loginUser, registerUser, getAllUsers, updateUser, getUserDashboard } = require('../controllers/userController');
const authenticateToken = require('../middlewares/authMiddleware');
const {check} = require('express-validator');

const router = express.Router();

router.post('/login', loginUser);
router.post('/register', [
  check('name', 'El nombre es obligatorio.')
    .not().isEmpty(),
  check('email', 'El correo no es válido.').isEmail(),
  check('password','La contraseña debe tener al menos 6 caracteres.')
    .isLength({min: 6}),
],registerUser);
router.get('/list', getAllUsers);

// Editar datos de usuario
router.put('/update', authenticateToken, updateUser);

// Ruta con proteccion
router.get('/dashboard', authenticateToken, getUserDashboard);

module.exports = router;