const { Router } = require("express");
const isLoggedIn = require("../policies/isLoggedIn"); 
const nodeController = require("../controllers/nodeController");

const nodeRouter = Router();

/**
 * @route GET /
 * @desc Obtener nodos por ID
 */
nodeRouter.get(
  "/get/:external_id",
  nodeController.getNodeById
);

/**
 * @route GET /
 * @desc Obtener todos los nodos
 */
nodeRouter.get(
  "/list",
  nodeController.list
);

/**
 * @route POST /
 * @desc Crea un nodo
 */
nodeRouter.post(
  "/create",
  isLoggedIn,
  nodeController.createNode
);

/**
 * @route PUT /
 * @desc Actualiza un nodo
 */
nodeRouter.put(
  "/update",
  isLoggedIn,
  nodeController.updateNode
);

module.exports = nodeRouter;