const { Router } = require("express");
const isLoggedIn = require("../policies/isLoggedIn");
const rolController = require("../controllers/rolController");

const rolRouter = Router();

/**
 * @route GET /
 * @desc Obtener rol por ID
 */
rolRouter.get(
    "/get/:external_id",
    rolController.getRolById
);

/**
 * @route GET /
 * @desc Obtener todos los roles
 */
rolRouter.get(
    "/list",
    rolController.list
);

/**
 * @route POST /
 * @desc Crear un rol
 */
rolRouter.post(
    "/create",
    // isLoggedIn,
    rolController.createRol
);

/**
 * @route PUT /
 * @desc Actualizar un rol
 */
rolRouter.put(
    "/update",
    // isLoggedIn,
    rolController.updateRol
);

module.exports = rolRouter;