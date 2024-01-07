// const { Router } = require("express");
var express = require("express");
var router = express.Router();
var cuentaController = require("../controllers/cuentaController");
const isLoggedIn = require("../policies/isLoggedIn");
const {
  createAccountSchema,
  editAccountSchema,
} = require("../validationSchemas/account");
const middleware = require("../middlewares");

// const {
//     editCuentaSchema,
//     createCuentaSchema
// } = requite("../validationSchemas/cuenta");
// const middlewares = require("../middlewares");
// const isLoginIn = require("../policies/isLoggedIn");

/**
 *  @route GET /
 *  @dec Obtener todas las cuentas
 *  @access Logged
 */

router.get("/", cuentaController.getAllAcounts);

/**
 * @route GET /:id
 * @desc Obtener cuenta por id
 * @access Public
 */
router.get("/:external", cuentaController.getCuentaByExternalId);

/**
 * @route POST/
 * @desc Crear cuenta
 * @access Public
 */

router.post(
  "/",
  middleware.validateRequestBody(createAccountSchema),
  cuentaController.createCuenta
);

/**
 * @route PUT /:id
 * @desc Actualizar cuenta por id
 * @access Public
 */

router.put("/:external", cuentaController.updateCuenta);

//TODO: Determinar eliminacion de usuarios

/**
 * @route DELETE /:id
 * @desc Bloquear usuario por id
 * @access Logged
 */
router.delete("/:external", cuentaController.deleteCuenta);

module.exports = router;
