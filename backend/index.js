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

// Routes
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: '../' });
});

app.get('/accueil', (req, res) => {
  res.sendFile('acceuil.html', { root: '../' });
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

// Connexion à la base de données
connectDB();

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
