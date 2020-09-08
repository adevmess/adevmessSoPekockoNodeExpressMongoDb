"use strict"; //mode stricte
//gestion des fichier entrants via les requetes HTTP
//multer ajoute une proprité req.file qu'il faut parser avant exploitation
const multer = require("multer");

//dictionnaire pour les extensions (type de media , format)
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png"
};

// création de l'objet de configuration pour multer

//On enregistre sur le disque en spécifiant la destination(fichier ici "image" et on cree l'extension avec le dictionnaire )
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images")
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + "." + extension);
  }
});

module.exports = multer({
  storage
}).single("image");