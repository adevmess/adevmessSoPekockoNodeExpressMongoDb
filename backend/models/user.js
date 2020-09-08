"use strict"; //mode stricte activé

// creation du schéma via mongoose
const mongoose = require("mongoose");

//facilite la lecture des erreurs
const uniqueValidator = require("mongoose-unique-validator");

//création de schéma via la methode shema
const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true, // l'email doit etre unique
    // plutot que lowercase: true,on utilise uniqueCaseInsensitive qui permet de considérer les mots avec maj ou non comme des doublons
    uniqueCaseInsensitive: true
  },
  password: {
    type: String,
    required: true
  }
})


userSchema.plugin(uniqueValidator);

//on exporte le modèle
//1er argument =>nom du modèle
//2er argument =>schéma utilisé
module.exports = mongoose.model("User", userSchema);