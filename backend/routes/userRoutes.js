const express = require('express');
const { loginUser, registerUser, getAllUsers } = require('../controllers/userController');
const authenticateToken = require('../middlewares/authMiddleware');
const User = require('../models/User');
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
router.put('/update', authenticateToken, async (req, res) => {
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

    await user.update({name, email});

    return res.json({message: "Usuario actualizado correctamente.", user});
  } catch (error) {
    console.error(error);
    res.status(500).json({message: error.message})
  }
})

// Ruta con proteccion
router.get('/dashboard', authenticateToken, async (req, res) => {
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
})

module.exports = router;