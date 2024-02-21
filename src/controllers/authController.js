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
    try {
      const { email } = req.body;
      const account = await Account.findOne({ email });

      if (!account) {
        return res.json({ status: 400, msg: "Email incorrecto" });
      }

      const token = generateUrlFriendlyToken();
      account.token = token;
      account.tokenExpiresAt = new Date(Date.now() + 3 * 60 * 60 * 100);
      await account.save();

      const recoveryEmailMessage = `
      <p>¡Hola!</p>
      <p>Parece que has solicitado recuperar tu contraseña. Por favor, haz click en el siguiente botón para continuar con el proceso:</p>
      <p><a href="${process.env.FRONT_BASEURL}/recovery-password/${token}"><button style="background-color: pink; color: white; padding: 10px; border: none; cursor: pointer;">Recuperar contraseña</button></a></p>
      <p>O copia y pega este enlace en tu navegador:</p>
      <p><a href="${process.env.FRONT_BASEURL}/recovery-password/${token}">${process.env.FRONT_BASEURL}/recovery-password/${token}</a></p>
      <p style="font-size: 12px;">Si no has solicitado esto, puedes ignorar este mensaje.</p>
      <p style="font-size: 12px;">Gracias,<br>El equipo de Soporte</p>
  `;

      // console.log(token);
      const mailOptions = {
        from: transporter.options.auth.user,
        to: email,
        subject: "Recuperacion de contraseña Eco-clima",
        html: recoveryEmailMessage,
      };

      await transporter.sendMail(mailOptions);

      return res.status(200).json({
        msg: "El link de acceso se le envio a su email de registro",
      });
    } catch (error) {
      console.log({ error });

      return res
        .status(500)
        .json({ msg: "Algo salió mal", details: error.message });
    }
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
