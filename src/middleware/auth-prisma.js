const jwt = require('jsonwebtoken');
const UserService = require('../services/userService');

// Middleware d'authentification JWT pour Prisma
const authenticateJWTPrisma = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      status: 'error',
      message: 'Accès refusé. Token manquant.'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    const user = await UserService.findById(decoded.id);
    
    if (!user) {
      return res.status(403).json({
        status: 'error',
        message: 'Utilisateur non trouvé.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({
      status: 'error',
      message: 'Token invalide ou expiré.'
    });
  }
};

// Exporter le middleware
module.exports = authenticateJWTPrisma;
