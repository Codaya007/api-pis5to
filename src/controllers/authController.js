const { generateToken } = require("../helpers/tokenGeneration");
const authService = require("../services/authService");
const { hashPassword } = require("../helpers/hashPassword");
const { tokenValidation } = require("../helpers/validateToken");
const { generateUrlFriendlyToken } = require("../helpers");
const Account = require("../models/Account");
const bcrypt = require("bcrypt");
const transporter = require("../config/emailConfig");
module.exports = {
  loginUser: async (req, res) => {
    const { email, password } = req.body;
    // const account = await authService.login(email, password);
    const account = await Account.findOne({ email });
    if (!account) {
      return res.json({ status: 400, message: "La cuenta no fue encontrada" });
    }
    if (account.state == "BLOQUEADA") {
      return res.json({ status: 401, message: "Cuenta bloqueada" });
    }
    if (account.state == "INACTIVA") {
      return res.json({ status: 401, message: "Cuenta inactivada" });
    }
    const compare = bcrypt.compareSync(password, account.password);
    if (!compare) {
      return res.json({ status: 401, message: "Credenciales incorrectas" });
    }
    const payload = { id: account.id };
    const token = await generateToken(payload);

    return res.json({ account, token });
  },

  activateAccount: async (req, res, next) => {
    const { email } = req.body;
    // const account = await authService.login(email, password);
    const account = await Account.findOne({ email });
    if (!account) {
      return res.json({ status: 400, message: "La cuenta no fue encontrada" });
    }

    account.state = "ACTIVA";
    await account.save();
    return res.json({
      message: "Cuenta activada",
      account,
    });
  },

  generatePasswordRecoveryToken: async (req, res, next) => {
    const { email } = req.body;
    // const token = await authService.generatePasswordRecoveryToken(email);
    const account = await Account.findOne({ email });

    if (!account) {
      return res.json({ status: 400, message: "Email incorrecto" });
    }

    const token = generateUrlFriendlyToken();
    account.token = token;
    account.tokenExpiresAt = new Date(Date.now() + 3 * 60 * 60 * 100);
    await account.save();

    console.log(token);
    const mailOptions = {
      form: transporter.options.auth.user,
      to: email,
      subject: "Recuperacion de contraseña",
      html: `
       <b>Haga click en el siguiente enlace o pégelo en su navegador web para la recuperación de contraseña</b>
       <a href="http://localhost:3000/auth/recovery-password/${token}">http://localhost:3000/recovery-password/${token}</a>
      `,
    };
    await transporter.sendMail(mailOptions);

    return res.json({
      message: "El link de acceso se le envio a su email de registro",
    });
  },

  recoverPassword: async (req, res, next) => {
    const { token } = req.params;
    const { password } = req.body;
    // const account = await authService.validateTokenAccount(tokenA);
    const account = await Account.findOne({ token });
    if (!account) {
      return res.json({ status: 400, message: "Token invalido" });
    }

    if (Date.now() > account.tokenExpiresAt) {
      return res.json({ status: 401, message: "Token a expirado" });
    }

    account.password = await hashPassword(password);
    const newUser = await account.save();

    if (!newUser) {
      return next({
        status: 400,
        message: "No se ha podido recuperar la contraseña, intente más tarde",
      });
    }

    res.json({
      message: "Contraseña actualizada exitosamente",
    });
  },
};
