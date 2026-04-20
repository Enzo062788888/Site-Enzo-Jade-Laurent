const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Servir les fichiers statiques du frontend
app.use(express.static('../'));

// Headers pour éviter les problèmes CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Fonction de connexion à MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// Modèle simple pour les tests
const TestSchema = new mongoose.Schema({
  name: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
});

const Test = mongoose.model('Test', TestSchema);

// Modèle User pour l'authentification
const UserSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);

// Modèle Score pour le Space Invader
const ScoreSchema = new mongoose.Schema({
  playerName: { type: String, required: true },
  score: { type: Number, required: true },
  level: { type: Number, default: 1 },
  gameDate: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

// Index pour les requêtes rapides
ScoreSchema.index({ score: -1 }); // Pour les meilleurs scores
ScoreSchema.index({ gameDate: -1 }); // Pour les scores récents

const Score = mongoose.model('Score', ScoreSchema);

// Routes
app.get('/', (req, res) => {
  res.sendFile('accueil.html', { root: '../' });
});

app.get('/accueil', (req, res) => {
  res.sendFile('accueil.html', { root: '../' });
});

app.get('/about', (req, res) => {
  res.send('About Page');
});

// Route de test pour la DB
app.get('/test', async (req, res) => {
  try {
    const newTest = new Test({
      name: 'Test à la con',
      message: 'Hello MongoDB! ça marche ! 🎉'
    });
    
    const savedTest = await newTest.save();
    res.json({
      success: true,
      message: 'Test réussi !',
      data: savedTest
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur de test',
      error: error.message
    });
  }
});

// Route pour voir tous les tests
app.get('/tests', async (req, res) => {
  try {
    const tests = await Test.find();
    res.json({
      success: true,
      count: tests.length,
      data: tests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur de lecture',
      error: error.message
    });
  }
});

// Route d'inscription
app.post('/register', async (req, res) => {
  try {
    const { nom, email, password } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Cet email est déjà utilisé'
      });
    }

    // Créer un nouvel utilisateur
    const newUser = new User({ nom, email, password });
    await newUser.save();

    res.json({
      success: true,
      message: 'Inscription réussie !',
      user: { nom: newUser.nom, email: newUser.email }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'inscription',
      error: error.message
    });
  }
});

// Route de connexion
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Chercher l'utilisateur
    const user = await User.findOne({ email, password });

    if (user) {
      res.json({
        success: true,
        message: 'Connexion réussie !',
        user: { nom: user.nom, email: user.email }
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la connexion',
      error: error.message
    });
  }
});

// ============ ROUTES POUR LES SCORES DU SPACE INVADER ============

// Route pour ajouter un nouveau score
app.post('/scores', async (req, res) => {
  try {
    const { playerName, score, level } = req.body;

    // Validation des données
    if (!playerName || score === undefined) {
      return res.status(400).json({
        success: false,
        message: 'playerName et score sont requis'
      });
    }

    // Créer un nouveau score
    const newScore = new Score({
      playerName,
      score,
      level: level || 1
    });

    await newScore.save();

    res.json({
      success: true,
      message: 'Score sauvegardé avec succès !',
      data: newScore
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la sauvegarde du score',
      error: error.message
    });
  }
});

// Route pour récupérer les meilleurs scores
app.get('/scores/top', async (req, res) => {
  try {
    const limit = req.query.limit || 10;
    
    const topScores = await Score.find()
      .sort({ score: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: topScores.length,
      data: topScores
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des scores',
      error: error.message
    });
  }
});

// Route pour récupérer les scores d'un joueur
app.get('/scores/player/:playerName', async (req, res) => {
  try {
    const { playerName } = req.params;
    
    const playerScores = await Score.find({ playerName })
      .sort({ score: -1 });

    res.json({
      success: true,
      count: playerScores.length,
      data: playerScores
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des scores du joueur',
      error: error.message
    });
  }
});

// Route pour récupérer tous les scores
app.get('/scores', async (req, res) => {
  try {
    const scores = await Score.find().sort({ score: -1 });

    res.json({
      success: true,
      count: scores.length,
      data: scores
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des scores',
      error: error.message
    });
  }
});

// Route pour supprimer un score (par ID)
app.delete('/scores/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deletedScore = await Score.findByIdAndDelete(id);

    if (!deletedScore) {
      return res.status(404).json({
        success: false,
        message: 'Score non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Score supprimé avec succès',
      data: deletedScore
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du score',
      error: error.message
    });
  }
});

// Connexion à la base de données
connectDB();

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});