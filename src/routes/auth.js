const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authenticateJWT = require('../middleware/auth');
const { validateInput, validateEmail, validatePassword } = require('../middleware/security');

const router = express.Router();

// Route d'inscription
router.post('/register', validateInput([validateEmail, validatePassword]), async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        status: 'error',
        message: 'Cet email est déjà utilisé.'
      });
    }

    const newUser = new User({ email, password, firstName, lastName });
    await newUser.save();

    res.status(201).json({
      status: 'success',
      message: 'Utilisateur créé avec succès.',
      user: newUser
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erreur lors de la création de l\'utilisateur.',
      error: error.message
    });
  }
});

// Route de connexion
router.post('/login', validateInput([validateEmail, validatePassword]), async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        status: 'error',
        message: 'Identifiants invalides.'
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({
      status: 'success',
      message: 'Connexion réussie.',
      token
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
router.get('/me', authenticateJWT, (req, res) => {
  res.status(200).json({
    status: 'success',
    user: req.user
  });
});

// Exporter les routes
module.exports = router;
