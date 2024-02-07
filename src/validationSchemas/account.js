const Joi = require("joi");

const createAccountSchema = Joi.object({
  name: Joi.string().required().min(3).max(25).messages({
    "*": "El campo nombre es requerido y debe tener entre 3 y 25 caracteres",
  }),
  lastname: Joi.string().required().min(3).max(25).messages({
    "*": "El campo apellido es requerido y debe tener entre 3 y 25 caracteres",
  }),
  email: Joi.string().required().min(5).max(30).messages({
    "*": "El campo email es requerido y debe tener entre 5 y 30 caracteres",
  }),
  avatar: Joi.string().optional().messages({
    "*": "El campo avatar es invalido",
  }),
  password: Joi.string().required().min(8).messages({
    "*": "El campo contraseña es requerido de tener un minimo de 8 caracteres",
  }),
  state: Joi.string()
    .valid("ACTIVA", "BLOQUEADA", "INACTIVA")
    .optional()
    .messages({
      "*": "El campo estado es requerido y debe ser uno de: 'ACTIVA', 'BLOQUEADA', 'INACTIVA'",
    }),
});

const changePasswordSchema = Joi.object({
  token: Joi.string().required().messages({
    "*": "El token es requerido",
  }),
  password: Joi.string().required().min(8).messages({
    "*": "La contraseña debe tener un minimo de 8 caracteres",
  }),
});

const editAccountSchema = Joi.object({
  external: Joi.string().required().messages({
    "*": "El id es requerido",
  }),
  name: Joi.string().optional().min(3).max(25).messages({
    "*": "El campo nombre es requerido y debe tener entre 3 y 25 caracteres",
  }),
  lastname: Joi.string().optional().min(3).max(25).messages({
    "*": "El campo apellido es requerido y debe tener entre 3 y 25 caracteres",
  }),
  email: Joi.string().email().optional().messages({
    "*": "El campo email debe ser un email válido",
  }),
  avatar: Joi.string().optional().messages({
    "*": "El campo avatar es invalido",
  }),
  password: Joi.string().optional().min(8).messages({
    "*": "El campo contraseña es requerido de tener un minimo de 8 caracteres",
  }),
  state: Joi.string()
    .valid("ACTIVA", "BLOQUEADA", "INACTIVA")
    .optional()
    .messages({
      "*": "El campo estado es requerido y debe ser uno de: 'ACTIVA', 'BLOQUEADA', 'INACTIVA'",
    }),
});

module.exports = {
  createAccountSchema,
  editAccountSchema,
  changePasswordSchema,
};
