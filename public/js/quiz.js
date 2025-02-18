const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');
const questions = require('./data/questions.js');
const servicesIA = require('./data/servicesIA.js');
const servicesRV = require('./data/servicesRV.js');
const cors = require('cors');

const app = express();

// Middleware pour les cookies
app.use(cookieParser());

// Configuration des sessions en mémoire
app.use(session({
  secret: 'votre_secret_key_complexe',
  name: 'quiz_session',
  resave: true,
  rolling: true,
  saveUninitialized: false,
  cookie: {
    secure: false, // Mettre à true en production avec HTTPS
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 30 * 60 * 1000 // 30 minutes
  }
}));

// Configuration
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout');

// Middleware pour parser le JSON et les formulaires
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware CORS avec configuration spécifique pour WordPress
app.use(cors({
  origin: true, // Permet toutes les origines temporairement
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Accept', 'Origin']
}));

// Middleware pour initialiser la session du quiz
app.use((req, res, next) => {
  if (!req.session.quizState) {
    req.session.quizState = {
      view: 'home',
      currentQuestion: 0,
      answers: []
    };
  }
  next();
});

// Fichiers statiques
app.use(express.static('public'));
app.use('/images', express.static('public/images'));
app.use('/css', express.static('public/css'));
app.use('/js', express.static('public/js'));

// Route principale
app.get('/', (req, res) => {
  try {
    // Initialiser uniquement si nécessaire
    if (!req.session.quizState) {
      req.session.quizState = {
        view: 'home',
        currentQuestion: 0,
        answers: []
      };
    }
    res.render('index');
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).send('Une erreur est survenue');
  }
});

// Route pour gérer les actions du quiz
app.post('/action', (req, res) => {
  try {
    const { action, answer } = req.body;
    const origin = req.headers['origin'] || '';
    
    // S'assurer que quizState existe
    if (!req.session.quizState) {
      req.session.quizState = {
        view: 'home',
        currentQuestion: 0,
        answers: []
      };
    }
    
    const quizState = req.session.quizState;

    switch (action) {
      case 'start-quiz':
        quizState.view = 'quiz';
        quizState.currentQuestion = 0;
        quizState.answers = [];
        break;

      case 'answer':
        if (answer) {
          quizState.answers[quizState.currentQuestion] = answer;
          if (quizState.currentQuestion < questions.length - 1) {
            quizState.currentQuestion++;
          } else {
            quizState.view = 'results';
          }
        }
        break;

      case 'previous':
        if (quizState.currentQuestion > 0) {
          quizState.currentQuestion--;
        }
        break;

      case 'reset':
        quizState.view = 'home';
        quizState.currentQuestion = 0;
        quizState.answers = [];
        break;
    }

    // Sauvegarder les changements dans la session
    req.session.quizState = quizState;
    req.session.save();

    // Détermine quel service afficher en fonction de l'Origin
    let servicesToShow = servicesRV;
    if (origin.includes('intelligence-artificielle.com')) {
      servicesToShow = servicesIA;
    }

    // Retourne la vue appropriée sans layout pour les requêtes AJAX
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      let viewData = {};

      switch (quizState.view) {
        case 'quiz':
          viewData = {
            question: questions[quizState.currentQuestion],
            currentQuestion: quizState.currentQuestion,
            totalQuestions: questions.length
          };
          return res.render('quiz', { ...viewData, layout: false });
        case 'results':
          viewData = { services: servicesToShow };
          return res.render('results', { ...viewData, layout: false });
        default:
          return res.render('index', { layout: false });
      }
    }

    res.redirect('/');
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).send('Une erreur est survenue');
  }
});

app.get('/robots.txt', (req, res) => {
  res.sendFile(path.join(__dirname, 'robots.txt'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});