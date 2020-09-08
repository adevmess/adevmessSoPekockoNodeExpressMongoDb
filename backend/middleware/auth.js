"use strict"; // utilisation du mode strict

const jwt = require("jsonwebtoken"); // encodage et décodage du token

//verification du userId avant passage au middleware suivant
module.exports = (req, res, next) => {
  try {
    //recupération du token
    const token = req.headers.authorization.split(" ")[1];
    //verification du token ( 1er argument= elemnt a verifier, 2 argument= clef secrete poour decoder le token)
    const decodedToken = jwt.verify(token, process.env.KEY_TOKEN)
    //récupération du userId dans l'objet décodé
    const userId = decodedToken.userId;
    //verification du userId
    if (req.body.userId && req.body.userId != userId) {
      throw "Invalid user ID";
    } else {
      next();
    }
  } catch (error) {
    res;
    status(401).json({
      error: error | "invalid request !"
    })
  }
};