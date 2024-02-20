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

module.exports = weatherConditionRouter;