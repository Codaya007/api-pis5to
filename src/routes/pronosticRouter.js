const { Router } = require("express");
const isLoggedIn = require("../policies/isLoggedIn"); 
const pronosticController = require("../controllers/pronosticController");

const pronosticRouter = Router();

/**
 * @route GET /
 * @desc Obtener pronostico por ID
 */
pronosticRouter.get(
  "/get/:external_id",
  pronosticController.getPronosticById
);

/**
 * @route GET /
 * @desc Obtener todos los pronósticos
 */
pronosticRouter.get(
  "/list",
  pronosticController.list
);


/**
 * @route GET /
 * @desc Obtener pronostico por rango de fechas. Solo los admins pueden ver el historial de pronósticos  guardados
 */
pronosticRouter.get(
  "/:initDate/:endDate",
  isLoggedIn,
  pronosticController.getPronosticByDate
);

/**
 * @route GET /
 * @desc Generar pronostico por rango de fechas. Acceso solo a admin. (Reporte)
 */
pronosticRouter.get(
  "/generate/:initDate/:endDate",
  // isLoggedIn,
  pronosticController.getGeneratePronosticByDate
);

/**
 * @route POST /
 * @desc Crea un pronóstico
 */
pronosticRouter.post(
  "/create",
  pronosticController.createPronostic
);

module.exports = pronosticRouter;