<<<<<<< HEAD
const { Router } = require("express");
const ConditionControllerClass = require("../controllers/WeatherConditionsController");
const { body, validationResult } = require('express-validator');

const weatherConditionRouter = Router();
//const weatherConditionRouter = express.Router();
let conditionControl = new ConditionControllerClass();

weatherConditionRouter.get("/list", conditionControl.list);
weatherConditionRouter.get("/get/:external_id", conditionControl.getByExternalId);
weatherConditionRouter.post("/create", conditionControl.save);
weatherConditionRouter.post("/state", [
    body('temperature', 'No hay valor de la temperatura').trim().exists().not().isEmpty().isLength({ min: 1, max: 10 }),
    body('humidity', 'No hay valor de la humedad').trim().exists().not().isEmpty().isLength({ min: 1, max: 10 }),
    body('pressure', 'No hay valor de la presion').trim().exists().not().isEmpty().isLength({ min: 1, max: 10 }),
  ],conditionControl.determineWeatherState);
=======
const express = require("express");
const ConditionControllerClass = require("../controllers/WeatherConditionsController");

const weatherConditionRouter = express.Router();
let conditionControl = new ConditionControllerClass();

weatherConditionRouter.get("/", conditionControl.list);
weatherConditionRouter.get("/:external_id", conditionControl.getByExternalId);
weatherConditionRouter.post("/", conditionControl.save);
weatherConditionRouter.put("/", conditionControl.modify);
>>>>>>> 25023719067eb7abf7c9c5c21913394bb2ce3615

module.exports = weatherConditionRouter;
