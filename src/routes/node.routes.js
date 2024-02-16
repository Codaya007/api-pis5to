const { Router } = require("express");
const isLoggedIn = require("../policies/isLoggedIn");
const nodeController = require("../controllers/nodeController");
const { validateRequestBody } = require("../middlewares");
const { nodeSchema, editNodeSchema } = require("../validationSchemas/node");

const nodeRouter = Router();

/**
 * @route GET /
 * @desc Obtener todos los nodos
 */
nodeRouter.get("/", isLoggedIn, nodeController.list);

/**
 * @route POST /
 * @desc Crea un nodo
 */
nodeRouter.post(
  "/",
  validateRequestBody(nodeSchema),
  isLoggedIn,
  nodeController.createNode
);

/**
 * @route GET /
 * @desc Obtener nodos por ID
 */
nodeRouter.get("/:external_id", isLoggedIn, nodeController.getNodeById);

/**
 * @route DELETE /
 * @desc Eliminar nodo por ID
 */
nodeRouter.delete("/:external_id", isLoggedIn, nodeController.deleteNodeById);

/**
 * @route PUT /
 * @desc Actualiza un nodo
 */
nodeRouter.put(
  "/:external_id",
  validateRequestBody(editNodeSchema),
  isLoggedIn,
  nodeController.updateNode
);

module.exports = nodeRouter;
