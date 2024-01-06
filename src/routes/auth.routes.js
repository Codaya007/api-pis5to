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
router.post("/recovery-password", authController.recoverPassword);

/**
 * @route POST /forgor-passord
 * @desc Generate token and send it to the email to recover it
 * @access Public
 */
router.post("/forgot-password", authController.generatePasswordRecoveryToken);

module.exports = router;
