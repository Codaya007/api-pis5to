const Joi = require("joi");

const loginSchema = Joi.object({
  email: Joi.string().required().max(40).messages({
    "*": "El campo email es requerido y debe tener maximo de 40 caracteres",
  }),
  password: Joi.string().required().max(60).messages({
    "*": "El campo contraseña es requerido y debe tener un maximo de 60 caracteres",
  }),
});
module.exports = { loginSchema };
