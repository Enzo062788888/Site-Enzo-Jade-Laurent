// Gestion du switch entre login et register
const loginToRegister = document.getElementById('login-to-register');
const registerToLogin = document.getElementById('register-to-login');
const loginSection = document.querySelector('.login');
const registerSection = document.querySelector('.register');

loginToRegister.addEventListener('click', (e) => {
  e.preventDefault();
  loginSection.style.display = 'none';
  registerSection.style.display = 'block';
});

registerToLogin.addEventListener('click', (e) => {
  e.preventDefault();
  loginSection.style.display = 'block';
  registerSection.style.display = 'none';
});

// Route du serveur
const API_URL = 'http://localhost:4000';

// ============ FORMULAIRE DE LOGIN ============
document.getElementById('Login-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  if (!email || !password) {
    alert('❌ Veuillez remplir tous les champs');
    return;
  }

  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (data.success) {
      alert(`✅ Bienvenue ${data.user.nom} !`);
      // Optionnel: Sauvegarder les infos de l'utilisateur
      localStorage.setItem('user', JSON.stringify(data.user));
      // Redirection vers la page d'accueil
      window.location.href = 'acceuil.html';
    } else {
      alert(`❌ ${data.message}`);
    }
  } catch (error) {
    alert(`❌ Erreur : ${error.message}`);
    console.error('Erreur de connexion:', error);
  }
});

// ============ FORMULAIRE D'INSCRIPTION ============
document.getElementById('Inscription-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const nom = document.getElementById('nom').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  if (!nom || !email || !password) {
    alert('❌ Veuillez remplir tous les champs');
    return;
  }

  if (password.length < 6) {
    alert('❌ Le mot de passe doit contenir au moins 6 caractères');
    return;
  }

  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nom, email, password })
    });

    const data = await response.json();

    if (data.success) {
      alert(`✅ Inscription réussie ! Vous pouvez maintenant vous connecter.`);
      // Réinitialiser le formulaire
      document.getElementById('Inscription-form').reset();
      // Retour au formulaire de login
      loginSection.style.display = 'block';
      registerSection.style.display = 'none';
    } else {
      alert(`❌ ${data.message}`);
    }
  } catch (error) {
    alert(`❌ Erreur : ${error.message}`);
    console.error('Erreur d\'inscription:', error);
  }
});