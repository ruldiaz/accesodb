const jwt = require('jsonwebtoken');

// Middleware para validar JWT
const authenticateToken = (req, res, next) => {
   const token = req.header('Authorization');
   if(!token){
      return res.status(401).json({message: 'Acceso denegado, se requiere el token.'});
   }

   jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if(err) return res.status(403).json({message: 'Token invalido.'});
      req.user = user;
      next();
   })
}

module.exports = authenticateToken;