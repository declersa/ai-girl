const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const questions = require('./data/questions.js');
const servicesIA = require('./data/servicesIA.js');
const servicesRV = require('./data/servicesRV.js');
const cors = require('cors'); // Ajout du middleware CORS

const app = express();

// État global du quiz
const quizState = {
  view: 'home',
  currentQuestion: 0,
  answers: [],
  reset() {
    this.view = 'home';
    this.currentQuestion = 0;
    this.answers = [];
  }
};

// Configuration
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout');

// Middleware pour parser le JSON et les formulaires
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Middleware CORS pour autoriser une origine spécifique
const allowedOrigins = [
  'https://intelligence-artificielle.com',
  'https://www.realite-virtuelle.com'
];

app.use(cors({
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['POST'], // Autorise uniquement la méthode POST si nécessaire
}));

// Fichiers statiques
app.use(express.static('public'));
app.use('/images', express.static('public/images'));
app.use('/css', express.static('public/css'));
app.use('/js', express.static('public/js'));

// Route principale qui affiche toujours la page d'accueil
app.get('/', (req, res) => {
  try {
    quizState.reset(); // Toujours réinitialiser l'état quand on charge la home
    res.render('index');
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).send('Une erreur est survenue');
  }
});

// Nouvelle route pour gérer les actions
// Nouvelle route pour gérer les actions
app.post('/action', (req, res) => {
  try {
    const { action, answer } = req.body;
    const origin = req.headers['origin'] || ''; // Récupération de l'Origin

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
        quizState.reset();
        break;
    }

    // Détermine quel service afficher en fonction de l'Origin
    let servicesToShow = servicesRV; // Par défaut, on affiche 'servicesRV'
    if (origin.includes('intelligence-artificielle.com')) {
      servicesToShow = servicesIA; // Si l'origin est celui de ton site, affiche 'servicesIA'
    }

    // Retourne la vue demandée sans layout en AJAX
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
