const { Router } = require("express");
const pronosticController = require("../controllers/pronosticController");
// const {
//   createNodeWithDetailSchema,
//   updateNodeWithDetailSchema,
// } = require("../validationSchemas/NodeWithDetail");

const pronosticRouter = Router();

/**
 * @route GET /
 * @desc Metodo de prueba
 */
pronosticRouter.get(
  "/",
  pronosticController.prueba
);


/**
 * @route GET /
 * @desc Obtener pronostico por ID
 */
pronosticRouter.get(
  "/:id",
  pronosticController.getPronosticById
);


/**
 * @route GET /
 * @desc Obtener pronostico por rango de fechas
 */
pronosticRouter.get(
  "/:initDate/:endDate",
  pronosticController.getPronosticByDate
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