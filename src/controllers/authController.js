const { generateToken } = require("../helpers/tokenGeneration");
// const authService = require("../services/authService");
const { hashPassword } = require("../helpers/hashPassword");
// const { tokenValidation } = require("../helpers/validateToken");
const { generateUrlFriendlyToken } = require("../helpers");
const Account = require("../models/Account");
const bcrypt = require("bcrypt");
const transporter = require("../config/emailConfig");

module.exports = {
  loginUser: async (req, res, next) => {
    const { email, password } = req.body;
    // const account = await authService.login(email, password);
    let account = await Account.findOne({ email });

    if (!account) {
      return next({ status: 404, msg: "La cuenta no fue encontrada" });
    }

    if (account.state == "BLOQUEADA") {
      return next({ status: 401, msg: "Cuenta bloqueada" });
    }

    if (account.state == "INACTIVA") {
      return next({ status: 401, msg: "Cuenta inactivada" });
    }

    const datos = {
      external_id: account.external_id,
      name: account.name,
      lastname: account.lastname,
      avatar: account.avatar,
      state: account.state,
      email: account.email,
    };

    const compare = bcrypt.compareSync(password, account.password);

    if (!compare) {
      return next({ status: 401, msg: "Credenciales incorrectas" });
    }

    const payload = { id: account.id };
    const token = await generateToken(payload);

    return res.status(200).json({ results: datos, token });
  },

  activateAccount: async (req, res, next) => {
    const { email } = req.body;

    const account = await Account.findOne({ email });

    if (!account) {
      return next({ status: 400, msg: "La cuenta no fue encontrada" });
    }

    account.state = "ACTIVA";
    await account.save();

    return res.status(200).json({
      msg: "Cuenta activada",
      results: account,
    });
  },

  generatePasswordRecoveryToken: async (req, res, next) => {
    const { email } = req.body;
    const account = await Account.findOne({ email });

    if (!account) {
      return res.json({ status: 400, msg: "Email incorrecto" });
    }

    const token = generateUrlFriendlyToken();
    account.token = token;
    account.tokenExpiresAt = new Date(Date.now() + 3 * 60 * 60 * 100);
    await account.save();

    // console.log(token);
    const mailOptions = {
      form: transporter.options.auth.user,
      to: email,
      subject: "Recuperacion de contraseña",
      html: `
       <b>Haga click en el siguiente enlace o pégelo en su navegador web para la recuperación de contraseña</b>
       <a href="http://localhost:3000/auth/recovery-password/${token}">http://localhost:3000/auth/recovery-password/${token}</a>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      msg: "El link de acceso se le envio a su email de registro",
    });
  },

  recoverPassword: async (req, res, next) => {
    const { token } = req.params;
    const { password } = req.body;

    const account = await Account.findOne({ token });

    if (!account) {
      return next({ status: 400, msg: "Token invalido" });
    }

    if (Date.now() > account.tokenExpiresAt) {
      return next({ status: 401, msg: "Token a expirado" });
    }

    account.password = await hashPassword(password);
    const newUser = await account.save();

    if (!newUser) {
      return next({
        status: 400,
        msg: "No se ha podido recuperar la contraseña, intente más tarde",
      });
    }

    res.status(200).json({
      msg: "Contraseña actualizada exitosamente",
    });
  },
};
