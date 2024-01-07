const Joi = require("joi");

const loginSchema = Joi.object({
  email: Joi.string().required().min(5).max(40).messages({
    "*": "El campo email es requerido y debe terner entre 5 y 40 caracteres",
  }),
  password: Joi.string().required().min(5).max(61).messages({
    "*": "El campo contraseña es requerido y debe tener entre 5 y 61 caracteres",
  }),
});
module.exports = { loginSchema };
