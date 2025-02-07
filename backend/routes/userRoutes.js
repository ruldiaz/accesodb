const express = require('express');
const { loginUser, registerUser, getAllUsers } = require('../controllers/userController');
const authenticateToken = require('../middlewares/authMiddleware');
const User = require('../models/User');

const router = express.Router();

router.post('/login', loginUser);
router.post('/register', registerUser);
router.get('/list', getAllUsers);

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