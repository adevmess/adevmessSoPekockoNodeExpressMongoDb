"use strict";
// creation du schéma via mongoose
const mongoose = require("mongoose");


//id de la resource(sauce) immuable, generé automatiquement par mongoose
const sauceSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  manufacturer: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  mainPepper: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  heat: {
    type: Number,
    required: true
  },
  likes: {
    type: Number,
  },
  dislikes: {
    type: Number,
  },
  usersLiked: {
    type: [String],
  },
  usersDisliked: {
    type: [String],
  },
});

//on exporte ce modele(mongoose.model) en tant que model Mongoose pour pouvoir l'exploiter (lire, enregistrer etc)dans la base de donnee
//1er argument =>nom du model attention majuscule
//2er argument =>shema utilisé
module.exports = mongoose.model("Sauce", sauceSchema);