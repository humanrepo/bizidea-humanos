const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');

// Configuration Helmet pour les en-têtes de sécurité
const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
});

// Configuration CORS pour les origines frontend
const corsConfig = cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
});

// Rate limiting - 100 requêtes/15min par IP
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limite de 100 requêtes par fenêtre
  message: {
    status: 'error',
    message: 'Trop de requêtes depuis cette IP, veuillez réessayer dans 15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Validation des entrées avec express-validator
const validateInput = (validations) => {
  return async (req, res, next) => {
    try {
      // Exécuter les validations
      await Promise.all(validations.map(validation => validation.run(req)));

      // Vérifier les erreurs de validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          status: 'error',
          message: 'Données d\'entrée invalides',
          errors: errors.array()
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

// Protection contre les injections XSS
const xssProtection = (req, res, next) => {
  // Nettoyer les données d'entrée pour prévenir les attaques XSS
  const cleanInput = (data) => {
    if (typeof data === 'string') {
      return data.replace(/</g, '<').replace(/>/g, '>');
    }
    return data;
  };

  // Nettoyer les paramètres de requête, body et query
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      req.body[key] = cleanInput(req.body[key]);
    });
  }

  if (req.query) {
    Object.keys(req.query).forEach(key => {
      req.query[key] = cleanInput(req.query[key]);
    });
  }

  if (req.params) {
    Object.keys(req.params).forEach(key => {
      req.params[key] = cleanInput(req.params[key]);
    });
  }

  next();
};

// Middleware pour valider les emails
const validateEmail = body('email')
  .isEmail()
  .withMessage('Veuillez fournir un email valide')
  .normalizeEmail();

// Middleware pour valider les mots de passe
const validatePassword = body('password')
  .isLength({ min: 8 })
  .withMessage('Le mot de passe doit contenir au moins 8 caractères')
  .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
  .withMessage('Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre');

// Export des middlewares de sécurité
module.exports = {
  helmetConfig,
  corsConfig,
  rateLimiter,
  validateInput,
  xssProtection,
  validateEmail,
  validatePassword
};
