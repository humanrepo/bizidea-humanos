const mongoose = require('mongoose');
const { PrismaClient } = require('../generated/prisma');

// Configuration MongoDB (User)
// const connectMongoDB = async () => {
//   try {
//     const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bizidea';
    
//     await mongoose.connect(mongoURI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
    
//     console.log('✅ MongoDB connecté avec succès');
//   } catch (error) {
//     console.error('❌ Erreur de connexion MongoDB:', error.message);
//     process.exit(1);
//   }
// };

// Configuration PostgreSQL (Prisma)
const prisma = new PrismaClient();

const connectPostgreSQL = async () => {
  try {
    await prisma.$connect();
    console.log('✅ PostgreSQL (Prisma) connecté avec succès');
  } catch (error) {
    console.error('❌ Erreur de connexion PostgreSQL:', error.message);
    process.exit(1);
  }
};

// Middleware de gestion d'erreurs pour Prisma
const handlePrismaError = (error) => {
  if (error.code === 'P2002') {
    return {
      status: 'error',
      message: 'Violation de contrainte unique',
      field: error.meta?.target?.[0]
    };
  }
  
  if (error.code === 'P2025') {
    return {
      status: 'error',
      message: 'Enregistrement non trouvé'
    };
  }
  
  return {
    status: 'error',
    message: 'Erreur de base de données',
    error: error.message
  };
};

// Fermer les connexions
const closeConnections = async () => {
  try {
    await mongoose.connection.close();
    await prisma.$disconnect();
    console.log('Connexions fermées avec succès');
  } catch (error) {
    console.error('Erreur lors de la fermeture des connexions:', error);
  }
};

// Gestion des signaux pour fermer proprement
process.on('SIGINT', closeConnections);
process.on('SIGTERM', closeConnections);

module.exports = {
  // connectMongoDB,
  connectPostgreSQL,
  prisma,
  handlePrismaError,
  closeConnections
};
