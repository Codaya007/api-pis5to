const { generateToken } = require("../helpers/tokenGeneration");
const authService = require("../services/authService");
const { hashPassword } = require("../helpers/hashPassword");
const { tokenValidation } = require("../helpers/validateToken");
const transporter = require("../config/emailConfig");
module.exports = {
  loginUser: async (req, res) => {
    const { email, password } = req.body;
    const account = await authService.login(email, password);
    if (account) {
      console.log(account);
      const payload = { id: account.id };
      const token = await generateToken(payload);
      return res.json({ account, token });
    }

    next({ status: 401, message: "Incorrect Credentials" });
  },

  generatePasswordRecoveryToken: async (req, res, next) => {
    const { email } = req.body;
    const token = await authService.generatePasswordRecoveryToken(email);
    console.log(token);
    const mailOptions = {
      form: transporter.options.auth.user,
      to: email,
      subject: "Recuperacion de contraseña",
      html: `
       <b>Haga click en el siguiente enlace o pégelo en su navegador web para la recuperación de contraseña</b>
       <a href="http://localhost:3001/recovery-password/${token}">http://localhost:3001/recovery-password/${token}</a>
      `,
    };
    await transporter.sendMail(mailOptions);

    return res.json({
      message: "Si la cuenta fue encontrada, el token se enviara a su email",
    });
  },

  recoverPassword: async (req, res, next) => {
    const { token, password } = req.body;
    const account = await authService.validateTokenAccount(token);

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
