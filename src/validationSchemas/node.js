const Joi = require("joi");

const nodeSchema = Joi.object({
  tag: Joi.string().required().messages({
    "*": "El campo tag es requerido",
  }),
  detail: Joi.string().required().min(3).max(25).messages({
    "*": "El campo detalle es requerido y debe tener entre 3 y 25 caracteres",
  }),
  ip: Joi.string().ip().required().messages({
    "*": "La ip es requerida y debe ser una ip válida",
  }),
  rol: Joi.string().uuid().required().messages({
    "*": "El rol es requerido y debe ser un valor válido",
  }),
  sensor: Joi.string().uuid().messages({
    "*": "El sensor es requerido y debe ser un valor válido",
  }),
}).options({ abortEarly: false });

const editNodeSchema = Joi.object({
  external_id: Joi.string().required().messages({
    "*": "El id es requerido",
  }),
  tag: Joi.string().optional().min(3).max(25).messages({
    "*": "El campo nombre es requerido y debe tener entre 3 y 25 caracteres",
  }),
  detail: Joi.string().optional().min(3).max(25).messages({
    "*": "El campo apellido es requerido y debe tener entre 3 y 25 caracteres",
  }),
  ip: Joi.string().ip().messages({
    "*": "La ip debe ser una ip válida",
  }),
  rol: Joi.string().uuid().messages({
    "*": "El rol debe ser un valor válido",
  }),
  sensor: Joi.string().uuid().messages({
    "*": "El sensor debe ser un valor válido",
  }),
});

module.exports = {
  nodeSchema,
  editNodeSchema,
};
