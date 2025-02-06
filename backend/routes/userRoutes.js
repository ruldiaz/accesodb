const express = require('express');
const { loginUser, registerUser, getAllUsers } = require('../controllers/userController');
const authenticateToken = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/login', loginUser);
router.post('/register', registerUser);
router.get('/list', getAllUsers);

// Ruta con proteccion
router.get('/dashboard', authenticateToken, (req, res) => {
   res.json({message: 'Acceso permitido', user: req.user});
})

module.exports = router;