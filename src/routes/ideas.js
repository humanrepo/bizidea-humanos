const express = require('express');
const { PrismaClient } = require('../generated/prisma');
const authenticateJWT = require('../middleware/auth');
const { validateInput } = require('../middleware/security');
const { body } = require('express-validator');

const router = express.Router();
const prisma = new PrismaClient();

// Validation des données pour la création/mise à jour d'idée
const validateIdea = [
  body('title')
    .isLength({ min: 5, max: 100 })
    .withMessage('Le titre doit contenir entre 5 et 100 caractères'),
  body('description')
    .isLength({ min: 10, max: 1000 })
    .withMessage('La description doit contenir entre 10 et 1000 caractères'),
  body('problem')
    .isLength({ min: 10, max: 500 })
    .withMessage('Le problème doit contenir entre 10 et 500 caractères'),
  body('solution')
    .isLength({ min: 10, max: 1000 })
    .withMessage('La solution doit contenir entre 10 et 1000 caractères'),
  body('targetMarket')
    .isLength({ min: 5, max: 200 })
    .withMessage('Le marché cible doit contenir entre 5 et 200 caractères'),
  body('uniqueValueProposition')
    .isLength({ min: 10, max: 300 })
    .withMessage('La proposition de valeur unique doit contenir entre 10 et 300 caractères'),
  body('businessModel')
    .isLength({ min: 10, max: 500 })
    .withMessage('Le modèle économique doit contenir entre 10 et 500 caractères'),
  body('competitors')
    .isLength({ min: 5, max: 300 })
    .withMessage('Les concurrents doivent contenir entre 5 et 300 caractères'),
  body('status')
    .isIn(['draft', 'submitted', 'reviewed', 'accepted', 'rejected'])
    .withMessage('Statut invalide')
];

// GET /api/ideas - Liste des idées avec pagination et filtres
router.get('/', authenticateJWT, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const skip = (page - 1) * limit;

    // Construire les filtres
    const where = { userId: req.user.id };
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    const ideas = await prisma.idea.findMany({
      where,
      skip,
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    const total = await prisma.idea.count({ where });

    res.json({
      status: 'success',
      data: ideas,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erreur lors de la récupération des idées',
      error: error.message
    });
  }
});

// GET /api/ideas/:id - Détails d'une idée
router.get('/:id', authenticateJWT, async (req, res) => {
  try {
    const idea = await prisma.idea.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    if (!idea) {
      return res.status(404).json({
        status: 'error',
        message: 'Idée non trouvée'
      });
    }

    // Vérifier que l'utilisateur est propriétaire de l'idée
    if (idea.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Accès non autorisé'
      });
    }

    res.json({
      status: 'success',
      data: idea
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erreur lors de la récupération de l\'idée',
      error: error.message
    });
  }
});

// POST /api/ideas - Création d'une idée
router.post('/', authenticateJWT, validateInput(validateIdea), async (req, res) => {
  try {
    const ideaData = {
      ...req.body,
      userId: req.user.id
    };

    const idea = await prisma.idea.create({
      data: ideaData,
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    res.status(201).json({
      status: 'success',
      message: 'Idée créée avec succès',
      data: idea
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erreur lors de la création de l\'idée',
      error: error.message
    });
  }
});

// PUT /api/ideas/:id - Modification d'une idée
router.put('/:id', authenticateJWT, validateInput(validateIdea), async (req, res) => {
  try {
    const idea = await prisma.idea.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    if (!idea) {
      return res.status(404).json({
        status: 'error',
        message: 'Idée non trouvée'
      });
    }

    // Vérifier que l'utilisateur est propriétaire de l'idée
    if (idea.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Accès non autorisé'
      });
    }

    const updatedIdea = await prisma.idea.update({
      where: { id: parseInt(req.params.id) },
      data: req.body,
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    res.json({
      status: 'success',
      message: 'Idée mise à jour avec succès',
      data: updatedIdea
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erreur lors de la mise à jour de l\'idée',
      error: error.message
    });
  }
});

// DELETE /api/ideas/:id - Suppression d'une idée
router.delete('/:id', authenticateJWT, async (req, res) => {
  try {
    const idea = await prisma.idea.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    if (!idea) {
      return res.status(404).json({
        status: 'error',
        message: 'Idée non trouvée'
      });
    }

    // Vérifier que l'utilisateur est propriétaire de l'idée
    if (idea.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Accès non autorisé'
      });
    }

    await prisma.idea.delete({
      where: { id: parseInt(req.params.id) }
    });

    res.json({
      status: 'success',
      message: 'Idée supprimée avec succès'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erreur lors de la suppression de l\'idée',
      error: error.message
    });
  }
});

module.exports = router;
