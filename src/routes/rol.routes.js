const { Router } = require("express");
const isLoggedIn = require("../policies/isLoggedIn");
const rolController = require("../controllers/rolController");

const rolRouter = Router();

/**
 * @route GET /
 * @desc Obtener rol por ID
 */
rolRouter.get("/get/:external_id", rolController.getRolById);

/**
 * @route GET /
 * @desc Obtener todos los roles
 */
rolRouter.get("/", rolController.list);

/**
 * @route POST /
 * @desc Crear un rol
 */
rolRouter.post("/", isLoggedIn, rolController.createRol);

/**
 * @route PUT /
 * @desc Actualizar un rol
 */
rolRouter.put("/:external_id", isLoggedIn, rolController.updateRol);

module.exports = rolRouter;
