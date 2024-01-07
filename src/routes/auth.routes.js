var express = require("express");
var router = express.Router();
var authController = require("../controllers/authController");

/**
 * @route POST /login
 * @desc Iniciar sesión
 * @access Public
 */
router.post("/login", authController.loginUser);

/**
 * @route POST /recovery-password
 * @desc Recuperar la contraseña
 * @access Public
 */
router.post("/recovery-password/:token", authController.recoverPassword);

/**
 * @route POST /forgor-passord
 * @desc Generate token and send it to the email to recover it
 * @access Public
 */
router.post("/forgot-password", authController.generatePasswordRecoveryToken);

/**
 * @route POST /activate-Account
 * @desc Change account's state
 * @access Public
 */
router.post("/activate-account", authController.activateAccount);

module.exports = router;
