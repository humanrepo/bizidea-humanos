const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware d'authentification JWT
const authenticateJWT = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      status: 'error',
      message: 'Accès refusé. Token manquant.'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password'); // Exclure le mot de passe
    next();
  } catch (error) {
    return res.status(403).json({
      status: 'error',
      message: 'Token invalide ou expiré.'
    });
  }
};

// Exporter le middleware
module.exports = authenticateJWT;
