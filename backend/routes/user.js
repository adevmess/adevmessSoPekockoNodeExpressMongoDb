"use strict";

const express = require("express");
const router = express.Router();
//validation des inputs d'autentification
const checkDataValidation = require("../middleware/checkDataValidation")


//recup de la logique metier concernant l'inscription et la connexion d'un user
const userCtrl = require("../controllers/user");


//implementation de la Logique de routing  pour l'authentification
router.post("/signup", checkDataValidation, userCtrl.signup);
router.post("/login", checkDataValidation, userCtrl.login);

//on exporte le routeur
module.exports = router;