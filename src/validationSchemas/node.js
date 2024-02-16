const Joi = require("joi");

const nodeSchema = Joi.object({
  tag: Joi.string().required().messages({
    "*": "El campo tag es requerido",
  }),
  detail: Joi.string().required().max(200).messages({
    "*": "El campo detalle es requerido y debe tener hasta 200 caracteres",
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
  estado: Joi.boolean()
    .default(true)
    .messages({ "*": "Debe ser un campo booleano" }),
}).options({ abortEarly: false });

const editNodeSchema = Joi.object({
  external_id: Joi.string().required().messages({
    "*": "El id es requerido",
  }),
  tag: Joi.string().optional().min(3).max(25).messages({
    "*": "El campo tag debe tener entre 3 y 25 caracteres",
  }),
  detail: Joi.string().optional().max(200).messages({
    "*": "El campo detail debe tener hasta 200 caracteres",
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
  estado: Joi.boolean()
    .optional()
    .messages({ "*": "Debe ser un campo booleano" }),
});

module.exports = {
  nodeSchema,
  editNodeSchema,
};
