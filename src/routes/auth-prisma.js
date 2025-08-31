const express = require('express');
const jwt = require('jsonwebtoken');
const authenticateJWTPrisma = require('../middleware/auth-prisma');
const { validateInput, validateEmail, validatePassword } = require('../middleware/security');
const UserService = require('../services/userService');

const router = express.Router();

// Route d'inscription avec Prisma
router.post('/register', validateInput([validateEmail, validatePassword]), async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  try {
    const userExists = await UserService.findByEmail(email);
    if (userExists) {
      return res.status(400).json({
        status: 'error',
        message: 'Cet email est déjà utilisé.'
      });
    }

    const newUser = await UserService.create({ email, password, firstName, lastName });

    res.status(201).json({
      status: 'success',
      message: 'Utilisateur créé avec succès.',
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role,
        createdAt: newUser.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erreur lors de la création de l\'utilisateur.',
      error: error.message
    });
  }
});

// Route de connexion avec Prisma
router.post('/login', validateInput([validateEmail, validatePassword]), async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserService.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Identifiants invalides.'
      });
    }

    const isPasswordValid = await UserService.verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'error',
        message: 'Identifiants invalides.'
      });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: '1h' });
    
    res.status(200).json({
      status: 'success',
      message: 'Connexion réussie.',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erreur lors de la connexion.',
      error: error.message
    });
  }
});

// Route pour récupérer le profil utilisateur
router.get('/me', authenticateJWTPrisma, async (req, res) => {
  try {
    const user = await UserService.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'Utilisateur non trouvé.'
      });
    }

    res.status(200).json({
      status: 'success',
      user
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erreur lors de la récupération du profil.',
      error: error.message
    });
  }
});

module.exports = router;
