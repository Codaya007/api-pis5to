const { Router } = require("express");
const isLoggedIn = require("../policies/isLoggedIn");
const sensorController = require("../controllers/sensorController");

const sensorRouter = Router();

/**
 * @route GET /
 * @desc Obtener sensor por ID
 */
sensorRouter.get("/:external_id", sensorController.getSensorById);

/**
 * @route GET /
 * @desc Obtener todos los sensores
 */
sensorRouter.get("/", sensorController.list);

/**
 * @route POST /
 * @desc Crear un sensor
 */
sensorRouter.post("/", isLoggedIn, sensorController.createSensor);

/**
 * @route PUT /
 * @desc Actualizar un sensor
 */
sensorRouter.put("/:external_id", isLoggedIn, sensorController.updateSensor);

/**
 * @route DELETE /
 * @desc Eliminar un sensor
 */
sensorRouter.delete("/:external_id", isLoggedIn, sensorController.deleteById);

module.exports = sensorRouter;
