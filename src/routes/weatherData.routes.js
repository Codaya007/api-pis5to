const express = require("express");
const isLoggedIn = require("../policies/isLoggedIn");
const WeatherDataController = require("../controllers/WeatherDataController");
const { validateRequestBody } = require("../middlewares");
const { createWeatherDataSchema } = require("../validationSchemas/WeatherData");
const weatherDataController = new WeatherDataController();

const weatherDataRouter = express.Router();

// Solo los admins pueden ver el historial de datos climáticos guardados
<<<<<<< HEAD
<<<<<<< Updated upstream
weatherDataRouter.get("/", 
// isLoggedIn,
 weatherDataController.list);
=======
weatherDataRouter.get("/", isLoggedIn, weatherDataController.list);
weatherDataRouter.get("/free", weatherDataController.list);
>>>>>>> Stashed changes
=======
weatherDataRouter.get("/", isLoggedIn, weatherDataController.list);
>>>>>>> 25023719067eb7abf7c9c5c21913394bb2ce3615

weatherDataRouter.get(
  "/:external_id",
  isLoggedIn,
  weatherDataController.getById
);

// Servicio público ya que lo usará la mota padre
weatherDataRouter.post(
  "/",
  // isLoggedIn,
  validateRequestBody(createWeatherDataSchema),
  weatherDataController.create
);

module.exports = weatherDataRouter;
