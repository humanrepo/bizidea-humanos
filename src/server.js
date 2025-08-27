const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const mongoose = require('mongoose');
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

// Connexion PostgreSQL avec gestion d'erreurs améliorée
const poolPG = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT || 5432,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

// Test de connexion PostgreSQL avec logique de retry
const connecterPostgreSQL = async (tentatives = 3) => {
    for (let i = 0; i < tentatives; i++) {
        try {
            const client = await poolPG.connect();
            journaliser('PostgreSQL connecté avec succès', 'success');
            client.release();
            return true;
        } catch (erreur) {
            journaliser(`Tentative de connexion PostgreSQL ${i + 1} échouée: ${erreur.message}`, 'error');
            if (i === tentatives - 1) {
                journaliser('Connexion PostgreSQL échouée après toutes les tentatives', 'error');
                return false;
            }
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
};

// Connexion MongoDB avec configuration améliorée
const connecterMongoDB = async (tentatives = 3) => {
    for (let i = 0; i < tentatives; i++) {
        try {
            await mongoose.connect(process.env.MONGO_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                maxPoolSize: 10,
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMillis: 45000,
                bufferCommands: false,
                bufferMaxEntries: 0
            });
            journaliser('MongoDB connecté avec succès', 'success');
            return true;
        } catch (erreur) {
            journaliser(`Tentative de connexion MongoDB ${i + 1} échouée: ${erreur.message}`, 'error');
            if (i === tentatives - 1) {
                journaliser('Connexion MongoDB échouée après toutes les tentatives', 'error');
                return false;
            }
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
};

// Point de terminaison de vérification de santé amélioré
app.get('/api/sante', async (req, res) => {
    try {
        const verificationSante = {
            statut: 'OK',
            horodatage: new Date().toISOString(),
            tempsActivite: process.uptime(),
            environnement: process.env.NODE_ENV || 'development',
            version: process.env.npm_package_version || '1.0.0',
            services: {}
        };

        // Test de connexion PostgreSQL
        try {
            const resultatPG = await poolPG.query('SELECT NOW() as heure_actuelle, version() as version_pg');
            verificationSante.services.postgresql = {
                statut: 'connecté',
                horodatage: resultatPG.rows[0].heure_actuelle,
                version: resultatPG.rows[0].version_pg.split(' ')[1]
            };
        } catch (erreurPG) {
            verificationSante.services.postgresql = {
                statut: 'déconnecté',
                erreur: erreurPG.message
            };
        }

        // Test de connexion MongoDB
        const etatMongo = mongoose.connection.readyState;
        const etatsMongo = {
            0: 'déconnecté',
            1: 'connecté',
            2: 'en cours de connexion',
            3: 'en cours de déconnexion'
        };

        verificationSante.services.mongodb = {
            statut: etatsMongo[etatMongo] || 'inconnu',
            etatPret: etatMongo
        };

        if (etatMongo === 1) {
            try {
                const statsMongo = await mongoose.connection.db.admin().serverStatus();
                verificationSante.services.mongodb.version = statsMongo.version;
                verificationSante.services.mongodb.tempsActivite = statsMongo.uptime;
            } catch (erreurMongo) {
                verificationSante.services.mongodb.erreurStats = erreurMongo.message;
            }
        }

        // Déterminer le statut global
        const tousServicesEnSante = Object.values(verificationSante.services).every(
            service => service.statut === 'connecté'
        );

        if (!tousServicesEnSante) {
            verificationSante.statut = 'DÉGRADÉ';
            return res.status(503).json(verificationSante);
        }

        res.json(verificationSante);
    } catch (erreur) {
        journaliser(`Erreur de vérification de santé: ${erreur.message}`, 'error');
        res.status(500).json({
            statut: 'ERREUR',
            message: process.env.NODE_ENV === 'production' ? 'Erreur interne du serveur' : erreur.message,
            horodatage: new Date().toISOString()
        });
    }
});

// Routes API de base
app.get('/api', (req, res) => {
    res.json({
        message: 'Serveur API Bizidea',
        version: '1.0.0',
        statut: 'en fonctionnement',
        horodatage: new Date().toISOString(),
        pointsTerminaison: {
            sante: '/api/sante',
            documentation: '/api/docs'
        }
    });
});

// Gestionnaire d'erreurs global
app.use((err, req, res, next) => {
    journaliser(`Gestionnaire d'erreurs global: ${err.stack}`, 'error');
    
    // Gérer les types d'erreurs spécifiques
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({
            statut: 'REQUÊTE_INVALIDE',
            message: 'Charge utile JSON invalide',
            horodatage: new Date().toISOString()
        });
    }

    if (err.type === 'entity.too.large') {
        return res.status(413).json({
            statut: 'CHARGE_TROP_VOLUMINEUSE',
            message: 'Charge utile de la requête trop volumineuse',
            horodatage: new Date().toISOString()
        });
    }

    res.status(err.status || 500).json({
        statut: 'ERREUR',
        message: process.env.NODE_ENV === 'production' ? 'Erreur interne du serveur' : err.message,
        horodatage: new Date().toISOString(),
        ...(process.env.NODE_ENV !== 'production' && { pile: err.stack })
    });
});

// Gestionnaire 404
app.use('*', (req, res) => {
    journaliser(`404 - Route non trouvée: ${req.method} ${req.originalUrl}`, 'warn');
    res.status(404).json({
        statut: 'NON_TROUVÉ',
        message: `Route ${req.method} ${req.originalUrl} non trouvée`,
        horodatage: new Date().toISOString(),
        pointsTerminaisonDisponibles: ['/api', '/api/sante']
    });
});

// Gestionnaires d'arrêt gracieux
const arretGracieux = async (signal) => {
    journaliser(`${signal} reçu, arrêt gracieux en cours...`, 'info');
    
    try {
        // Fermer le pool PostgreSQL
        await poolPG.end();
        journaliser('Pool PostgreSQL fermé', 'info');
        
        // Fermer la connexion MongoDB
        await mongoose.connection.close();
        journaliser('Connexion MongoDB fermée', 'info');
        
        journaliser('Arrêt gracieux terminé', 'info');
        process.exit(0);
    } catch (erreur) {
        journaliser(`Erreur lors de l'arrêt gracieux: ${erreur.message}`, 'error');
        process.exit(1);
    }
};

process.on('SIGTERM', () => arretGracieux('SIGTERM'));
process.on('SIGINT', () => arretGracieux('SIGINT'));

// Gérer les exceptions non capturées
process.on('uncaughtException', (erreur) => {
    journaliser(`Exception non capturée: ${erreur.message}`, 'error');
    journaliser(erreur.stack, 'error');
    arretGracieux('EXCEPTION_NON_CAPTURÉE');
});

process.on('unhandledRejection', (raison, promesse) => {
    journaliser(`Rejet non géré à: ${promesse}, raison: ${raison}`, 'error');
    arretGracieux('REJET_NON_GÉRÉ');
});

// Initialiser les connexions de base de données et démarrer le serveur
const demarrerServeur = async () => {
    journaliser('Démarrage du serveur API Bizidea...', 'info');
    
    // Se connecter aux bases de données
    const pgConnecte = await connecterPostgreSQL();
    const mongoConnecte = await connecterMongoDB();
    
    if (!pgConnecte || !mongoConnecte) {
        journaliser('Échec de connexion aux bases de données requises. Le serveur démarrera mais pourrait ne pas fonctionner correctement.', 'warn');
    }
    
    // Démarrer le serveur
    const serveur = app.listen(PORT, () => {
        journaliser(`🚀 Serveur en fonctionnement sur http://localhost:${PORT}`, 'success');
        journaliser(`📊 Vérification de santé disponible sur http://localhost:${PORT}/api/sante`, 'info');
        journaliser(`🌍 Environnement: ${process.env.NODE_ENV || 'development'}`, 'info');
        journaliser(`🔧 CORS activé pour: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`, 'info');
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