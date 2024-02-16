const Joi = require("joi");

// Esquema de validación para la creación de un modelo
const createWeatherDataSchema = Joi.object({
  windSpeed: Joi.number().default(null).min(0).max(200).messages({
    "number.base": "La velocidad del viento debe ser un número.",
    "number.min": "La velocidad del viento no puede ser menor que 0.",
    "number.max": "La velocidad del viento no puede ser mayor que 200.",
  }),
  temperature: Joi.number().required().min(-100).max(100).messages({
    "any.required": "La temperatura es un campo obligatorio.",
    "number.base": "La temperatura debe ser un número.",
    "number.min": "La temperatura no puede ser menor que -100.",
    "number.max": "La temperatura no puede ser mayor que 100.",
  }),
  humidity: Joi.number().required().min(0).max(200).messages({
    "any.required": "La humedad es un campo obligatorio.",
    "number.base": "La humedad debe ser un número.",
    "number.min": "La humedad no puede ser menor que 0.",
    "number.max": "La humedad no puede ser mayor que 200.",
  }),
  barometricPressure: Joi.number().required().min(0).max(2000).messages({
    "any.required": "La presión barométrica es un campo obligatorio.",
    "number.base": "La presión barométrica debe ser un número.",
    "number.min": "La presión barométrica no puede ser menor que 0.",
    "number.max": "La presión barométrica no puede ser mayor que 2000.",
  }),
});

// Esquema de validación para la edición de un modelo
const editWeatherDataSchema = Joi.object({
  windSpeed: Joi.number().min(0).max(200).messages({
    "number.base": "La velocidad del viento debe ser un número.",
    "number.min": "La velocidad del viento no puede ser menor que 0.",
    "number.max": "La velocidad del viento no puede ser mayor que 200.",
  }),
  temperature: Joi.number().min(-100).max(100).messages({
    "number.base": "La temperatura debe ser un número.",
    "number.min": "La temperatura no puede ser menor que -100.",
    "number.max": "La temperatura no puede ser mayor que 100.",
  }),
  humidity: Joi.number().min(0).max(200).messages({
    "number.base": "La humedad debe ser un número.",
    "number.min": "La humedad no puede ser menor que 0.",
    "number.max": "La humedad no puede ser mayor que 200.",
  }),
  barometricPressure: Joi.number().min(0).max(2000).messages({
    "number.base": "La presión barométrica debe ser un número.",
    "number.min": "La presión barométrica no puede ser menor que 0.",
    "number.max": "La presión barométrica no puede ser mayor que 2000.",
  }),
});

module.exports = {
  createWeatherDataSchema,
  editWeatherDataSchema,
};
