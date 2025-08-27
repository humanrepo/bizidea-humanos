const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Système de journalisation amélioré
const journaliser = (message, niveau = 'info') => {
    const horodatage = new Date().toISOString();
    const niveauLog = niveau.toUpperCase();
    console.log(`[${horodatage}] ${niveauLog}: ${message}`);
};

// Configuration de sécurité et middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json({ 
    limit: process.env.MAX_FILE_SIZE || '10mb',
    strict: true
}));
app.use(express.urlencoded({ 
    extended: true, 
    limit: process.env.MAX_FILE_SIZE || '10mb'
}));

// Middleware de journalisation des requêtes
app.use((req, res, next) => {
    journaliser(`${req.method} ${req.path} - ${req.ip}`, 'info');
    next();
});

// Point de terminaison de vérification de santé (version démo)
app.get('/api/sante', async (req, res) => {
    try {
        const verificationSante = {
            statut: 'OK',
            horodatage: new Date().toISOString(),
            tempsActivite: process.uptime(),
            environnement: process.env.NODE_ENV || 'development',
            version: '1.0.0-demo',
            services: {
                serveur: {
                    statut: 'connecté',
                    port: PORT,
                    message: 'Serveur de démonstration actif'
                },
                postgresql: {
                    statut: 'désactivé',
                    message: 'Base de données désactivée pour la démonstration'
                },
                mongodb: {
                    statut: 'désactivé',
                    message: 'Base de données désactivée pour la démonstration'
                }
            }
        };

        res.json(verificationSante);
    } catch (erreur) {
        journaliser(`Erreur de vérification de santé: ${erreur.message}`, 'error');
        res.status(500).json({
            statut: 'ERREUR',
            message: erreur.message,
            horodatage: new Date().toISOString()
        });
    }
});

// Routes API de base
app.get('/api', (req, res) => {
    res.json({
        message: 'Serveur API Bizidea - Version Démonstration',
        version: '1.0.0-demo',
        statut: 'en fonctionnement',
        horodatage: new Date().toISOString(),
        pointsTerminaison: {
            sante: '/api/sante',
            demo: '/api/demo'
        }
    });
});

// Route de démonstration
app.get('/api/demo', (req, res) => {
    res.json({
        message: 'Bienvenue sur Bizidea !',
        description: 'Plateforme SaaS pour transformer vos idées en business',
        fonctionnalites: [
            'Gestion de projets',
            'Analyse de marché',
            'Outils de collaboration',
            'Tableaux de bord analytiques'
        ],
        statut: 'Démonstration active',
        horodatage: new Date().toISOString()
    });
});

// Gestionnaire d'erreurs global
app.use((err, req, res, next) => {
    journaliser(`Gestionnaire d'erreurs global: ${err.stack}`, 'error');
    
    res.status(err.status || 500).json({
        statut: 'ERREUR',
        message: process.env.NODE_ENV === 'production' ? 'Erreur interne du serveur' : err.message,
        horodatage: new Date().toISOString()
    });
});

// Gestionnaire 404
app.use('*', (req, res) => {
    journaliser(`404 - Route non trouvée: ${req.method} ${req.originalUrl}`, 'warn');
    res.status(404).json({
        statut: 'NON_TROUVÉ',
        message: `Route ${req.method} ${req.originalUrl} non trouvée`,
        horodatage: new Date().toISOString(),
        pointsTerminaisonDisponibles: ['/api', '/api/sante', '/api/demo']
    });
});

// Démarrer le serveur
const demarrerServeur = async () => {
    journaliser('🚀 Démarrage du serveur API Bizidea (Mode Démonstration)...', 'info');
    
    const serveur = app.listen(PORT, () => {
        journaliser(`🚀 Serveur en fonctionnement sur http://localhost:${PORT}`, 'success');
        journaliser(`📊 Vérification de santé disponible sur http://localhost:${PORT}/api/sante`, 'info');
        journaliser(`🎯 API de démonstration disponible sur http://localhost:${PORT}/api/demo`, 'info');
        journaliser(`🌍 Environnement: ${process.env.NODE_ENV || 'development'}`, 'info');
        journaliser(`🔧 CORS activé pour: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`, 'info');
        journaliser(`✨ Mode démonstration - Bases de données désactivées`, 'info');
    });

    // Gérer les erreurs du serveur
    serveur.on('error', (erreur) => {
        if (erreur.code === 'EADDRINUSE') {
            journaliser(`Le port ${PORT} est déjà utilisé`, 'error');
        } else {
            journaliser(`Erreur du serveur: ${erreur.message}`, 'error');
        }
        process.exit(1);
    });
};

// Démarrer l'application
demarrerServeur().catch((erreur) => {
    journaliser(`Échec du démarrage du serveur: ${erreur.message}`, 'error');
    process.exit(1);
});