const { Router } = require("express");
const isLoggedIn = require("../policies/isLoggedIn");
const nodeController = require("../controllers/nodeController");

const nodeRouter = Router();

/**
 * @route GET /
 * @desc Obtener todos los nodos
 */
nodeRouter.get("/", nodeController.list);

/**
 * @route POST /
 * @desc Crea un nodo
 */
nodeRouter.post("/", isLoggedIn, nodeController.createNode);

/**
 * @route GET /
 * @desc Obtener nodos por ID
 */
nodeRouter.get("/:external_id", nodeController.getNodeById);

/**
 * @route PUT /
 * @desc Actualiza un nodo
 */
nodeRouter.put("/:external_id", isLoggedIn, nodeController.updateNode);

module.exports = nodeRouter;
