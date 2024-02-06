var express = require("express");
var router = express.Router();
var cuentaController = require("../controllers/cuentaController");
const isLoggedIn = require("../policies/isLoggedIn");
const {
  createAccountSchema,
  // changePasswordSchema,
  editAccountSchema,
} = require("../validationSchemas/account");
const middleware = require("../middlewares");

/**
 *  @route GET /
 *  @dec Obtener todas las cuentas
 *  @access Logged
 */
router.get("/", isLoggedIn, cuentaController.getAllAcounts);

/**
 * @route GET /:id
 * @desc Obtener cuenta por id
 * @access Public
 */
router.get("/:external", isLoggedIn, cuentaController.getCuentaByExternalId);

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
router.put(
  "/:external",
  isLoggedIn,
  middleware.validateRequestBody(editAccountSchema),
  cuentaController.updateCuenta
);

//TODO: Determinar eliminacion de usuarios

/**
 * @route DELETE /:id
 * @desc Bloquear usuario por id
 * @access Logged
 */
router.delete("/:external", isLoggedIn, cuentaController.deleteCuenta);

module.exports = router;
