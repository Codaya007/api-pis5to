const ApiCustomError = require("../errors/ApiError");
const InvalidToken = require("../errors/InvalidToken");
const ValidationError = require("../errors/ValidationError");
const { generateUrlFriendlyToken } = require("../helpers");
const Account = require("../models/Account");
const bcrypt = require("bcrypt");

const login = async (email, password) => {
  const account = await Account.findOne({ email });
  if (!account) {
    return res.json({ status: 400, msg: "La cuenta no fue encontrada" });
  }
  const compare = bcrypt.compareSync(password, account.password);
  if (!compare) {
    return res.json({ status: 401, msg: "Credenciales incorrectas" });
  }
  return account;
};

const generatePasswordRecoveryToken = async (email) => {
  const account = await Account.findOne({ email });

  if (!account) {
    return res.json({ status: 401, msg: "Email incorrecto" });
  }

  const token = generateUrlFriendlyToken();
  account.token = token;
  account.tokenExpiresAt = new Date(Date.now() + 3 * 60 * 60 * 100);
  await account.save();

  return token;
};

const validateTokenAccount = async (token) => {
  const account = await Account.findOne({ token });
  if (!account) {
    return res.json({ status: 400, msg: "Token invalido" });
  }

  if (Date.now() > account.tokenExpiresAt) {
    return res.json({ status: 401, msg: "Token a expirado" });
  }

  return account;
};
module.exports = {
  login,
  generatePasswordRecoveryToken,
  validateTokenAccount,
};
