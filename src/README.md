# Bizidea Backend

Backend complet pour la plateforme SaaS Bizidea par HumanOS, avec authentification JWT, gestion des idées d'entreprise, et base de données hybride MongoDB/PostgreSQL.

## 🚀 Fonctionnalités

- **Authentification sécurisée** avec JWT et bcrypt
- **Gestion complète des idées** (CRUD avec validation)
- **Base de données hybride** :
  - MongoDB pour les utilisateurs
  - PostgreSQL (Prisma) pour les idées
- **Sécurité renforcée** avec Helmet, CORS, et rate limiting
- **Validation des données** avec express-validator
- **Gestion d'erreurs complète**

## 📦 Installation

1. **Cloner le repository**
```bash
git clone <repository-url>
cd bizidea-backend
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration des bases de données**
   - Installer MongoDB et PostgreSQL
   - Créer les bases de données `bizidea` sur les deux systèmes
   - Configurer les variables d'environnement dans `.env`

4. **Initialiser Prisma**
```bash
npx prisma generate
npx prisma db push
```

5. **Démarrer le serveur**
```bash
npm run dev
```

## 🔧 Configuration

### Variables d'environnement (.env)

```env
PORT=5000
NODE_ENV=development
MAX_FILE_SIZE=10mb

# MongoDB
MONGODB_URI=mongodb://localhost:27017/bizidea

# PostgreSQL (Prisma)
DATABASE_URL=postgresql://username:password@localhost:5432/bizidea

# JWT
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRES_IN=1h

# Frontend
FRONTEND_URL=http://localhost:3000
```

## 📡 API Endpoints

### Authentification

- `POST /api/auth/register` - Créer un compte
- `POST /api/auth/login` - Se connecter
- `GET /api/auth/me` - Récupérer le profil utilisateur

### Idées

- `GET /api/ideas` - Liste des idées (avec pagination)
- `GET /api/ideas/:id` - Détails d'une idée
- `POST /api/ideas` - Créer une idée
- `PUT /api/ideas/:id` - Modifier une idée
- `DELETE /api/ideas/:id` - Supprimer une idée

## 🛡️ Sécurité

- **Helmet** pour les en-têtes de sécurité
- **CORS** configuré pour le frontend
- **Rate limiting** (100 requêtes/15min par IP)
- **Validation des entrées** avec express-validator
- **Protection XSS** automatique
- **Mots de passe hashés** avec bcrypt (coût 12)

## 🗄️ Structure de la base de données

### MongoDB (Utilisateurs)
```javascript
{
  email: String (unique, validé),
  password: String (hashé),
  firstName: String,
  lastName: String,
  role: String (user/admin),
  createdAt: Date,
  updatedAt: Date
}
```

### PostgreSQL (Idées)
```prisma
model Idea {
  id                    Int      @id @default(autoincrement())
  title                 String
  description           String
  problem               String
  solution              String
  targetMarket          String
  uniqueValueProposition String
  businessModel         String
  competitors           String
  status                String   @default("draft")
  userId                Int
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
  user                  User     @relation(fields: [userId], references: [id])
}
```

## 🧪 Tests

### Tests manuels
```bash
node src/test-api.js
```

### Tests automatisés (à venir)
```bash
npm test
```

## 🚀 Déploiement

### Production
1. Mettre à jour les variables d'environnement
2. Générer les builds de production
3. Configurer les bases de données de production
4. Démarrer avec `npm start`

### Variables critiques pour la production
- `JWT_SECRET` fort et unique
- `NODE_ENV=production`
- Bases de données de production sécurisées
- HTTPS activé

## 📊 Monitoring

Le endpoint `/api/sante` fournit des informations détaillées sur l'état du serveur et des bases de données.

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

Pour toute question ou problème :
- Ouvrir une issue sur GitHub
- Contacter l'équipe de développement

---

**Développé avec ❤️ par HumanOS**
