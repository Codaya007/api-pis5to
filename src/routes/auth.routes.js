var express = require("express");
var router = express.Router();
var authController = require("../controllers/authController");
const { loginSchema } = require("../validationSchemas/login");
const middleware = require("../middlewares");
const { changePasswordSchema } = require("../validationSchemas/account");
/**
 * @route POST /login
 * @desc Iniciar sesión
 * @access Public
 */
router.post(
  "/login",
  middleware.validateRequestBody(loginSchema),
  authController.loginUser
);

/**
 * @route POST /recovery-password/:token
 * @desc Recuperar la contraseña usando token de recuperacion creado y enviado a su gmail
 * @access Public
 */
router.post(
  "/recovery-password/:token",
  middleware.validateRequestBody(changePasswordSchema),
  authController.recoverPassword
);

/**
 * @route POST /forgot-passord
 * @desc Generate token and send it to the email to recover it
 * @access Public
 */
router.post("/forgot-password", authController.generatePasswordRecoveryToken);

/**
 * @route POST /activate-account
 * @desc Change account's state
 * @access Public
 */
router.post("/activate-account", authController.activateAccount);

module.exports = router;
