const Sauce = require('../models/sauceMod');
const fs = require("fs");


//logique metier de chaque route concernant la lecture,la creation, la modification et la suppression d'une sauce

//creation d'une sauce
exports.createSauce = (req, res, next) => {
  //extraction sous forme de Json exploitable
  const sauceObject = JSON.parse(req.body.sauce);
  //creation d'une sauce a partir du body de la requete
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
    likes: 0,
    dislikes: 0
  });

  // enregistrement de la sauce dans la BDD + gestion de la réponse et des erreurs
  sauce.save()
    .then(() => res.status(201).json({
      message: "objet enregistré !"
    }))

    .catch(error => res.status(400).json({
      error: error
    }));
};

//Modification d'une sauce
exports.modifySauce = (req, res, next) => {
  let sauceToEdit = {};
  //verification de la présence d'un req.file 
  req.file ? (
      Sauce.findOne({
        _id: req.params.id
      })
      //suppression de l'ancienne image
      .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlinkSync(`images/${filename}`)
      }),
      sauceToEdit = {
        //extraction des modifs a efectuer sous forme de Json exploitable puis implementation du chemin de la nouvelle image
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
      })
    //sinon on recupere les modification a effectuer directement dans le body san passer par le parsage car req.file est absent
    :
    (sauceToEdit = {
      ...req.body
    })

  //Modification de la sauce via les parmetres de l'ID (car ID Mongoose est immuable)
  Sauce.updateOne({
      _id: req.params.id
    }, {
      ...sauceToEdit,
      _id: req.params.id
    })
    .then(() => res.status(200).json({
      message: "objet modifié ! "
    }))
    .catch(error => res.status(400).json({
      error
    }))
};

// suppression d'une sauce
exports.deleteSauce = (req, res, next) => {
  //ciblage d'une sauce
  Sauce.findOne({
      _id: req.params.id
    })
    //suppression de l'image puis de la sauce
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        sauce.deleteOne({
            _id: req.params.id
          })
          .then(() => res.status(200).json({
            message: 'Objet supprimé !'
          }))
          .catch(error => res.status(400).json({
            error
          }));
      });
    })
    .catch(error => res.status(500).json({
      error
    }));
};

//récupération d'une sauce
exports.getOneSauce = (req, res, next) => {
  //ciblage d'une sauce via son ID
  Sauce.findOne({
      _id: req.params.id
    })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({
      error
    }));
}

//récupération de toutes les sauces
exports.getAllSauces = (req, res, next) => {
  //affichage des infos de la session en cours
  console.log(req.session);
  console.log(req.session.cookie);
  console.log(req.session.id); //different pour chaque req
  console.log(req.session.cookie.expires) // date d'expiration
  console.log(req.session.cookie.maxAge) //temps restant avant expiration de la session
  Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({
      error
    }));
}


//gestion des likes/dislikes
exports.postLikeDislike = (req, res, next) => {
  const userIdProd = req.body.userId;
  const sauceId = req.params.id;
  const likeValue = req.body.like;

  //ciblage d'une sauce via son ID
  Sauce.findOne({
      _id: sauceId
    })
    .then(sauce => {


      //valeur du like =1 le userId est ajouté au usersLiked, likes est incrémenté de 1
      if (likeValue === 1) {
        console.log("like = 1 =>  le user aime cette sauce");
        Sauce.updateOne({
            _id: sauceId
          }, {
            $addToSet: {
              usersLiked: userIdProd
            },
            $inc: {
              likes: +1
            }
          })
          .then(() => res.status(200).json({
            message: "like pris en compte"
          }))
          .catch(error => res.status(400).json({
            error
          }))
      }


      //valeur du like = -1 le userId est ajouté au usersDisliked, dislikes est incrémenté de 1
      else if (likeValue === -1) {

        console.log("like = -1 => le user n'aime pas cette sauce");
        Sauce.updateOne({
            _id: sauceId
          }, {
            $addToSet: {
              usersDisliked: userIdProd
            },
            $inc: {
              dislikes: +1
            }
          })
          .then(() => res.status(200).json({
            message: "dislike pris en compte"
          }))
          .catch(error => res.status(400).json({
            error
          }))
      }

      //valeur du like = 0 le userId est supprimé de usersDisliked ou usersLiked, dislikes ou likes est décrémenté de 1
      else {
        Sauce.findOne({
            _id: sauceId
          })
          //vérification de la présence de l'ID du users (!=-1) dans usersLiked ou usersDisliked   
          .then(sauce => {
            indexUserIdLiked = (sauce.usersLiked.indexOf(userIdProd));
            indexUserIdDisLiked = (sauce.usersDisliked.indexOf(userIdProd));

            //annulation du like
            if (indexUserIdLiked != -1) {
              console.log("like = 0 => le like a été annulé");
              Sauce.updateOne({
                  _id: sauceId
                }, {
                  $pull: {
                    usersLiked: userIdProd
                  },
                  $inc: {
                    likes: -1
                  }
                })
                .then(() => res.status(200).json({
                  message: "annulation du like pris en compte"
                }))
                .catch(error => res.status(400).json({
                  error
                }))
            }

            //annulation du disLike
            else if (indexUserIdDisLiked != -1) {
              console.log("like = 0 => le disLike a été annulé");
              Sauce.updateOne({
                  _id: sauceId
                }, {
                  $pull: {
                    usersDisliked: userIdProd
                  },
                  $inc: {
                    dislikes: -1
                  }
                })
                .then(() => res.status(200).json({
                  message: "annulation du dislike pris en compte"
                }))
                .catch(error => res.status(400).json({
                  error
                }))
            }
          })
          .catch(error => res.status(400).json({
            error
          }))
      }
    })
}