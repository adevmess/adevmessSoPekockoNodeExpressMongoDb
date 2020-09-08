"use strict"; //Mode strict
require('dotenv').config(); //gestion des variables d'environnnement
const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require("mongoose"); //facilite l'interaction avec BDD
const session = require('express-session') //securisation des cookies
const path = require("path"); //gestion des fichiers
const helmet = require("helmet"); //securisation des en têtes HTTP
const nocache = require('nocache'); //desactivation cache coté client pour authentification
const rateLimit = require("express-rate-limit"); //limitation des requetes  
const hpp = require('hpp'); //pollution des parametres HTTP


//Importe les routers stuff et user
const saucesRoutes = require('./routes/sauces');
const userRoutes = require("./routes/user");


//connection de l'API à la BDD
mongoose.set('useCreateIndex', true);
mongoose.connect(
    process.env.KEY_BDD_MONGO_ATLAS, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


//Initialisation appli express
const app = express();

//initialisation de noCache (disableCacheClientSide)
const noCache = nocache()

//securisation des en têtes HTTP
app.use(helmet());

// gestion du middleware Cross-origin de l'objet reponse(acces au ressources depuis toute origine ,headers et verbes autorisés)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});


//gestion du parsage pour toutes les requetes avant utilisation  .
app.use(bodyParser.json());
// app.use(express.urlencoded({
//   limit: "1kb",
// }));
app.use(express.json({
  limit: "1kb"
}));
// app.use(express.multipart({
//   limit: "10mb"
// }));
// app.use(express.limit("5kb")); // this will be valid for every other content type

//empeche la pollution des parametres http
app.use(hpp());

// gestion session cookie via objet session
app.use(session({
  name: process.env.EXPRESS_SESSION_NAME,
  saveUninitialized: false, //ne pas suvegarder de session pas encore initialisé
  resave: false, //pas de sauvegarde si la session n'a pas changé
  secret: process.env.KEY_EXPRESS_SESSION, //signe id de session,valide cookie cote client

  //le cookie est signé mais pas crypté car pas de data précieuses (OWASP) (chaine aléatoire)
  cookie: {
    httpOnly: true, // valeur par default a true le cookie est lue seulement cote serveur
    // secure: true,
    maxAge: 1000 * 60 * 60 * 2, //temps avant expiration 2h en millisecondes
    sameSite: true, //attribut SameSite dans l'en tête Set-Cookie attenue le CSRF (true="strict"), gestion envoi cookies lors des demandes intersites
    secure: true //definit en-tete Setcookie (cookie envoye seulemlement via https)
  }
}))

//limitation des requêtes lors de l'authentification 5 possibilitées avant bloquage de 5 minutes (BruteForce)
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 10
});

//routes pour les requetes du dossier image
app.use("/images", express.static(path.join(__dirname, "images")));

//debut de routes + pour cette route utilise le routeur qui se trouve dans sauceRoutes => permet de masquer toute la logique
app.use('/api/sauces', saucesRoutes); //attention bien mettre /api
app.use("/api/auth", limiter, noCache, userRoutes);

module.exports = app;