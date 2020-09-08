"use strict"; // utilisation du mode strict
//récupéretion du schéma
const schema = require("../models/checkSchema");

module.exports = (req, res, next) => {
  //comparaison du mot de pass et de l'email par rapport au schéma
  const validation = schema.validate(req.body);
  // console.log(validation.value)
  if (validation.error) {
    res.status(400).json({
      error: "Le mot de passe doit contenir : 1 lettre majuscule, minuscule, un chiffre, un caractere special et un minimum de huit caractères ou/et email incorrect"
    })
  } else {
    next()
  }
}