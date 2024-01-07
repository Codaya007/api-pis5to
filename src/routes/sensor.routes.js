const { Router } = require("express");
// const isLoggedIn = require("../policies/isLoggedIn");
const sensorController = require("../controllers/sensorController");

const sensorRouter = Router();

/**
 * @route GET /
 * @desc Obtener sensor por ID
 */
sensorRouter.get(
    "/get/:external_id",
    sensorController.getSensorById
);

/**
 * @route GET /
 * @desc Obtener todos los sensores
 */
sensorRouter.get(
    "/list",
    sensorController.list
);

/**
 * @route POST /
 * @desc Crear un sensor
 */
sensorRouter.post(
    "/create",
    // isLoggedIn,
    sensorController.createSensor
);

/**
 * @route PUT /
 * @desc Actualizar un sensor
 */
sensorRouter.put(
    "/update",
    // isLoggedIn,
    sensorController.updateSensor
);

module.exports = sensorRouter;