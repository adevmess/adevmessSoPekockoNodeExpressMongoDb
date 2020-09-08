"use strict";
const express = require("express"); //importe  express
const router = express.Router() //creation du router



//recupere le middleware d'authentification
const auth = require("../middleware/auth");
// middlware de traitement de fichier
const multer = require("../middleware/multer-config");
//recup de la logique metier concernant acces aux ressources "sauces"
const sauceCtrl = require("../controllers/sauceEvaluation.js");


//Logique de routing pour la creation d'une sauce (applique fct a la route)
router.post("/", auth, multer, sauceCtrl.createSauce);
//gestion like/dislike
router.post("/:id/like", auth, multer, sauceCtrl.postLikeDislike);
//modification d'une sauce
router.put("/:id", auth, multer, sauceCtrl.modifySauce);
//suppression d'une sauce
router.delete("/:id", auth, sauceCtrl.deleteSauce);
//  récupération d'une seule sauce
router.get("/:id", auth, sauceCtrl.getOneSauce);
//récupération de toutes les sauces
router.get("/", auth, sauceCtrl.getAllSauces);


//On exporte le routeur
module.exports = router;