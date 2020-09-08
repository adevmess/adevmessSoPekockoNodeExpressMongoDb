"use strict"; // mode stricte
//gestion et validation des inputs
const Joi = require("joi");

const schema = Joi.object({
  email: Joi.string().email().min(8).max(254).trim().required(),
  password: Joi.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/u).required()

})

module.exports = schema;

//au moins une lettre majuscule ( ? = .* ? [A - Z])
//au moins une lettre minuscule ( ? = .* ? [a - z])
//au moins un chiffre ( ? = .* ? [0 - 9])
//au moins un caractere spécial ( ? = .* ? [# ? !@$ % ^ & * -])
//huit caracteres minimum { 8,}(with the anchors)