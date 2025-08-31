const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Test de l'API
async function testAPI() {
  console.log('🧪 Démarrage des tests API...\n');

  try {
    // Test 1: Vérification de santé
    console.log('1. Test de vérification de santé...');
    const healthResponse = await axios.get(`${BASE_URL}/sante`);
    console.log('✅ Vérification de santé:', healthResponse.data.statut);
    
    // Test 2: Création d'un utilisateur
    console.log('\n2. Test de création d\'utilisateur...');
    const userData = {
      email: 'test@example.com',
      password: 'Password123!',
      firstName: 'Test',
      lastName: 'User'
    };
    
    const registerResponse = await axios.post(`${BASE_URL}/auth/register`, userData);
    console.log('✅ Utilisateur créé:', registerResponse.data.message);
    
    // Test 3: Connexion
    console.log('\n3. Test de connexion...');
    const loginData = {
      email: 'test@example.com',
      password: 'Password123!'
    };
    
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, loginData);
    const token = loginResponse.data.token;
    console.log('✅ Connexion réussie, token reçu');
    
    // Test 4: Récupération du profil
    console.log('\n4. Test de récupération du profil...');
    const profileResponse = await axios.get(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Profil récupéré:', profileResponse.data.user.email);
    
    // Test 5: Création d'une idée
    console.log('\n5. Test de création d\'idée...');
    const ideaData = {
      title: 'Mon idée de startup',
      description: 'Une plateforme révolutionnaire pour connecter les entrepreneurs',
      problem: 'Les entrepreneurs ont du mal à trouver des partenaires',
      solution: 'Créer une plateforme de mise en relation',
      targetMarket: 'Entrepreneurs et startups',
      uniqueValueProposition: 'Algorithme de matching intelligent',
      businessModel: 'Abonnement mensuel',
      competitors: 'LinkedIn, AngelList',
      status: 'draft'
    };
    
    const ideaResponse = await axios.post(`${BASE_URL}/ideas`, ideaData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Idée créée:', ideaResponse.data.message);
    
    // Test 6: Liste des idées
    console.log('\n6. Test de liste des idées...');
    const ideasResponse = await axios.get(`${BASE_URL}/ideas`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Idées récupérées:', ideasResponse.data.data.length);
    
    console.log('\n🎉 Tous les tests ont réussi !');
    
  } catch (error) {
    console.error('❌ Erreur lors des tests:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Message:', error.message);
    }
    process.exit(1);
  }
}

// Exécuter les tests si ce fichier est appelé directement
if (require.main === module) {
  testAPI();
}

module.exports = testAPI;
