"use strict";
//hachage unidirectionnelle (Cryptage du password)
const bcrypt = require("bcrypt");
//Récupération du schéma du user
const User = require("../models/user");
// package pour génerer le token (encodage et décodage)
const jwt = require("jsonwebtoken");

// const MaskData = require('maskdata');
// const maskemailSchema = require('../models/maskemailSchema');
// const maskemailSchema = {
//   maskWidth: "*",
//   unmaskedStartCharactersBeforeAt: 2,
//   unmaskedEndCharactersAfterAt: 2,
//   maskAtTheRate: false
// };

//enrgistrement de nouveaux users 
exports.signup = (req, res, next) => {

  //creation du mot de passe haché  avc choix du salage a 12
  bcrypt.hash(req.body.password, 12)
    .then(hash => {
      //creation du user
      const user = new User({
        email: req.body.email,
        password: hash
        // emailMasked: (MaskData.maskEmail2(req.body.email, maskemailSchema))
      });

      //sauvegarde du users dans la BDD
      user.save()
        .then(() => res.status(201).json({

          message: 'Utilisateur créé !'
        }))
        .catch(error => res.status(400).json({
          error
        }));
    })
    .catch(error => res.status(500).json({
      error
    }));
};


// connection des users 
exports.login = (req, res, next) => {

  console.log(req.session);
  console.log(req.session.cookie);
  console.log(req.session.id);
  User.findOne({
      //filtre par rapport a l'email
      email: req.body.email
    })

    .then(user => {
      //Bolean
      if (!user) {
        return res.status(401).json({
          error: 'Utilisateur non trouvé !'
        });
      }

      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({
              error: 'Mot de passe incorrect !'
            });
          }
          //encodage du userId dans le token crypté d'authentification
          res.status(200).json({
            //payload a encoder
            userId: user._id,
            token: jwt.sign({
                userId: user._id
              },
              //clef d'encodage
              process.env.KEY_TOKEN, {
                //argument de configuration (expiration=12h)
                expiresIn: process.env.TOKEN_EXPIRATION
              }
            )
          });
        })
        .catch(error => res.status(500).json({
          error
        }));
    })
    .catch(error => res.status(500).json({
      error
    }));
};