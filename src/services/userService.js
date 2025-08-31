const bcrypt = require('bcryptjs');
const { prisma, handlePrismaError } = require('../config/database');

class UserService {
  // Trouver un utilisateur par email
  static async findByEmail(email) {
    try {
      return await prisma.user.findUnique({
        where: { email }
      });
    } catch (error) {
      throw handlePrismaError(error);
    }
  }

  // Créer un nouvel utilisateur
  static async create(userData) {
    try {
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      
      return await prisma.user.create({
        data: {
          email: userData.email,
          password: hashedPassword,
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: userData.role || 'user'
        }
      });
    } catch (error) {
      throw handlePrismaError(error);
    }
  }

  // Vérifier le mot de passe
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Trouver un utilisateur par ID
  static async findById(id) {
    try {
      return await prisma.user.findUnique({
        where: { id: parseInt(id) },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          createdAt: true,
          updatedAt: true
        }
      });
    } catch (error) {
      throw handlePrismaError(error);
    }
  }
}

module.exports = UserService;
