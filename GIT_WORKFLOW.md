# Stratégie de Branchement Git - BizIdea Frontend

## 📋 Structure des Branches

### Branches Principales
- **`main`** : Branche de production (stable)
- **`dev`** : Branche de développement (intégration)

### Branches de Fonctionnalités (Feature Branches)
- **`feat/*`** : Nouvelles fonctionnalités
  - Ex: `feat/user-authentication`, `feat/dashboard-redesign`

### Branches de Corrections (Fix Branches)
- **`fix/*`** : Corrections de bugs
  - Ex: `fix/login-issue`, `fix/responsive-layout`

### Branches de Tâches (Chore Branches)
- **`chore/*`** : Tâches d'infrastructure et configuration
  - Ex: `chore/dependency-update`, `chore/ci-cd-setup`

### Branches de Tests
- **`test/*`** : Tests et améliorations de qualité
  - Ex: `test/unit-tests`, `test/e2e-coverage`

## 🔄 Workflow de Développement

### 1. Création d'une Nouvelle Fonctionnalité
```bash
# Se positionner sur la branche dev
git checkout dev
git pull origin dev

# Créer une nouvelle branche de fonctionnalité
git checkout -b feat/nouvelle-fonctionnalite

# Développer et committer
git add .
git commit -m "feat: ajouter nouvelle fonctionnalité"

# Pousser la branche
git push -u origin feat/nouvelle-fonctionnalite
```

### 2. Processus de Revue (Code Review)
- Créer une Pull Request (PR) vers `dev`
- Assigner des reviewers
- Résoudre les commentaires
- Merge après approbation

### 3. Déploiement en Production
```bash
# Fusionner dev dans main après tests
git checkout main
git merge dev

# Taguer la version
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

## 📝 Convention de Commits

### Format des Messages
```
type(scope): description concise

[corps optionnel]

[footer optionnel]
```

### Types de Commits
- **`feat`** : Nouvelle fonctionnalité
- **`fix`** : Correction de bug
- **`docs`** : Documentation
- **`style`** : Formatage, style
- **`refactor`** : Refactoring
- **`test`** : Tests
- **`chore`** : Tâches de maintenance

### Exemples
```
feat(auth): implémenter l'authentification OAuth2
fix(ui): corriger le responsive sur mobile
docs(readme): mettre à jour les instructions d'installation
```

## 🚀 Bonnes Pratiques

### 1. Fréquence des Commits
- Committer souvent, des changements petits et atomiques
- Un commit = une fonctionnalité/correction

### 2. Messages de Commit
- Utiliser l'impératif présent ("ajouter", pas "ajouté")
- Limiter la première ligne à 50 caractères
- Décrire le "pourquoi" dans le corps si nécessaire

### 3. Synchronisation
- Pull régulièrement depuis `dev`
- Resoudre les conflits rapidement
- Ne jamais pousser directement sur `main`

### 4. Revue de Code
- Toutes les PR doivent être revues
- Minimum 1 approbation requis
- Tests obligatoires avant merge

## 🔧 Commandes Utiles

### Configuration
```bash
# Configurer l'utilisateur
git config user.name "Votre Nom"
git config user.email "votre.email@example.com"

# Configurer le push par défaut
git config push.default current
```

### Branches
```bash
# Lister toutes les branches
git branch -a

# Supprimer une branche locale
git branch -d nom-branche

# Supprimer une branche distante
git push origin --delete nom-branche
```

### Historique
```bash
# Voir l'historique avec graph
git log --oneline --graph --all

# Voir les changements non commités
git status

# Voir les différences
git diff
```

## 🎯 Règles Importantes

1. **Protection des Branches**
   - `main` et `dev` protégées
   - Merge uniquement via PR
   - Tests requis avant merge

2. **Qualité du Code**
   - Linting obligatoire
   - Tests unitaires pour nouvelles fonctionnalités
   - Couverture de code maintenue

3. **Documentation**
   - Mettre à jour la documentation
   - Commenter le code complexe
   - Maintenir le CHANGELOG

Cette stratégie assure un développement collaboratif, organisé et de haute qualité pour le projet BizIdea Frontend.
